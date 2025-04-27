import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AutomationTaskWizard } from '@/components/automation/AutomationTaskWizard';

import { fetchAutomationTasks, AutomationTask } from '@/lib/automationTasks';

export default function AutomationPage() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [tasks, setTasks] = useState<AutomationTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAutomationTasks();
      setTasks(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  // Load tasks on mount and after wizard completes
  React.useEffect(() => {
    loadTasks();
  }, []);

  const handleWizardComplete = () => {
    setWizardOpen(false);
    loadTasks();
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <h2 className="text-2xl font-bold">Automation Setup</h2>
      <Card>
        <CardContent>
          <div className="flex flex-row items-center justify-between">
            <p className="text-muted-foreground">Set up and manage your automation tasks below.</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button onClick={() => setWizardOpen(true)}>New Automation Task</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogTitle>New Automation Task</DialogTitle>
                <DialogDescription>
                  <AutomationTaskWizard onComplete={handleWizardComplete} />
                </DialogDescription>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-red-600">{error}</p>
          ) : loading ? (
            <p className="text-muted-foreground">Loading tasks...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border-b text-left">Type</th>
                    <th className="px-4 py-2 border-b text-left">Target</th>
                    <th className="px-4 py-2 border-b text-left">Schedule</th>
                    <th className="px-4 py-2 border-b text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center text-muted-foreground py-4">No automation tasks yet.</td>
                    </tr>
                  ) : (
                    tasks.map((task: AutomationTask) => (
                      <tr key={task.id}>
                        <td className="px-4 py-2 border-b">{task.type}</td>
                        <td className="px-4 py-2 border-b">{task.target}</td>
                        <td className="px-4 py-2 border-b">{task.schedule === 'now' ? 'Run Now' : 'Schedule for Later'}</td>
                        <td className="px-4 py-2 border-b">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${task.status === 'Scheduled' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{task.status}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
