import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.layout';
import { Box } from '@mui/material';
import { Footer } from './Footer.layout';

const SharedLayout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default SharedLayout;
