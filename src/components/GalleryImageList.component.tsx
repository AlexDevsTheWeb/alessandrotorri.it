import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { resolveImageIds } from '../data/galleries.mapper';
import type { GalleryDraft } from '../types/gallery.types';
import type { CatalogImage } from '../types/image.types';

interface GalleryImageListProps {
  value: GalleryDraft;
  catalog: CatalogImage[];
  onChange: (patch: Partial<GalleryDraft>) => void;
  disabled?: boolean;
}

const GalleryImageList: React.FC<GalleryImageListProps> = ({
  value,
  catalog,
  onChange,
  disabled = false,
}) => {
  const [selected, setSelected] = useState<CatalogImage | null>(null);
  const images = resolveImageIds(value.imageIds, catalog, value.layoutConfig);
  const available = catalog.filter((image) => !value.imageIds.includes(image.id));

  const handleAdd = () => {
    if (!selected) return;
    const patch: Partial<GalleryDraft> = {
      imageIds: [...value.imageIds, selected.id],
    };
    if (!value.coverImageId) {
      patch.coverImageId = selected.id;
      patch.coverImageUrl = selected.path;
    }
    onChange(patch);
    setSelected(null);
  };

  const handleRemove = (id: string, url: string) => {
    const remainingIds = value.imageIds.filter((imageId) => imageId !== id);
    const remaining = images.filter((image) => image.id !== id);
    const patch: Partial<GalleryDraft> = { imageIds: remainingIds };

    if (value.coverImageId === id || value.coverImageUrl === url) {
      patch.coverImageId = remaining[0]?.id ?? '';
      patch.coverImageUrl = remaining[0]?.url ?? '';
    }

    onChange(patch);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || result.destination.index === result.source.index) return;
    const next = Array.from(images);
    const [moved] = next.splice(result.source.index, 1);
    next.splice(result.destination.index, 0, moved);
    onChange({ imageIds: next.map((image) => image.id) });
  };

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ alignItems: { sm: 'center' } }}>
        <Typography variant="h6" component="h2" sx={{ flexGrow: 1 }}>
          Immagini della galleria
        </Typography>
        <Button component={RouterLink} to="/admin/images" nativeButton={false} size="small">
          Gestisci il catalogo
        </Button>
      </Stack>

      {images.length === 0 ? (
        <Typography color="text.secondary">
          Nessuna immagine assegnata. Aggiungine una dal catalogo qui sotto.
        </Typography>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="gallery-images">
            {(provided) => (
              <Stack spacing={2} ref={provided.innerRef} {...provided.droppableProps}>
                {images.map((image, index) => {
                  const isCover = value.coverImageId === image.id || value.coverImageUrl === image.url;
                  return (
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
                          sx={{
                            p: 2,
                            display: 'flex',
                            gap: 2,
                            alignItems: 'center',
                            outline: isCover ? '2px solid' : 'none',
                            outlineColor: 'primary.main',
                          }}
                        >
                          <Box
                            {...draggable.dragHandleProps}
                            sx={{ color: 'text.secondary', cursor: 'grab' }}
                            aria-label={`Sposta immagine ${index + 1}`}
                          >
                            <DragIndicatorIcon fontSize="small" />
                          </Box>
                          <Box
                            sx={{
                              width: 120,
                              flexShrink: 0,
                              aspectRatio: image.ratio,
                              overflow: 'hidden',
                              backgroundColor: (theme) => theme.palette.action.hover,
                            }}
                          >
                            <Box
                              component="img"
                              src={image.url}
                              alt={image.alt || image.title || `Immagine ${index + 1}`}
                              sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                objectPosition: 'center',
                              }}
                            />
                          </Box>
                          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Typography variant="subtitle1" noWrap>
                              {image.title || 'Senza titolo'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {image.url}
                            </Typography>
                            {image.alt && (
                              <Typography variant="caption" color="text.secondary" noWrap>
                                {image.alt}
                              </Typography>
                            )}
                          </Box>
                          <IconButton
                            aria-label={
                              isCover
                                ? `Copertina corrente: ${image.title || image.url}`
                                : `Imposta ${image.title || image.url} come copertina`
                            }
                            onClick={() =>
                              onChange({ coverImageId: image.id, coverImageUrl: image.url })
                            }
                            color={isCover ? 'primary' : 'default'}
                            disabled={disabled}
                          >
                            {isCover ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                          </IconButton>
                          <IconButton
                            aria-label={`Rimuovi immagine ${index + 1}`}
                            onClick={() => handleRemove(image.id, image.url)}
                            disabled={disabled}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Card>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </Stack>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <Card sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Aggiungi dal catalogo
        </Typography>
        {catalog.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Il catalogo è vuoto. Indicizza i file in <code>public/galleries/</code> dalla sezione
            Immagini.
          </Typography>
        ) : (
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Autocomplete
              options={available}
              value={selected}
              onChange={(_, next) => setSelected(next)}
              getOptionLabel={(option) =>
                option.title ? `${option.filename} — ${option.title}` : option.filename
              }
              isOptionEqualToValue={(option, current) => option.id === current.id}
              disabled={disabled || available.length === 0}
              sx={{ flexGrow: 1 }}
              renderInput={(params) => (
                <TextField {...params} label="Immagine dal catalogo" size="small" />
              )}
            />
            <Button
              variant="outlined"
              onClick={handleAdd}
              disabled={disabled || selected === null}
            >
              Aggiungi
            </Button>
          </Stack>
        )}
      </Card>
    </Stack>
  );
};

export default GalleryImageList;
