
import { Box, Typography, Container, IconButton } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';

export const Footer: React.FC = () => {
    return (
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: 'transparent',
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Alessandro Torri. All rights reserved.
            </Typography>
            <IconButton
              color="inherit"
              href="https://www.instagram.com/alessandrotorri/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramIcon />
            </IconButton>
          </Box>
        </Container>
      </Box>
    );
  };