import {
  Alert,
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
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import GalleryFields from '../components/GalleryFields.component';
import GalleryList from '../components/GalleryList.component';
import {
  createEmptyDraft,
  slugify,
  toGalleryDraft,
  validateGalleryDraft,
} from '../services/galleries.service';
import { useAuthStore } from '../store/authStore';
import { useGalleryStore } from '../store/galleryStore';
import type { Gallery, GalleryDraft } from '../types/gallery.types';

type DialogMode = 'create' | 'edit';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const {
    galleries,
    status,
    error,
    fetchGalleries,
    createGallery,
    saveGallery,
    deleteGallery,
    reorderGalleries,
  } = useGalleryStore();

  const [mode, setMode] = useState<DialogMode>('create');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [draft, setDraft] = useState<GalleryDraft>(() => createEmptyDraft());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [slugLocked, setSlugLocked] = useState(false);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Gallery | null>(null);

  useEffect(() => {
    void fetchGalleries();
  }, [fetchGalleries]);

  const openCreate = () => {
    setMode('create');
    setEditingId(null);
    setDraft(createEmptyDraft(galleries.length));
    setSlugLocked(false);
    setDialogError(null);
    setIsDialogOpen(true);
  };

  const openEdit = (gallery: Gallery) => {
    setMode('edit');
    setEditingId(gallery.id);
    setDraft(toGalleryDraft(gallery));
    setSlugLocked(true);
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
    const validation = validateGalleryDraft(draft, galleries, editingId ?? undefined);
    if (validation) {
      setDialogError(validation);
      return;
    }

    setIsSaving(true);
    try {
      if (mode === 'create') {
        const id = await createGallery(draft);
        setIsDialogOpen(false);
        navigate(`/admin/gallery/${id}`);
      } else if (editingId) {
        await saveGallery(editingId, draft);
        setIsDialogOpen(false);
      }
    } catch (submitError) {
      setDialogError(
        submitError instanceof Error ? submitError.message : 'Operazione non riuscita.',
      );
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
          <Stack direction="row" spacing={1}>
            <Button component={RouterLink} to="/gallery" nativeButton={false} size="small">
              Vedi sito
            </Button>
            <Button variant="contained" size="small" onClick={openCreate}>
              Nuova galleria
            </Button>
            <Button size="small" onClick={() => void logout()}>
              Esci
            </Button>
          </Stack>
        </Stack>

        {status === 'loading' && galleries.length === 0 && <LinearProgress sx={{ mb: 2 }} />}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <GalleryList
          galleries={galleries}
          onReorder={handleReorder}
          onEdit={openEdit}
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
        <DialogTitle>{mode === 'create' ? 'Nuova galleria' : 'Modifica galleria'}</DialogTitle>
        <DialogContent dividers>
          <GalleryFields value={draft} onChange={handleDraftChange} disabled={isSaving} />
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
