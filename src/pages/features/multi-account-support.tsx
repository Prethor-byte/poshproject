import { Helmet } from "react-helmet-async";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function MultiAccountSupportFeaturePage() {
  return (
    <PublicLayout>
      <Helmet>
        <title>Multi-Account Support | PoshAuto</title>
        <meta name="description" content="Manage multiple Poshmark closets from a single dashboard with PoshAuto's Multi-Account Support. Simplify your workflow and grow your business." />
      </Helmet>
      <main className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 max-w-3xl">
        <h1 className="text-4xl font-extrabold text-primary mb-6">Multi-Account Support</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
          Effortlessly manage multiple Poshmark closets with PoshAuto’s Multi-Account Support. Seamlessly switch between accounts and monitor all your activity in one place.
        </p>
        <ul className="list-disc ml-6 mb-8 text-gray-800 dark:text-gray-200">
          <li>Connect and manage unlimited closets</li>
          <li>Centralized dashboard for all accounts</li>
          <li>Switch between accounts with one click</li>
          <li>Track analytics and activity for each account</li>
        </ul>
        <div className="mb-8">
          <img src="/feature-illustrations/multi-account-support.png" alt="Multi-Account Support Screenshot" className="rounded-xl shadow-lg w-full max-w-lg mx-auto" />
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
