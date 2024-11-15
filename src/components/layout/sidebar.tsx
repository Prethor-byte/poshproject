import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  HomeIcon,
  ShareIcon,
  UserIcon,
  CogIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/use-auth';

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

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-background px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <Link to="/app" className="text-xl font-semibold">
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
                            ? 'bg-gray-50 text-indigo-600 dark:bg-gray-800'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-gray-800'
                        )}
                      >
                        <item.icon
                          className={cn(
                            'h-6 w-6 shrink-0',
                            isActive
                              ? 'text-indigo-600'
                              : 'text-gray-400 group-hover:text-indigo-600'
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
            <li className="mt-auto">
              <div className="mb-2 px-2">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.email}
                </div>
              </div>
              <button
                onClick={() => signOut()}
                className="group -mx-2 flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                Sign out
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
