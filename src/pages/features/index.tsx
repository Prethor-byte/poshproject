import { Helmet } from "react-helmet-async";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { features, FeatureItem } from "../landing/index";

const comparisonTable = [
  {
    label: "Automated Sharing",
    poshauto: true,
    competitorA: true,
    competitorB: false,
  },
  {
    label: "Smart Following",
    poshauto: true,
    competitorA: false,
    competitorB: false,
  },
  {
    label: "Multi-Account Support",
    poshauto: true,
    competitorA: false,
    competitorB: true,
  },
  {
    label: "Sales Analytics",
    poshauto: true,
    competitorA: false,
    competitorB: false,
  },
  {
    label: "AI-Powered Tools",
    poshauto: true,
    competitorA: false,
    competitorB: false,
  },
  {
    label: "Priority Support",
    poshauto: true,
    competitorA: false,
    competitorB: false,
  },
];

const testimonials = [
  {
    name: "Jessica R.",
    role: "Top Poshmark Seller",
    content:
      "PoshAuto saved me hours every week. My sales have doubled since I started using their automation tools!",
  },
  {
    name: "Mike T.",
    role: "Boutique Owner",
    content:
      "The analytics and smart scheduling features are game changers. Highly recommended for serious sellers.",
  },
];

const faqs = [
  {
    q: "Is PoshAuto safe to use with my Poshmark account?",
    a: "Yes! PoshAuto is designed to mimic natural user behavior and strictly follows Poshmark's guidelines. Your account security is our top priority.",
  },
  {
    q: "Can I manage multiple closets?",
    a: "Absolutely. PoshAuto supports multi-account management, perfect for power sellers and boutique owners.",
  },
  {
    q: "What kind of support do you offer?",
    a: "We provide priority email support for all paid plans, and 24/7 support for enterprise customers.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes, we offer a 14-day free trial with no credit card required. Try all features risk-free!",
  },
];

export default function FeaturesPage() {
  return (
    <PublicLayout>
      <Helmet>
        <title>Features | PoshAuto</title>
        <meta name="description" content="Explore all the automation, analytics, and management features of PoshAuto for Poshmark sellers. See the benefits, compare with competitors, and get answers to common questions." />
      </Helmet>
      <main className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 min-h-screen">
        {/* Hero Section */}
        <section className="mb-20">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-gray-50 text-center mb-4">All Features</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-8 max-w-2xl mx-auto">
            Discover the most advanced automation, analytics, and management tools for Poshmark sellers. Designed for growth, efficiency, and peace of mind.
          </p>
          <div className="text-center">
            <Button asChild size="lg" className="px-10 py-4 text-lg">
              <a href="/#pricing">See Pricing</a>
            </Button>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-10 text-center">What Makes PoshAuto Stand Out?</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature: FeatureItem, idx: number) => (
              <div key={idx} className="flex flex-col items-start p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-center rounded-full bg-primary/10 p-4 mb-6">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-50 mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-base mb-2">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison Table */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-10 text-center">How We Compare</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 dark:border-gray-800 rounded-lg">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900">
                  <th className="px-6 py-3 text-left text-base font-bold">Feature</th>
                  <th className="px-6 py-3 text-center text-base font-bold">PoshAuto</th>
                  <th className="px-6 py-3 text-center text-base font-bold">Competitor A</th>
                  <th className="px-6 py-3 text-center text-base font-bold">Competitor B</th>
                </tr>
              </thead>
              <tbody>
                {comparisonTable.map((row, idx) => (
                  <tr key={idx} className="border-t border-gray-100 dark:border-gray-800">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-50">{row.label}</td>
                    <td className="px-6 py-4 text-center">{row.poshauto ? '✔️' : '—'}</td>
                    <td className="px-6 py-4 text-center">{row.competitorA ? '✔️' : '—'}</td>
                    <td className="px-6 py-4 text-center">{row.competitorB ? '✔️' : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-10 text-center">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {testimonials.map((t, idx) => (
              <blockquote key={idx} className="bg-white dark:bg-gray-900 rounded-2xl shadow p-8 border border-gray-100 dark:border-gray-800">
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">“{t.content}”</p>
                <footer className="text-base font-semibold text-primary">{t.name}<span className="text-gray-500 font-normal ml-2">{t.role}</span></footer>
              </blockquote>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-10 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-8">
            {faqs.map((faq, idx) => (
              <div key={idx}>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-2">{faq.q}</h3>
                <p className="text-gray-600 dark:text-gray-300">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center mt-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-6">Ready to Grow Your Poshmark Business?</h2>
          <Button asChild size="lg" className="px-10 py-4 text-lg">
            <a href="/#pricing">Start Your Free Trial</a>
          </Button>
        </section>
      </main>
    </PublicLayout>
  );
}
