import { useState } from 'react';
import { Share2, Users, BarChart3, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Overview } from './components/overview';
import { RecentActivity } from './components/recent-activity';
import { QuickActions } from './components/quick-actions';

export function Dashboard() {
  const [isLoading] = useState(false);

  const stats = [
    {
      title: 'Total Shares',
      value: '2,345',
      icon: Share2,
      change: '+12.5%',
      trend: 'up',
    },
    {
      title: 'New Followers',
      value: '456',
      icon: Users,
      change: '+8.2%',
      trend: 'up',
    },
    {
      title: 'Success Rate',
      value: '98.5%',
      icon: BarChart3,
      change: '+2.1%',
      trend: 'up',
    },
    {
      title: 'Avg. Response',
      value: '1.2s',
      icon: Clock,
      change: '-0.3s',
      trend: 'down',
    },
  ];

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button disabled={isLoading}>Refresh Stats</Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${
                stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
              }`}>
                {stat.change} from last week
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Tabs defaultValue="overview" className="col-span-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <Overview />
          </TabsContent>
          <TabsContent value="activity" className="space-y-4">
            <RecentActivity />
          </TabsContent>
        </Tabs>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <QuickActions />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}