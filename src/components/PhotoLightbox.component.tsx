import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Dialog, IconButton, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import type { CollectionPhoto } from '../data/collections.data';

interface PhotoLightboxProps {
  photos: CollectionPhoto[];
  index: number | null;
  onChange: (index: number) => void;
  onClose: () => void;
}

const PhotoLightbox: React.FC<PhotoLightboxProps> = ({ photos, index, onChange, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const photo = index === null ? null : photos[index];

  const handlePrev = useCallback(() => {
    if (index === null || photos.length === 0) return;
    onChange((index - 1 + photos.length) % photos.length);
  }, [index, onChange, photos.length]);

  const handleNext = useCallback(() => {
    if (index === null || photos.length === 0) return;
    onChange((index + 1) % photos.length);
  }, [index, onChange, photos.length]);

  useEffect(() => {
    if (index === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') handleNext();
      if (event.key === 'ArrowLeft') handlePrev();
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, index, onClose]);

  return (
    <Dialog
      fullScreen
      open={index !== null}
      onClose={onClose}
      aria-labelledby="photo-lightbox-title"
      slotProps={{
        paper: {
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.92)',
            backgroundImage: 'none',
          },
        },
        backdrop: {
          sx: { backdropFilter: 'blur(15px)' },
        },
      }}
    >
      <IconButton
        onClick={onClose}
        aria-label="Close"
        sx={{ position: 'absolute', top: 16, right: 16, color: 'white', zIndex: 10 }}
      >
        <CloseIcon />
      </IconButton>

      {!isMobile && (
        <>
          <IconButton
            onClick={handlePrev}
            aria-label="Previous photo"
            sx={{
              position: 'absolute',
              left: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.18)' },
            }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
          <IconButton
            onClick={handleNext}
            aria-label="Next photo"
            sx={{
              position: 'absolute',
              right: 20,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.18)' },
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </>
      )}

      {photo && (
        <Stack
          sx={{
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            px: { xs: 2, md: 4 },
            pt: { xs: 7, md: 4 },
            pb: { xs: 3, md: 4 },
          }}
        >
          <Box
            component="img"
            src={photo.src}
            alt={photo.caption}
            sx={{
              display: 'block',
              maxWidth: { xs: '92vw', md: '78vw' },
              maxHeight: { xs: '62vh', md: '75vh' },
              objectFit: 'contain',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
            }}
          />
          <Box sx={{ color: 'white', textAlign: 'center', maxWidth: 640, mt: 2 }}>
            <Typography id="photo-lightbox-title" variant="h6">
              {photo.caption}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.65, mt: 0.5 }}>
              Dati EXIF non disponibili
            </Typography>
          </Box>

          {isMobile && (
            <Stack direction="row" spacing={4} sx={{ mt: 2 }}>
              <IconButton onClick={handlePrev} aria-label="Previous photo" sx={{ color: 'white' }}>
                <ArrowBackIosNewIcon />
              </IconButton>
              <IconButton onClick={handleNext} aria-label="Next photo" sx={{ color: 'white' }}>
                <ArrowForwardIosIcon />
              </IconButton>
            </Stack>
          )}
        </Stack>
      )}
    </Dialog>
  );
};

export default PhotoLightbox;
