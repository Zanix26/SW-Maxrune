import { createTheme } from '@mui/material/styles';

const darkBg = '#1A1A1A';
const darkBgLight = '#2A2A2A';
const gray900 = '#111827';
const gray700 = '#374151';
const gray600 = '#4B5563';
const gray400 = '#9CA3AF';
const blue500 = '#3B82F6';
const manaBlue = '#55AAFF';
const manaYellow = '#FFFFAA';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: darkBg, // Grauer Hintergrund
      paper: gray900,
    },
    primary: {
      main: blue500,
    },
    secondary: {
      main: manaBlue,
    },
    text: {
      primary: '#ffffff',
      secondary: gray400,
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
    h1: { fontSize: '2rem', fontWeight: 700 },
    h2: { fontSize: '1.5rem', fontWeight: 600 },
    body1: { fontSize: '1rem' },
    body2: { fontSize: '0.875rem', color: gray400 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: `1px solid ${gray700}`,
          padding: '1.5rem',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '4px',
            backgroundColor: gray900,
            '& fieldset': {
              borderColor: gray600,
            },
            '&:hover fieldset': {
              borderColor: gray400,
            },
            '&.Mui-focused fieldset': {
              borderColor: blue500,
            },
          },
          '& .MuiInputLabel-root': {
            color: gray400,
            fontSize: '0.875rem',
            transform: 'translate(14px, 16px) scale(1)',
            '&.Mui-focused, &.MuiFormLabel-filled': {
              transform: 'translate(14px, 4px) scale(0.75)',
              color: blue500,
            },
          },
          '& .MuiInputBase-input': {
            padding: '16px 14px 8px',
            color: '#ffffff',
          },
        },
      },
    },
  },
});

export default theme;