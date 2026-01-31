import { createTheme } from '@mui/material/styles';

// Light Theme
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6d6d6d', // A slightly darker gray for primary elements
    },
    secondary: {
      main: '#a56d4d', // A warm, earthy secondary color
    },
    background: {
      default: '#f5f5f5', // A warm off-white
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

// Dark Theme
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9c27b0',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212', // A nice dark gray
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});
