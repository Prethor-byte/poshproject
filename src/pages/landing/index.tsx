import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Clock, DollarSign, Menu, X, Zap } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Helmet } from "react-helmet-async";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';
import { trackEvent } from "@/lib/analytics";
import { DemoVideoModal } from "@/components/demo-video-modal";
import { useToast } from "@/components/ui/use-toast";
import { ThemeSwitch } from "@/components/ui/theme-switch"; // Fixing the import path for the ThemeSwitch component

// Structured data for rich snippets
const structuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "PoshAuto",
  "applicationCategory": "BusinessApplication",
  "offers": {
    "@type": "Offer",
    "price": "29",
    "priceCurrency": "USD"
  },
  "description": "Automate your Poshmark business with intelligent tools for sharing, following, and managing multiple accounts."
};

export function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDemoVideo, setShowDemoVideo] = useState(false);
  const pricingRef = useRef<HTMLElement>(null);
  const { toast } = useToast();
  
  // Track page view
  useEffect(() => {
    trackEvent('page_view', {
      page_name: 'landing',
      page_path: window.location.pathname
    });
  }, []);

  // Smooth scroll to pricing section
  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
    trackEvent('click_pricing_link', {
      location: 'navbar'
    });
  };

  // Smooth scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    trackEvent('click_logo', {
      location: 'navbar'
    });
  };

  // Handle trial start
  const handleStartTrial = async () => {
    try {
      setIsLoading(true);
      trackEvent('start_trial_click', {
        location: 'hero_section'
      });
      // Add your trial start logic here
      
    } catch (error) {
      console.error('Failed to start trial:', error);
      toast({
        title: "Error",
        description: "Failed to start your trial. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
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

      <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md"
        >
          Skip to main content
        </a>

        {/* Navbar */}
        <nav
          className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800"
          role="navigation"
          aria-label="Main navigation"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <button 
                onClick={scrollToTop}
                className="flex items-center space-x-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md"
                aria-label="Back to top"
              >
                <span className="text-2xl font-bold text-primary">PoshAuto</span>
              </button>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex lg:items-center lg:space-x-8">
                <Link to="/blog" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50">Blog</Link>
                <button onClick={scrollToPricing} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50">Pricing</button>
                <Link to="/login" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50">Sign In</Link>
                <Link to="/register">
                  <Button>Sign Up</Button>
                </Link>
                <ThemeSwitch />
              </div>

              {/* Mobile menu button */}
              <div className="flex items-center gap-4 lg:hidden">
                <ThemeSwitch />
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50"
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div
              className={cn(
                "lg:hidden",
                isMenuOpen ? "block" : "hidden"
              )}
            >
              <div className="space-y-1 pb-3 pt-2">
                <Link
                  to="/blog"
                  className="block px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-50"
                >
                  Blog
                </Link>
                <button
                  onClick={() => {
                    scrollToPricing();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-50"
                >
                  Pricing
                </button>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-base font-medium text-primary hover:bg-primary/10"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main id="main-content">
          {/* Hero Section */}
          <header className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 mt-16" role="banner">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
              <div className="flex flex-col justify-center space-y-8">
                <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-6xl">
                  Automate Your <span className="text-primary">Poshmark</span> Business
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Boost your sales and save countless hours with our intelligent automation platform designed specifically for Poshmark resellers.
                </p>
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <Link to="/register" onClick={handleStartTrial}>
                    <Button
                      size="lg"
                      className="group w-full sm:w-auto"
                      disabled={isLoading}
                      aria-label="Start your free trial"
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Loading...
                        </span>
                      ) : (
                        <>
                          Start Free Trial
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </Button>
                  </Link>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => {
                      trackEvent('watch_demo_click');
                      setShowDemoVideo(true);
                    }}
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
              <div className="relative hidden lg:block">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/30 rounded-3xl blur-3xl" aria-hidden="true" />
                <div className="relative rounded-3xl bg-white/80 p-8 shadow-xl backdrop-blur dark:bg-gray-900/80">
                  <LazyLoadImage
                    alt="PoshAuto dashboard preview"
                    src="/dashboard-preview.png"
                    effect="blur"
                    className="aspect-[4/3] rounded-2xl w-full h-full object-cover"
                    wrapperClassName="aspect-[4/3] rounded-2xl bg-gray-100 dark:bg-gray-800"
                  />
                </div>
              </div>
            </div>
          </header>

          {/* Features Section */}
          <section
            className="bg-gray-50 py-24 dark:bg-gray-900"
            aria-labelledby="features-heading"
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2
                  id="features-heading"
                  className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl"
                >
                  Everything you need to scale your Poshmark business
                </h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                  Our platform provides all the tools you need to automate your Poshmark operations
                </p>
              </div>

              <div className="mt-20 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => (
                  <div
                    key={feature.title}
                    className="relative"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary/50 to-secondary/50 opacity-20 blur transition group-hover:opacity-100" />
                    <div className="relative rounded-lg bg-white p-8 shadow-lg dark:bg-gray-900">
                      <div
                        className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10"
                        aria-hidden="true"
                      >
                        {feature.icon}
                      </div>
                      <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-gray-50">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-gray-600 dark:text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section
            ref={pricingRef}
            className="scroll-mt-20 py-24"
            aria-labelledby="pricing-heading"
          >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2
                  id="pricing-heading"
                  className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl"
                >
                  Simple, transparent pricing
                </h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                  Choose the plan that best fits your business needs
                </p>
              </div>

              <div className="mt-20 grid grid-cols-1 gap-8 lg:grid-cols-3">
                {plans.map((plan) => (
                  <div
                    key={plan.name}
                    className={`relative rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-900 ${plan.featured ? "ring-2 ring-primary" : ""}`}
                  >
                    {plan.featured && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-medium text-white">
                        Most Popular
                      </div>
                    )}
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">{plan.name}</h3>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">${plan.price}</span>
                        <span className="text-gray-600 dark:text-gray-400">/month</span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{plan.description}</p>
                    </div>
                    <ul className="mt-8 space-y-4">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center">
                          <svg
                            className="h-5 w-5 text-primary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="ml-3 text-gray-600 dark:text-gray-400">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8">
                      <Link to="/register">
                        <Button
                          className={`w-full ${
                            plan.featured ? "bg-primary" : "bg-gray-800"
                          }`}
                        >
                          Get Started
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials */}
          <section className="bg-gray-50 py-24 dark:bg-gray-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-4xl">
                  Loved by Poshmark sellers
                </h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                  Here's what our customers have to say
                </p>
              </div>

              <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.name}
                    className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-900"
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
          <section className="bg-primary py-24 dark:bg-gray-900">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white dark:text-gray-50 sm:text-4xl">
                  Ready to grow your Poshmark business?
                </h2>
                <p className="mt-4 text-lg text-white/90 dark:text-gray-400">
                  Join thousands of successful Poshmark sellers who are saving time and making more money
                </p>
                <div className="mt-8 flex justify-center space-x-4">
                  <Link to="/register">
                    <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-700">
                      Start Free Trial
                    </Button>
                  </Link>
                  <a href="mailto:sales@poshauto.com">
                    <Button size="lg" variant="outline" className="text-white dark:text-gray-50 dark:hover:bg-gray-800">
                      Contact Sales
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
      {/* Demo Video Modal */}
      <DemoVideoModal 
        isOpen={showDemoVideo} 
        onClose={() => setShowDemoVideo(false)} 
      />
    </>
  );
}

const features = [
  {
    title: "Intelligent Automation",
    description: "Automate sharing, following, and other repetitive tasks with our smart AI-powered system.",
    icon: <Bot className="h-6 w-6 text-primary" />,
  },
  {
    title: "Multi-Account Management",
    description: "Manage multiple Poshmark accounts from a single dashboard with ease.",
    icon: <Zap className="h-6 w-6 text-primary" />,
  },
  // Add more features...
];

const plans = [
  {
    name: "Starter",
    price: 29,
    description: "Perfect for new Poshmark sellers",
    features: [
      "1 Poshmark Account",
      "Basic Automation",
      "24/7 Support",
      "Analytics Dashboard",
    ],
  },
  {
    name: "Professional",
    price: 79,
    description: "For growing Poshmark businesses",
    featured: true,
    features: [
      "3 Poshmark Accounts",
      "Advanced Automation",
      "Priority Support",
      "Advanced Analytics",
      "Bulk Actions",
    ],
  },
  {
    name: "Enterprise",
    price: 199,
    description: "For large-scale operations",
    features: [
      "10 Poshmark Accounts",
      "Custom Automation Rules",
      "Dedicated Support",
      "API Access",
      "Custom Integration",
    ],
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
