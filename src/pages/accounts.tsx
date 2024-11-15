import { useState } from 'react';
import { usePoshmark } from '@/hooks/use-poshmark';
import { formatDistanceToNow } from 'date-fns';

export function AccountsPage() {
  const { accounts, loading, error, addAccount, removeAccount, verifyAccount } = usePoshmark();
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      if (!email || !password) {
        throw new Error('Please fill in all fields');
      }

      const account = await addAccount(email, password);
      if (account) {
        setShowAddAccount(false);
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to add account');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async (id: string) => {
    const result = await verifyAccount(id);
    if (!result.success) {
      alert(result.error || 'Failed to verify account');
    } else {
      alert('Account verified successfully!');
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
          onClick={() => setShowAddAccount(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500"
        >
          Add Account
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">{error}</div>
      )}

      {showAddAccount && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Add New Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                disabled={submitting}
              />
            </div>
            {formError && (
              <div className="text-sm text-red-600">{formError}</div>
            )}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowAddAccount(false)}
                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 disabled:opacity-50"
                disabled={submitting}
              >
                {submitting ? 'Adding...' : 'Add Account'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading accounts...</div>
      ) : accounts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No Poshmark accounts connected yet
        </div>
      ) : (
        <div className="grid gap-6">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="bg-white p-6 rounded-lg shadow flex items-center justify-between"
            >
              <div>
                <h3 className="font-semibold">{account.email}</h3>
                <p className="text-sm text-gray-500">
                  Last login:{' '}
                  {account.last_login
                    ? formatDistanceToNow(new Date(account.last_login), {
                        addSuffix: true,
                      })
                    : 'Never'}
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => handleVerify(account.id)}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Verify Login
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to remove this account?')) {
                      removeAccount(account.id);
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
