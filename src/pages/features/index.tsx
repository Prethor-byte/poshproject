import { Helmet } from "react-helmet-async";
import { PublicLayout } from "@/components/layout/public-layout";
import { Link } from "react-router-dom";

const coreFeatures = [
  {
    slug: "automated-sharing",
    title: "Automated Sharing",
    description: "Schedule and automate sharing of your Poshmark listings for maximum exposure.",
  },
  {
    slug: "multi-account-support",
    title: "Multi-Account Support",
    description: "Manage multiple Poshmark closets from a single dashboard.",
  },
  {
    slug: "smart-scheduling",
    title: "Smart Scheduling",
    description: "Queue and time your actions for optimal results.",
  },
  {
    slug: "analytics",
    title: "Advanced Analytics",
    description: "Track shares, follows, sales, and engagement with actionable insights.",
  },
];

export default function FeaturesIndexPage() {
  return (
    <PublicLayout>
      <Helmet>
        <title>Core Features | PoshAuto</title>
        <meta name="description" content="Explore the core features of PoshAuto, including automated sharing, multi-account management, smart scheduling, and analytics." />
      </Helmet>
      <main className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-50 mb-10 text-center">Core Features</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {coreFeatures.map(feature => (
            <Link
              key={feature.slug}
              to={`/features/${feature.slug}`}
              className="block p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 hover:-translate-y-2 hover:shadow-xl transition-transform"
            >
              <h2 className="text-2xl font-bold text-primary mb-2">{feature.title}</h2>
              <p className="text-gray-700 dark:text-gray-300 text-base">{feature.description}</p>
            </Link>
          ))}
        </div>
      </main>
    </PublicLayout>
  );
}
