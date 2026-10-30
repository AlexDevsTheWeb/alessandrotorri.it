import { Box, Breadcrumbs, Button, Container, Link as MuiLink, Typography } from '@mui/material';
import Masonry from '@mui/lab/Masonry';
import React, { useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { COLLECTIONS } from '../data/collections.data';
import { PHOTOS } from '../data/collections.photos';
import PhotoLightbox from '../components/PhotoLightbox.component';
import ProgressiveImage from '../components/ProgressiveImage.component';

const CollectionPage: React.FC = () => {
  const { collectionName } = useParams<{ collectionName: string }>();
  const collection = COLLECTIONS.find((item) => item.slug === collectionName);
  const photos = collection ? PHOTOS[collection.slug] ?? [] : [];
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!collection) {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 }, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Collezione non trovata
        </Typography>
        <Button component={RouterLink} to="/gallery" nativeButton={false} sx={{ mt: 2 }}>
          Torna alle gallerie
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ justifyContent: 'center' }}>
        <MuiLink
          component={RouterLink}
          to="/gallery"
          underline="none"
          variant="caption"
          sx={{
            textTransform: 'uppercase',
            letterSpacing: '0.16em',
            color: 'text.secondary',
            '&:hover': { color: 'text.primary' },
          }}
        >
          Gallerie
        </MuiLink>
        <Typography
          variant="caption"
          sx={{ textTransform: 'uppercase', letterSpacing: '0.16em', color: 'text.primary' }}
        >
          {collection.title}
        </Typography>
      </Breadcrumbs>

      <Typography
        variant="h1"
        component="h1"
        align="center"
        sx={{
          mt: 2,
          mb: { xs: 4, md: 6 },
          fontSize: { xs: '2.2rem', md: '3.25rem' },
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        {collection.title}
      </Typography>

      {photos.length === 0 ? (
        <Typography align="center" color="text.secondary">
          Nessuna foto disponibile
        </Typography>
      ) : (
        <Masonry
          columns={{ xs: 1, sm: 2, md: 3 }}
          spacing={{ xs: 2, md: 3 }}
          sx={{ m: '0 !important' }}
        >
          {photos.map((photo, index) => (
            <Box key={`${photo.src}-${index}`} sx={{ position: 'relative', overflow: 'hidden' }}>
              <Box
                component="button"
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-label={`Apri ${photo.caption}`}
                sx={{
                  position: 'relative',
                  display: 'block',
                  width: '100%',
                  p: 0,
                  border: 0,
                  background: 'none',
                  cursor: 'zoom-in',
                  '&:focus-visible': { outline: 'none' },
                  '&:hover .photo-caption-overlay, &:focus-visible .photo-caption-overlay': {
                    opacity: 1,
                  },
                  '&:hover .photo-caption-text, &:focus-visible .photo-caption-text': {
                    opacity: 1,
                    transform: 'translate(-50%, -50%)',
                  },
                }}
              >
                <ProgressiveImage src={photo.src} alt={photo.caption} ratio={photo.ratio} />
                <Box
                  className="photo-caption-overlay"
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0,
                    background:
                      'linear-gradient(to top, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.45) 100%)',
                    transition: 'opacity 0.3s ease',
                    pointerEvents: 'none',
                  }}
                />
                <Typography
                  className="photo-caption-text"
                  component="span"
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: 'calc(100% - 32px)',
                    color: '#ffffff',
                    fontSize: { xs: '0.95rem', md: '1.05rem' },
                    fontWeight: 500,
                    letterSpacing: '0.04em',
                    textAlign: 'center',
                    textShadow: '0 1px 8px rgba(0, 0, 0, 0.4)',
                    opacity: 0,
                    transform: 'translate(-50%, calc(-50% + 14px))',
                    transition: 'transform 0.35s ease, opacity 0.35s ease',
                    pointerEvents: 'none',
                  }}
                >
                  {photo.caption}
                </Typography>
              </Box>
            </Box>
          ))}
        </Masonry>
      )}

      <PhotoLightbox
        photos={photos}
        index={selectedIndex}
        onChange={setSelectedIndex}
        onClose={() => setSelectedIndex(null)}
      />
    </Container>
  );
};

export default CollectionPage;
