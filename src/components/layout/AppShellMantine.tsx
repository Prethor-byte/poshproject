import { AppShell, Burger, useMantineColorScheme, Group, Title, Text, Button, ScrollArea, Avatar, Divider } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Settings, Share, Bell, Logout, LayoutDashboard, Discount2, Box, Users, ChartBar, Help } from 'tabler-icons-react';
import { Link, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';

// Sidebar navigation structure and icons
const mainLinks = [
  { label: 'Dashboard', to: '/app/dashboard', icon: LayoutDashboard },
  { label: 'Share Manager', to: '/app/share', icon: Share },
  { label: 'Offers', to: '/app/offers', icon: Discount2 },
  { label: 'Listings', to: '/app/listings', icon: Box },
  { label: 'Accounts', to: '/app/accounts', icon: Users },
];
const analyticsLinks = [
  { label: 'Analytics', to: '/app/analytics', icon: ChartBar },
  { label: 'Notifications', to: '/app/notifications', icon: Bell, badge: 3 }, // Example badge
];
const adminLinks = [
  { label: 'Settings', to: '/app/settings', icon: Settings },
  { label: 'Support / Help', to: '/app/support', icon: Help },
];

export function AppShellMantine({ children }: { children: ReactNode }) {
  const [opened, { toggle }] = useDisclosure(false);
  const location = useLocation();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <AppShell padding="md">
      <AppShell.Navbar>
        <AppShell.Section style={{ padding: 16, paddingBottom: 0 }}>
          {/* Logo and user avatar/profile */}
          <Group justify="space-between" style={{ marginBottom: 24 }}>
            <Group>
              <img src="/logo192.png" alt="PoshAuto Logo" style={{ width: 32, height: 32, borderRadius: 8 }} />
              <Title order={4} style={{ fontWeight: 700, letterSpacing: -1 }}>PoshAuto</Title>
            </Group>
            <Avatar src={null} alt="User" radius="xl" size={32} color="grape">
              U
            </Avatar>
          </Group>
        </AppShell.Section>
        <AppShell.Section grow component={ScrollArea} style={{ padding: 8, paddingTop: 0 }}>
          {/* Main links */}
          {mainLinks.map((link) => (
            <Button
              key={link.label}
              component={Link}
              to={link.to}
              leftSection={<link.icon size={18} />}
              variant={location.pathname.startsWith(link.to) ? 'filled' : 'subtle'}
              fullWidth
              style={{ justifyContent: 'flex-start', marginBottom: 6 }}
              aria-label={link.label}
            >
              {link.label}
            </Button>
          ))}
          <Divider my={8} />
          {/* Analytics/Notifications */}
          {analyticsLinks.map((link) => (
            <Button
              key={link.label}
              component={Link}
              to={link.to}
              leftSection={<link.icon size={18} />}
              variant={location.pathname.startsWith(link.to) ? 'filled' : 'subtle'}
              fullWidth
              style={{ justifyContent: 'flex-start', marginBottom: 6, position: 'relative' }}
              aria-label={link.label}
            >
              {link.label}
              {link.badge && (
                <span style={{
                  position: 'absolute',
                  right: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: '#e03131',
                  color: 'white',
                  borderRadius: '999px',
                  fontSize: 12,
                  padding: '2px 8px',
                  fontWeight: 700,
                }}>{link.badge}</span>
              )}
            </Button>
          ))}
          <Divider my={8} />
          {/* Admin/Support */}
          {adminLinks.map((link) => (
            <Button
              key={link.label}
              component={Link}
              to={link.to}
              leftSection={<link.icon size={18} />}
              variant={location.pathname.startsWith(link.to) ? 'filled' : 'subtle'}
              fullWidth
              style={{ justifyContent: 'flex-start', marginBottom: 6 }}
              aria-label={link.label}
            >
              {link.label}
            </Button>
          ))}
        </AppShell.Section>
        <AppShell.Section style={{ padding: 16 }}>
          <Button
            variant="outline"
            color="red"
            leftSection={<Logout size={18} />}
            fullWidth
            style={{ marginTop: 8 }}
            aria-label="Sign out"
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
