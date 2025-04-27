import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 mt-16">
      <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="PoshAuto Logo" className="h-8 w-8" />
          <span className="font-bold text-lg text-gray-900 dark:text-gray-50">PoshAuto</span>
        </div>
        <nav className="flex flex-wrap gap-6 text-gray-600 dark:text-gray-400 text-base">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
          <Link to="/support" className="hover:text-primary transition-colors">Support</Link>
          <Link to="/register" className="hover:text-primary transition-colors">Sign Up</Link>
          <Link to="/legal/terms" className="hover:text-primary transition-colors">Terms</Link>
          <Link to="/legal/privacy" className="hover:text-primary transition-colors">Privacy</Link>
        </nav>
        <div className="text-sm text-gray-400 dark:text-gray-600">&copy; {new Date().getFullYear()} PoshAuto. All rights reserved.</div>
      </div>
    </footer>
  );
}
