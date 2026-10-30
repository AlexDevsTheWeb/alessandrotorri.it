import { Box, Breadcrumbs, Button, Container, Link as MuiLink, Stack, Typography } from '@mui/material';
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
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 }, textAlign: 'center' }}>
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
    <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
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
        <Stack spacing={{ xs: 4, md: 6 }}>
          {photos.map((photo, index) => (
            <Box component="figure" key={`${photo.src}-${index}`} sx={{ m: 0 }}>
              <Box
                component="button"
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-label={`Apri ${photo.caption}`}
                sx={{
                  display: 'block',
                  width: '100%',
                  p: 0,
                  border: 0,
                  background: 'none',
                  cursor: 'zoom-in',
                  '&:focus-visible': { outline: 'none' },
                }}
              >
                <ProgressiveImage src={photo.src} alt={photo.caption} ratio={photo.ratio} />
              </Box>
              <Typography component="figcaption" variant="body2" color="text.secondary" align="center" sx={{ mt: 1.5 }}>
                {photo.caption}
              </Typography>
            </Box>
          ))}
        </Stack>
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
