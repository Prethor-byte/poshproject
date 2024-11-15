import { Avatar } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const activities = [
  {
    type: 'share',
    item: 'Vintage Leather Jacket',
    time: '2 minutes ago',
    status: 'success',
  },
  {
    type: 'follow',
    user: 'Sarah Miller',
    time: '5 minutes ago',
    status: 'success',
  },
  {
    type: 'share',
    item: 'Designer Handbag',
    time: '10 minutes ago',
    status: 'success',
  },
  {
    type: 'follow',
    user: 'John Davis',
    time: '15 minutes ago',
    status: 'failed',
  },
  {
    type: 'share',
    item: 'Luxury Watch',
    time: '20 minutes ago',
    status: 'success',
  },
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, i) => (
            <div
              key={i}
              className="flex items-center gap-4 text-sm border-b last:border-0 pb-4 last:pb-0"
            >
              <Avatar className="h-8 w-8" />
              <div className="flex-1">
                <p>
                  {activity.type === 'share' ? (
                    <>Shared <strong>{activity.item}</strong></>
                  ) : (
                    <>Followed <strong>{activity.user}</strong></>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
              <span
                className={`text-xs ${
                  activity.status === 'success'
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                {activity.status}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}