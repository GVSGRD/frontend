import { alpha } from '@mui/material/styles';

export const dataDisplayCustomizations = {
  MuiList: {
    styleOverrides: {
      root: {
        padding: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      },
    },
  },
  MuiListItem: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius,
        padding: '6px 8px',
        '&:hover': {
          backgroundColor: alpha(theme.palette.action.hover, 0.1),
        },
      }),
    },
  },
  MuiListItemText: {
    styleOverrides: {
      primary: {
        fontWeight: 500,
      },
      secondary: {
        fontSize: '0.875rem',
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: '999px',
        border: '1px solid',
        borderColor: theme.palette.divider,
        backgroundColor: alpha(theme.palette.background.paper, 0.5),
      }),
    },
  },
};