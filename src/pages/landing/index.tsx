import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { Bot, Clock, DollarSign, Zap } from "lucide-react";
import { useState, useRef } from "react";
import 'react-lazy-load-image-component/src/effects/blur.css';
import { trackEvent } from "@/lib/analytics";
import { DemoVideoModal } from "@/components/demo-video-modal";
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
        <main id="main-content" role="main" className="pb-24">
          {/* Hero Section */}
          <section
  className="relative flex flex-col items-center justify-center min-h-[90vh] w-full px-4 py-32 overflow-hidden bg-[#18181b]"
  aria-labelledby="hero-heading"
>
  {/* Animated SVG Orb */}
  <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none select-none">
    <svg
      width="900"
      height="900"
      viewBox="0 0 900 900"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-orb-spin"
      aria-hidden="true"
      style={{ filter: "blur(32px)", opacity: 0.85 }}
    >
      <defs>
        <radialGradient id="orbGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="1" />
          <stop offset="40%" stopColor="#6366f1" stopOpacity="0.7" />
          <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#18181b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="orbStroke" x1="0" y1="0" x2="900" y2="900" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f472b6" />
          <stop offset="1" stopColor="#818cf8" />
        </linearGradient>
      </defs>
      <ellipse
        cx="450"
        cy="450"
        rx="340"
        ry="340"
        fill="url(#orbGradient)"
        stroke="url(#orbStroke)"
        strokeWidth="8"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 450 450"
          to="360 450 450"
          dur="22s"
          repeatCount="indefinite"
        />
      </ellipse>
    </svg>
  </div>
  {/* Main Content */}
  <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
    <h1
      id="hero-heading"
      className="text-[2.8rem] sm:text-6xl md:text-7xl font-black leading-[1.1] tracking-tight text-white mb-6"
      style={{ fontFamily: 'Inter, Satoshi, sans-serif' }}
    >
      <span className="inline-block relative">
        <span className="pr-2">The new standard for</span>
        <span
          className="inline-block bg-gradient-to-r from-[#a78bfa] via-[#818cf8] to-[#06b6d4] bg-clip-text text-transparent animate-gradient-move"
          style={{ backgroundSize: '200% 200%' }}
        >
          Poshmark Automation
        </span>
      </span>
    </h1>
    <h2 className="text-2xl sm:text-3xl font-semibold text-[#A1A1AA] mb-8" style={{letterSpacing: '-0.01em'}}>
      Automation Platform for Poshmark
    </h2>
    <p className="text-lg sm:text-2xl text-[#A1A1AA] mb-10 max-w-xl mx-auto">
      Automate, organize, and scale your Poshmark business with beautiful, fast, and reliable tools. Experience the future of social selling.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
      <Button
        size="lg"
        className="relative px-10 py-4 text-xl font-bold rounded-full shadow-xl bg-gradient-to-r from-[#818cf8] via-[#a78bfa] to-[#06b6d4] text-white border-2 border-transparent hover:from-[#a78bfa] hover:to-[#818cf8] hover:shadow-2xl focus-visible:ring-4 focus-visible:ring-[#818cf8] transition-all duration-200 animate-glow"
        asChild
      >
        <a href="/#pricing" aria-label="Start your free trial now">
          Start Free Trial
        </a>
      </Button>
      <Button
        variant="outline"
        size="lg"
        className="relative px-8 py-4 text-xl font-semibold rounded-full border-2 border-[#818cf8] text-white hover:bg-[#818cf8]/10 hover:scale-105 transition-transform duration-200"
        onClick={handleDemoVideoClick}
      >
        <span className="flex items-center gap-2">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" stroke="url(#demo-play)" strokeWidth="2"/><polygon points="10,8 16,12 10,16" fill="url(#demo-play)"/><defs><linearGradient id="demo-play" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop stopColor="#a78bfa"/><stop offset="1" stopColor="#06b6d4"/></linearGradient></defs></svg>
          Watch Demo
        </span>
      </Button>
    </div>
    <p className="text-base text-[#71717A]">
      No credit card required. Cancel anytime.
    </p>
  </div>
</section>


          {/* Features Section */}
          <section className="container mx-auto px-4 py-20 sm:px-6 lg:px-8" aria-labelledby="features-heading">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <h2 id="features-heading" className="text-4xl font-extrabold text-gray-900 dark:text-gray-50 mb-4">
                Everything You Need to Win on Poshmark
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Our automation suite is built to help you grow, save time, and maximize your sales—no matter your experience level.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group flex flex-col items-start p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 transition-transform hover:-translate-y-2 hover:shadow-xl focus-within:ring-2 focus-within:ring-primary outline-none cursor-pointer"
                  tabIndex={0}
                  aria-label={feature.title}
                >
                  <div className="flex items-center justify-center rounded-full bg-primary/10 p-4 mb-6">
                    <feature.icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-50 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-base">
                    {feature.description}
                  </p>
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

export type FeatureItem = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

export const features: FeatureItem[] = [
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
    description: "Perfect for getting started with Poshmark automation.",
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
    description: "For advanced automation needs.",
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
    description: "For teams and power users.",
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

const testimonials: { name: string; role: string; content: string }[] = [];
