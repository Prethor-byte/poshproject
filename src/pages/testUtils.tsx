import { ReactNode } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <HelmetProvider>
      <ThemeProvider defaultTheme="system" storageKey="posh-theme">
        <MemoryRouter>
          {children}
        </MemoryRouter>
      </ThemeProvider>
    </HelmetProvider>
  );
}
