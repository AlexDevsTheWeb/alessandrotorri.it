import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Box, Button, Container, IconButton, Typography } from '@mui/material';
import { INSTAGRAM_URL, YOUTUBE_URL } from './Navbar.layout';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        px: 2,
        mt: 'auto',
        backgroundColor: 'transparent',
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Button
            onClick={scrollToTop}
            disableRipple
            sx={{
              color: 'text.primary',
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              fontWeight: 500,
              backgroundColor: 'transparent !important',
              '&:hover': { opacity: 0.5, backgroundColor: 'transparent !important' },
              '& .MuiTouchRipple-root': { display: 'none' },
            }}
          >
            ↑ Back to Top
          </Button>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
          </Box>
          <Typography variant="body2" color="text.secondary" align="center">
            Copyright © Alessandro Torri {new Date().getFullYear()}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
