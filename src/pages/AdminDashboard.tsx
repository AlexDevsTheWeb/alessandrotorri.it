import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNav from '../components/AdminNav.component';
import GalleryFields from '../components/GalleryFields.component';
import GalleryList from '../components/GalleryList.component';
import {
  createEmptyDraft,
  validateGalleryDraft,
} from '../services/galleries.service';
import { describeFirestoreError } from '../services/firestore.service';
import { slugify } from '../services/slug.service';
import { useAuthStore } from '../store/authStore';
import { useGalleryStore } from '../store/galleryStore';
import { useImageStore } from '../store/imageStore';
import type { Gallery, GalleryDraft } from '../types/gallery.types';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const {
    galleries,
    status,
    error,
    adminStatus,
    fetchGalleries,
    checkAdminAccess,
    createGallery,
    deleteGallery,
    reorderGalleries,
  } = useGalleryStore();

  const catalog = useImageStore((state) => state.images);
  const fetchImages = useImageStore((state) => state.fetchImages);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [draft, setDraft] = useState<GalleryDraft>(() => createEmptyDraft());
  const [slugLocked, setSlugLocked] = useState(false);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Gallery | null>(null);

  useEffect(() => {
    void fetchGalleries();
  }, [fetchGalleries]);

  useEffect(() => {
    void fetchImages();
  }, [fetchImages]);

  useEffect(() => {
    if (user?.uid) void checkAdminAccess(user.uid);
  }, [checkAdminAccess, user?.uid]);

  const openCreate = () => {
    setDraft(createEmptyDraft(galleries.length));
    setSlugLocked(false);
    setDialogError(null);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    if (isSaving) return;
    setIsDialogOpen(false);
    setDialogError(null);
  };

  const handleDraftChange = (patch: Partial<GalleryDraft>) => {
    setDraft((previous) => {
      const next = { ...previous, ...patch };
      if (previous.name !== next.name && !slugLocked) {
        next.slug = slugify(next.name);
      }
      return next;
    });
    if (patch.slug !== undefined) setSlugLocked(true);
    setDialogError(null);
  };

  const handleSubmit = async () => {
    const validation = validateGalleryDraft(draft, galleries);
    if (validation) {
      setDialogError(validation);
      return;
    }

    setIsSaving(true);
    try {
      const id = await createGallery(draft);
      setIsDialogOpen(false);
      navigate(`/admin/gallery/${id}`);
    } catch (submitError) {
      setDialogError(describeFirestoreError(submitError));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteGallery(pendingDelete.id);
    } finally {
      setPendingDelete(null);
    }
  };

  const handleReorder = (ids: string[]) => {
    void reorderGalleries(ids).catch(() => undefined);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: { xs: 4, md: 6 } }}>
        <AdminNav onLogout={() => void logout()} />
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ alignItems: { sm: 'center' }, mb: 3 }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="h1">
              Gallerie
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Crea, ordina e modifica le gallerie pubblicate e le loro immagini.
            </Typography>
          </Box>
          <Button variant="contained" size="small" onClick={openCreate}>
            Nuova galleria
          </Button>
        </Stack>

        {adminStatus === 'not-admin' && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <AlertTitle>Account non abilitato alla scrittura</AlertTitle>
            L&apos;account {user?.email ?? ''} (UID <code>{user?.uid}</code>) non è presente in{' '}
            <code>admins/{user?.uid}</code>. Nella console Firebase apri Firestore, crea la
            collezione <code>admins</code> e un documento con ID uguale all&apos;UID. Senza quel
            documento Firestore rifiuta ogni salvataggio con &quot;Missing or insufficient
            permissions&quot;.
          </Alert>
        )}

        {adminStatus === 'error' && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <AlertTitle>Permessi non verificabili</AlertTitle>
            Non riesco a leggere <code>admins/{user?.uid}</code>. Controlla che le regole Firestore
            siano pubblicate: <code>firebase deploy --only firestore:rules --project alessandrotorri-it</code>.
          </Alert>
        )}

        {status === 'loading' && galleries.length === 0 && <LinearProgress sx={{ mb: 2 }} />}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <GalleryList
          galleries={galleries}
          onReorder={handleReorder}
          onDelete={setPendingDelete}
          disabled={status === 'loading'}
        />

        <Divider sx={{ my: 4 }} />
        <Typography variant="body2" color="text.secondary">
          Le immagini sono file statici: caricali in <code>public/galleries/</code> e qui indica
          il percorso (es. <code>/galleries/nome-file.webp</code>). Le modifiche vengono pubblicate
          con il prossimo deploy.
        </Typography>
      </Box>

      <Dialog open={isDialogOpen} onClose={closeDialog} fullWidth maxWidth="md">
        <DialogTitle>Nuova galleria</DialogTitle>
        <DialogContent dividers>
          <GalleryFields value={draft} catalog={catalog} onChange={handleDraftChange} disabled={isSaving} />
          {dialogError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {dialogError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} disabled={isSaving}>
            Annulla
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? 'Salvataggio...' : 'Salva'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={pendingDelete !== null} onClose={() => setPendingDelete(null)}>
        <DialogTitle>Eliminare la galleria?</DialogTitle>
        <DialogContent>
          <Typography>
            {pendingDelete?.name} verrà rimossa da Firestore. I file immagine in{' '}
            <code>public/galleries/</code> restano nel repository.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingDelete(null)}>Annulla</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Elimina
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;
