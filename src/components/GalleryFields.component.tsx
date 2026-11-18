import {
  Box,
  FormControlLabel,
  Grid,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { repositoryImageFallback } from '../services/githubImages.service';
import type {
  GalleryDraft,
  GalleryPadding,
  ImageAspectRatio,
} from '../types/gallery.types';
import RepositoryImage from './RepositoryImage.component';

interface GalleryFieldsProps {
  value: GalleryDraft;
  onChange: (patch: Partial<GalleryDraft>) => void;
  disabled?: boolean;
}

const ASPECT_RATIO_OPTIONS: Array<{ value: ImageAspectRatio; label: string }> = [
  { value: '16:9', label: '16:9' },
  { value: '3:2', label: '3:2' },
  { value: '4:3', label: '4:3' },
  { value: '1:1', label: '1:1' },
  { value: 'auto', label: 'Naturale' },
];

const PADDING_OPTIONS: Array<{ value: GalleryPadding; label: string }> = [
  { value: 'none', label: 'Nessuno (0 px)' },
  { value: 'small', label: 'Piccolo (8 px)' },
  { value: 'medium', label: 'Medio (16 px)' },
  { value: 'large', label: 'Grande (24 px)' },
];

const GalleryFields: React.FC<GalleryFieldsProps> = ({ value, onChange, disabled = false }) => {
  const previewRatio =
    value.layoutConfig.aspectRatio === 'auto'
      ? '3/2'
      : value.layoutConfig.aspectRatio.replace(':', '/');

  return (
    <Grid container spacing={2} sx={{ mt: 0 }}>
      <Grid size={{ xs: 12, sm: 7 }}>
        <TextField
          label="Nome"
          value={value.name}
          onChange={(event) => onChange({ name: event.target.value })}
          fullWidth
          required
          disabled={disabled}
          helperText="Titolo mostrato nella griglia delle gallerie."
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 5 }}>
        <TextField
          label="Slug"
          value={value.slug}
          onChange={(event) => onChange({ slug: event.target.value })}
          fullWidth
          required
          disabled={disabled}
          helperText={`URL pubblica: /gallery/${value.slug || '...'}`}
        />
      </Grid>
      <Grid size={12}>
        <TextField
          label="Descrizione"
          value={value.description}
          onChange={(event) => onChange({ description: event.target.value })}
          fullWidth
          multiline
          minRows={2}
          disabled={disabled}
          helperText="Testo introduttivo della galleria."
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField
          label="Ordine"
          type="number"
          value={value.displayOrder}
          onChange={(event) => onChange({ displayOrder: Number(event.target.value) })}
          fullWidth
          disabled={disabled}
          slotProps={{ htmlInput: { min: 0, step: 1 } }}
          helperText="Posizione nella griglia pubblica."
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Stack spacing={1} sx={{ height: '100%', justifyContent: 'center' }}>
          <FormControlLabel
            control={
              <Switch
                checked={value.isVisible}
                onChange={(event) => onChange({ isVisible: event.target.checked })}
                disabled={disabled}
              />
            }
            label="Visibile nel sito"
          />
          <FormControlLabel
            control={
              <Switch
                checked={value.isFeatured}
                onChange={(event) => onChange({ isFeatured: event.target.checked })}
                disabled={disabled}
              />
            }
            label="In evidenza in homepage"
          />
          <Typography variant="caption" color="text.secondary">
            In evidenza occupa entrambe le colonne in cima. Una galleria nascosta o senza foto
            visibili non compare nel sito.
          </Typography>
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField
          label="Ordine in evidenza"
          type="number"
          value={value.featuredOrder}
          onChange={(event) => onChange({ featuredOrder: Number(event.target.value) })}
          fullWidth
          disabled={disabled || !value.isFeatured}
          slotProps={{ htmlInput: { min: 0, step: 1 } }}
          helperText="Ordine tra le gallerie in evidenza."
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          select
          label="Rapporto immagini"
          value={value.layoutConfig.aspectRatio}
          onChange={(event) =>
            onChange({
              layoutConfig: {
                ...value.layoutConfig,
                aspectRatio: event.target.value as ImageAspectRatio,
              },
            })
          }
          fullWidth
          disabled={disabled}
          helperText="Ritaglio delle foto e della copertina. Con Naturale vale il rapporto della singola foto."
        >
          {ASPECT_RATIO_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          select
          label="Spaziatura griglia"
          value={value.layoutConfig.padding}
          onChange={(event) =>
            onChange({
              layoutConfig: {
                ...value.layoutConfig,
                padding: event.target.value as GalleryPadding,
              },
            })
          }
          fullWidth
          disabled={disabled}
          helperText="Distanza tra le foto della galleria."
        >
          {PADDING_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid size={12}>
        <Stack spacing={1}>
          <TextField
            label="Immagine di copertina"
            value={value.coverImageUrl}
            fullWidth
            disabled
            helperText="Si sceglie dall'elenco immagini qui sotto con l'icona a stella."
          />
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              maxWidth: 320,
              aspectRatio: previewRatio,
              overflow: 'hidden',
              backgroundColor: (theme) => theme.palette.action.hover,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            {value.coverImageUrl ? (
              <RepositoryImage
                src={value.coverImageUrl}
                fallbackSrc={repositoryImageFallback(value.coverImageUrl)}
                alt={`Anteprima copertina ${value.name || 'galleria'}`}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />
            ) : (
              <Typography variant="caption" color="text.secondary">
                Nessuna copertina
              </Typography>
            )}
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default GalleryFields;
