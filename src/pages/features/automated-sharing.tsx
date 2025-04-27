import { Helmet } from "react-helmet-async";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function AutomatedSharingFeaturePage() {
  return (
    <PublicLayout>
      <Helmet>
        <title>Automated Sharing | PoshAuto</title>
        <meta name="description" content="Automate sharing of your Poshmark listings with PoshAuto. Save time, boost sales, and grow your business with our advanced sharing automation feature." />
      </Helmet>
      <main className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-4xl font-extrabold text-primary mb-6"
        >
          Automated Sharing
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          className="text-lg text-gray-700 dark:text-gray-300 mb-8"
        >
          PoshAuto’s Automated Sharing feature lets you schedule and automate sharing of your Poshmark listings for maximum exposure. No more manual clicks—just set your schedule and watch your closet grow!
        </motion.p>
        <motion.ul
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          className="list-disc ml-6 mb-8 text-gray-800 dark:text-gray-200"
        >
          <li>Schedule shares at optimal times</li>
          <li>Automate sharing for multiple listings or closets</li>
          <li>Stay compliant with Poshmark’s guidelines</li>
          <li>Boost visibility and sales</li>
        </motion.ul>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
          className="mb-8"
        >
          <img src="/feature-illustrations/automated-sharing.png" alt="Automated Sharing Screenshot" className="rounded-xl shadow-lg w-full max-w-lg mx-auto" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button size="lg" asChild>
            <Link to="/register">Start Free Trial</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/support">Learn More</Link>
          </Button>
        </motion.div>
      </main>
    </PublicLayout>
  );
}
