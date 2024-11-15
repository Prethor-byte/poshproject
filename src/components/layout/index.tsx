import { Outlet } from 'react-router-dom';
import { Sidebar } from './sidebar';
import { ThemeToggle } from './theme-toggle';

export function Layout() {
  return (
    <div className="relative min-h-screen">
      <Sidebar />
      <div className="flex min-h-screen flex-col lg:pl-72">
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <div className="flex flex-1 items-center justify-end gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="flex-1">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
