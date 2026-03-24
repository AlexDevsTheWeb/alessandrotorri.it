import { createTheme } from '@mui/material/styles';

const baseTypography = {
  // Font di default per tutto il corpo del testo, menu, bottoni
  fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
  
  // Font specifico per i titoli
  h1: { fontFamily: '"Playfair Display", serif', letterSpacing: '-0.02em' },
  h2: { fontFamily: '"Playfair Display", serif', fontWeight: 700 },
  h3: { fontFamily: '"Playfair Display", serif', fontWeight: 600 },
  h4: { fontFamily: '"Playfair Display", serif', fontWeight: 600 },
  h5: { fontFamily: '"Inter", sans-serif', fontWeight: 500 }, // Titoli piccoli più moderni
  h6: { fontFamily: '"Inter", sans-serif', fontWeight: 500 },
  
  button: {
    textTransform: 'none' as const, // Toglie il tutto maiuscolo automatico, molto più moderno
    fontWeight: 500,
    letterSpacing: '0.02em',
  },
};

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1a1a1a' }, // Nero quasi puro per testi e icone
    background: {
      default: '#ffffff', // Bianco puro per la massima pulizia
      paper: '#fafafa',
    },
  },
  typography: baseTypography,
  shape: { borderRadius: 0 }, // Angoli netti = look più moderno e architettonico
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#ffffff' },
    // Questo resetta i colori di "azione" (hover, selected, etc.)
    action: {
      hover: 'rgba(255, 255, 255, 0.08)', 
      selected: 'rgba(255, 255, 255, 0.16)',
    },
    background: { default: '#0a0a0a', paper: '#121212' },
  },
  typography: baseTypography,
  // --- AGGIUNGI QUESTA SEZIONE ---
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true, // Toglie l'animazione a cerchio ovunque
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          // Rimuove il background grigio/viola di default su tutti i bottoni text
          '&:hover': {
            backgroundColor: 'transparent',
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
        },
      },
    },
  },
});