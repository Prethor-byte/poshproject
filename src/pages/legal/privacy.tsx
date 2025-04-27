import { Helmet } from "react-helmet-async";
import { PublicLayout } from "@/components/layout/public-layout";

export default function PrivacyPage() {
  return (
    <PublicLayout>
      <Helmet>
        <title>Privacy Policy | PoshAuto</title>
        <meta name="description" content="Read the comprehensive Privacy Policy for PoshAuto, including data collection, use, rights, cookies, security, and compliance information." />
      </Helmet>
      <main className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 max-w-3xl">
        {/* Hero */}
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-50 mb-4 text-center">Privacy Policy</h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-8">Last updated: April 27, 2025</p>
        {/* Table of Contents */}
        <nav className="mb-10">
          <ul className="list-decimal list-inside space-y-2 text-base text-primary font-medium">
            <li><a href="#data-collected">Information We Collect</a></li>
            <li><a href="#use">How We Use Information</a></li>
            <li><a href="#cookies">Cookies & Tracking</a></li>
            <li><a href="#third-party">Third-Party Services</a></li>
            <li><a href="#security">Data Security</a></li>
            <li><a href="#rights">Your Rights & Choices</a></li>
            <li><a href="#children">Children's Privacy</a></li>
            <li><a href="#changes">Changes to Policy</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
        {/* Article */}
        <section className="prose prose-lg dark:prose-invert max-w-none">
          <h2 id="data-collected">1. Information We Collect</h2>
          <ul>
            <li><strong>Account Information:</strong> Name, email address, password, and other information provided when you register for PoshAuto.</li>
            <li><strong>Usage Data:</strong> Log files, analytics, device information, and interactions with the Service.</li>
            <li><strong>Payment Information:</strong> Processed securely by third-party payment processors; we do not store full payment card details.</li>
            <li><strong>Communications:</strong> Your correspondence with us, including support requests and feedback.</li>
          </ul>

          <h2 id="use">2. How We Use Information</h2>
          <ul>
            <li>To provide, maintain, and improve our Service and features.</li>
            <li>To personalize your experience and recommend relevant features.</li>
            <li>To process transactions and manage subscriptions.</li>
            <li>To communicate with you about updates, promotions, and support.</li>
            <li>To comply with legal obligations and enforce our Terms of Service.</li>
          </ul>

          <h2 id="cookies">3. Cookies & Tracking</h2>
          <p>We use cookies and similar tracking technologies to enhance your experience, analyze usage, and deliver personalized content. You can control cookies through your browser settings, but disabling cookies may limit functionality.</p>

          <h2 id="third-party">4. Third-Party Services</h2>
          <ul>
            <li>We may use third-party service providers for analytics, hosting, payment processing, and customer support.</li>
            <li>These providers may access or process your information as necessary to perform their functions, subject to contractual obligations.</li>
            <li>We do not sell your personal information to third parties.</li>
          </ul>

          <h2 id="security">5. Data Security</h2>
          <p>We implement industry-standard security measures to protect your data from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.</p>

          <h2 id="rights">6. Your Rights & Choices</h2>
          <ul>
            <li>You may access, update, or delete your personal information by contacting us at <a href="mailto:support@poshproject.com">support@poshproject.com</a>.</li>
            <li>If you are in the EU/EEA, you have rights under the GDPR, including the right to access, rectify, erase, restrict, or object to processing of your data.</li>
            <li>If you are a California resident, you have rights under the CCPA, including the right to know, delete, and opt out of the sale of your personal information.</li>
            <li>We will respond to all requests in accordance with applicable law.</li>
          </ul>

          <h2 id="children">7. Children's Privacy</h2>
          <p>PoshAuto is not intended for children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal data, please contact us for removal.</p>

          <h2 id="changes">8. Changes to Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new policy and updating the "Last updated" date. Continued use of the Service constitutes acceptance of the revised policy.</p>

          <h2 id="contact">9. Contact</h2>
          <p>For privacy questions or requests, contact us at <a href="mailto:support@poshproject.com">support@poshproject.com</a>.</p>
        </section>
      </main>
    </PublicLayout>
  );
}
