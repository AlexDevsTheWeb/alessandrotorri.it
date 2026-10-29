import { IconButton } from '@mui/material';
import { alpha } from '@mui/material/styles';
import UpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useEffect, useState } from 'react';

const BacktoTopButton = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const checkScrollHeight = () => {
      setShowButton(window.scrollY > 400);
    };

    window.addEventListener('scroll', checkScrollHeight);
    return () => {
      window.removeEventListener('scroll', checkScrollHeight);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <IconButton
      aria-label="Back to top"
      onClick={scrollToTop}
      sx={{
        position: 'fixed',
        bottom: { xs: 24, md: 32 },
        right: { xs: 16, md: 32 },
        zIndex: 1000,
        display: showButton ? 'inline-flex' : 'none',
        color: (theme) => alpha(theme.palette.text.primary, 0.6),
        backgroundColor: 'transparent !important',
        boxShadow: 'none',
        transition: 'color 0.2s ease',
        '&:hover': {
          backgroundColor: 'transparent !important',
          color: 'text.primary',
        },
      }}
    >
      <UpIcon />
    </IconButton>
  );
};

export default BacktoTopButton;
