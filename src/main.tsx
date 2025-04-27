import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './components/theme-provider';
import { PoshMantineProvider } from '@/lib/mantine-provider';
import { Toaster } from '@/components/ui/toaster';
import { router } from '@/routes';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <PoshMantineProvider>
        <ThemeProvider defaultTheme="system" storageKey="posh-theme">
          <RouterProvider router={router} />
          <Toaster />
        </ThemeProvider>
      </PoshMantineProvider>
    </HelmetProvider>
  </StrictMode>
);
