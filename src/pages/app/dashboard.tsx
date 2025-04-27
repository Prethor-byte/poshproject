import { useAuth } from '@/hooks/use-auth';
import { Title, Text, Grid, Card, Group, Badge } from '@mantine/core';

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <>
      <Group justify="space-between" style={{ marginBottom: 16 }}>
        <div>
          <Title order={2} fw={700}>Welcome back{user?.email ? `, ${user.email}` : ''}</Title>
          <Text color="dimmed" size="md">Here's an overview of your Poshmark automation activities</Text>
        </div>
      </Group>
      <Grid gutter="md">
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card shadow="md" radius="md" p="lg" withBorder>
            <Title order={4}>Shares</Title>
            <Text size="xl" fw={700}>1,234</Text>
            <Badge color="grape" variant="light">Today</Badge>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card shadow="md" radius="md" p="lg" withBorder>
            <Title order={4}>Offers Sent</Title>
            <Text size="xl" fw={700}>98</Text>
            <Badge color="grape" variant="light">This week</Badge>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card shadow="md" radius="md" p="lg" withBorder>
            <Title order={4}>Closet Followers</Title>
            <Text size="xl" fw={700}>2,017</Text>
            <Badge color="grape" variant="light">Current</Badge>
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
          <Card shadow="md" radius="md" p="lg" withBorder>
            <Title order={4}>Listings</Title>
            <Text size="xl" fw={700}>142</Text>
            <Badge color="grape" variant="light">Active</Badge>
          </Card>
        </Grid.Col>
      </Grid>
    </>
  );
}
