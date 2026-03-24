import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  // const [latestWork, loading, error] = useCollectionData<IImage>(
  //   query(
  //     collection(db, 'images'),
  //     where('isLatestWork', '==', true),
  //     where('isVisible', '==', true),
  //     orderBy('createdAt', 'desc'),
  //   ),
  //   { idField: 'id' }
  // );

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: '70vh',
          backgroundImage: 'url(https://source.unsplash.com/random?art,abstract)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
          },
          boxShadow: 'inset 0 0 100px rgba(0,0,0,.5)',
        }}
      >
        <Container sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography variant="h1" component="h1" gutterBottom sx={{ fontWeight: 700, textShadow: '2px 2px 8px rgba(0,0,0,0.7)' }}>
              Alessandro Torri
            </Typography>
            <Typography variant="h5" component="p" gutterBottom sx={{ fontStyle: 'italic', textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}>
              A Journey Through the Lens
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              component={Link}
              to="/gallery"
              sx={{
                mt: 4,
                borderRadius: '50px',
                px: 5,
                py: 1.5,
                boxShadow: '0px 10px 30px rgba(0, 99, 255, 0.3)',
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-5px)',
                }
              }}
            >
              Explore Gallery
            </Button>
          </motion.div>
        </Container>
      </Box>

      {/* Latest Work Section */}
      <Container sx={{ py: 8, height: '3000px' }} maxWidth="lg">
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6, fontWeight: 600 }}>
          Latest Work
        </Typography>
        {/* {loading && <Typography>Loading...</Typography>} */}
        {/* {error && <Typography color="error">Error: {error.message}</Typography>} */}
        <Grid container spacing={4} justifyContent="center">
          {/* {latestWork?.map((image, index) => (
            <Grid item key={image.id} xs={12} sm={6} md={4}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Box
                  component={Link}
                  to={`/gallery/${image.collection}`}
                  sx={{
                    display: 'block',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 2,
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1), 0 6px 6px rgba(0,0,0,0.1)',
                    '& img': {
                      width: '100%',
                      height: '300px',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease, filter 0.5s ease',
                    },
                    '&:hover img': {
                      transform: 'scale(1.1)',
                      filter: 'brightness(0.7)',
                    },
                    '& .overlay': {
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      opacity: 0,
                      transition: 'opacity 0.5s ease',
                    },
                    '&:hover .overlay': {
                      opacity: 1,
                    }
                  }}
                >
                  <img src={image.url} alt={image.name} />
                  <Box className="overlay">
                    <Typography variant="h6">{image.name}</Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          ))} */}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;        
