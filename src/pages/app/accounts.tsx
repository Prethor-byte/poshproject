import { useState } from 'react';
import { usePoshmark } from '@/hooks/use-poshmark';
import { Box, Group, Title, Card, Button, Modal, Select, Badge, Skeleton, Stack, Alert, Text } from '@mantine/core';
import { formatDistanceToNow } from 'date-fns';

const InfoIcon = () => <span role="img" aria-label="info">ℹ️</span>;

const regionOptions = [
  { value: 'US', label: 'United States (poshmark.com)' },
  { value: 'CA', label: 'Canada (poshmark.ca)' },
];

type PoshmarkRegion = 'US' | 'CA';

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
    <Box p={24}>
      <Alert icon={<InfoIcon />} color="grape" mb="md" title="Onboarding" variant="filled">
        Connect your Poshmark account to start automating your closet.
      </Alert>

      {error && (
        <Alert color="red" mb="md" title={error.message} variant="filled">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearError}
          >
            Dismiss
          </Button>
        </Alert>
      )}

      <Group justify="space-between" mb="md">
        <Title order={1}>Poshmark Accounts</Title>
        <Modal 
          opened={isDialogOpen} 
          onClose={() => setIsDialogOpen(false)} 
          title="Connect Poshmark Account"
        >
          <Select
            value={selectedRegion}
            onChange={(value) => setSelectedRegion(value as PoshmarkRegion)}
            data={regionOptions}
            label="Select region"
            placeholder="Select region"
            mb="md"
          />
          <Group justify="flex-end" mt="md">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConnect} 
              loading={loading}
            >
              {loading ? 'Connecting...' : 'Connect'}
            </Button>
          </Group>
        </Modal>
        <Button onClick={() => setIsDialogOpen(true)}>Connect Account</Button>
      </Group>

      {loading ? (
        <Stack gap="md">
          {[1, 2, 3].map((_, index) => (
            <Card key={index} p="xl">
              <Skeleton height={40} mb="md" />
              <Skeleton height={20} mb="md" />
              <Skeleton height={20} mb="md" />
              <Group align="apart">
                <Button variant="outline" size="sm" loading>
                  Verify
                </Button>
                <Button variant="filled" color="red" size="sm" loading>
                  Remove
                </Button>
              </Group>
            </Card>
          ))}
        </Stack>
      ) : (
        <Stack gap="md">
          {sessions.map((session) => (
            <Card key={session.id} p="xl">
              <Group align="apart">
                <Text fw={500}>{session.username}</Text>
                <Badge 
                  color={session.is_active ? 'green' : 'red'} 
                  variant="filled"
                >
                  {session.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </Group>
              <Text mb="md">
                Connected {formatDistanceToNow(new Date(session.created_at), { addSuffix: true })}
              </Text>
              <Text mb="md">
                Region: {session.region === 'US' ? 'United States' : 'Canada'}
              </Text>
              <Text mb="md">
                Last verified: {formatDistanceToNow(new Date(session.last_verified), { addSuffix: true })}
              </Text>
              <Group align="apart">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleVerify(session.id)}
                  loading={loading}
                >
                  Verify
                </Button>
                <Button 
                  variant="filled" 
                  color="red" 
                  size="sm" 
                  onClick={() => handleRemove(session.id)}
                  loading={loading}
                >
                  Remove
                </Button>
              </Group>
            </Card>
          ))}
        </Stack>
      )}

      {!loading && sessions.length === 0 && (
        <Card p="xl" ta="center">
          <Text fw={500} mb="md">
            No Accounts Connected
          </Text>
          <Text mb="md">
            Connect your Poshmark account to start automating your closet.
          </Text>
          <Button onClick={() => setIsDialogOpen(true)}>Connect Account</Button>
        </Card>
      )}
    </Box>
  );
}
