import { Helmet } from "react-helmet-async";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function AnalyticsFeaturePage() {
  return (
    <PublicLayout>
      <Helmet>
        <title>Advanced Analytics | PoshAuto</title>
        <meta name="description" content="Track your Poshmark performance with Advanced Analytics from PoshAuto. Get actionable insights on shares, follows, sales, and engagement." />
      </Helmet>
      <main className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 max-w-3xl">
        <h1 className="text-4xl font-extrabold text-primary mb-6">Advanced Analytics</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
          Unlock actionable insights with PoshAuto’s Advanced Analytics. Track shares, follows, sales, and engagement to make data-driven decisions and grow your business.
        </p>
        <ul className="list-disc ml-6 mb-8 text-gray-800 dark:text-gray-200">
          <li>Visualize your growth over time</li>
          <li>Detailed reports on all activity</li>
          <li>Identify top-performing listings and strategies</li>
          <li>Export data for further analysis</li>
        </ul>
        <div className="mb-8">
          <img src="/feature-illustrations/analytics.png" alt="Analytics Screenshot" className="rounded-xl shadow-lg w-full max-w-lg mx-auto" />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" asChild>
            <Link to="/register">Start Free Trial</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/support">Learn More</Link>
          </Button>
        </div>
      </main>
    </PublicLayout>
  );
}
