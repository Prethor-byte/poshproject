import { Helmet } from "react-helmet-async";
import { PublicLayout } from "@/components/layout/public-layout";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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
  {
    slug: "crosslisting",
    title: "Crosslisting to Other Marketplaces",
    description: "List your inventory on multiple marketplaces with one click. (Coming Soon)",
  },
  {
    slug: "ai-photo-tools",
    title: "AI-Powered Photo Tools",
    description: "Enhance and clean up your product photos automatically. (Coming Soon)",
  },
  {
    slug: "inventory-management",
    title: "Inventory Management & Sale Detection",
    description: "Track inventory, detect sales, and manage listings efficiently. (Coming Soon)",
  },
  {
    slug: "silent-auctions",
    title: "Silent Auctions & Bulk Offers",
    description: "Run silent auctions and send bulk offers to maximize sales. (Coming Soon)",
  },
  {
    slug: "api-team-management",
    title: "API Access & Team Management",
    description: "Integrate with your own tools and manage business teams. (Coming Soon)",
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
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-4xl font-extrabold text-gray-900 dark:text-gray-50 mb-10 text-center"
        >
          Core Features
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {coreFeatures.map((feature, idx) => (
            <motion.div
              key={feature.slug}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: idx * 0.1, ease: 'easeOut' }}
            >
              <Link
                to={`/features/${feature.slug}`}
                className="block p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 hover:-translate-y-2 hover:shadow-xl transition-transform"
              >
                <h2 className="text-2xl font-bold text-primary mb-2">{feature.title}</h2>
                <p className="text-gray-700 dark:text-gray-300 text-base">{feature.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </PublicLayout>
  );
}
