import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  HomeIcon,
  ShareIcon,
  UserIcon,
  CogIcon,
  KeyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/use-auth';
import { useState, useEffect } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/app', icon: HomeIcon },
  { name: 'Share', href: '/app/share', icon: ShareIcon },
  { name: 'Accounts', href: '/app/accounts', icon: KeyIcon },
  { name: 'Profile', href: '/app/profile', icon: UserIcon },
  { name: 'Settings', href: '/app/settings', icon: CogIcon },
];

export function Sidebar() {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 1024);
      if (width < 1024) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          "fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800",
          "hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200",
          "lg:hidden"
        )}
      >
        <Bars3Icon className="h-5 w-5 text-zinc-500" />
      </button>

      <div
        className={cn(
          "fixed inset-y-0 z-40 flex flex-col transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-72",
          isMobile && isCollapsed && "-translate-x-full"
        )}
      >
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 h-full">
          <div className="flex h-16 shrink-0 items-center justify-between px-6">
            {!isCollapsed && (
              <Link to="/app" className="text-xl font-semibold bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">
                Poshmark
              </Link>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="rounded-lg p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {isCollapsed ? (
                <ChevronRightIcon className="h-5 w-5 text-zinc-500" />
              ) : (
                <ChevronLeftIcon className="h-5 w-5 text-zinc-500" />
              )}
            </button>
          </div>
          <nav className="flex flex-1 flex-col px-4">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="space-y-2">
                  {navigation.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          to={item.href}
                          className={cn(
                            'group flex items-center gap-x-3 rounded-lg p-2 text-sm font-medium transition-colors',
                            isActive
                              ? 'bg-gradient-to-r from-violet-500/10 to-indigo-500/10 text-violet-600 dark:from-violet-400/10 dark:to-indigo-400/10 dark:text-violet-400'
                              : 'text-zinc-700 hover:bg-zinc-100 hover:text-violet-600 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-violet-400'
                          )}
                        >
                          <item.icon
                            className={cn(
                              'h-5 w-5 shrink-0',
                              isActive
                                ? 'text-violet-600 dark:text-violet-400'
                                : 'text-zinc-400 group-hover:text-violet-600 dark:text-zinc-500 dark:group-hover:text-violet-400'
                            )}
                            aria-hidden="true"
                          />
                          {!isCollapsed && <span>{item.name}</span>}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
              <li className="mt-auto">
                {!isCollapsed && (
                  <div className="mb-2 px-2">
                    <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      {user?.email}
                    </div>
                  </div>
                )}
                <button
                  onClick={() => signOut()}
                  className={cn(
                    "group flex items-center gap-x-3 rounded-lg p-2 text-sm font-medium transition-colors w-full",
                    "text-zinc-700 hover:bg-zinc-100 hover:text-violet-600 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-violet-400",
                    isCollapsed && "justify-center"
                  )}
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 text-zinc-400 group-hover:text-violet-600 dark:text-zinc-500 dark:group-hover:text-violet-400" />
                  {!isCollapsed && "Sign out"}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Overlay for mobile */}
      {!isCollapsed && isMobile && (
        <div 
          className="fixed inset-0 bg-zinc-900/50 z-30"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  );
}
