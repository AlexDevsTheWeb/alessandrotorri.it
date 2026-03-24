import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import Masonry from '@mui/lab/Masonry';
import { Box, Dialog, IconButton, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ProgressiveImage from '../components/ProgressiveImage.component';

// Esempi di dati delle foto presi dal web
// In un'app reale, questi dati proverrebbero da un'API o da un file di configurazione
const photos = [
  {
    id: 1,
    highRes: 'https://images.unsplash.com/photo-1542332213-31f87348057f?q=80&w=2070',
    placeholder: 'https://images.unsplash.com/photo-1542332213-31f87348057f?q=10&w=20',
    alt: 'Mountain landscape with snow',
    ratio: '16/9'
  },
  {
    id: 2,
    highRes: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=2070',
    placeholder: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=10&w=20',
    alt: 'Golden hour sunset over water',
    ratio: '4/3'
  },
  {
    id: 3,
    highRes: 'https://images.unsplash.com/photo-1510784722466-f2aa9c52fff6?q=80&w=2070',
    placeholder: 'https://images.unsplash.com/photo-1510784722466-f2aa9c52fff6?q=10&w=20',
    alt: 'Aerial view of a forest path',
    ratio: '1/1'
  },
  {
    id: 4,
    highRes: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2070',
    placeholder: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=10&w=20',
    alt: 'Lush green valley with a river',
    ratio: '4/5' // Orientamento verticale
  },
  {
    id: 5,
    highRes: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070',
    placeholder: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=10&w=20',
    alt: 'Misty landscape with mountains',
    ratio: '21/9' // Panoramica
  },
  {
    id: 6,
    highRes: 'https://images.unsplash.com/photo-1532274402911-5a3b227e99b6?q=80&w=2070',
    placeholder: 'https://images.unsplash.com/photo-1532274402911-5a3b227e99b6?q=10&w=20',
    alt: 'Desert landscape under stars',
    ratio: '3/2'
  },
];

const PhotoGallery: React.FC = () => {
  const theme = useTheme();
  // Determiniamo se lo schermo è piccolo per regolare la Dialog
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Stato per gestire la foto selezionata (null se nessuna foto è selezionata)
  const [selectedPhoto, setSelectedPhoto] = useState<typeof photos[0] | null>(null);

  // Funzione per aprire la Dialog con la foto selezionata
  const handleOpenPhoto = (photo: typeof photos[0]) => {
    setSelectedPhoto(photo);
  };

  // Funzione per chiudere la Dialog
  const handleClosePhoto = () => {
    setSelectedPhoto(null);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation(); // Evita di chiudere la dialog se clicchi sulla freccia
    if (!selectedPhoto) return;
    const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
    const nextIndex = (currentIndex + 1) % photos.length;
    setSelectedPhoto(photos[nextIndex]);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!selectedPhoto) return;
    const currentIndex = photos.findIndex(p => p.id === selectedPhoto.id);
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
    setSelectedPhoto(photos[prevIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPhoto) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') handleClosePhoto();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto]); // Si aggiorna quando cambia la foto selezionata

  return (
    <Box sx={{ width: '100%', p: { xs: 2, md: 4 } }}> {/* Padding esterno per Negative Space */}
      <Typography variant="h2" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 6 }}>
        My Portfolio
      </Typography>

      {/* 1. & 2. Masonry Grid e Spazi Bianchi */}
      <Masonry
        columns={{ xs: 1, sm: 2, md: 3 }} // Colonne responsivore
        spacing={{ xs: 2, sm: 3, md: 4 }} // Spaziatura responsiva tra le immagini (Negative Space)
      >
        {photos.map((photo) => (
          <Box key={photo.id} sx={{ width: '100%', display: 'flex' }}>
            {/* 3. & 4. Caricamento Progressivo e object-fit: cover */}
            <ProgressiveImage
              src={photo.highRes}
              placeholder={photo.placeholder}
              alt={photo.alt}
              ratio={photo.ratio}
              onClickPhoto={() => handleOpenPhoto(photo)}
            />
          </Box>
        ))}
      </Masonry>

      <Dialog
        fullScreen
        open={!!selectedPhoto}
        onClose={handleClosePhoto}
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(0,0,0,0.85)', // Sfondo scuro per far risaltare i colori
            backgroundImage: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          },
        }}
        // --- EFFETTO SFOCATO SFONDO ---
        slotProps={{
          backdrop: {
            sx: { backdropFilter: 'blur(15px)' }
          }
        }}
      >
        {/* Bottone di chiusura */}
        <IconButton
          onClick={handleClosePhoto}
          sx={{ position: 'absolute', top: 20, right: 20, color: 'white', zIndex: 10 }}
        >
          <CloseIcon />
        </IconButton>

        {/* Frecce di navigazione Desktop */}
        {!isMobile && (
          <>
            <IconButton
              onClick={handlePrev}
              sx={{ position: 'absolute', left: 20, color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
            <IconButton
              onClick={handleNext}
              sx={{ position: 'absolute', right: 20, color: 'white', bgcolor: 'rgba(255,255,255,0.1)', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </>
        )}

        {selectedPhoto && (
          <Stack
            spacing={2}
            alignItems="center"
            sx={{ width: '100%', height: '100%', justifyContent: 'center', p: 3 }}
          >
            <Box
              component="img"
              src={selectedPhoto.highRes}
              alt={selectedPhoto.alt}
              sx={{
                maxWidth: '90%',
                maxHeight: '75vh',
                objectFit: 'contain',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              }}
            />

            {/* 1. DESCRIZIONE DELL'IMMAGINE */}
            <Box sx={{ color: 'white', textAlign: 'center', maxWidth: '600px' }}>
              <Typography variant="h6" sx={{ fontFamily: '"Playfair Display", serif' }}>
                {selectedPhoto.alt}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7, mt: 1 }}>
                {/* Qui potresti mettere dati EXIF o una descrizione lunga */}
                Scatto realizzato in Islanda, 2024. ISO 100, f/8, 1/125s.
              </Typography>
            </Box>

            {/* Navigazione Mobile (sotto l'immagine) */}
            {isMobile && (
              <Stack direction="row" spacing={4}>
                <IconButton onClick={handlePrev} sx={{ color: 'white' }}><ArrowBackIosNewIcon /></IconButton>
                <IconButton onClick={handleNext} sx={{ color: 'white' }}><ArrowForwardIosIcon /></IconButton>
              </Stack>
            )}
          </Stack>
        )}
      </Dialog>
    </Box>
  );
};

export default PhotoGallery;