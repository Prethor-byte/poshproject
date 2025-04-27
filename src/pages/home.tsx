import { useAuth } from '@/hooks/use-auth';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function HomePage() {
  const { user } = useAuth();

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <h1 className="text-2xl font-semibold text-foreground">Welcome back, {user?.email}</h1>
        <p className="text-muted-foreground mt-1">Here's your Poshmark automation dashboard</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Activity Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.7, delay: 0.05, ease: 'easeOut' }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Activity Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Items Listed</span>
                <span className="font-medium text-foreground">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Shares Today</span>
                <span className="font-medium text-foreground">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Active Listings</span>
                <span className="font-medium text-foreground">0</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="default">
                Share All Listings
              </Button>
              <Button className="w-full" variant="default">
                Update Prices
              </Button>
              <Button className="w-full" variant="default">
                Add New Listing
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.7, delay: 0.25, ease: 'easeOut' }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground text-center py-8">
                No recent activity
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Analytics Section */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.7 }}
        transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
      >
        <h2 className="text-xl font-semibold text-foreground mb-4">Analytics Overview</h2>
        <Card>
          <CardContent className="py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="text-muted-foreground">Total Revenue</h3>
                <p className="text-2xl font-bold text-foreground mt-2">$0.00</p>
              </div>
              <div className="text-center">
                <h3 className="text-muted-foreground">Average Price</h3>
                <p className="text-2xl font-bold text-foreground mt-2">$0.00</p>
              </div>
              <div className="text-center">
                <h3 className="text-muted-foreground">Total Sales</h3>
                <p className="text-2xl font-bold text-foreground mt-2">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
