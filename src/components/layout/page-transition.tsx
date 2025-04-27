import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        style={{ minHeight: "100%" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
