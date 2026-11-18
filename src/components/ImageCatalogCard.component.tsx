import {
  Box,
  Button,
  Card,
  Chip,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import type { Gallery, ImageAspectRatio } from '../types/gallery.types';
import type { CatalogEntry, CatalogImageDraft } from '../types/image.types';
import RepositoryImage from './RepositoryImage.component';

const ASPECT_RATIO_OPTIONS: Array<{ value: ImageAspectRatio; label: string }> = [
  { value: 'auto', label: 'Naturale' },
  { value: '16:9', label: '16:9' },
  { value: '3:2', label: '3:2' },
  { value: '4:3', label: '4:3' },
  { value: '1:1', label: '1:1' },
];

interface ImageCatalogCardProps {
  entry: CatalogEntry;
  galleries: Gallery[];
  disabled?: boolean;
  onIndex: () => Promise<void>;
  onSave: (patch: Partial<CatalogImageDraft>) => Promise<void>;
  onAssign: (galleryId: string) => Promise<void>;
  onUnassign: (galleryId: string) => Promise<void>;
  onCreateGallery: () => void;
}

const ImageCatalogCard: React.FC<ImageCatalogCardProps> = ({
  entry,
  galleries,
  disabled = false,
  onIndex,
  onSave,
  onAssign,
  onUnassign,
  onCreateGallery,
}) => {
  const { image } = entry;
  const [title, setTitle] = useState(image?.title ?? '');
  const [description, setDescription] = useState(image?.description ?? '');
  const [alt, setAlt] = useState(image?.alt ?? '');
  const [aspectRatio, setAspectRatio] = useState<ImageAspectRatio>(image?.aspectRatio ?? 'auto');
  const [isVisible, setIsVisible] = useState(image?.isVisible ?? true);
  const [isBusy, setIsBusy] = useState(false);

  const isDirty =
    image !== null &&
    (title.trim() !== image.title ||
      description.trim() !== image.description ||
      alt.trim() !== image.alt ||
      aspectRatio !== image.aspectRatio ||
      isVisible !== image.isVisible);

  const assignedGalleries = image
    ? image.galleryIds.map((id) => ({
        id,
        name: galleries.find((gallery) => gallery.id === id)?.name ?? id,
      }))
    : [];

  const handleSave = async () => {
    setIsBusy(true);
    try {
      await onSave({ title, description, alt, aspectRatio, isVisible });
      setTitle(title.trim());
      setDescription(description.trim());
      setAlt(alt.trim());
    } catch {
      return;
    } finally {
      setIsBusy(false);
    }
  };

  const handleAssign = async (galleryId: string) => {
    if (!galleryId) return;
    setIsBusy(true);
    try {
      await onAssign(galleryId);
    } catch {
      return;
    } finally {
      setIsBusy(false);
    }
  };

  const handleUnassign = async (galleryId: string) => {
    setIsBusy(true);
    try {
      await onUnassign(galleryId);
    } catch {
      return;
    } finally {
      setIsBusy(false);
    }
  };

  const isDisabled = disabled || isBusy;
  const previewRatio = aspectRatio === 'auto' ? '3/2' : aspectRatio.replace(':', '/');

  return (
    <Card sx={{ p: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
      <Box
        sx={{
          width: { xs: '100%', sm: 180 },
          flexShrink: 0,
          aspectRatio: previewRatio,
          overflow: 'hidden',
          backgroundColor: (theme) => theme.palette.action.hover,
        }}
      >
        <RepositoryImage
          src={entry.path}
          fallbackSrc={entry.remoteUrl}
          alt={image?.alt || image?.title || entry.filename}
          sx={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
      </Box>

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start' }}>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" noWrap>
              {entry.filename}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap component="p">
              {entry.path}
            </Typography>
          </Box>
          <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {!entry.isFromRepository && <Chip size="small" label="Fuori repository" />}
            {image && !isVisible && <Chip size="small" color="warning" label="Nascosta" />}
            {image && (
              <Chip
                size="small"
                color={assignedGalleries.length > 0 ? 'primary' : 'default'}
                variant={assignedGalleries.length > 0 ? 'outlined' : 'filled'}
                label={
                  assignedGalleries.length > 0
                    ? `${assignedGalleries.length} gallerie`
                    : 'Non assegnata'
                }
              />
            )}
          </Stack>
        </Stack>

        {!image ? (
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            sx={{ mt: 1.5, alignItems: { sm: 'center' } }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
              Presente in <code>public/galleries/</code>, non ancora indicizzata.
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => void onIndex()}
              disabled={isDisabled}
            >
              Indicizza
            </Button>
          </Stack>
        ) : (
          <Stack spacing={1.5} sx={{ mt: 1.5 }}>
            <TextField
              label="Titolo"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              fullWidth
              size="small"
              disabled={isDisabled}
            />
            <TextField
              label="Descrizione"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              fullWidth
              multiline
              minRows={2}
              size="small"
              disabled={isDisabled}
            />
            <TextField
              label="Testo alternativo"
              value={alt}
              onChange={(event) => setAlt(event.target.value)}
              fullWidth
              size="small"
              disabled={isDisabled}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <TextField
                select
                label="Rapporto"
                value={aspectRatio}
                onChange={(event) => setAspectRatio(event.target.value as ImageAspectRatio)}
                size="small"
                sx={{ minWidth: 140 }}
                disabled={isDisabled}
                helperText="Usato quando la galleria è su Naturale."
              >
                {ASPECT_RATIO_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Assegna a una galleria"
                value=""
                onChange={(event) => {
                  const value = event.target.value;
                  if (value === '__new__') onCreateGallery();
                  else void handleAssign(value);
                }}
                size="small"
                sx={{ flexGrow: 1 }}
                disabled={isDisabled}
              >
                <MenuItem value="" disabled>
                  Scegli una galleria...
                </MenuItem>
                {galleries
                  .filter((gallery) => !image?.galleryIds.includes(gallery.id))
                  .map((gallery) => (
                    <MenuItem key={gallery.id} value={gallery.id}>
                      {gallery.name}
                    </MenuItem>
                  ))}
                <MenuItem value="__new__">+ Nuova galleria</MenuItem>
              </TextField>
              <Button
                variant="contained"
                size="small"
                onClick={() => void handleSave()}
                disabled={!isDirty || isDisabled}
              >
                Salva
              </Button>
            </Stack>
            <FormControlLabel
              control={
                <Switch
                  checked={isVisible}
                  onChange={(event) => setIsVisible(event.target.checked)}
                  disabled={isDisabled}
                />
              }
              label="Visibile nel sito"
            />
            {assignedGalleries.length > 0 && (
              <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap' }}>
                {assignedGalleries.map((gallery) => (
                  <Chip
                    key={gallery.id}
                    size="small"
                    label={gallery.name}
                    onDelete={() => void handleUnassign(gallery.id)}
                    disabled={isDisabled}
                  />
                ))}
              </Stack>
            )}
          </Stack>
        )}
      </Box>
    </Card>
  );
};

export default ImageCatalogCard;
