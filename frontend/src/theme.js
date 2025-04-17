import { createTheme } from '@mui/material/styles';

// Farben für das *Summoners War*-Thema
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
    mode: 'dark', // Dunkles Theme für Minimalismus
    background: {
      default: darkBg,
      paper: gray900, // Für Karten und Container
    },
    primary: {
      main: blue500, // Primärfarbe für Buttons, Eingaben, etc.
    },
    secondary: {
      main: manaBlue, // Mana-Kristall-Blau für Akzente
    },
    text: {
      primary: '#ffffff', // Weißer Text
      secondary: gray400, // Grauer Text für Labels
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif', // Beibehaltung von Poppins
    h1: { fontSize: '2rem', fontWeight: 700 },
    h2: { fontSize: '1.5rem', fontWeight: 600 },
    body1: { fontSize: '1rem' },
    body2: { fontSize: '0.875rem', color: gray400 },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // Abgerundete Ecken wie rounded-lg
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // Wie shadow-xl
          border: `1px solid ${gray700}`, // Wie border-gray-700
          padding: '1.5rem', // Wie p-6
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'scale(1.05)', // Wie hover:scale-105
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '4px', // Wie rounded
            backgroundColor: gray900, // Wie bg-gray-900
            '& fieldset': {
              borderColor: gray600, // Wie border-gray-600
            },
            '&:hover fieldset': {
              borderColor: gray400,
            },
            '&.Mui-focused fieldset': {
              borderColor: blue500, // Wie focus:border-blue-500
            },
          },
          '& .MuiInputLabel-root': {
            color: gray400, // Wie text-gray-400
            fontSize: '0.875rem', // Wie text-sm
            transform: 'translate(14px, 16px) scale(1)', // Startposition für schwebende Labels
            '&.Mui-focused, &.MuiFormLabel-filled': {
              transform: 'translate(14px, 4px) scale(0.75)', // Wie top-1 text-xs
              color: blue500, // Wie text-blue-500
            },
          },
          '& .MuiInputBase-input': {
            padding: '16px 14px 8px', // Anpassung für schwebende Labels
            color: '#ffffff', // Wie text-white
          },
        },
      },
    },
  },
});

export default theme;