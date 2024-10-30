import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Customize your primary color
    },
    secondary: {
      main: '#dc004e', // Customize your secondary color
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial',
    h6: {
      fontWeight: 600,
    },
  },
});

export default theme;
