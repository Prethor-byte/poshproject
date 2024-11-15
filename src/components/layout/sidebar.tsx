import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Settings,
  Share2,
  Users,
  Menu,
  X,
  Moon,
  Sun,
  Laptop,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/lib/theme';

interface MenuItem {
  icon: React.ElementType;
  label: string;
  href: string;
}

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Share2, label: 'Share Manager', href: '/share' },
  { icon: Users, label: 'Follow Manager', href: '/follow' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { setTheme } = useTheme();
  const location = useLocation();

  return (
    <div
      className={cn(
        'h-screen bg-background border-r flex flex-col transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="p-4 flex justify-between items-center">
        <h1
          className={cn(
            'font-bold text-xl transition-opacity duration-300',
            collapsed && 'opacity-0'
          )}
        >
          Poshmark Pro
        </h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </Button>
      </div>

      <nav className="flex-1 p-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className="block mb-2 w-full"
            >
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  'w-full justify-start',
                  collapsed ? 'px-2' : 'px-4'
                )}
              >
                <item.icon className="mr-2" size={20} />
                <span
                  className={cn(
                    'transition-opacity duration-300',
                    collapsed && 'opacity-0'
                  )}
                >
                  {item.label}
                </span>
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn('w-full justify-start', collapsed ? 'px-2' : 'px-4')}
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span
                className={cn(
                  'ml-2 transition-opacity duration-300',
                  collapsed && 'opacity-0'
                )}
              >
                Theme
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme('light')}>
              <Sun className="mr-2 h-4 w-4" />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('dark')}>
              <Moon className="mr-2 h-4 w-4" />
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme('system')}>
              <Laptop className="mr-2 h-4 w-4" />
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}