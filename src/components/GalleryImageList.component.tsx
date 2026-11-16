import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Box, Button, Card, Grid, IconButton, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { GalleryImage } from '../types/gallery.types';

interface GalleryImageListProps {
  images: GalleryImage[];
  onChange: (images: GalleryImage[]) => void;
  disabled?: boolean;
}

type EditableField = 'url' | 'title' | 'alt' | 'ratio';

const GalleryImageList: React.FC<GalleryImageListProps> = ({
  images,
  onChange,
  disabled = false,
}) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [alt, setAlt] = useState('');
  const [ratio, setRatio] = useState('3/2');

  const normalize = (items: GalleryImage[]): GalleryImage[] =>
    items.map((image, index) => ({ ...image, order: index }));

  const handleFieldChange = (id: string, field: EditableField, value: string) => {
    onChange(images.map((image) => (image.id === id ? { ...image, [field]: value } : image)));
  };

  const handleRemove = (id: string) => {
    onChange(normalize(images.filter((image) => image.id !== id)));
  };

  const handleAdd = () => {
    if (!url.trim()) return;
    onChange(
      normalize([
        ...images,
        {
          id: uuidv4(),
          url: url.trim(),
          title: title.trim(),
          alt: alt.trim(),
          ratio: ratio.trim() || '3/2',
          order: images.length,
        },
      ]),
    );
    setUrl('');
    setTitle('');
    setAlt('');
    setRatio('3/2');
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || result.destination.index === result.source.index) return;
    const next = Array.from(images);
    const [moved] = next.splice(result.source.index, 1);
    next.splice(result.destination.index, 0, moved);
    onChange(normalize(next));
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h6" component="h2">
        Immagini della galleria
      </Typography>

      {images.length === 0 ? (
        <Typography color="text.secondary">Nessuna immagine: aggiungine una qui sotto.</Typography>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="gallery-images">
            {(provided) => (
              <Stack spacing={2} ref={provided.innerRef} {...provided.droppableProps}>
                {images.map((image, index) => (
                  <Draggable
                    key={image.id}
                    draggableId={image.id}
                    index={index}
                    isDragDisabled={disabled}
                  >
                    {(draggable) => (
                      <Card
                        ref={draggable.innerRef}
                        {...draggable.draggableProps}
                        sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'flex-start' }}
                      >
                        <Box
                          {...draggable.dragHandleProps}
                          sx={{ pt: 1, color: 'text.secondary', cursor: 'grab' }}
                          aria-label={`Sposta immagine ${index + 1}`}
                        >
                          <DragIndicatorIcon fontSize="small" />
                        </Box>
                        <Box
                          sx={{
                            width: 120,
                            flexShrink: 0,
                            aspectRatio: '3/2',
                            overflow: 'hidden',
                            backgroundColor: (theme) => theme.palette.action.hover,
                            display: 'grid',
                            placeItems: 'center',
                          }}
                        >
                          {image.url ? (
                            <Box
                              component="img"
                              src={image.url}
                              alt={image.alt || image.title || `Immagine ${index + 1}`}
                              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <Typography variant="caption" color="text.secondary">
                              Anteprima
                            </Typography>
                          )}
                        </Box>
                        <Grid container spacing={1.5} sx={{ flexGrow: 1 }}>
                          <Grid size={12}>
                            <TextField
                              label="Percorso o URL"
                              value={image.url}
                              onChange={(event) =>
                                handleFieldChange(image.id, 'url', event.target.value)
                              }
                              fullWidth
                              size="small"
                              disabled={disabled}
                              placeholder="/galleries/nome-file.webp"
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 5 }}>
                            <TextField
                              label="Titolo / didascalia"
                              value={image.title}
                              onChange={(event) =>
                                handleFieldChange(image.id, 'title', event.target.value)
                              }
                              fullWidth
                              size="small"
                              disabled={disabled}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 5 }}>
                            <TextField
                              label="Testo alternativo"
                              value={image.alt}
                              onChange={(event) =>
                                handleFieldChange(image.id, 'alt', event.target.value)
                              }
                              fullWidth
                              size="small"
                              disabled={disabled}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 2 }}>
                            <TextField
                              label="Rapporto"
                              value={image.ratio}
                              onChange={(event) =>
                                handleFieldChange(image.id, 'ratio', event.target.value)
                              }
                              fullWidth
                              size="small"
                              disabled={disabled}
                              placeholder="3/2"
                            />
                          </Grid>
                        </Grid>
                        <IconButton
                          aria-label={`Rimuovi immagine ${index + 1}`}
                          onClick={() => handleRemove(image.id)}
                          disabled={disabled}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Stack>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <Card sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Aggiungi immagine
        </Typography>
        <Grid container spacing={1.5}>
          <Grid size={12}>
            <TextField
              label="Percorso o URL"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              fullWidth
              size="small"
              disabled={disabled}
              placeholder="/galleries/nome-file.webp"
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 5 }}>
            <TextField
              label="Titolo / didascalia"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              fullWidth
              size="small"
              disabled={disabled}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 5 }}>
            <TextField
              label="Testo alternativo"
              value={alt}
              onChange={(event) => setAlt(event.target.value)}
              fullWidth
              size="small"
              disabled={disabled}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 2 }}>
            <TextField
              label="Rapporto"
              value={ratio}
              onChange={(event) => setRatio(event.target.value)}
              fullWidth
              size="small"
              disabled={disabled}
              placeholder="3/2"
            />
          </Grid>
          <Grid size={12}>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              <Button variant="outlined" onClick={handleAdd} disabled={disabled || !url.trim()}>
                Aggiungi
              </Button>
              <Box
                sx={{
                  width: 120,
                  aspectRatio: '3/2',
                  overflow: 'hidden',
                  backgroundColor: (theme) => theme.palette.action.hover,
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                {url ? (
                  <Box
                    component="img"
                    src={url}
                    alt="Anteprima nuova immagine"
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    Anteprima
                  </Typography>
                )}
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </Stack>
  );
};

export default GalleryImageList;
