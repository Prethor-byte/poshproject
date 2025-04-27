import { Outlet } from 'react-router-dom';
import { AppShellMantine } from './AppShellMantine';

export function Layout() {
  return (
    <AppShellMantine>
      <Outlet />
    </AppShellMantine>
  );
}
