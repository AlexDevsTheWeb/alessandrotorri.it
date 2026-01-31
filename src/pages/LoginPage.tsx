import React, { useState } from 'react';
import {
  Button,
  Container,
  Typography,
  Box,
} from '@mui/material';
import { useAuthStore } from '../store/authStore';
import { Navigate } from 'react-router-dom';
import { Google } from '@mui/icons-material';

const LoginPage: React.FC = () => {
  const {  loginWithGoogle, user, isLoading } = useAuthStore();

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Admin Login
        </Typography>
        
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Google />}
            onClick={loginWithGoogle}
            disabled={isLoading}
          >
            Sign in with Google
          </Button>
        </Box>
    </Container>
  );
};

export default LoginPage;
