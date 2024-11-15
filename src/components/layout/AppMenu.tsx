import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { playwrightLogin } from '@/lib/playwrightLogin'; 
import { useState } from 'react';

export const AppMenu = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    try {
      const email = prompt('Enter your Poshmark email:');
      const password = prompt('Enter your Poshmark password:');

      if (!email || !password) {
        setError('Email and password are required');
        return;
      }

      const result = await playwrightLogin(email, password); 

      if (!result.success) {
        setError(result.error || 'Login failed');
        return;
      }

      // Store the cookies in localStorage or your preferred storage
      localStorage.setItem('poshmark_cookies', JSON.stringify(result.cookies));
      
      // Redirect to dashboard
      navigate('/'); 
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
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
            <button 
              onClick={handleLogin} 
              disabled={loading} 
              className="text-white"
            >
              {loading ? 'Connecting...' : 'Login'}
            </button>
          )}
          {error && <div className="text-sm text-red-500">{error}</div>}
        </div>
      </div>
      <div className="mt-4">
        <ul className="space-y-2">
          <li>
            <Link to="/app" className="text-white hover:underline">Dashboard</Link>
          </li>
          <li>
            <Link to="/app/share" className="text-white hover:underline">Share Management</Link>
          </li>
          <li>
            <Link to="/app/profile" className="text-white hover:underline">User Profile</Link>
          </li>
          <li>
            <Link to="/app/settings" className="text-white hover:underline">Settings</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};