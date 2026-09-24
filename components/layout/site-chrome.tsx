"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

type SiteChromeProps = {
  children: React.ReactNode;
};

export function SiteChrome({
  children,
}: SiteChromeProps) {
  const pathname = usePathname();
  const isAdminRoute =
    pathname.startsWith("/admin");

  return (
    <>
      {isAdminRoute ? null : <SiteHeader />}

      <AnimatePresence mode="wait">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0.6, y: -4 }}
          initial={{ opacity: 0.6, y: 4 }}
          key={pathname}
          transition={{
            duration: 0.22,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {isAdminRoute ? null : <SiteFooter />}
    </>
  );
}