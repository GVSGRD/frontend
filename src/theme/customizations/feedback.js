import { alpha } from '@mui/material/styles';

export const feedbackCustomizations = {
  MuiAlert: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 8,
        border: '1px solid',
        borderColor: theme.palette.divider,
      }),
    },
  },
};