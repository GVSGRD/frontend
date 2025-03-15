import { alpha } from '@mui/material/styles';

export const surfacesCustomizations = {
  MuiPaper: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius,
        border: '1px solid',
        borderColor: theme.palette.divider,
      }),
    },
  },
};