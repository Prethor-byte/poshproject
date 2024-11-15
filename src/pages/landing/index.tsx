import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bot, Share2, Users, Zap } from 'lucide-react';

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6" />
          <span className="font-bold text-xl">Poshmark Pro</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link to="/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Automate Your Poshmark Success
        </h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Boost your sales with intelligent automation. Share listings, grow followers,
          and manage your closet effortlessly.
        </p>
        <Link to="/signup">
          <Button size="lg" className="animate-pulse">
            Start Free Trial
          </Button>
        </Link>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-24">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-card rounded-lg shadow-lg">
            <Share2 className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Smart Sharing</h3>
            <p className="text-muted-foreground">
              Automated sharing with intelligent timing and targeting
            </p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow-lg">
            <Users className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Follow Management</h3>
            <p className="text-muted-foreground">
              Grow your following with smart automation
            </p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow-lg">
            <Zap className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Analytics</h3>
            <p className="text-muted-foreground">
              Track performance and optimize your strategy
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}