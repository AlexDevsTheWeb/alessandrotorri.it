import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: '60vh',
          backgroundImage: 'url(https://source.unsplash.com/random?landscape)',
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
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <Container sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Alessio Torri Photography
          </Typography>
          <Typography variant="h5" component="p" gutterBottom>
            Capturing the beauty of the world, one frame at a time.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={Link}
            to="/gallery"
            sx={{ mt: 2 }}
          >
            View Gallery
          </Button>
        </Container>
      </Box>

      {/* Gallery Preview */}
      <Container sx={{ py: 8 }} maxWidth="md">
        <Typography variant="h4" align="center" gutterBottom>
          Featured Work
        </Typography>
        <Grid container spacing={4}>
          <Grid size={{xs: 12, sm: 6, md: 4}}>
            <img
              src="https://source.unsplash.com/random?nature"
              alt="Nature"
              style={{ width: '100%', height: 'auto' }}
            />
          </Grid>
          <Grid size={{xs: 12, sm: 6, md: 4}}>
            <img
              src="https://source.unsplash.com/random?city"
              alt="City"
              style={{ width: '100%', height: 'auto' }}
            />
          </Grid>
          <Grid size={{xs: 12, sm: 6, md: 4}}>
            <img
              src="https://source.unsplash.com/random?people"
              alt="People"
              style={{ width: '100%', height: 'auto' }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Contact Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" gutterBottom>
            Contact Me
          </Typography>
          <Typography variant="body1" align="center" paragraph>
            Have a project in mind? I'd love to hear from you. Feel free to
            reach out for collaborations, prints, or any other inquiries.
          </Typography>
          <Box textAlign="center">
            <Button variant="outlined" color="primary" size="large">
              Get in Touch
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
