import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";


const navLinks = [
  { href: "/features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
  { href: "/support", label: "Support" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 w-full z-40">
      <nav
        className="glass shadow-lg backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 border-b border-gray-100 dark:border-gray-800 transition-all duration-300"
        style={{ WebkitBackdropFilter: "blur(12px) saturate(1.2)" }}
      >
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <Link
            to="/"
            className="text-3xl font-extrabold tracking-tight flex items-center gap-2"
            style={{ color: "var(--color-primary)" }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="inline-block mr-2"><circle cx="16" cy="16" r="16" fill="url(#a)"/><defs><linearGradient id="a" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#7c3aed"/><stop offset="1" stopColor="#f472b6"/></linearGradient></defs></svg>
            PoshAuto
          </Link>
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4 lg:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`relative px-2 py-1 text-base font-semibold transition-colors duration-200 text-gray-800 dark:text-gray-100 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded-lg ${
                  location.pathname === link.href.split("#")[0] ? "text-primary" : ""
                }`}
              >
                {link.label}
                <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-gradient-to-r from-primary to-accent rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </a>
            ))}
            <Button asChild size="lg" className="ml-2 px-6 py-2 text-base shadow-xl bg-gradient-to-r from-primary to-accent text-white">
              <a href="/#pricing">Start Free Trial</a>
            </Button>
          </div>
          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex items-center justify-center p-2 rounded-lg border border-transparent hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Open navigation menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <line x1="4" y1="7" x2="24" y2="7" />
              <line x1="4" y1="14" x2="24" y2="14" />
              <line x1="4" y1="21" x2="24" y2="21" />
            </svg>
          </button>
        </div>
        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white/95 dark:bg-gray-900/95 px-6 pb-6 pt-2 shadow-xl border-b border-primary animate-fade-in-down">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-lg font-semibold py-2 px-2 rounded-lg transition-colors duration-200 text-gray-800 dark:text-gray-100 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:rounded-lg ${
                    location.pathname === link.href.split("#")[0] ? "text-primary" : ""
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Button asChild size="lg" className="mt-2 px-6 py-2 text-base shadow-xl bg-gradient-to-r from-primary to-accent text-white">
                <a href="/#pricing">Start Free Trial</a>
              </Button>
              <Link
                to="/login"
                className="text-base font-semibold px-4 py-2 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                aria-label="Sign in to your account"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md"
                aria-label="Create a new account"
              >
                <Button size="lg" className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold px-6 py-2 shadow-md hover:from-primary/80 hover:to-secondary/80 transition-colors">Sign Up</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
export { Navbar };

