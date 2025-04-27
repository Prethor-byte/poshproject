import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Title, Text, Grid, Card, Group, Badge, Button, Alert, Skeleton, Stack, Paper } from '@mantine/core';
// Use emoji or Mantine icons as fallback for demo
const InfoIcon = () => <span role="img" aria-label="info">ℹ️</span>;
const PlusIcon = () => <span role="img" aria-label="plus">➕</span>;
const ListIcon = () => <span role="img" aria-label="list">📋</span>;

const mockStats = [
  { label: 'Shares', value: 1234, badge: 'Today' },
  { label: 'Offers Sent', value: 98, badge: 'This week' },
  { label: 'Closet Followers', value: 2017, badge: 'Current' },
  { label: 'Listings', value: 142, badge: 'Active' },
];

export function DashboardPage() {
  const { user } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(true);
  const loading = false; // Set to true to demo skeletons

  return (
    <Stack gap="md">
      {showOnboarding && (
        <Alert
          icon={<InfoIcon />}
          title="Welcome to your Dashboard!"
          color="grape"
          withCloseButton
          onClose={() => setShowOnboarding(false)}
          mb="sm"
        >
          Get started by creating your first automation task or reviewing your activity logs. Need help? Visit the Support tab.
        </Alert>
      )}
      <Group justify="space-between" align="flex-end" wrap="wrap">
        <div>
          <Title order={2} fw={700}>Welcome back{user?.email ? `, ${user.email}` : ''}</Title>
          <Text color="dimmed" size="md">Here's an overview of your Poshmark automation activities</Text>
        </div>
        <Group>
          <Button leftSection={<PlusIcon />} color="grape" variant="filled">
            New Automation Task
          </Button>
          <Button leftSection={<ListIcon />} variant="light" color="grape">
            View Logs
          </Button>
        </Group>
      </Group>
      <Grid gutter="md">
        {mockStats.map(stat => (
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }} key={stat.label}>
            <Card shadow="md" radius="md" p="lg" withBorder>
              <Title order={4}>{stat.label}</Title>
              {loading ? (
                <Skeleton height={32} mt="xs" mb="xs" />
              ) : (
                <Text size="xl" fw={700}>{stat.value.toLocaleString()}</Text>
              )}
              <Badge color="grape" variant="light">{stat.badge}</Badge>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
      <Paper shadow="xs" withBorder p="md" mt="md">
        <Title order={4} mb="xs">Weekly Activity</Title>
        {/* Replace with Mantine AreaChart if available, else use a placeholder */}
        {/*
        <AreaChart
          h={220}
          data={mockChart}
          dataKey="date"
          series={[{ name: 'shares', color: 'grape' }, { name: 'offers', color: 'indigo' }]}
          curveType="monotone"
          gridAxis="xy"
        />
        */}
        <Skeleton h={220} radius="md" visible={true} />
        <Text color="dimmed" size="sm" ta="center" mt="xs">
          (Activity chart coming soon)
        </Text>
      </Paper>
    </Stack>
  );
}
