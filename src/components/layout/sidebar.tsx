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
          "fixed top-4 left-4 z-50 p-2 rounded-lg bg-background border-border",
          "hover:bg-accent hover:text-accent-foreground transition-colors duration-200",
          "lg:hidden"
        )}
      >
        <Bars3Icon className="h-5 w-5" />
      </button>

      <div
        className={cn(
          "fixed inset-y-0 z-40 flex flex-col transition-all duration-300 ease-in-out bg-background border-r border-border",
          isCollapsed ? "w-20" : "w-72",
          isMobile && isCollapsed && "-translate-x-full"
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between px-6">
          {!isCollapsed && (
            <Link to="/app" className="text-xl font-semibold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
              Poshmark
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="rounded-lg p-2 hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            {isCollapsed ? (
              <ChevronRightIcon className="h-5 w-5" />
            ) : (
              <ChevronLeftIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-y-4 px-4">
          <ul role="list" className="flex flex-1 flex-col gap-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      'group flex items-center gap-x-3 rounded-lg p-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <item.icon
                      className={cn(
                        'h-5 w-5 shrink-0',
                        isActive
                          ? 'text-current'
                          : 'text-muted-foreground group-hover:text-current'
                      )}
                      aria-hidden="true"
                    />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-auto pb-4">
            {!isCollapsed && (
              <div className="mb-2 px-2">
                <div className="text-sm font-medium text-muted-foreground">
                  {user?.email}
                </div>
              </div>
            )}
            <button
              onClick={() => signOut()}
              className={cn(
                "group flex items-center gap-x-3 rounded-lg p-2 text-sm font-medium transition-colors w-full",
                "text-muted-foreground hover:bg-destructive hover:text-destructive-foreground",
                isCollapsed && "justify-center"
              )}
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 shrink-0" />
              {!isCollapsed && "Sign out"}
            </button>
          </div>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {!isCollapsed && isMobile && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30"
          onClick={() => setIsCollapsed(true)}
        />
      )}
    </>
  );
}
