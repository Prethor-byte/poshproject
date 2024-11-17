import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and Poshmark account details
        </p>
      </div>

      <div className="grid gap-6">
        {/* User Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details and profile picture</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.photoURL || undefined} />
                <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Button variant="outline">Change Picture</Button>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user?.email || ''} disabled />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Display Name</Label>
                <Input id="name" value={user?.displayName || ''} placeholder="Enter your name" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Poshmark Account Card */}
        <Card>
          <CardHeader>
            <CardTitle>Poshmark Account</CardTitle>
            <CardDescription>Your connected Poshmark account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="poshmark-username">Poshmark Username</Label>
              <Input id="poshmark-username" placeholder="@username" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="poshmark-email">Poshmark Email</Label>
              <Input id="poshmark-email" type="email" placeholder="poshmark@example.com" />
            </div>
            <Button className="w-full sm:w-auto">Verify Poshmark Account</Button>
          </CardContent>
        </Card>

        {/* Activity Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Statistics</CardTitle>
            <CardDescription>Overview of your automation activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Items Listed</p>
                <p className="text-2xl font-bold">245</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Items Sold</p>
                <p className="text-2xl font-bold">37</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Active Listings</p>
                <p className="text-2xl font-bold">208</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Automation Hours</p>
                <p className="text-2xl font-bold">156</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
