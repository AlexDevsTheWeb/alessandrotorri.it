import { alpha, Box, styled } from '@mui/material';
import React, { useState } from 'react';

interface ProgressiveImageProps {
  src: string;
  placeholder: string;
  alt: string;
  ratio?: string;
  onClickPhoto?: () => void; // Aggiunta la prop onClickPhoto
}

// Styled component per l'immagine ad alta risoluzione
const HighResImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
  top: 0,
  left: 0,
  opacity: 0, // Inizialmente nascosta
  transition: 'opacity 0.6s ease-out', // Transizione fluida per l'apparizione
  '&.loaded': {
    opacity: 1, // Appare quando è caricata
  },
}));

const PlaceholderImage = styled('div')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  filter: 'blur(20px)', // Sfocatura intensa
  transform: 'scale(1.1)', // Evita i bordi chiari della sfocatura
  position: 'absolute',
  top: 0,
  left: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}));

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  placeholder,
  alt,
  ratio,
  onClickPhoto // Destrutturiamo la nuova prop
}) => {
  const [loaded, setLoaded] = useState(false);

  const handleLoad = () => {
    setLoaded(true);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: ratio ? 'auto' : '100%',
        aspectRatio: ratio,
        backgroundColor: (theme) => alpha(theme.palette.text.disabled, 0.1),
        cursor: onClickPhoto ? 'pointer' : 'default', // Cambia il cursore se cliccabile
      }}
      onClick={onClickPhoto} // Associa la funzione al click
    >
      <PlaceholderImage style={{ backgroundImage: `url(${placeholder})` }} aria-hidden="true" />
      <HighResImage
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={handleLoad}
        className={loaded ? 'loaded' : ''}
      />
    </Box>
  );
};

export default ProgressiveImage;