import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Box, Button, Card, Chip, IconButton, Stack, Typography } from '@mui/material';
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { repositoryImageFallback } from '../services/githubImages.service';
import type { Gallery } from '../types/gallery.types';
import RepositoryImage from './RepositoryImage.component';

interface GalleryListProps {
  galleries: Gallery[];
  onReorder: (ids: string[]) => void;
  onDelete: (gallery: Gallery) => void;
  disabled?: boolean;
}

const GalleryList: React.FC<GalleryListProps> = ({
  galleries,
  onReorder,
  onDelete,
  disabled = false,
}) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || result.destination.index === result.source.index) return;
    const next = Array.from(galleries);
    const [moved] = next.splice(result.source.index, 1);
    next.splice(result.destination.index, 0, moved);
    onReorder(next.map((gallery) => gallery.id));
  };

  if (galleries.length === 0) {
    return (
      <Typography color="text.secondary">
        Nessuna galleria. Creane una per iniziare.
      </Typography>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="galleries">
        {(provided) => (
          <Stack spacing={1.5} ref={provided.innerRef} {...provided.droppableProps}>
            {galleries.map((gallery, index) => {
              const cover = gallery.coverImageUrl;
              return (
                <Draggable
                  key={gallery.id}
                  draggableId={gallery.id}
                  index={index}
                  isDragDisabled={disabled}
                >
                  {(draggable) => (
                    <Card
                      ref={draggable.innerRef}
                      {...draggable.draggableProps}
                      sx={{ p: 1.5, display: 'flex', gap: 2, alignItems: 'center' }}
                    >
                      <Box
                        {...draggable.dragHandleProps}
                        sx={{ color: 'text.secondary', cursor: 'grab' }}
                        aria-label={`Sposta galleria ${gallery.name}`}
                      >
                        <DragIndicatorIcon fontSize="small" />
                      </Box>
                      <Box
                        sx={{
                          width: 96,
                          aspectRatio: '4/3',
                          flexShrink: 0,
                          overflow: 'hidden',
                          backgroundColor: (theme) => theme.palette.action.hover,
                          display: 'grid',
                          placeItems: 'center',
                        }}
                      >
                        {cover ? (
                          <RepositoryImage
                            src={cover}
                            fallbackSrc={repositoryImageFallback(cover)}
                            alt=""
                            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            —
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                          <Typography variant="subtitle1" noWrap>
                            {gallery.name}
                          </Typography>
                          {gallery.isFeatured && (
                            <Chip size="small" label="In evidenza" color="primary" variant="outlined" />
                          )}
                        </Stack>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          /gallery/{gallery.slug} · {gallery.imageIds.length} immagini · ordine{' '}
                          {gallery.displayOrder}
                        </Typography>
                        {!gallery.isVisible && (
                          <Chip size="small" color="warning" label="Nascosta" sx={{ mt: 0.5 }} />
                        )}
                      </Box>
                      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <Button
                          component={RouterLink}
                          to={`/admin/gallery/${gallery.id}`}
                          nativeButton={false}
                          size="small"
                        >
                          Gestisci
                        </Button>
                        <IconButton
                          aria-label={`Elimina ${gallery.name}`}
                          onClick={() => onDelete(gallery)}
                          disabled={disabled}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Stack>
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
  );
};

export default GalleryList;
