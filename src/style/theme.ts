import { createTheme } from '@mui/material/styles';

const baseTypography = {
  fontFamily: '"DM Sans", "Helvetica", "Arial", sans-serif',
  h1: {
    fontFamily: '"Instrument Serif", "Times New Roman", serif',
    fontWeight: 400,
    letterSpacing: '-0.02em',
    lineHeight: 1.05,
  },
  h2: {
    fontFamily: '"Instrument Serif", "Times New Roman", serif',
    fontWeight: 400,
    letterSpacing: '-0.01em',
  },
  h3: {
    fontFamily: '"Instrument Serif", "Times New Roman", serif',
    fontWeight: 400,
  },
  h4: {
    fontFamily: '"Instrument Serif", "Times New Roman", serif',
    fontWeight: 400,
  },
  h5: { fontFamily: '"DM Sans", sans-serif', fontWeight: 500 },
  h6: { fontFamily: '"DM Sans", sans-serif', fontWeight: 500 },
  button: {
    textTransform: 'none' as const,
    fontWeight: 500,
    letterSpacing: '0.02em',
  },
};

const sharedComponents = {
  MuiButtonBase: {
    defaultProps: {
      disableRipple: true,
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        '&:hover': {
          backgroundColor: 'transparent',
        },
        '&.Mui-focusVisible': {
          outline: 'none',
          boxShadow: 'none',
        },
      },
    },
  },
  MuiIconButton: {
    styleOverrides: {
      root: {
        '&:hover': {
          backgroundColor: 'transparent',
        },
        '&.Mui-focusVisible': {
          outline: 'none',
          boxShadow: 'none',
        },
      },
    },
  },
};

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1a1a1a' },
    background: {
      default: '#ffffff',
      paper: '#fafafa',
    },
  },
  typography: baseTypography,
  shape: { borderRadius: 0 },
  components: sharedComponents,
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#ffffff' },
    action: {
      hover: 'rgba(255, 255, 255, 0.08)',
      selected: 'rgba(255, 255, 255, 0.16)',
    },
    background: { default: '#0a0a0a', paper: '#121212' },
  },
  typography: baseTypography,
  shape: { borderRadius: 0 },
  components: sharedComponents,
});
