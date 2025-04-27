import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeSwitch } from "@/components/ui/theme-switch";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const scrollToSection = (sectionId: string) => {
    if (!isHomePage) {
      // If not on home page, navigate to home page first
      window.location.href = `/#${sectionId}`;
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-950/80 shadow-sm transition-shadow">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md group">
              <img src="/logo.svg" alt="PoshAuto Logo" className="h-7 w-7" />
              <span className="text-2xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight group-hover:text-primary transition-colors">PoshAuto</span>
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden flex-1 items-center justify-center space-x-4 lg:flex">
            <button
              onClick={() => scrollToSection("pricing")}
              className={cn(
                "text-base font-medium transition-colors",
                "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              )}
            >
              Pricing
            </button>
            <Link
              to="/support"
              className={cn(
                "text-base font-medium transition-colors",
                isActive("/support")
                  ? "text-primary"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              )}
            >
              Support
            </Link>
            <Link
              to="/blog"
              className={cn(
                "text-base font-medium transition-colors",
                isActive("/blog")
                  ? "text-primary"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              )}
            >
              Blog
            </Link>
          </div>

          {/* Desktop Right Side */}
          <div className="hidden items-center space-x-4 lg:flex">
            <Link
              to="/login"
              className="text-base font-semibold px-4 py-2 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
              aria-label="Sign in to your account"
            >
              Sign In
            </Link>
            <Link to="/register" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md" aria-label="Create a new account">
              <Button size="lg" className="bg-primary text-white font-bold px-6 py-2 shadow-md hover:bg-primary/90 transition-colors">Sign Up</Button>
            </Link>
            <ThemeSwitch />
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-4 lg:hidden">
            <ThemeSwitch />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50"
              aria-label="Toggle menu"
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
            <button
              onClick={() => scrollToSection("pricing")}
              className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-50"
            >
              Pricing
            </button>
            <Link
              to="/support"
              className="block px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Support
            </Link>
            <Link
              to="/blog"
              className="block px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              to="/login"
              className="block px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="block px-3 py-2 text-base font-medium text-primary hover:bg-primary/10"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}