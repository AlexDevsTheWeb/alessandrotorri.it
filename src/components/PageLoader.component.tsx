import { Box, CircularProgress } from '@mui/material';
import React from 'react';

const PageLoader: React.FC = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
    <CircularProgress size={24} color="inherit" />
  </Box>
);

export default PageLoader;
