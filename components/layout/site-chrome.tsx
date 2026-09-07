"use client";

import { usePathname } from "next/navigation";

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
      {children}
      {isAdminRoute ? null : <SiteFooter />}
    </>
  );
}