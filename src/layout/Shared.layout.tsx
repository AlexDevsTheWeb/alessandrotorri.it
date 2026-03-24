import { Box, Toolbar } from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router-dom';
import BacktoTopButton from './BacktoTopButton.layout';
import { Footer } from './Footer.layout';
import Navbar from './Navbar.layout';

const SharedLayout: React.FC = () => {

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw' }}>
      <Navbar />
      <Toolbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <Footer />
      <BacktoTopButton />
    </Box>
  );
};

export default SharedLayout;
