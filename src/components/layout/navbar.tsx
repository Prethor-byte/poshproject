import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeSwitch } from "@/components/ui/theme-switch";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
   

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-gradient-to-r from-primary via-pink-400 to-secondary shadow-lg border-b border-primary/40 transition-shadow">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8" aria-label="Main navigation">
        {/* Left: Logo */}
        <div className="flex items-center flex-shrink-0">
          <button
            type="button"
            className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md group"
            aria-label="Homepage"
            onClick={() => {
              if (location.pathname === "/") {
                const top = document.getElementById("top");
                if (top) top.scrollIntoView({ behavior: "smooth" });
                else window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                window.location.href = "/";
              }
            }}
          >
            <img src="/logo.svg" alt="PoshAuto Logo" className="h-7 w-7" />
            <span className="text-2xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight group-hover:text-primary transition-colors">PoshAuto</span>
          </button>
        </div>
        {/* Center: Desktop Navigation */}
        <div className="hidden flex-1 items-center justify-center space-x-4 lg:flex">
          {[
            { label: 'Pricing', to: '#pricing', isScroll: true },
            { label: 'Features', to: '/features' },
            { label: 'Blog', to: '/blog' },
            { label: 'Support', to: '/support' },
          ].map((item) => (
            item.isScroll ? (
              <button
                key={item.label}
                onClick={() => {
                  if (location.pathname === "/") {
                    const pricing = document.getElementById("pricing");
                    if (pricing) pricing.scrollIntoView({ behavior: "smooth" });
                  } else {
                    window.location.href = "/#pricing";
                  }
                }}
                className={cn(
                  'text-base font-medium transition-colors px-2 py-1 rounded hover:bg-gradient-to-r hover:from-primary/20 hover:to-secondary/20',
                  'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50'
                )}
                aria-label={item.label}
              >
                {item.label}
              </button>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'text-base font-medium transition-colors px-2 py-1 rounded hover:bg-gradient-to-r hover:from-primary/20 hover:to-secondary/20',
                  isActive(item.to)
                    ? 'text-primary underline underline-offset-4'
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50'
                )}
                aria-current={isActive(item.to) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            )
          ))}
        </div>
        {/* Right: Actions (Desktop) */}
        <div className="hidden lg:flex items-center space-x-3 flex-shrink-0">
          <div className="rounded-full border-2 border-secondary bg-white/80 dark:bg-black/60 shadow-md p-2 hover:scale-110 transition-transform duration-200">
            <ThemeSwitch />
          </div>
          <Link
            to="/login"
            className="text-base font-semibold px-4 py-2 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
            aria-label="Sign in to your account"
          >
            Sign In
          </Link>
          <Link to="/register" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md" aria-label="Create a new account">
            <Button size="lg" className="bg-gradient-to-r from-primary to-secondary text-white font-bold px-6 py-2 shadow-md hover:from-primary/80 hover:to-secondary/80 transition-colors">Sign Up</Button>
          </Link>
        </div>
        {/* Right: Menu Button (Mobile) */}
        <div className="flex items-center gap-2 lg:hidden flex-shrink-0">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Open menu"
            aria-controls="mobile-menu"
            aria-expanded={isMenuOpen}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>
      {/* Mobile Drawer Menu */}
      <Transition.Root show={isMenuOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[100]" onClose={setIsMenuOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
            leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={() => setIsMenuOpen(false)} />
          </Transition.Child>
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-200"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="absolute right-0 top-0 h-full w-80 max-w-full bg-white dark:bg-gray-950 shadow-xl rounded-l-2xl flex flex-col focus:outline-none">
                  {/* Top bar in Drawer */}
                  <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-800">
                    <div className="rounded-full border-2 border-secondary bg-white/80 dark:bg-black/60 shadow-md p-2">
                      <ThemeSwitch />
                    </div>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      aria-label="Close menu"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  {/* Nav Links */}
                  <div className="flex flex-col gap-2 px-4 py-6 flex-1">
                    {[
                      { label: 'Pricing', to: '#pricing', isScroll: true },
                      { label: 'Features', to: '/features' },
                      { label: 'Blog', to: '/blog' },
                      { label: 'Support', to: '/support' },
                    ].map((item) => (
                      item.isScroll ? (
                        <button
                          key={item.label}
                          onClick={() => {
                            setIsMenuOpen(false);
                            if (location.pathname === "/") {
                              const pricing = document.getElementById("pricing");
                              if (pricing) pricing.scrollIntoView({ behavior: "smooth" });
                            } else {
                              window.location.href = "/#pricing";
                            }
                          }}
                          className="block w-full text-left px-3 py-2 text-base font-medium text-gray-600 dark:text-gray-400 hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:text-primary rounded"
                          aria-label={item.label}
                        >
                          {item.label}
                        </button>
                      ) : (
                        <Link
                          key={item.to}
                          to={item.to}
                          onClick={() => setIsMenuOpen(false)}
                          className={cn(
                            'block px-3 py-2 text-base font-medium rounded',
                            isActive(item.to)
                              ? 'text-primary bg-primary/10 dark:bg-primary/20 underline underline-offset-4'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 hover:text-primary'
                          )}
                          aria-current={isActive(item.to) ? 'page' : undefined}
                        >
                          {item.label}
                        </Link>
                      )
                    ))}
                  </div>
                  {/* Bottom: Actions */}
                  <div className="flex flex-col gap-3 px-4 pb-6 border-t border-gray-200 dark:border-gray-800">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-base font-semibold px-4 py-2 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary"
                      aria-label="Sign in to your account"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md"
                      aria-label="Create a new account"
                    >
                      <Button size="lg" className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold px-6 py-2 shadow-md hover:from-primary/80 hover:to-secondary/80 transition-colors">Sign Up</Button>
                    </Link>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </header>
  );
}
