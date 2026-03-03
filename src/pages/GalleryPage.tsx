import {
  Container,
  Typography
} from '@mui/material';
import React from 'react';

const GalleryPage: React.FC = () => {
  // const [images, loading, error] = useCollectionData<IImage>(
  //   query(collection(db, 'images'), where('isVisible', '==', true), orderBy('collection')),
  //   { idField: 'id' }
  // );

  // const collections = images?.reduce((acc: { [key: string]: IImage[] }, image) => {
  //   if (!acc[image.collection]) {
  //     acc[image.collection] = [];
  //   }
  //   acc[image.collection].push(image as IImage);
  //   return acc;
  // }, {});

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h2" component="h1" align="center" gutterBottom sx={{ mb: 6, fontWeight: 600 }}>
        Explore the Collections
      </Typography>
      {/* {loading && <Typography align="center">Loading collections...</Typography>} */}
      {/* {error && <Typography color="error" align="center">Error: {error.message}</Typography>} */}
      {/* {collections && (
        <Grid container spacing={5}>
          {Object.entries(collections).map(([collectionName, images], index) => {
            const coverImage = images.find((image) => image.isCoverImage) || images[0];
            return (
              <Grid item key={collectionName} xs={12} sm={6} md={4}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                >
                  <Box
                    component={Link}
                    to={`/gallery/${collectionName}`}
                    sx={{
                      display: 'block',
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: 3,
                      boxShadow: '0 15px 30px rgba(0,0,0,0.1), 0 8px 10px rgba(0,0,0,0.08)',
                      '& img': {
                        width: '100%',
                        height: '350px',
                        objectFit: 'cover',
                        transition: 'transform 0.6s ease, filter 0.6s ease',
                      },
                      '&:hover img': {
                        transform: 'scale(1.15)',
                        filter: 'brightness(0.6)',
                      },
                      '& .collection-title': {
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        textAlign: 'center',
                        color: 'white',
                        p: 3,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
                        transform: 'translateY(100%)',
                        transition: 'transform 0.5s ease-in-out',
                      },
                      '&:hover .collection-title': {
                        transform: 'translateY(0)',
                      },
                    }}
                  >
                    <img src={coverImage?.url} alt={coverImage?.name} />
                    <Box className="collection-title">
                      <Typography variant="h5" component="div" sx={{ fontWeight: 500, textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>
                        {collectionName}
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            );
          })}
        </Grid>
      )} */}
    </Container>
  );
};

export default GalleryPage;
