
import { useState } from 'react';
import { Container, Stack, Card, Title, Text, Tabs, Group, Alert, Skeleton } from '@mantine/core';

export function SettingsPage() {
  const [loading, setLoading] = useState(false); // Set true to show skeletons
  return (
    <Container size="md" py="xl">
      <Stack gap="md">
        <Alert color="grape" mb="md" title="Settings Onboarding" variant="filled">
          Manage your account, automation, and notification preferences here. Changes are saved automatically.
        </Alert>
        <Title order={2} mb="xs">Settings</Title>
        <Text color="dimmed" mb="md">Manage your account settings and preferences</Text>
        <Tabs defaultValue="account" variant="outline" radius="md">
          <Tabs.List mb="md">
            <Tabs.Tab value="account">Account</Tabs.Tab>
            <Tabs.Tab value="automation">Automation</Tabs.Tab>
            <Tabs.Tab value="notifications">Notifications</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="account">
            <Card withBorder p="xl" mb="md">
              <Title order={4} mb="xs">Account Settings</Title>
              {loading ? <Skeleton height={40} width="60%" /> : <Text color="dimmed">Add account settings form here.</Text>}
            </Card>
          </Tabs.Panel>
          <Tabs.Panel value="automation">
            <Card withBorder p="xl" mb="md">
              <Title order={4} mb="xs">Automation Preferences</Title>
              {loading ? <Skeleton height={40} width="60%" /> : <Text color="dimmed">Add automation settings form here.</Text>}
            </Card>
          </Tabs.Panel>
          <Tabs.Panel value="notifications">
            <Card withBorder p="xl" mb="md">
              <Title order={4} mb="xs">Notifications</Title>
              {loading ? <Skeleton height={40} width="60%" /> : <Text color="dimmed">Add notification settings here.</Text>}
            </Card>
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}
