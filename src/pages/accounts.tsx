import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { usePoshmark } from '@/hooks/use-poshmark';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function AccountsPage() {
  const { sessions, loading, error, clearError, importSession, verifySession, removeSession } = usePoshmark();

  const handleConnect = async () => {
    try {
      await importSession();
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleVerify = async (sessionId: string) => {
    try {
      await verifySession(sessionId);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleRemove = async (sessionId: string) => {
    if (!confirm('Are you sure you want to remove this account?')) {
      return;
    }

    try {
      await removeSession(sessionId);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Poshmark Accounts</h1>
        <Button 
          onClick={handleConnect} 
          disabled={loading}
        >
          {loading ? 'Connecting...' : 'Connect Account'}
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <XCircle className="h-4 w-4" />
          <AlertTitle>{error.message}</AlertTitle>
          {error.details && (
            <AlertDescription className="mt-2">
              {error.details}
            </AlertDescription>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearError}
            className="mt-2"
          >
            Dismiss
          </Button>
        </Alert>
      )}

      {/* Sessions List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sessions.map((session) => (
          <Card key={session.id} className="p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{session.username}</h3>
                <p className="text-sm text-gray-500">
                  Connected {formatDistanceToNow(new Date(session.created_at), { addSuffix: true })}
                </p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs ${
                session.is_active 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {session.is_active ? 'Active' : 'Inactive'}
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              Last verified: {formatDistanceToNow(new Date(session.last_verified), { addSuffix: true })}
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleVerify(session.id)}
                disabled={loading}
              >
                Verify
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="text-red-600 hover:text-red-700" 
                onClick={() => handleRemove(session.id)}
                disabled={loading}
              >
                Remove
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {!loading && sessions.length === 0 && (
        <Card className="p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">No Accounts Connected</h3>
          <p className="text-gray-600 mb-4">
            Connect your Poshmark account to start automating your closet.
          </p>
          <Button onClick={handleConnect}>Connect Account</Button>
        </Card>
      )}
    </div>
  );
}
