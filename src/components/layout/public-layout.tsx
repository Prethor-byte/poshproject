import { ReactNode } from "react";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { CookieBanner } from "@/components/compliance/cookie-banner";
import { PageTransition } from "@/components/layout/page-transition";

interface PublicLayoutProps {
  children: ReactNode;
}

import { ThemeProvider } from '@/components/theme-provider';
import { ScrollHandler } from './scroll-to-top';

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="posh-theme">
      <ScrollHandler />
      <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
        <Navbar />
        <CookieBanner />
        <div className="flex-1 flex flex-col">
          <PageTransition>{children}</PageTransition>
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
