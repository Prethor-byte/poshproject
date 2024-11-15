import { useAuth } from '@/hooks/use-auth';
import { playwrightLogin } from '@/lib/playwrightLogin';

export const AppMenu = () => {
  const { user, signOut } = useAuth();

  const handleLogin = async () => {
    const email = prompt('Enter your Poshmark email:');
    const password = prompt('Enter your Poshmark password:');

    if (email && password) {
      const result = await playwrightLogin(email, password); // Pass email and password here

      if (result.success) {
        alert('Login successful!');
        // Optionally, save session cookies here
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
    </nav>
  );
};