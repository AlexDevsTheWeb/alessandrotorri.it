import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Box, Container, IconButton, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { INSTAGRAM_URL, YOUTUBE_URL } from './Navbar.layout';

export const Footer: React.FC = () => (
  <Box
    component="footer"
    sx={{
      py: 2,
      px: 2,
      mt: 'auto',
      backgroundColor: 'transparent',
    }}
  >
    <Container maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: { xs: 0, sm: 2 },
        }}
      >
        <Typography variant="caption" color="text.secondary">
          Copyright © Alessandro Torri {new Date().getFullYear()}
        </Typography>
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 0.5 }}>
          <IconButton
            color="inherit"
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            disableRipple
            aria-label="Instagram"
            sx={{
              color: (theme) => alpha(theme.palette.text.primary, 0.6),
              '&:hover': { color: 'text.primary' },
            }}
          >
            <InstagramIcon sx={{ fontSize: 17 }} />
          </IconButton>
          <IconButton
            color="inherit"
            href={YOUTUBE_URL}
            target="_blank"
            rel="noopener noreferrer"
            disableRipple
            aria-label="YouTube"
            sx={{
              color: (theme) => alpha(theme.palette.text.primary, 0.6),
              '&:hover': { color: 'text.primary' },
            }}
          >
            <YouTubeIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Box>
      </Box>
    </Container>
  </Box>
);
