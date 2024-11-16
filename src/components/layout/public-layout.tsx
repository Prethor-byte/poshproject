import { ReactNode } from "react";
import { Navbar } from "./navbar";

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />
      {children}
    </div>
  );
}
