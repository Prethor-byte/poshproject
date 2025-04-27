import { Box, Title, Text, Card, Group } from '@mantine/core';

export function SharePage() {
  return (
    <Box>
      <Group style={{ display: 'flex', flexDirection: 'column', rowGap: 4, marginBottom: 24 }}>
        <Title order={2}>Share Manager</Title>
        <Text c="dimmed">Schedule and manage your Poshmark sharing activities</Text>
      </Group>
      <Group style={{ gap: 16 }}>
        {/* Add share manager components here */}
        <Card shadow="md" radius="md" p="lg" withBorder>
          <Title order={5}>Sharing Automation</Title>
          <Text size="sm" c="dimmed">Set up your automated sharing tasks here.</Text>
        </Card>
      </Group>
    </Box>
  );
}
