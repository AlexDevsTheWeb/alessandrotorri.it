import { Box, Toolbar } from '@mui/material';
import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import ErrorBoundary from '../components/ErrorBoundary.component';
import PageLoader from '../components/PageLoader.component';
import BacktoTopButton from './BacktoTopButton.layout';
import { Footer } from './Footer.layout';
import Navbar from './Navbar.layout';

const SharedLayout: React.FC = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw' }}>
    <Navbar />
    <Toolbar />
    <Box component="main" sx={{ flexGrow: 1 }}>
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </ErrorBoundary>
    </Box>
    <Footer />
    <BacktoTopButton />
  </Box>
);

export default SharedLayout;
