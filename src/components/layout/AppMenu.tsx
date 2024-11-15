import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { playwrightLogin } from '@/lib/playwrightLogin';

export const AppMenu = () => {
  const { user, signOut } = useAuth();

  const handleLogin = async () => {
    const result = await playwrightLogin(); // Open Playwright login window

    if (result.success) {
      alert('Login successful!');
      // Optionally, save session cookies here
    } else {
      alert(`Login failed: ${result.error}`);
    }
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-white text-lg font-bold">Poshmark Automation</h1>
        <div>
          {user ? (
            <button onClick={signOut} className="text-white">Logout</button>
          ) : (
            <button onClick={handleLogin} className="text-white">Login</button>
          )}
        </div>
      </div>
    </nav>
  );
};
