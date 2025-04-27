import { Helmet } from "react-helmet-async";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function SmartSchedulingFeaturePage() {
  return (
    <PublicLayout>
      <Helmet>
        <title>Smart Scheduling | PoshAuto</title>
        <meta name="description" content="Optimize your automation with Smart Scheduling from PoshAuto. Queue and time your actions for maximum results and efficiency." />
      </Helmet>
      <main className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 max-w-3xl">
        <h1 className="text-4xl font-extrabold text-primary mb-6">Smart Scheduling</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
          Maximize your efficiency and results with PoshAuto’s Smart Scheduling. Queue and time your automation actions for the best performance and compliance.
        </p>
        <ul className="list-disc ml-6 mb-8 text-gray-800 dark:text-gray-200">
          <li>Set custom schedules for every action</li>
          <li>Automated queue management</li>
          <li>Optimize for peak engagement times</li>
          <li>Stay within Poshmark’s limits and guidelines</li>
        </ul>
        <div className="mb-8">
          <img src="/feature-illustrations/smart-scheduling.png" alt="Smart Scheduling Screenshot" className="rounded-xl shadow-lg w-full max-w-lg mx-auto" />
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
