import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import InstagramIcon from '@mui/icons-material/Instagram';
import { useThemeStore } from '../store/themeStore';
import { Brightness4, Brightness7 } from '@mui/icons-material';

const Navbar: React.FC = () => {
  const { themeMode, toggleTheme } = useThemeStore();

  return (
    <AppBar 
      position="sticky" 
      elevation={0} 
      sx={{ 
        backgroundColor: 'background.default',
        color: 'text.primary'
      }}
    >
      <Toolbar>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
          <Button color="inherit" component={Link} to="/gallery">
            Gallery
          </Button>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Typography variant="h6" component="div">
            Alessandro Torri
          </Typography>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton
            color="inherit"
            href="https://www.instagram.com/alessandrotorri/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <InstagramIcon />
          </IconButton>
          <IconButton onClick={toggleTheme} color="inherit">
            {themeMode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
