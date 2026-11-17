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
  LinearProgress,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import AdminNav from '../components/AdminNav.component';
import ImageCatalogCard from '../components/ImageCatalogCard.component';
import {
  createEmptyDraft,
  validateGalleryDraft,
} from '../services/galleries.service';
import { describeFirestoreError } from '../services/firestore.service';
import { slugify } from '../services/slug.service';
import {
  fetchRepositoryImages,
  GITHUB_BRANCH,
  GITHUB_REPOSITORY,
} from '../services/githubImages.service';
import { useAuthStore } from '../store/authStore';
import { useGalleryStore } from '../store/galleryStore';
import { useImageStore } from '../store/imageStore';
import type { CatalogEntry, ImageFilter, RepositoryImageFile } from '../types/image.types';

type RepositoryStatus = 'idle' | 'loading' | 'ready' | 'error';

const FILTER_OPTIONS: Array<{ value: ImageFilter; label: string }> = [
  { value: 'all', label: 'Tutte' },
  { value: 'new', label: 'Nuove / non indicizzate' },
  { value: 'missing-title', label: 'Senza titolo' },
  { value: 'missing-description', label: 'Senza descrizione' },
  { value: 'unassigned', label: 'Non assegnate' },
];

const AdminImagesPage: React.FC = () => {
  const { logout, user } = useAuthStore();
  const {
    galleries,
    status: galleryStatus,
    error: galleryError,
    adminStatus,
    fetchGalleries,
    checkAdminAccess,
    createGallery,
  } = useGalleryStore();
  const {
    images,
    status,
    error,
    fetchImages,
    indexImage,
    indexImages,
    saveImage,
    assignToGallery,
  } = useImageStore();

  const [filter, setFilter] = useState<ImageFilter>('all');
  const [search, setSearch] = useState('');
  const [repoFiles, setRepoFiles] = useState<RepositoryImageFile[]>([]);
  const [repoStatus, setRepoStatus] = useState<RepositoryStatus>('loading');
  const [repoError, setRepoError] = useState<string | null>(null);
  const [pendingImageId, setPendingImageId] = useState<string | null>(null);
  const [newGalleryName, setNewGalleryName] = useState('');
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const scanRepository = useCallback(async () => {
    setRepoStatus('loading');
    setRepoError(null);
    try {
      const files = await fetchRepositoryImages();
      setRepoFiles(files);
      setRepoStatus('ready');
    } catch (error) {
      setRepoError(error instanceof Error ? error.message : 'Scansione del repository non riuscita.');
      setRepoStatus('error');
    }
  }, []);

  useEffect(() => {
    let active = true;
    void fetchGalleries();
    void fetchImages();
    fetchRepositoryImages()
      .then((files) => {
        if (!active) return;
        setRepoFiles(files);
        setRepoStatus('ready');
      })
      .catch((error: unknown) => {
        if (!active) return;
        setRepoError(
          error instanceof Error ? error.message : 'Scansione del repository non riuscita.',
        );
        setRepoStatus('error');
      });

    return () => {
      active = false;
    };
  }, [fetchGalleries, fetchImages]);

  useEffect(() => {
    if (user?.uid) void checkAdminAccess(user.uid);
  }, [checkAdminAccess, user?.uid]);

  const entries = useMemo<CatalogEntry[]>(() => {
    const byFilename = new Map(images.map((image) => [image.filename, image]));
    const repoEntries: CatalogEntry[] = repoFiles.map((file) => ({
      filename: file.filename,
      path: file.path,
      image: byFilename.get(file.filename) ?? null,
      isFromRepository: true,
    }));
    const known = new Set(repoFiles.map((file) => file.filename));
    const localEntries: CatalogEntry[] = images
      .filter((image) => !known.has(image.filename))
      .map((image) => ({
        filename: image.filename,
        path: image.path,
        image,
        isFromRepository: false,
      }));

    return [...repoEntries, ...localEntries];
  }, [images, repoFiles]);

  const counts = useMemo<Record<ImageFilter, number>>(
    () => ({
      all: entries.length,
      new: entries.filter((entry) => entry.image === null).length,
      'missing-title': entries.filter((entry) => entry.image && !entry.image.title.trim()).length,
      'missing-description': entries.filter(
        (entry) => entry.image && !entry.image.description.trim(),
      ).length,
      unassigned: entries.filter(
        (entry) => entry.image && entry.image.galleryIds.length === 0,
      ).length,
    }),
    [entries],
  );

  const filteredEntries = useMemo(() => {
    const term = search.trim().toLowerCase();

    return entries.filter((entry) => {
      if (term) {
        const haystack = `${entry.filename} ${entry.image?.title ?? ''}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }

      switch (filter) {
        case 'new':
          return entry.image === null;
        case 'missing-title':
          return entry.image !== null && entry.image.title.trim().length === 0;
        case 'missing-description':
          return entry.image !== null && entry.image.description.trim().length === 0;
        case 'unassigned':
          return entry.image !== null && entry.image.galleryIds.length === 0;
        default:
          return true;
      }
    });
  }, [entries, filter, search]);

  const unindexedFiles = useMemo(
    () =>
      repoFiles.filter((file) => !images.some((image) => image.filename === file.filename)),
    [images, repoFiles],
  );

  const pendingImage = useMemo(
    () => images.find((image) => image.id === pendingImageId) ?? null,
    [images, pendingImageId],
  );

  const handleIndex = async (filename: string) => {
    const file = repoFiles.find((item) => item.filename === filename);
    if (!file) return;
    try {
      await indexImage(file);
    } catch {
      return;
    }
  };

  const handleIndexAll = async () => {
    try {
      await indexImages(unindexedFiles);
    } catch {
      return;
    }
  };

  const handleAssign = async (imageId: string, galleryId: string) => {
    try {
      await assignToGallery(imageId, galleryId);
      await fetchGalleries();
    } catch {
      return;
    }
  };

  const closeCreateDialog = () => {
    if (isCreating) return;
    setPendingImageId(null);
    setNewGalleryName('');
    setDialogError(null);
  };

  const handleCreateGallery = async () => {
    if (!pendingImageId) return;
    const name = newGalleryName.trim();
    if (!name) {
      setDialogError('Il nome della galleria è obbligatorio.');
      return;
    }

    const draft = { ...createEmptyDraft(galleries.length), name, slug: slugify(name) };
    const validation = validateGalleryDraft(draft, galleries);
    if (validation) {
      setDialogError(validation);
      return;
    }

    setIsCreating(true);
    setDialogError(null);
    try {
      const galleryId = await createGallery(draft);
      await assignToGallery(pendingImageId, galleryId);
      await fetchGalleries();
      setPendingImageId(null);
      setNewGalleryName('');
    } catch (error) {
      setDialogError(describeFirestoreError(error));
    } finally {
      setIsCreating(false);
    }
  };

  const isBusy = status === 'loading' || repoStatus === 'loading';

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: { xs: 4, md: 6 } }}>
        <AdminNav onLogout={() => void logout()} />

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ alignItems: { sm: 'center' }, mb: 1 }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="h1">
              Immagini
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Catalogo delle foto in <code>public/galleries/</code>, metadati e assegnazione alle
              gallerie.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            onClick={() => void scanRepository()}
            disabled={repoStatus === 'loading'}
          >
            {repoStatus === 'loading' ? 'Scansione...' : 'Scansiona repository'}
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => void handleIndexAll()}
            disabled={isBusy || unindexedFiles.length === 0}
          >
            Indicizza tutte ({unindexedFiles.length})
          </Button>
        </Stack>

        <Typography variant="caption" color="text.secondary" component="p" sx={{ mb: 2 }}>
          Sorgente: {GITHUB_REPOSITORY} · ramo {GITHUB_BRANCH} · {repoFiles.length} file trovati
        </Typography>

        {adminStatus === 'not-admin' && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <AlertTitle>Account non abilitato alla scrittura</AlertTitle>
            L&apos;account {user?.email ?? ''} (UID <code>{user?.uid}</code>) non è presente in{' '}
            <code>admins/{user?.uid}</code>. Crea il documento nella console Firebase.
          </Alert>
        )}

        {adminStatus === 'error' && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <AlertTitle>Permessi non verificabili</AlertTitle>
            Non riesco a leggere <code>admins/{user?.uid}</code>. Controlla che le regole Firestore
            siano pubblicate.
          </Alert>
        )}

        {repoError && (
          <Alert
            severity="warning"
            sx={{ mb: 2 }}
            action={
              <Button color="inherit" size="small" onClick={() => void scanRepository()}>
                Riprova
              </Button>
            }
          >
            {repoError}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {galleryError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {galleryError}
          </Alert>
        )}

        {(status === 'loading' || galleryStatus === 'loading') && (
          <LinearProgress sx={{ mb: 2 }} />
        )}

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ alignItems: { md: 'center' }, mb: 3 }}
        >
          <ToggleButtonGroup
            exclusive
            value={filter}
            onChange={(_, next: ImageFilter | null) => {
              if (next) setFilter(next);
            }}
            size="small"
            sx={{ flexWrap: 'wrap' }}
          >
            {FILTER_OPTIONS.map((option) => (
              <ToggleButton key={option.value} value={option.value}>
                {option.label} ({counts[option.value]})
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <TextField
            label="Cerca"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            size="small"
            sx={{ minWidth: { md: 240 } }}
          />
        </Stack>

        {filteredEntries.length === 0 ? (
          <Typography color="text.secondary">
            Nessuna immagine corrisponde al filtro selezionato.
          </Typography>
        ) : (
          <Stack spacing={2}>
            {filteredEntries.map((entry) => (
              <ImageCatalogCard
                key={entry.image?.id ?? entry.filename}
                entry={entry}
                galleries={galleries}
                disabled={isBusy}
                onIndex={() => handleIndex(entry.filename)}
                onSave={(patch) =>
                  entry.image ? saveImage(entry.image.id, patch) : Promise.resolve()
                }
                onAssign={(galleryId) =>
                  entry.image ? handleAssign(entry.image.id, galleryId) : Promise.resolve()
                }
                onCreateGallery={() => {
                  if (!entry.image) return;
                  setPendingImageId(entry.image.id);
                  setNewGalleryName('');
                  setDialogError(null);
                }}
              />
            ))}
          </Stack>
        )}
      </Box>

      <Dialog open={pendingImageId !== null} onClose={closeCreateDialog} fullWidth maxWidth="sm">
        <DialogTitle>Nuova galleria</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            La galleria verrà creata e {pendingImage?.filename ?? 'la foto'} le sarà assegnata.
          </Typography>
          <TextField
            label="Nome"
            value={newGalleryName}
            onChange={(event) => {
              setNewGalleryName(event.target.value);
              setDialogError(null);
            }}
            fullWidth
            autoFocus
            disabled={isCreating}
          />
          {dialogError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {dialogError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeCreateDialog} disabled={isCreating}>
            Annulla
          </Button>
          <Button variant="contained" onClick={() => void handleCreateGallery()} disabled={isCreating}>
            {isCreating ? 'Creazione...' : 'Crea e assegna'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminImagesPage;
