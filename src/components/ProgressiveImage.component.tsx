import { alpha, Box, styled } from '@mui/material';
import React, { useState } from 'react';

interface ProgressiveImageProps {
  src: string;
  placeholder?: string;
  alt: string;
  ratio?: string;
  onClickPhoto?: () => void;
}

const HighResImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
  top: 0,
  left: 0,
  opacity: 0,
  transition: 'opacity 0.6s ease-out',
  '&.loaded': {
    opacity: 1,
  },
});

const PlaceholderImage = styled('div')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  filter: 'blur(20px)',
  transform: 'scale(1.1)',
  position: 'absolute',
  top: 0,
  left: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
});

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  placeholder,
  alt,
  ratio,
  onClickPhoto,
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: ratio ? 'auto' : '100%',
        aspectRatio: ratio,
        backgroundColor: (theme) => alpha(theme.palette.text.disabled, 0.1),
        cursor: onClickPhoto ? 'pointer' : 'default',
      }}
      onClick={onClickPhoto}
    >
      {placeholder && (
        <PlaceholderImage style={{ backgroundImage: `url(${placeholder})` }} aria-hidden="true" />
      )}
      <HighResImage
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={loaded ? 'loaded' : ''}
      />
    </Box>
  );
};

export default ProgressiveImage;
