import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { createAutomationTask } from '@/lib/automationTasks';

const taskTypes = [
  { value: 'share', label: 'Share Listings' },
  { value: 'follow', label: 'Follow Users' },
  { value: 'offer', label: 'Send Offers' },
];

export function AutomationTaskWizard({ onComplete }: { onComplete: () => void }) {
  const [active, setActive] = useState(0);
  const [taskType, setTaskType] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<string>('now');
  const [quantity, setQuantity] = useState<number>(10);
  const [target, setTarget] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => setActive((c) => c + 1);
  const handleBack = () => setActive((c) => c - 1);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await createAutomationTask({
        type: taskType ?? '',
        target,
        quantity,
        schedule,
      });
      setSuccess(true);
      setLoading(false);
      onComplete();
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Failed to create task');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Automation Task Wizard</CardTitle>
      </CardHeader>
      <CardContent>
        {active === 0 && (
          <form onSubmit={(e: React.FormEvent) => { e.preventDefault(); handleNext(); }} className="flex flex-col gap-4">
            <Label htmlFor="taskType">Task Type</Label>
            <Select value={taskType ?? ''} onValueChange={setTaskType} required>
              <SelectTrigger id="taskType">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {taskTypes.map(t => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit" disabled={!taskType}>Next</Button>
          </form>
        )}
        {active === 1 && (
          <form onSubmit={(e: React.FormEvent) => { e.preventDefault(); handleNext(); }} className="flex flex-col gap-4">
            <Label htmlFor="target">{taskType === 'share' ? 'Listing(s) URL or ID' : taskType === 'follow' ? 'User(s) to follow' : 'Target'}</Label>
            <Input id="target" value={target} onChange={e => setTarget(e.currentTarget.value)} placeholder={taskType === 'share' ? 'e.g. https://poshmark.com/listing/...' : 'Enter target'} required />
            <Label htmlFor="quantity">Quantity</Label>
            <Input id="quantity" type="number" min={1} max={1000} value={quantity} onChange={e => setQuantity(Number(e.currentTarget.value))} required />
            <Label htmlFor="schedule">Schedule</Label>
            <Select value={schedule} onValueChange={setSchedule} required>
              <SelectTrigger id="schedule">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="now">Run Now</SelectItem>
                <SelectItem value="later">Schedule for Later</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={handleBack}>Back</Button>
              <Button type="submit" disabled={!target}>Next</Button>
            </div>
          </form>
        )}
        {active === 2 && (
          <form onSubmit={(e: React.FormEvent) => { e.preventDefault(); handleSubmit(); }} className="flex flex-col gap-4">
            <div>Type: <b>{taskTypes.find(t => t.value === taskType)?.label}</b></div>
            <div>Target: <b>{target}</b></div>
            <div>Quantity: <b>{quantity}</b></div>
            <div>Schedule: <b>{schedule === 'now' ? 'Run Now' : 'Schedule for Later'}</b></div>
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert variant="default">
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>Task created!</AlertDescription>
              </Alert>
            )}
            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={handleBack}>Back</Button>
              <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Task'}</Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
