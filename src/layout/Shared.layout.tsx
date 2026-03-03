import { Box } from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router-dom';
import AppNavbar from './AppBar.layout';
import { Footer } from './Footer.layout';

const SharedLayout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw' }}>
      {/* <Navbar /> */}
      <AppNavbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default SharedLayout;
