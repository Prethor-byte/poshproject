import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Share2, Clock, BarChart2, History } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

const shareFormSchema = z.object({
  shareType: z.enum(['closet', 'party']),
  partyTime: z.string().optional(),
  itemsToShare: z.enum(['all', 'available', 'custom']),
  customItems: z.array(z.string()).optional(),
  schedule: z.boolean(),
  scheduleTime: z.string().optional(),
  scheduleRepeat: z.boolean(),
  scheduleInterval: z.number().min(1).max(24).optional(),
});

type ShareFormValues = z.infer<typeof shareFormSchema>;

const defaultValues: Partial<ShareFormValues> = {
  shareType: 'closet',
  itemsToShare: 'all',
  schedule: false,
  scheduleRepeat: false,
};

export function ShareManager() {
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ShareFormValues>({
    resolver: zodResolver(shareFormSchema),
    defaultValues,
  });

  const shareType = form.watch('shareType');
  const schedule = form.watch('schedule');
  const scheduleRepeat = form.watch('scheduleRepeat');

  async function onSubmit(data: ShareFormValues) {
    try {
      setIsSharing(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Share task created',
        description: `Successfully created ${data.shareType} share task`,
      });

      // Reset form
      form.reset(defaultValues);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create share task. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSharing(false);
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Share Manager</h1>
          <p className="text-muted-foreground mt-1">
            Automate your Poshmark sharing tasks
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => form.reset(defaultValues)}
          disabled={isSharing}
        >
          Reset
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Share Settings</CardTitle>
            <CardDescription>
              Configure your automated sharing preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="shareType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Share Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select share type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="closet">Closet Share</SelectItem>
                          <SelectItem value="party">Party Share</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {shareType === 'party' && (
                  <FormField
                    control={form.control}
                    name="partyTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Party Time</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select party time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="noon">Noon Party</SelectItem>
                            <SelectItem value="evening">Evening Party</SelectItem>
                            <SelectItem value="night">Night Party</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="itemsToShare"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Items to Share</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select items to share" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">All Items</SelectItem>
                          <SelectItem value="available">
                            Available Items Only
                          </SelectItem>
                          <SelectItem value="custom">Custom Selection</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="schedule"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Schedule Sharing
                        </FormLabel>
                        <FormDescription>
                          Schedule your shares for a specific time
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {schedule && (
                  <>
                    <FormField
                      control={form.control}
                      name="scheduleTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Schedule Time</FormLabel>
                          <FormControl>
                            <Input
                              type="time"
                              {...field}
                              className="w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="scheduleRepeat"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Repeat Schedule
                            </FormLabel>
                            <FormDescription>
                              Repeat this share task at regular intervals
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {scheduleRepeat && (
                      <FormField
                        control={form.control}
                        name="scheduleInterval"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Repeat Interval (hours)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={1}
                                max={24}
                                {...field}
                                onChange={e => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormDescription>
                              Enter a number between 1 and 24 hours
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </>
                )}

                <Button type="submit" className="w-full" disabled={isSharing}>
                  {isSharing ? 'Creating Share Task...' : 'Create Share Task'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="md:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Share Statistics</CardTitle>
              <CardDescription>
                Your sharing activity overview
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Share2 className="h-4 w-4 text-muted-foreground" />
                    <span>Total Shares</span>
                  </div>
                  <span className="font-semibold">1,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Active Tasks</span>
                  </div>
                  <span className="font-semibold">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BarChart2 className="h-4 w-4 text-muted-foreground" />
                    <span>Success Rate</span>
                  </div>
                  <span className="font-semibold">98.5%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest sharing activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <History className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm font-medium">Closet Share Completed</p>
                    <p className="text-xs text-muted-foreground">
                      Successfully shared 45 items
                    </p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <History className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-sm font-medium">Party Share Scheduled</p>
                    <p className="text-xs text-muted-foreground">
                      Evening Party - 25 items
                    </p>
                    <p className="text-xs text-muted-foreground">5 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}