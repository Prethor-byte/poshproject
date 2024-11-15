import { Share2, Users, RotateCw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const actions = [
  {
    icon: Share2,
    label: 'Share All Items',
    description: 'Share your entire closet',
  },
  {
    icon: Users,
    label: 'Follow Suggested',
    description: 'Follow recommended users',
  },
  {
    icon: RotateCw,
    label: 'Relist Items',
    description: 'Relist stale listings',
  },
  {
    icon: Settings,
    label: 'Update Settings',
    description: 'Configure automation',
  },
];

export function QuickActions() {
  return (
    <div className="space-y-4">
      {actions.map((action) => (
        <Button
          key={action.label}
          variant="outline"
          className="w-full justify-start gap-4"
        >
          <action.icon className="h-4 w-4" />
          <div className="text-left">
            <div className="font-semibold">{action.label}</div>
            <div className="text-xs text-muted-foreground">
              {action.description}
            </div>
          </div>
        </Button>
      ))}
    </div>
  );
}