import { Helmet } from "react-helmet-async";
import { PublicLayout } from "@/components/layout/public-layout";

export default function TermsPage() {
  return (
    <PublicLayout>
      <Helmet>
        <title>Terms of Service | PoshAuto</title>
        <meta name="description" content="Read the comprehensive Terms of Service for PoshAuto, including user rights, obligations, intellectual property, subscriptions, and more." />
      </Helmet>
      <main className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 max-w-3xl">
        {/* Hero */}
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-50 mb-4 text-center">Terms of Service</h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">Last updated: April 27, 2025</p>
        {/* Table of Contents */}
        <nav className="mb-10">
          <ul className="list-decimal list-inside space-y-2 text-base text-primary font-medium">
            <li><a href="#acceptance">Acceptance of Terms</a></li>
            <li><a href="#eligibility">Eligibility</a></li>
            <li><a href="#account">Account Registration & Security</a></li>
            <li><a href="#subscriptions">Subscriptions & Billing</a></li>
            <li><a href="#intellectual">Intellectual Property</a></li>
            <li><a href="#prohibited">Prohibited Use</a></li>
            <li><a href="#liability">Limitation of Liability</a></li>
            <li><a href="#indemnification">Indemnification</a></li>
            <li><a href="#law">Governing Law</a></li>
            <li><a href="#changes">Changes to Terms</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
        {/* Article */}
        <section className="prose prose-lg dark:prose-invert max-w-none">
          <h2 id="acceptance">1. Acceptance of Terms</h2>
          <p>By accessing or using PoshAuto (the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service.</p>

          <h2 id="eligibility">2. Eligibility</h2>
          <p>You must be at least 18 years old and able to form a binding contract to use PoshAuto. By using the Service, you represent and warrant that you meet these requirements.</p>

          <h2 id="account">3. Account Registration & Security</h2>
          <ul>
            <li>You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate and complete.</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</li>
            <li>You must promptly notify us of any unauthorized use or security breach of your account.</li>
          </ul>

          <h2 id="subscriptions">4. Subscriptions & Billing</h2>
          <ul>
            <li>PoshAuto offers subscription-based access to features. By subscribing, you agree to pay all applicable fees.</li>
            <li>Subscriptions are billed in advance on a recurring basis (monthly or annually), unless canceled.</li>
            <li>You may cancel your subscription at any time. Cancellations take effect at the end of the current billing period.</li>
            <li>Refunds are subject to our <a href="/legal/refund-policy">Refund Policy</a>.</li>
          </ul>

          <h2 id="intellectual">5. Intellectual Property</h2>
          <ul>
            <li>All content, trademarks, logos, and software provided by PoshAuto are the property of PoshProject or its licensors and are protected by intellectual property laws.</li>
            <li>You may not copy, modify, distribute, sell, or lease any part of our Service without our written permission.</li>
          </ul>

          <h2 id="prohibited">6. Prohibited Use</h2>
          <ul>
            <li>You agree not to use the Service for any unlawful, harmful, or fraudulent purpose.</li>
            <li>You may not attempt to gain unauthorized access to any part of the Service or interfere with its operation.</li>
            <li>Use of bots, scrapers, or other automated means not provided by PoshAuto is strictly prohibited.</li>
            <li>You must comply with all applicable laws and Poshmark’s own terms of use.</li>
          </ul>

          <h2 id="liability">7. Limitation of Liability</h2>
          <p>PoshAuto is provided "as is" and "as available." To the fullest extent permitted by law, PoshProject and its affiliates disclaim all warranties and are not liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues.</p>

          <h2 id="indemnification">8. Indemnification</h2>
          <p>You agree to indemnify and hold harmless PoshProject, its affiliates, officers, agents, and employees from any claim or demand arising out of your use of the Service or violation of these Terms.</p>

          <h2 id="law">9. Governing Law</h2>
          <p>These Terms are governed by and construed in accordance with the laws of the jurisdiction in which PoshProject is established, without regard to its conflict of law principles.</p>

          <h2 id="changes">10. Changes to Terms</h2>
          <p>We reserve the right to update or modify these Terms at any time. We will notify users of significant changes. Continued use of the Service after changes constitutes acceptance of the new Terms.</p>

          <h2 id="contact">11. Contact</h2>
          <p>For questions about these Terms, contact us at <a href="mailto:support@poshproject.com">support@poshproject.com</a>.</p>
        </section>
      </main>
    </PublicLayout>
  );
}
