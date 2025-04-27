import { useState } from 'react';
import { Title, Text, Card, Stack, Alert, Table, Badge, Group, TextInput, Skeleton, Button } from '@mantine/core';

const InfoIcon = () => <span role="img" aria-label="info">ℹ️</span>;

const mockLogs = [
  { id: '1', type: 'Share', target: 'Listing #123', status: 'Success', time: '2025-04-27 12:30', message: 'Shared successfully' },
  { id: '2', type: 'Follow', target: 'User @posher', status: 'Error', time: '2025-04-27 11:00', message: 'User not found' },
  { id: '3', type: 'Offer', target: 'Listing #456', status: 'Pending', time: '2025-04-27 10:15', message: 'Waiting for confirmation' },
];

export default function LogsPage() {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false); // Set true to show skeletons

  const filteredLogs = mockLogs.filter(
    (log) =>
      log.type.toLowerCase().includes(search.toLowerCase()) ||
      log.target.toLowerCase().includes(search.toLowerCase()) ||
      log.status.toLowerCase().includes(search.toLowerCase()) ||
      log.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Stack p="md" gap="md">
      <Alert icon={<InfoIcon />} color="grape" mb="sm">
        Here you can review all automation activity and troubleshoot issues. Use search to quickly find logs.
      </Alert>
      <Title order={2} mb="sm">Task Logs</Title>
      <Card shadow="sm" p="lg" withBorder>
        <Group justify="space-between" mb="md" wrap="wrap">
          <TextInput
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            w={{ base: '100%', sm: 300 }}
          />
          <Button variant="light" color="grape" onClick={() => setLoading(true)} disabled={loading}>
            Refresh
          </Button>
        </Group>
        {loading ? (
          <Skeleton h={180} radius="md" />
        ) : filteredLogs.length === 0 ? (
          <Text color="dimmed" ta="center">No logs found.</Text>
        ) : (
          <Table striped highlightOnHover>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Time</Table.Th>
                <Table.Th>Type</Table.Th>
                <Table.Th>Target</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Message</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredLogs.map((log) => (
                <Table.Tr key={log.id}>
                  <Table.Td>{log.time}</Table.Td>
                  <Table.Td>{log.type}</Table.Td>
                  <Table.Td>{log.target}</Table.Td>
                  <Table.Td>
                    <Badge color={
                      log.status === 'Success' ? 'green' :
                      log.status === 'Pending' ? 'yellow' : 'red'
                    } variant="light">{log.status}</Badge>
                  </Table.Td>
                  <Table.Td>{log.message}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Card>
    </Stack>
  );
}
