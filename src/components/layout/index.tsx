import { Outlet } from 'react-router-dom';
import { Sidebar } from './sidebar';
import { Toaster } from '@/components/ui/sonner';

export function Layout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}