import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Clock, DollarSign, Menu, X, Zap } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pricingRef = useRef<HTMLElement>(null);
  
  // Smooth scroll to pricing section
  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary">PoshAuto</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:space-x-8">
              <Link to="/blog" className="text-gray-600 hover:text-gray-900">Blog</Link>
              <button onClick={scrollToPricing} className="text-gray-600 hover:text-gray-900">Pricing</button>
              <Link to="/login" className="text-gray-600 hover:text-gray-900">Sign In</Link>
              <Link to="/register">
                <Button>Sign Up</Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
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
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                Blog
              </Link>
              <button
                onClick={() => {
                  scrollToPricing();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                Pricing
              </button>
              <Link
                to="/login"
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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

      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
          <div className="flex flex-col justify-center space-y-8">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Automate Your <span className="text-primary">Poshmark</span> Business
            </h1>
            <p className="text-xl text-gray-600">
              Boost your sales and save countless hours with our intelligent automation platform designed specifically for Poshmark resellers.
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Link to="/register">
                <Button size="lg" className="group w-full sm:w-auto">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" onClick={() => {
                // Add demo video modal logic here
              }}>
                Watch Demo
              </Button>
            </div>
            <div className="flex items-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-primary" />
                14-day free trial
              </div>
              <div className="flex items-center">
                <DollarSign className="mr-2 h-4 w-4 text-primary" />
                No credit card required
              </div>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/30 rounded-3xl blur-3xl" />
            <div className="relative rounded-3xl bg-white/80 p-8 shadow-xl backdrop-blur">
              {/* Add dashboard preview image here */}
              <div className="aspect-[4/3] rounded-2xl bg-gray-100" />
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="bg-gray-50 py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to scale your Poshmark business
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Our platform provides all the tools you need to automate your Poshmark operations
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="relative">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary/50 to-secondary/50 opacity-20 blur transition group-hover:opacity-100" />
                <div className="relative rounded-lg bg-white p-8 shadow-lg">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    {feature.icon}
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section ref={pricingRef} className="scroll-mt-20 py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Choose the plan that best fits your business needs
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl bg-white p-8 shadow-lg ${
                  plan.featured ? "ring-2 ring-primary" : ""
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-medium text-white">
                    Most Popular
                  </div>
                )}
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{plan.description}</p>
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
                      <span className="ml-3 text-gray-600">{feature}</span>
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
      <section className="bg-gray-50 py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Loved by Poshmark sellers
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Here's what our customers have to say
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="rounded-lg bg-white p-8 shadow-lg"
              >
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gray-200" />
                  <div className="ml-4">
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="mt-6 text-gray-600">{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to grow your Poshmark business?
            </h2>
            <p className="mt-4 text-lg text-white/90">
              Join thousands of successful Poshmark sellers who are saving time and making more money
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <Link to="/register">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                  Start Free Trial
                </Button>
              </Link>
              <a href="mailto:sales@poshauto.com">
                <Button size="lg" variant="outline" className="text-white hover:bg-primary/90">
                  Contact Sales
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
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
