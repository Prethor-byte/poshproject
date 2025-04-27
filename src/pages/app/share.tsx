import { useState } from 'react';
import { Container, Stack, Card, Title, Text, Alert, Skeleton, Button, Group } from '@mantine/core';

export function SharePage() {
  const [loading] = useState(false); // Set true to show skeletons
  return (
    <Container size="md" py="xl">
      <Stack gap="md">
        <Alert color="grape" mb="md" title="Share Manager Onboarding" variant="filled">
          Schedule and manage your Poshmark sharing activities here. Sharing automation helps boost your sales!
        </Alert>
        <Title order={2} mb="xs">Share Manager</Title>
        <Text color="dimmed" mb="md">Schedule and manage your Poshmark sharing activities</Text>
        <Card withBorder p="xl">
          <Title order={4} mb="xs">Sharing Automation</Title>
          <Text size="sm" color="dimmed" mb="md">Set up your automated sharing tasks here.</Text>
          {loading ? (
            <Skeleton height={40} width="80%" />
          ) : (
            <Group gap="md">
              <Button variant="light" color="grape" disabled>New Share Task (Coming Soon)</Button>
              <Button variant="outline" disabled>View Scheduled Shares</Button>
            </Group>
          )}
        </Card>
      </Stack>
    </Container>
  );
}
