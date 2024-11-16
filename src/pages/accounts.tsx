import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { usePoshmark } from '@/hooks/use-poshmark';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from 'react';
import type { PoshmarkRegion } from '@/types/poshmark';

export function AccountsPage() {
  const { sessions, loading, error, clearError, importSession, verifySession, removeSession } = usePoshmark();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<PoshmarkRegion>('US');

  const handleConnect = async () => {
    try {
      await importSession(selectedRegion);
      setIsDialogOpen(false);
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Connect Account</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect Poshmark Account</DialogTitle>
              <DialogDescription>
                Choose your Poshmark region and connect your account.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Select
                value={selectedRegion}
                onValueChange={(value) => setSelectedRegion(value as PoshmarkRegion)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">United States (poshmark.com)</SelectItem>
                  <SelectItem value="CA">Canada (poshmark.ca)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConnect} disabled={loading}>
                {loading ? 'Connecting...' : 'Connect'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <XCircle className="h-4 w-4" />
          <AlertTitle>{error.message}</AlertTitle>
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
                <p className="text-sm text-muted-foreground">
                  Connected {formatDistanceToNow(new Date(session.created_at), { addSuffix: true })}
                </p>
                <p className="text-sm text-muted-foreground">
                  Region: {session.region === 'US' ? 'United States' : 'Canada'}
                </p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs ${
                session.is_active 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {session.is_active ? 'Active' : 'Inactive'}
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
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
                variant="destructive"
                size="sm"
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
          <Button onClick={() => setIsDialogOpen(true)}>Connect Account</Button>
        </Card>
      )}
    </div>
  );
}
