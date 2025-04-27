import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="glass relative z-10 border-t-0 mt-24 shadow-2xl backdrop-blur-lg bg-white/70 dark:bg-gray-900/70">
      <div className="absolute -top-1 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-secondary rounded-t-xl opacity-90" />
      <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Logo and Brand */}
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-tr from-primary to-accent shadow-xl">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="url(#footer-logo)"/><defs><linearGradient id="footer-logo" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse"><stop stopColor="#7c3aed"/><stop offset="1" stopColor="#f472b6"/></linearGradient></defs></svg>
          </span>
          <span className="font-extrabold text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent tracking-tight select-none">PoshAuto</span>
        </div>
        {/* Navigation Links */}
        <nav className="flex flex-wrap gap-6 text-lg font-semibold text-gray-700 dark:text-gray-200">
          <Link to="/" className="relative px-2 py-1 hover:text-primary transition group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            Home
            <span className="absolute left-0 -bottom-0.5 w-full h-0.5 bg-gradient-to-r from-primary to-accent rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </Link>
          <Link to="/blog" className="relative px-2 py-1 hover:text-primary transition group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            Blog
            <span className="absolute left-0 -bottom-0.5 w-full h-0.5 bg-gradient-to-r from-primary to-accent rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </Link>
          <Link to="/support" className="relative px-2 py-1 hover:text-primary transition group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            Support
            <span className="absolute left-0 -bottom-0.5 w-full h-0.5 bg-gradient-to-r from-primary to-accent rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </Link>
          <Link to="/register" className="relative px-2 py-1 hover:text-primary transition group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            Sign Up
            <span className="absolute left-0 -bottom-0.5 w-full h-0.5 bg-gradient-to-r from-primary to-accent rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </Link>
          <Link to="/legal/terms" className="relative px-2 py-1 hover:text-primary transition group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            Terms
            <span className="absolute left-0 -bottom-0.5 w-full h-0.5 bg-gradient-to-r from-primary to-accent rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </Link>
          <Link to="/legal/privacy" className="relative px-2 py-1 hover:text-primary transition group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            Privacy
            <span className="absolute left-0 -bottom-0.5 w-full h-0.5 bg-gradient-to-r from-primary to-accent rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </Link>
        </nav>
        {/* Social Icons */}
        <div className="flex gap-5">
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="group rounded-full p-2 bg-white/80 dark:bg-gray-800/80 shadow hover:bg-primary/10 hover:scale-110 transition-transform">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M16.5 8.5A4 4 0 0 1 20 12.5V17a1 1 0 0 1-1 1h-2.5v-4.5a1.5 1.5 0 0 0-3 0V18H11a1 1 0 0 1-1-1v-4.5a4 4 0 0 1 6.5-3z" stroke="url(#linkedin)" strokeWidth="1.5"/><rect x="3" y="8" width="4" height="12" rx="1" stroke="url(#linkedin)" strokeWidth="1.5"/><circle cx="5" cy="5" r="2" stroke="url(#linkedin)" strokeWidth="1.5"/><defs><linearGradient id="linkedin" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop stopColor="#7c3aed"/><stop offset="1" stopColor="#f472b6"/></linearGradient></defs></svg>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="group rounded-full p-2 bg-white/80 dark:bg-gray-800/80 shadow hover:bg-accent/10 hover:scale-110 transition-transform">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M22 5.924c-.793.352-1.644.59-2.54.698a4.48 4.48 0 0 0 1.962-2.476 8.918 8.918 0 0 1-2.828 1.084A4.466 4.466 0 0 0 12 9.037c0 .35.04.693.115 1.021C8.728 9.89 5.769 8.17 3.825 5.685a4.51 4.51 0 0 0-.606 2.247c0 1.55.789 2.917 1.99 3.722a4.462 4.462 0 0 1-2.021-.56v.057a4.475 4.475 0 0 0 3.58 4.383 4.495 4.495 0 0 1-2.016.077 4.474 4.474 0 0 0 4.175 3.108A8.96 8.96 0 0 1 2 19.07a12.63 12.63 0 0 0 6.84 2.006c8.206 0 12.7-6.797 12.7-12.7 0-.193-.004-.385-.013-.576A9.02 9.02 0 0 0 24 4.59a8.99 8.99 0 0 1-2.6.715z" stroke="url(#twitter)" strokeWidth="1.5"/><defs><linearGradient id="twitter" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop stopColor="#7c3aed"/><stop offset="1" stopColor="#f472b6"/></linearGradient></defs></svg>
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="group rounded-full p-2 bg-white/80 dark:bg-gray-800/80 shadow hover:bg-secondary/10 hover:scale-110 transition-transform">
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.867 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.238-.009-.868-.014-1.703-2.782.604-3.37-1.342-3.37-1.342-.454-1.154-1.11-1.461-1.11-1.461-.908-.62.069-.608.069-.608 1.004.07 1.532 1.031 1.532 1.031.892 1.53 2.341 1.088 2.91.832.092-.646.35-1.088.636-1.339-2.221-.253-4.555-1.111-4.555-4.945 0-1.091.39-1.984 1.03-2.683-.104-.253-.447-1.272.098-2.65 0 0 .84-.27 2.75 1.025A9.564 9.564 0 0 1 12 7.845a9.56 9.56 0 0 1 2.506.338c1.909-1.295 2.748-1.025 2.748-1.025.546 1.378.203 2.397.1 2.65.64.699 1.03 1.592 1.03 2.683 0 3.843-2.337 4.688-4.566 4.937.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.749 0 .268.18.579.688.481C19.135 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" stroke="url(#github)" strokeWidth="1.5"/><defs><linearGradient id="github" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse"><stop stopColor="#7c3aed"/><stop offset="1" stopColor="#f472b6"/></linearGradient></defs></svg>
          </a>
        </div>
        {/* Copyright */}
        <div className="w-full text-center md:w-auto text-sm font-medium mt-8 md:mt-0 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent select-none">
          &copy; {new Date().getFullYear()} PoshAuto. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
