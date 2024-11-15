import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, Share2 } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Share Manager', href: '/share', icon: Share2 },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-background px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <Link to="/" className="text-xl font-semibold">
            Poshmark Automation
          </Link>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={cn(
                          'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6',
                          isActive
                            ? 'bg-gray-50 text-primary dark:bg-gray-800'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-primary dark:text-gray-400 dark:hover:bg-gray-800'
                        )}
                      >
                        <item.icon
                          className={cn(
                            'h-6 w-6 shrink-0',
                            isActive
                              ? 'text-primary'
                              : 'text-gray-400 group-hover:text-primary'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
