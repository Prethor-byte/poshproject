import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { ArrowRight, Bot, Clock, DollarSign, Zap } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import 'react-lazy-load-image-component/src/effects/blur.css';
import { trackEvent } from "@/lib/analytics";
import { DemoVideoModal } from "@/components/demo-video-modal";
import { useToast } from "@/components/ui/use-toast";
import { PublicLayout } from "@/components/layout/public-layout";
import { cn } from "@/lib/utils";

// Structured data for rich snippets
const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "PoshAuto",
  "applicationCategory": "BusinessApplication",
  "description": "Automate your Poshmark business with intelligent tools for sharing, following, and managing multiple accounts.",
  "operatingSystem": "Web-based",
  "offers": {
    "@type": "Offer",
    "price": "29.99",
    "priceCurrency": "USD"
  }
};

export function LandingPage() {
  const [showDemoVideo, setShowDemoVideo] = useState(false);
  const { toast } = useToast();
  const pricingRef = useRef<HTMLElement>(null);

  // Track demo video views
  const handleDemoVideoClick = () => {
    setShowDemoVideo(true);
    trackEvent('demo_video_view');
  };

  return (
    <div id="top" className="min-h-screen bg-white dark:bg-gray-950">
      <Helmet>
        <title>PoshAuto - Automate Your Poshmark Business</title>
        <meta name="description" content="Boost your Poshmark sales and save time with our intelligent automation platform. Manage multiple accounts, automate sharing, and grow your business." />
        <meta name="keywords" content="poshmark automation, poshmark bot, poshmark seller tools, poshmark business, social selling automation" />
        <meta property="og:title" content="PoshAuto - Poshmark Automation Platform" />
        <meta property="og:description" content="Boost your Poshmark sales with intelligent automation tools." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <PublicLayout>
        <main id="main-content" role="main">
          {/* Hero Section */}
          <section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 mt-16" aria-labelledby="hero-heading">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
              <div className="flex flex-col justify-center space-y-8">
                <h1 id="hero-heading" className="text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-6xl">
                  Automate Your <span className="text-primary">Poshmark</span> Business
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Boost your sales and save countless hours with our intelligent automation platform designed specifically for Poshmark resellers.
                </p>
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <Link to="/register">
                    <Button
                      size="lg"
                      className="group w-full sm:w-auto"
                      aria-label="Start your free trial"
                    >
                      Start Free Trial
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleDemoVideoClick}
                    aria-label="Watch product demo video"
                  >
                    Watch Demo
                  </Button>
                </div>
                <div className="flex items-center space-x-8 text-sm text-gray-600 dark:text-gray-400" aria-label="Trial information">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-primary" aria-hidden="true" />
                    <span>14-day free trial</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-4 w-4 text-primary" aria-hidden="true" />
                    <span>No credit card required</span>
                  </div>
                </div>
              </div>
              <div className="relative hidden lg:block" aria-hidden="true">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/30 rounded-3xl blur-3xl" />
                <div className="relative rounded-3xl bg-white/80 p-8 shadow-xl backdrop-blur dark:bg-gray-900/80">
                  <LazyLoadImage
                    alt="PoshAuto dashboard preview showing automation features and analytics"
                    src="/dashboard-preview.png"
                    effect="blur"
                    className="aspect-[4/3] rounded-2xl w-full h-full object-cover"
                    wrapperClassName="aspect-[4/3] rounded-2xl bg-gray-100 dark:bg-gray-800"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="features-heading">
            <h2 id="features-heading" className="text-3xl font-bold text-gray-900 dark:text-gray-50 text-center mb-12">
              Powerful Features for Poshmark Sellers
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-start p-6 bg-gray-50 dark:bg-gray-900 rounded-lg"
                >
                  <div className="rounded-lg bg-primary/10 p-3 mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Pricing Section */}
          <section ref={pricingRef} id="pricing" className="container mx-auto px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="pricing-heading">
            <h2 id="pricing-heading" className="text-3xl font-bold text-gray-900 dark:text-gray-50 text-center mb-12">
              Simple, Transparent Pricing
            </h2>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {pricingPlans.map((plan, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex flex-col p-8 bg-gray-50 dark:bg-gray-900 rounded-lg",
                    plan.popular && "ring-2 ring-primary"
                  )}
                >
                  {plan.popular && (
                    <div className="inline-block px-4 py-1 rounded-full text-sm font-semibold text-primary bg-primary/10 self-start mb-4">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-50">{plan.name}</h3>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">{plan.description}</p>
                  <div className="mt-8">
                    <span className="text-4xl font-bold text-gray-900 dark:text-gray-50">${plan.price}</span>
                    <span className="text-gray-600 dark:text-gray-400">/month</span>
                  </div>
                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <svg
                          className="h-5 w-5 text-primary shrink-0"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="ml-3 text-gray-600 dark:text-gray-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/register"
                    className="mt-8"
                    onClick={() => trackEvent('pricing_signup_click', { plan: plan.name })}
                  >
                    <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                      Get Started
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonials */}
          <section 
            className="bg-gray-50 py-24 dark:bg-gray-900"
            aria-labelledby="testimonials-heading"
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 id="testimonials-heading" className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">
                  Loved by Poshmark sellers
                </h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                  Here's what our customers have to say
                </p>
              </div>

              <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3" role="list">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.name}
                    className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-900"
                    role="listitem"
                  >
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-gray-200" />
                      <div className="ml-4">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-50">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="mt-6 text-gray-600 dark:text-gray-400">{testimonial.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section 
            className="bg-primary py-24 dark:bg-gray-900"
            aria-labelledby="cta-heading"
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 id="cta-heading" className="text-3xl font-bold tracking-tight text-white dark:text-gray-50 sm:text-4xl">
                  Ready to grow your Poshmark business?
                </h2>
                <p className="mt-4 text-lg text-white/90 dark:text-gray-400">
                  Join thousands of successful Poshmark sellers who are saving time and making more money
                </p>
                <div className="mt-8 flex justify-center">
                  <Link to="/register">
                    <Button 
                      size="lg" 
                      variant="secondary" 
                      className="bg-white text-primary hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-700"
                      aria-label="Start your free trial now"
                    >
                      Start Free Trial
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </PublicLayout>

      {/* Demo Video Modal */}
      <DemoVideoModal 
        isOpen={showDemoVideo} 
        onClose={() => setShowDemoVideo(false)} 
      />
    </div>
  );
}

const features = [
  {
    title: "Automated Sharing",
    description: "Schedule automatic sharing of your listings at optimal times for maximum exposure.",
    icon: Clock,
  },
  {
    title: "Smart Following",
    description: "Intelligently follow potential buyers and sellers to grow your network.",
    icon: Bot,
  },
  {
    title: "Multi-Account Support",
    description: "Manage multiple Poshmark accounts from a single dashboard.",
    icon: Zap,
  },
  {
    title: "Sales Analytics",
    description: "Track your performance and revenue with detailed analytics.",
    icon: DollarSign,
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "29",
    description: "Perfect for new Poshmark sellers",
    features: [
      "1 Poshmark Account",
      "Automated Sharing",
      "Basic Analytics",
      "Email Support",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "49",
    description: "For growing Poshmark businesses",
    features: [
      "3 Poshmark Accounts",
      "Advanced Automation",
      "Detailed Analytics",
      "Priority Support",
      "Smart Following",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "99",
    description: "For power sellers and boutiques",
    features: [
      "Unlimited Accounts",
      "Custom Automation Rules",
      "Advanced Analytics",
      "24/7 Priority Support",
      "API Access",
      "Dedicated Account Manager",
    ],
    popular: false,
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Full-time Poshmark Seller",
    content: "This platform has completely transformed my Poshmark business. I've doubled my sales while spending half the time on manual tasks.",
  },
  {
    name: "Michael Chen",
    role: "Boutique Owner",
    content: "The multi-account management feature is a game-changer. I can now manage all my boutique accounts from one place.",
  },
  {
    name: "Emily Rodriguez",
    role: "Side Hustle Seller",
    content: "Even as a part-time seller, this tool has made it possible for me to compete with full-time sellers. The automation is incredible!",
  },
];
