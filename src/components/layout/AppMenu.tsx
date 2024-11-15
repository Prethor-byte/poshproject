import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { playwrightLogin } from '@/lib/playwrightLogin'; 

export const AppMenu = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate(); 

  const handleLogin = async () => {
    const email = prompt('Enter your Poshmark email:');
    const password = prompt('Enter your Poshmark password:');

    if (email && password) {
      const result = await playwrightLogin(email, password); 

      if (result.success) {
        alert('Login successful!');
        navigate('/'); 
      } else {
        alert(`Login failed: ${result.error}`);
      }
    } else {
      alert('Please enter both email and password.');
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
      <div className="mt-4">
        <ul className="space-y-2">
          <li>
            <Link to="/" className="text-white hover:underline">Dashboard</Link>
          </li>
          <li>
            <Link to="/share" className="text-white hover:underline">Share Management</Link>
          </li>
          <li>
            <Link to="/profile" className="text-white hover:underline">User Profile</Link>
          </li>
          <li>
            <Link to="/settings" className="text-white hover:underline">Settings</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};