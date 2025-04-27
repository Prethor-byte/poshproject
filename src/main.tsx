import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { PoshMantineProvider } from '@/lib/mantine-provider';
import { Toaster } from '@/components/ui/toaster';
import { router } from '@/routes';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <PoshMantineProvider>
        <RouterProvider router={router} />
        <Toaster />
      </PoshMantineProvider>
    </HelmetProvider>
  </StrictMode>
);
