import { AppShell, Burger, useMantineColorScheme, Group, Title, Text, Button, ScrollArea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Settings, User, Home, Share, Bell, Logout } from 'tabler-icons-react';
import { Link, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';

const navLinks = [
  { label: 'Dashboard', icon: Home, to: '/app' },
  { label: 'Share', icon: Share, to: '/app/share' },
  { label: 'Accounts', icon: User, to: '/app/accounts' },
  { label: 'Settings', icon: Settings, to: '/app/settings' }
];

export function AppShellMantine({ children }: { children: ReactNode }) {
  const [opened, { toggle }] = useDisclosure(false);
  const location = useLocation();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <AppShell padding="md">
      <AppShell.Navbar>
        <AppShell.Section>
          <ScrollArea style={{ height: '100%' }}>
            {navLinks.map((link) => (
              <Button
                key={link.label}
                component={Link}
                to={link.to}
                leftSection={<link.icon size={18} />}
                variant={location.pathname.startsWith(link.to) ? 'filled' : 'subtle'}
                fullWidth
                style={{ justifyContent: 'flex-start', marginBottom: 8 }}
              >
                {link.label}
              </Button>
            ))}
          </ScrollArea>
        </AppShell.Section>
        <AppShell.Section>
          <Button
            variant="outline"
            color="red"
            leftSection={<Logout size={18} />}
            fullWidth
            style={{ marginTop: 16 }}
            // TODO: Hook up sign out logic
          >
            Sign out
          </Button>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Header>
        <Group justify="space-between" style={{ height: '100%', padding: '0 16px' }}>
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Title order={3} style={{ fontWeight: 700, letterSpacing: -1 }}>PoshAuto</Title>
          </Group>
          <Group>
            <Button variant="subtle" onClick={toggleColorScheme} size="xs">
              {colorScheme === 'dark' ? 'Light' : 'Dark'} mode
            </Button>
            <Button variant="light" leftSection={<Bell size={18} />} size="xs">
              Notifications
            </Button>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <main style={{ minHeight: 'calc(100vh - 102px)' }}>{children}</main>
      </AppShell.Main>

      <AppShell.Footer>
        <Group justify="space-between" style={{ height: '100%', padding: '0 16px' }}>
          <Text size="sm" c="dimmed">© {new Date().getFullYear()} PoshAuto</Text>
          <Group gap={4}>
            <Button variant="subtle" size="xs" component={Link} to="/support">Support</Button>
          </Group>
        </Group>
      </AppShell.Footer>
    </AppShell>
  );
}
