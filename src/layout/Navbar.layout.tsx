import { Brightness4, Brightness7 } from '@mui/icons-material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import { AppBar, Box, Button, IconButton, type ButtonProps } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import React from 'react';
import { Link } from 'react-router-dom';
import { useThemeStore } from '../store/themeStore';
import NavbarWrapper from './NavbarWrapper.layout';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backdropFilter: 'blur(20px) saturate(180%)', // Il saturate aiuta a rendere i colori sotto più vivi
  WebkitBackdropFilter: 'blur(20px) saturate(180%)', // Supporto per Safari
  borderBottom: '1px solid',
  // Un bordo molto sottile e quasi trasparente
  borderColor: alpha(theme.palette.divider, 0.08),
  backgroundColor: alpha(
    theme.palette.mode === 'dark'
      ? theme.palette.background.default
      : '#ffffff',
    0.7 // Aumentato per leggibilità
  ),
  padding: '10px 40px', // Leggermente più stretto verticalmente, più largo ai lati
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
  transition: 'opacity 0.3s ease', // Transizione solo sull'opacità
  backgroundColor: 'transparent !important', // Forza la trasparenza

  '&:hover': {
    opacity: 0.5, // L'effetto diventa un "fade" delicato
    backgroundColor: 'transparent !important',
  },

  // Rimuove l'overlay grigio che MUI mette di default
  '& .MuiTouchRipple-root': {
    display: 'none',
  },
}));

const Navbar: React.FC = () => {
  const { themeMode, toggleTheme } = useThemeStore();

  return (
    <NavbarWrapper>
      <AppBar
        position="fixed" // 'fixed' è meglio di 'sticky' per questo effetto
        elevation={0}
        sx={{
          backgroundColor: 'transparent',
          transition: 'transform 0.3s ease-in-out', // Transizione fluida
        }}
      >
        <StyledToolbar>
          <IconButton
            component={Link}
            to="/"
            disableRipple
            sx={{ color: 'text.primary', '&:hover': { opacity: 0.6 } }}
          >
            <HomeOutlinedIcon sx={{ fontSize: 20 }} />
          </IconButton>

          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 4 }}>
            <NavLink component={Link} to="/gallery" disableRipple>
              Gallery
            </NavLink>
            <NavLink component={Link} to="/projects" disableRipple>
              Projects
            </NavLink>
            <NavLink component={Link} to="/about" disableRipple>
              About
            </NavLink>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              color="inherit"
              href="https://www.instagram.com/alessandrotorri/"
              target="_blank"
              disableRipple
              sx={{ '&:hover': { opacity: 0.6 } }}
            >
              <InstagramIcon sx={{ fontSize: 18 }} />
            </IconButton>
            <IconButton
              onClick={toggleTheme}
              color="inherit"
              disableRipple
              sx={{ '&:hover': { opacity: 0.6 } }}
            >
              {themeMode === 'dark' ? <Brightness7 sx={{ fontSize: 18 }} /> : <Brightness4 sx={{ fontSize: 18 }} />}
            </IconButton>
          </Box>
        </StyledToolbar>
      </AppBar>
    </NavbarWrapper>
  );
};

export default Navbar;
