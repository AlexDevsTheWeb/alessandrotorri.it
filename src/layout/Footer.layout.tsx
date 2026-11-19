import { Box, Container, Typography } from '@mui/material';
import React from 'react';

export const Footer: React.FC = () => (
  <Box
    component="footer"
    sx={{
      py: 2,
      px: 2,
      mt: 'auto',
      backgroundColor: 'transparent',
    }}
  >
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Copyright © Alessandro Torri {new Date().getFullYear()}
        </Typography>
      </Box>
    </Container>
  </Box>
);
