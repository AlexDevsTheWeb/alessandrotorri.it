import { Brightness4, Brightness7 } from '@mui/icons-material';
import InstagramIcon from '@mui/icons-material/Instagram';
import MenuIcon from '@mui/icons-material/Menu';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { AppBar, Box, Button, Drawer, IconButton, List, ListItem, type ButtonProps } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useThemeStore } from '../store/themeStore';
import NavbarWrapper from './NavbarWrapper.layout';

export const INSTAGRAM_URL = 'http://instagram.com/alessandrotorriph';
export const YOUTUBE_URL = 'https://www.youtube.com/c/AlessandroTorri';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  borderBottom: '1px solid',
  borderColor: alpha(theme.palette.divider, 0.08),
  backgroundColor: alpha(
    theme.palette.mode === 'dark'
      ? theme.palette.background.default
      : '#ffffff',
    0.7
  ),
  padding: '10px 40px',
  transition: 'all 0.3s ease',
}));

type NavLinkProps = ButtonProps & {
  component?: React.ElementType;
  to?: string;
};

const NavLink = styled(Button)<NavLinkProps>(({ theme }) => ({
  color: theme.palette.text.primary,
  textTransform: 'uppercase',
  fontSize: '0.75rem',
  letterSpacing: '0.2em',
  fontWeight: 500,
  padding: '6px 16px',
  transition: 'opacity 0.3s ease',
  backgroundColor: 'transparent !important',

  '&:hover': {
    opacity: 0.5,
    backgroundColor: 'transparent !important',
  },

  '& .MuiTouchRipple-root': {
    display: 'none',
  },
}));

const LogoLink = styled(Button)<NavLinkProps>(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '0.85rem',
  letterSpacing: '0.3em',
  fontWeight: 600,
  padding: '6px 16px',
  transition: 'opacity 0.3s ease',
  backgroundColor: 'transparent !important',

  '&:hover': {
    opacity: 0.5,
    backgroundColor: 'transparent !important',
  },

  '& .MuiTouchRipple-root': {
    display: 'none',
  },
}));

const Navbar: React.FC = () => {
  const { themeMode, toggleTheme } = useThemeStore();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <NavbarWrapper>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: 'transparent',
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        <StyledToolbar>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <NavLink component={Link} to="/gallery" disableRipple nativeButton={false}>
                Gallerie
              </NavLink>
            </Box>
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
              <IconButton
                onClick={() => setDrawerOpen(true)}
                color="inherit"
                disableRipple
                aria-label="Open menu"
                sx={{ '&:hover': { opacity: 0.6 } }}
              >
                <MenuIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <LogoLink component={Link} to="/" disableRipple nativeButton={false}>
              Alessandro Torri
            </LogoLink>
          </Box>

          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
            <IconButton
              color="inherit"
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              disableRipple
              aria-label="Instagram"
              sx={{ '&:hover': { opacity: 0.6 } }}
            >
              <InstagramIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <IconButton
              color="inherit"
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              disableRipple
              aria-label="YouTube"
              sx={{ '&:hover': { opacity: 0.6 } }}
            >
              <YouTubeIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <IconButton
              onClick={toggleTheme}
              color="inherit"
              disableRipple
              aria-label="Toggle theme"
              sx={{ '&:hover': { opacity: 0.6 } }}
            >
              {themeMode === 'dark' ? <Brightness7 sx={{ fontSize: 18 }} /> : <Brightness4 sx={{ fontSize: 18 }} />}
            </IconButton>
          </Box>
        </StyledToolbar>
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <List sx={{ minWidth: 220, pt: 2 }}>
            <ListItem>
              <NavLink
                component={Link}
                to="/gallery"
                disableRipple
                nativeButton={false}
                onClick={() => setDrawerOpen(false)}
              >
                Gallerie
              </NavLink>
            </ListItem>
          </List>
        </Drawer>
      </AppBar>
    </NavbarWrapper>
  );
};

export default Navbar;
