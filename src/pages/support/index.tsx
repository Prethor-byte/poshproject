import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { PublicLayout } from "@/components/layout/public-layout";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function SupportPage() {
  return (
    <PublicLayout>
      <Helmet>
        <title>Support - PoshAuto</title>
        <meta name="description" content="Get help with PoshAuto. Find tutorials, documentation, and answers to frequently asked questions." />
      </Helmet>

      <main className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-gray-50 mb-10 text-center">Support Center</h1>

          {/* Testimonial/Contact Block */}
          <section className="mb-16">
            <div className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-2xl shadow-md p-8 md:p-12 mb-10">
              <div className="flex-1 mb-6 md:mb-0">
                <blockquote className="text-xl font-semibold italic text-gray-700 dark:text-gray-200 mb-3">“The PoshAuto support team is always there for me—fast, friendly, and super helpful!”</blockquote>
                <div className="flex items-center gap-3">
                  <img src="/avatars/support-customer.jpg" alt="Customer" className="h-10 w-10 rounded-full border border-gray-200 dark:border-gray-800" />
                  <span className="font-medium text-gray-900 dark:text-gray-50">Jessica M.</span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">Top Seller</span>
                </div>
              </div>
              <div className="flex flex-col items-center md:items-end">
                <a href="mailto:support@poshproject.com" className="mb-3">
                  <Button size="lg" className="bg-primary text-white font-bold px-8 py-3 shadow-md hover:bg-primary/90 transition-colors">Email Support</Button>
                </a>
                <a href="/help" className="">
                  <Button size="lg" variant="outline" className="px-8 py-3 border-2 border-primary text-primary hover:bg-primary/10 transition-colors">Help Center</Button>
                </a>
              </div>
            </div>
          </section>

          {/* Search Section */}
          <div className="mb-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search for help..."
                className="pl-10 w-full"
              />
            </div>
          </div>

          {/* Quick Links */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50 mb-6">Quick Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="justify-start h-auto py-6 rounded-xl shadow-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-primary hover:bg-primary/10 transition-colors">
                <div className="text-left">
                  <div className="font-bold text-lg text-primary mb-1">Getting Started</div>
                  <div className="text-base text-gray-500 dark:text-gray-400">New to PoshAuto? Start here</div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-6 rounded-xl shadow-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-primary hover:bg-primary/10 transition-colors">
                <div className="text-left">
                  <div className="font-bold text-lg text-primary mb-1">Account Settings</div>
                  <div className="text-base text-gray-500 dark:text-gray-400">Manage your account</div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-6 rounded-xl shadow-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-primary hover:bg-primary/10 transition-colors">
                <div className="text-left">
                  <div className="font-bold text-lg text-primary mb-1">Billing</div>
                  <div className="text-base text-gray-500 dark:text-gray-400">Subscription and payments</div>
                </div>
              </Button>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50 mb-6">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Is PoshAuto safe to use with my Poshmark account?</AccordionTrigger>
                <AccordionContent>
                  Yes, PoshAuto is designed with safety as our top priority. We use advanced automation techniques that mimic human behavior and strictly follow Poshmark's guidelines. Our system includes rate limiting and random delays to ensure your account stays safe.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How many Poshmark accounts can I manage?</AccordionTrigger>
                <AccordionContent>
                  The number of accounts you can manage depends on your subscription plan. The Starter plan includes 1 account, Professional plan includes 3 accounts, and Enterprise plan offers unlimited account management.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>What features are included in the automation?</AccordionTrigger>
                <AccordionContent>
                  PoshAuto includes automated sharing of your listings, smart following of potential buyers, automated price drops, bulk listing actions, and detailed analytics. You can customize automation schedules and rules based on your needs.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Can I cancel my subscription anytime?</AccordionTrigger>
                <AccordionContent>
                  Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees. Your subscription will remain active until the end of your current billing period.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* Contact Support */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50 mb-6">Need More Help?</h2>
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-medium text-gray-900 dark:text-gray-50 mb-4">Contact Support</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Our support team is available 24/7 to help you with any questions or issues you may have.
              </p>
              <div className="space-x-4">
                <Button>Send Email</Button>
                <Button variant="outline">Live Chat</Button>
              </div>
            </div>
          </section>

          {/* Documentation */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50 mb-6">Documentation</h2>
            <div className="grid gap-6">
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                <h3 className="text-xl font-medium text-gray-900 dark:text-gray-50 mb-4">API Documentation</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Explore our API documentation to learn how to integrate PoshAuto with your existing systems.
                </p>
                <Button variant="outline">View Documentation</Button>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                <h3 className="text-xl font-medium text-gray-900 dark:text-gray-50 mb-4">User Guides</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Step-by-step guides to help you make the most of PoshAuto's features.
                </p>
                <Button variant="outline">View Guides</Button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </PublicLayout>
  );
}
