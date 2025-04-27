import { Helmet } from "react-helmet-async";
import { PublicLayout } from "@/components/layout/public-layout";

export default function PrivacyPage() {
  return (
    <PublicLayout>
      <Helmet>
        <title>Privacy Policy | PoshAuto</title>
        <meta name="description" content="Read the Privacy Policy for PoshAuto, the Poshmark automation platform." />
      </Helmet>
      <main className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 max-w-3xl">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-50 mb-10 text-center">Privacy Policy</h1>
        <section className="prose prose-lg dark:prose-invert max-w-none">
          <h2>1. Information We Collect</h2>
          <ul>
            <li>Account information (email, name, etc.)</li>
            <li>Usage data (logs, analytics)</li>
            <li>Payment information (processed securely via third-party providers)</li>
          </ul>
          <h2>2. How We Use Information</h2>
          <ul>
            <li>To provide and improve our service</li>
            <li>To communicate with you</li>
            <li>To comply with legal obligations</li>
          </ul>
          <h2>3. Data Sharing</h2>
          <p>We do not sell your data. We may share information with service providers or as required by law.</p>
          <h2>4. Data Security</h2>
          <p>We use industry-standard security measures to protect your data.</p>
          <h2>5. Your Rights</h2>
          <ul>
            <li>You may request access to or deletion of your personal data.</li>
            <li>Contact us at <a href="mailto:support@poshproject.com">support@poshproject.com</a> for privacy requests.</li>
          </ul>
          <h2>6. Changes to Policy</h2>
          <p>We may update this Privacy Policy. Continued use of the service constitutes acceptance of the new policy.</p>
        </section>
      </main>
    </PublicLayout>
  );
}
