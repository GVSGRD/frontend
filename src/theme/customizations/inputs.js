import { alpha } from '@mui/material/styles';

export const inputsCustomizations = {
  MuiTextField: {
    styleOverrides: {
      root: {
        borderRadius: 8,
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
  },
};