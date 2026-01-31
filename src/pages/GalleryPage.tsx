import React from 'react';
import { Container, Typography, Card, CardMedia, CardContent, CircularProgress, Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { collection } from 'firebase/firestore';
import { db } from '../firebase';

const GalleryPage: React.FC = () => {
  const [images, loading, error] = useCollectionData(collection(db, 'images'));

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  return (
    <Container sx={{ py: 8 }} maxWidth="lg">
      <Typography variant="h4" align="center" gutterBottom>
        Gallery
      </Typography>
      <Grid container spacing={4}>
        {images?.map((image) => (
          <Grid key={image.url} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={image.url}
                alt={image.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {image.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default GalleryPage;
