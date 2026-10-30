import { Brightness4, Brightness7 } from '@mui/icons-material';
import InstagramIcon from '@mui/icons-material/Instagram';
import MenuIcon from '@mui/icons-material/Menu';
import YouTubeIcon from '@mui/icons-material/YouTube';
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  Typography,
  useTheme,
  type ButtonProps,
} from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { COLLECTIONS } from '../data/collections.data';
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
    theme.palette.mode === 'dark' ? theme.palette.background.default : '#ffffff',
    0.7
  ),
  padding: '10px 16px',
  transition: 'all 0.3s ease',
  [theme.breakpoints.up('sm')]: {
    padding: '10px 40px',
  },
}));

type NavLinkProps = ButtonProps & {
  component?: React.ElementType;
  to?: string;
};

const NavLink = styled(Button)<NavLinkProps>(({ theme }) => ({
  color: alpha(theme.palette.text.primary, 0.65),
  textTransform: 'uppercase',
  fontSize: '0.75rem',
  letterSpacing: '0.2em',
  fontWeight: 500,
  padding: '6px 16px',
  transition: 'color 0.3s ease',
  backgroundColor: 'transparent !important',

  '&:hover': {
    color: theme.palette.text.primary,
    backgroundColor: 'transparent !important',
  },

  '&.Mui-focusVisible': {
    outline: 'none',
    boxShadow: 'none',
  },

  '& .MuiTouchRipple-root': {
    display: 'none',
  },
}));

const LogoLink = styled(Button)<NavLinkProps>(({ theme }) => ({
  color: alpha(theme.palette.text.primary, 0.72),
  fontSize: '0.85rem',
  letterSpacing: '0.3em',
  fontWeight: 600,
  padding: '6px 16px',
  transition: 'color 0.3s ease',
  backgroundColor: 'transparent !important',

  '&:hover': {
    color: theme.palette.text.primary,
    backgroundColor: 'transparent !important',
  },

  '&.Mui-focusVisible': {
    outline: 'none',
    boxShadow: 'none',
  },

  [theme.breakpoints.down('sm')]: {
    fontSize: '0.7rem',
    letterSpacing: '0.14em',
    padding: '6px 8px',
  },

  whiteSpace: 'nowrap',

  '& .MuiTouchRipple-root': {
    display: 'none',
  },
}));

const Navbar: React.FC = () => {
  const { themeMode, toggleTheme } = useThemeStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const location = useLocation();
  const mutedColor = alpha(theme.palette.text.primary, 0.65);
  const collectionSlug = location.pathname.match(/^\/gallery\/([^/]+)\/?$/)?.[1];
  const currentCollection = COLLECTIONS.find((item) => item.slug === collectionSlug);

  const iconButtonSx = {
    color: mutedColor,
    transition: 'color 0.3s ease',
    '&:hover': {
      color: theme.palette.text.primary,
    },
    '&.Mui-focusVisible': {
      outline: 'none',
      boxShadow: 'none',
    },
  };

  return (
    <NavbarWrapper>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: 'transparent',
          color: 'text.primary',
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        <StyledToolbar>
          <Box sx={{ flex: 1, minWidth: 0, display: 'flex', justifyContent: 'flex-start' }}>
            <Box
              component="nav"
              aria-label="breadcrumb"
              sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.5, minWidth: 0 }}
            >
              <NavLink component={Link} to="/gallery" disableRipple nativeButton={false}>
                Gallerie
              </NavLink>
              {currentCollection && (
                <>
                  <Typography
                    component="span"
                    sx={{ color: alpha(theme.palette.text.primary, 0.4), fontSize: '0.75rem' }}
                  >
                    /
                  </Typography>
                  <Typography
                    component="span"
                    sx={{
                      minWidth: 0,
                      color: 'text.primary',
                      fontSize: '0.72rem',
                      fontWeight: 500,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {currentCollection.title}
                  </Typography>
                </>
              )}
            </Box>
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
              <IconButton
                onClick={() => setDrawerOpen(true)}
                color="inherit"
                disableRipple
                aria-label="Open menu"
                sx={iconButtonSx}
              >
                <MenuIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>
          </Box>

          <Box sx={{ flex: '0 1 auto', minWidth: 0, display: 'flex', justifyContent: 'center' }}>
            <LogoLink component={Link} to="/" disableRipple nativeButton={false}>
              Alessandro Torri
            </LogoLink>
          </Box>

          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
          >
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
              <IconButton
                color="inherit"
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                disableRipple
                aria-label="Instagram"
                sx={iconButtonSx}
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
                sx={iconButtonSx}
              >
                <YouTubeIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton
                onClick={toggleTheme}
                color="inherit"
                disableRipple
                aria-label="Toggle theme"
                sx={iconButtonSx}
              >
                {themeMode === 'dark' ? <Brightness7 sx={{ fontSize: 18 }} /> : <Brightness4 sx={{ fontSize: 18 }} />}
              </IconButton>
            </Box>
          </Box>
        </StyledToolbar>

        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          slotProps={{
            paper: {
              sx: {
                width: 260,
                backgroundColor: alpha(theme.palette.background.default, 0.82),
                backgroundImage: 'none',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                borderRight: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
              },
            },
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2 }}>
            <List sx={{ pt: 0 }}>
              <ListItem disablePadding>
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
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
              <IconButton
                color="inherit"
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                disableRipple
                aria-label="Instagram"
                sx={iconButtonSx}
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
                sx={iconButtonSx}
              >
                <YouTubeIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton
                onClick={toggleTheme}
                color="inherit"
                disableRipple
                aria-label="Toggle theme"
                sx={iconButtonSx}
              >
                {themeMode === 'dark' ? <Brightness7 sx={{ fontSize: 18 }} /> : <Brightness4 sx={{ fontSize: 18 }} />}
              </IconButton>
            </Box>
          </Box>
        </Drawer>
      </AppBar>
    </NavbarWrapper>
  );
};

export default Navbar;
