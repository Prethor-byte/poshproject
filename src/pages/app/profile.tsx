import { useAuth } from '@/hooks/use-auth';
import { Container, Stack, Card, Group, Title, Text, Avatar, Button, Input, Skeleton, Alert } from '@mantine/core';

export function ProfilePage() {
  const { user } = useAuth();
  const loading = false; // Set true to show skeletons

  return (
    <Container size="md" py="xl">
      <Stack gap="md">
        <Alert color="grape" mb="md" title="Profile Onboarding" variant="filled">
          Manage your personal information and connected Poshmark account here. Changes are saved automatically.
        </Alert>
        <Title order={2} mb="xs">Profile</Title>
        <Text color="dimmed" mb="md">
          Manage your personal information and Poshmark account details
        </Text>
        <Stack gap="md">
          {/* User Profile Card */}
          <Card withBorder p="xl">
            <Title order={4} mb="xs">Personal Information</Title>
            <Text color="dimmed" mb="md">Update your personal details and profile picture</Text>
            <Group align="center" mb="md">
              {loading ? (
                <Skeleton height={80} circle mb="md" />
              ) : (
                <Avatar size={80} src={user?.user_metadata?.avatar_url || undefined} radius="xl">
                  {user?.email?.charAt(0).toUpperCase()}
                </Avatar>
              )}
              <Button variant="outline">Change Picture</Button>
            </Group>
            <Stack gap="sm">
              <Input.Wrapper label="Email">
                <Input value={user?.email || ''} disabled />
              </Input.Wrapper>
              <Input.Wrapper label="Display Name">
                <Input value={user?.user_metadata?.full_name || ''} placeholder="Enter your name" />
              </Input.Wrapper>
            </Stack>
          </Card>

          {/* Poshmark Account Card */}
          <Card withBorder p="xl">
            <Title order={4} mb="xs">Poshmark Account</Title>
            <Text color="dimmed" mb="md">Your connected Poshmark account details</Text>
            <Stack gap="sm">
              <Input.Wrapper label="Poshmark Username">
                <Input placeholder="@username" disabled />
              </Input.Wrapper>
              <Input.Wrapper label="Poshmark Email">
                <Input type="email" placeholder="poshmark@example.com" disabled />
              </Input.Wrapper>
              <Button variant="light" color="grape" w={{ base: '100%', sm: 200 }}>Verify Poshmark Account</Button>
            </Stack>
          </Card>

          {/* Activity Stats Card */}
          <Card withBorder p="xl">
            <Title order={4} mb="xs">Activity Statistics</Title>
            <Text color="dimmed" mb="md">Overview of your automation activities</Text>
            <Group grow>
              <Stack align="center" gap={0}>
                <Text color="dimmed" size="sm">Total Items Listed</Text>
                {loading ? <Skeleton height={26} width={40} /> : <Text size="xl" fw={700}>245</Text>}
              </Stack>
              <Stack align="center" gap={0}>
                <Text color="dimmed" size="sm">Items Sold</Text>
                {loading ? <Skeleton height={26} width={40} /> : <Text size="xl" fw={700}>37</Text>}
              </Stack>
              <Stack align="center" gap={0}>
                <Text color="dimmed" size="sm">Active Listings</Text>
                {loading ? <Skeleton height={26} width={40} /> : <Text size="xl" fw={700}>208</Text>}
              </Stack>
              <Stack align="center" gap={0}>
                <Text color="dimmed" size="sm">Automation Hours</Text>
                {loading ? <Skeleton height={26} width={40} /> : <Text size="xl" fw={700}>156</Text>}
              </Stack>
            </Group>
          </Card>
        </Stack>
      </Stack>
    </Container>
  );
}
