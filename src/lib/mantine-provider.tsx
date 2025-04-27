import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { poshTheme } from '@/styles/mantine-theme';
import { ReactNode } from 'react';

export function PoshMantineProvider({ children }: { children: ReactNode }) {
  return (
    <MantineProvider theme={poshTheme} withCssVariables defaultColorScheme="light">
      <Notifications position="top-right" zIndex={2077} />
      {children}
    </MantineProvider>
  );
}
