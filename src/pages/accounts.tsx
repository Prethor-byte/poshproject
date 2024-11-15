import { useState } from 'react';
import { usePoshmark } from '@/hooks/use-poshmark';
import { formatDistanceToNow } from 'date-fns';

export function AccountsPage() {
  const { sessions, loading, error, importSession, verifySession, removeSession } = usePoshmark();
  const [importing, setImporting] = useState(false);

  const handleImport = async () => {
    setImporting(true);
    try {
      await importSession();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to import session');
    } finally {
      setImporting(false);
    }
  };

  const handleVerify = async (id: string) => {
    try {
      const isValid = await verifySession(id);
      if (isValid) {
        alert('Session verified successfully!');
      } else {
        alert('Session is no longer valid. Please log in again.');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to verify session');
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Poshmark Accounts</h1>
          <p className="text-gray-600 mt-2">Manage your connected Poshmark accounts</p>
        </div>
        <button
          onClick={handleImport}
          disabled={importing}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 disabled:opacity-50"
        >
          {importing ? 'Connecting...' : 'Connect Account'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading accounts...</div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No Poshmark accounts connected yet
        </div>
      ) : (
        <div className="grid gap-6">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-white p-6 rounded-lg shadow flex items-center justify-between"
            >
              <div>
                <h3 className="font-semibold">{session.username || 'Unknown User'}</h3>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">
                    Last verified:{' '}
                    {session.last_verified
                      ? formatDistanceToNow(new Date(session.last_verified), {
                          addSuffix: true,
                        })
                      : 'Never'}
                  </p>
                  <p className="text-sm">
                    Status:{' '}
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        session.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {session.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => handleVerify(session.id)}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Verify
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to remove this account?')) {
                      removeSession(session.id);
                    }
                  }}
                  className="text-sm text-red-600 hover:text-red-500"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
