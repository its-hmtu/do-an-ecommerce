// src/styles/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontSize: 14, // base font size
    pxToRem: (size) => `${size / 16}rem`, // define pxToRem function
  },
});

export default theme;