import { useState } from 'react';
import { Container, Stack, Card, Title, Text, Alert, Button, Group, Skeleton } from '@mantine/core';

export default function SupportPage() {
  const [loading, setLoading] = useState(false); // Set true to show skeletons
  return (
    <Container size="sm" py="xl">
      <Stack gap="md">
        <Alert color="grape" mb="md" title="Support Onboarding" variant="filled">
          Need help? Contact our support team or browse help resources below.
        </Alert>
        <Title order={2} mb="xs">Support</Title>
        <Card withBorder p="xl" mb="md">
          <Text color="dimmed" mb="md">Our team is here to help you get the most out of the platform.</Text>
          {loading ? (
            <Skeleton height={32} width="80%" mb="md" />
          ) : (
            <Group gap="md">
              <Button component="a" href="mailto:support@poshproject.com" variant="light" color="grape">Email Support</Button>
              <Button component="a" href="/help" variant="outline">Browse Help Center</Button>
            </Group>
          )}
        </Card>
      </Stack>
    </Container>
  );
}
