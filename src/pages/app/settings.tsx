
import { Title, Text, Tabs, Group, Box } from '@mantine/core';

export function SettingsPage() {
  return (
    <Box>
      <Group wrap="nowrap" style={{ flexDirection: 'column', rowGap: 4, marginBottom: 24 }}>
        <Title order={2}>Settings</Title>
        <Text c="dimmed">Manage your account settings and preferences</Text>
      </Group>
      <Tabs defaultValue="account" variant="outline" radius="md">
        <Tabs.List style={{ marginBottom: 16 }}>
          <Tabs.Tab value="account">Account</Tabs.Tab>
          <Tabs.Tab value="automation">Automation</Tabs.Tab>
          <Tabs.Tab value="notifications">Notifications</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="account">
          <Title order={4} style={{ marginBottom: 8 }}>Account Settings</Title>
          {/* Add account settings form here */}
        </Tabs.Panel>
        <Tabs.Panel value="automation">
          <Title order={4} style={{ marginBottom: 8 }}>Automation Preferences</Title>
          {/* Add automation settings form here */}
        </Tabs.Panel>
        <Tabs.Panel value="notifications">
          <Title order={4} style={{ marginBottom: 8 }}>Notifications</Title>
          {/* Add notification settings here */}
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
}
