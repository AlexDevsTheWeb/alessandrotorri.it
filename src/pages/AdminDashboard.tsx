import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { useAuthStore } from '../store/authStore';
import ImageUpload from '../components/ImageUpload';

const AdminDashboard: React.FC = () => {
  const { logout } = useAuthStore();

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" gutterBottom>
          Welcome to your admin dashboard. Here you will be able to manage your photos, albums, and collections.
        </Typography>
        <Box my={4}>
          <Typography variant="h5" component="h2" gutterBottom>
            Upload New Image
          </Typography>
          <ImageUpload />
        </Box>
        <Button variant="contained" onClick={logout} sx={{ mt: 2 }}>
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default AdminDashboard;
