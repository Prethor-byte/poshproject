import { Helmet } from "react-helmet-async";
import { PublicLayout } from "@/components/layout/public-layout";

export default function TermsPage() {
  return (
    <PublicLayout>
      <Helmet>
        <title>Terms of Service | PoshAuto</title>
        <meta name="description" content="Read the Terms of Service for PoshAuto, the Poshmark automation platform." />
      </Helmet>
      <main className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 max-w-3xl">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-50 mb-10 text-center">Terms of Service</h1>
        <section className="prose prose-lg dark:prose-invert max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>By using PoshAuto, you agree to these Terms of Service and all applicable laws and regulations. If you do not agree, do not use the service.</p>
          <h2>2. Service Description</h2>
          <p>PoshAuto provides automation tools for Poshmark sellers. Features and functionality may change over time.</p>
          <h2>3. User Responsibilities</h2>
          <ul>
            <li>You are responsible for your account and activity.</li>
            <li>Do not use PoshAuto for illegal or prohibited activities.</li>
            <li>Follow Poshmark’s terms and policies.</li>
          </ul>
          <h2>4. Subscription & Billing</h2>
          <p>Subscription plans are billed monthly. You may cancel at any time; refunds are subject to our refund policy.</p>
          <h2>5. Limitation of Liability</h2>
          <p>PoshAuto is provided “as is.” We are not liable for indirect or consequential damages. Use at your own risk.</p>
          <h2>6. Changes to Terms</h2>
          <p>We may update these Terms at any time. Continued use of the service constitutes acceptance of the new terms.</p>
          <h2>7. Contact</h2>
          <p>For questions, contact <a href="mailto:support@poshproject.com">support@poshproject.com</a>.</p>
        </section>
      </main>
    </PublicLayout>
  );
}
