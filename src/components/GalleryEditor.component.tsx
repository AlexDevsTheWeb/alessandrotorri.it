import { Alert, Box, Button, Divider, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { toGalleryDraft, validateGalleryDraft } from '../services/galleries.service';
import { describeFirestoreError } from '../services/firestore.service';
import type { Gallery, GalleryDraft } from '../types/gallery.types';
import type { CatalogImage } from '../types/image.types';
import GalleryFields from './GalleryFields.component';
import GalleryImageList from './GalleryImageList.component';

interface GalleryEditorProps {
  gallery: Gallery;
  galleries: Gallery[];
  catalog: CatalogImage[];
  onSave: (draft: GalleryDraft) => Promise<void>;
}

const normalizeDraft = (draft: GalleryDraft): GalleryDraft => ({
  ...draft,
  name: draft.name.trim(),
  slug: draft.slug.trim(),
  description: draft.description.trim(),
  coverImageId: draft.coverImageId.trim(),
  coverImageUrl: draft.coverImageUrl.trim(),
  imageIds: Array.from(new Set(draft.imageIds.filter((id) => id.trim().length > 0))),
});

const GalleryEditor: React.FC<GalleryEditorProps> = ({ gallery, galleries, catalog, onSave }) => {
  const [draft, setDraft] = useState<GalleryDraft>(() => toGalleryDraft(gallery));
  const [baseline, setBaseline] = useState<GalleryDraft>(() => toGalleryDraft(gallery));
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(baseline);
  const usesLegacyImages = gallery.legacyImages.length > 0 && gallery.imageIds.length === 0;

  const handleChange = (patch: Partial<GalleryDraft>) => {
    setDraft((previous) => ({ ...previous, ...patch }));
    setError(null);
    setSaved(false);
  };

  const handleSave = async () => {
    const validation = validateGalleryDraft(draft, galleries, gallery.id);
    if (validation) {
      setError(validation);
      return;
    }

    const next = normalizeDraft(draft);
    setIsSaving(true);
    setError(null);
    try {
      await onSave(next);
      setDraft(next);
      setBaseline(next);
      setSaved(true);
    } catch (saveError) {
      setError(describeFirestoreError(saveError));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: { sm: 'center' } }}>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="h4" component="h1" noWrap>
            {draft.name || 'Galleria senza nome'}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            /gallery/{draft.slug || '...'}
          </Typography>
        </Box>
        <Button
          component={RouterLink}
          to={`/gallery/${draft.slug}`}
          target="_blank"
          rel="noreferrer"
          nativeButton={false}
          size="small"
          disabled={!draft.slug}
        >
          Apri nel sito
        </Button>
      </Stack>

      {usesLegacyImages && (
        <Alert severity="warning">
          Questa galleria usa il formato precedente con immagini incorporate. Finché non assegni le
          immagini dal catalogo, il sito continua a leggerle da lì. Aggiungile dalla sezione Immagini
          e riassegnale qui per passare al nuovo modello.
        </Alert>
      )}

      <GalleryFields value={draft} onChange={handleChange} disabled={isSaving} />

      <Divider />

      <GalleryImageList
        value={draft}
        catalog={catalog}
        onChange={handleChange}
        disabled={isSaving}
      />

      {error && <Alert severity="error">{error}</Alert>}
      {saved && !isDirty && <Alert severity="success">Modifiche salvate.</Alert>}

      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <Button variant="contained" onClick={handleSave} disabled={!isDirty || isSaving}>
          {isSaving ? 'Salvataggio...' : 'Salva modifiche'}
        </Button>
        <Typography variant="body2" color="text.secondary">
          {isDirty ? 'Modifiche non salvate' : 'Nessuna modifica'}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default GalleryEditor;
