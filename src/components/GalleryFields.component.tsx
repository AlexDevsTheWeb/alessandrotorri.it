import { Box, Grid, Stack, TextField, Typography } from '@mui/material';
import React from 'react';
import type { GalleryDraft } from '../types/gallery.types';

interface GalleryFieldsProps {
  value: GalleryDraft;
  onChange: (patch: Partial<GalleryDraft>) => void;
  disabled?: boolean;
}

const GalleryFields: React.FC<GalleryFieldsProps> = ({ value, onChange, disabled = false }) => (
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
    <Grid size={{ xs: 12, sm: 8 }}>
      <Stack spacing={1}>
        <TextField
          label="Immagine di copertina"
          value={value.coverImageUrl}
          onChange={(event) => onChange({ coverImageUrl: event.target.value })}
          fullWidth
          disabled={disabled}
          placeholder="/galleries/nome-file.webp"
          helperText="Percorso statico nel repository oppure URL completo."
        />
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            maxWidth: 320,
            aspectRatio: '4/3',
            overflow: 'hidden',
            backgroundColor: (theme) => theme.palette.action.hover,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          {value.coverImageUrl ? (
            <Box
              component="img"
              src={value.coverImageUrl}
              alt={`Anteprima copertina ${value.name || 'galleria'}`}
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <Typography variant="caption" color="text.secondary">
              Nessuna copertina
            </Typography>
          )}
        </Box>
      </Stack>
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
  </Grid>
);

export default GalleryFields;
