import { useAuth } from '@/hooks/use-auth';

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back{user?.email ? `, ${user.email}` : ''}</h1>
        <p className="text-muted-foreground">
          Here's an overview of your Poshmark automation activities
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Add dashboard cards here */}
      </div>
    </div>
  );
}
