import { MantineThemeOverride, MantineTheme } from '@mantine/core';

export const poshTheme: MantineThemeOverride = {
  primaryColor: 'grape',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  headings: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    fontWeight: '700',
  },
  colors: {
    grape: [
      '#f8f0fc', '#f3d9fa', '#eebefa', '#e599f7', '#da77f2', '#cc5de8', '#be4bdb', '#ae3ec9', '#9c36b5', '#862e9c'
    ],
    // Add accent colors if needed
  },
  components: {
    Button: {
      styles: (theme: MantineTheme) => ({
        root: {
          borderRadius: theme.radius.md,
          fontWeight: 600,
        },
      }),
    },
    Card: {
      styles: (theme: MantineTheme) => ({
        root: {
          borderRadius: theme.radius.lg,
          boxShadow: theme.shadows.md,
        },
      }),
    },
  },
};
