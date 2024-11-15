import { useAuth } from '@/hooks/use-auth';

export function HomePage() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Welcome back, {user?.email}</h1>
        <p className="text-gray-600 mt-2">Here's your Poshmark automation dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Activity Summary Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Activity Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Items Listed</span>
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Shares Today</span>
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Listings</span>
              <span className="font-medium">0</span>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <button className="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">
              Share All Listings
            </button>
            <button className="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">
              Update Prices
            </button>
            <button className="w-full py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors">
              Add New Listing
            </button>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="text-gray-500 text-center py-8">
              No recent activity
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Analytics Overview</h2>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="text-gray-600">Total Revenue</h3>
              <p className="text-2xl font-bold mt-2">$0.00</p>
            </div>
            <div className="text-center">
              <h3 className="text-gray-600">Average Price</h3>
              <p className="text-2xl font-bold mt-2">$0.00</p>
            </div>
            <div className="text-center">
              <h3 className="text-gray-600">Total Sales</h3>
              <p className="text-2xl font-bold mt-2">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
