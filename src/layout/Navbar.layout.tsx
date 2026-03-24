import { Brightness4, Brightness7 } from '@mui/icons-material';
import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import InstagramIcon from '@mui/icons-material/Instagram';
import { AppBar, Box, Button, IconButton } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import React from 'react';
import { Link } from 'react-router-dom';
import { useThemeStore } from '../store/themeStore';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  backdropFilter: 'blur(30px)',
  borderBottom: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.1)`
    : alpha(theme.palette.background.default, 0.1),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '20px',
}));

const Navbar: React.FC = () => {
  const { themeMode, toggleTheme } = useThemeStore();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        // backgroundColor: 'background.default',
        backgroundColor: 'transparent',
        color: 'text.primary'
      }}
    >
      <StyledToolbar>
        <Button color="inherit" component={Link} to="/" disableRipple disableFocusRipple>
          <HomeFilledIcon />
        </Button>

        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
          <Button color="inherit" component={Link} to="/gallery">
            Gallery
          </Button>
        </Box>

        {/* <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Typography variant="h6" component="div">
            Alessandro Torri
          </Typography>
        </Box> */}

        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton
            color="inherit"
            href="https://www.instagram.com/alessandrotorri/"
            target="_blank"
            rel="noopener noreferrer"
            disableFocusRipple disableRipple
          >
            <InstagramIcon />
          </IconButton>
          <IconButton onClick={toggleTheme} color="inherit" disableFocusRipple disableRipple disableTouchRipple>
            {themeMode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>
      </StyledToolbar>
    </AppBar>
  );
};

export default Navbar;
