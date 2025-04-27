import { Helmet } from "react-helmet-async";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function AutomatedSharingFeaturePage() {
  return (
    <PublicLayout>
      <Helmet>
        <title>Automated Sharing | PoshAuto</title>
        <meta name="description" content="Automate sharing of your Poshmark listings with PoshAuto. Save time, boost sales, and grow your business with our advanced sharing automation feature." />
      </Helmet>
      <main className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 max-w-3xl">
        <h1 className="text-4xl font-extrabold text-primary mb-6">Automated Sharing</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
          PoshAuto’s Automated Sharing feature lets you schedule and automate sharing of your Poshmark listings for maximum exposure. No more manual clicks—just set your schedule and watch your closet grow!
        </p>
        <ul className="list-disc ml-6 mb-8 text-gray-800 dark:text-gray-200">
          <li>Schedule shares at optimal times</li>
          <li>Automate sharing for multiple listings or closets</li>
          <li>Stay compliant with Poshmark’s guidelines</li>
          <li>Boost visibility and sales</li>
        </ul>
        <div className="mb-8">
          <img src="/feature-illustrations/automated-sharing.png" alt="Automated Sharing Screenshot" className="rounded-xl shadow-lg w-full max-w-lg mx-auto" />
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
