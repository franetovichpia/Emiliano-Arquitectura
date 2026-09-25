"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

type SiteChromeProps = {
  children: React.ReactNode;
};

/*
 * La View Transitions API nativa cancela la
 * transición si la actualización del DOM tarda
 * más de lo que tolera el navegador (por ejemplo,
 * en desarrollo, la primera vez que se visita una
 * ruta y Turbopack todavía la está compilando). La
 * navegación en sí funciona igual, pero el rechazo
 * de esa promesa queda sin atrapar y Next.js lo
 * muestra como un error. Acá lo silenciamos —
 * puntualmente ese caso, nada más.
 */
function isViewTransitionTimeout(
  reason: unknown,
) {
  const message =
    reason instanceof Error
      ? reason.message
      : String(reason);

  return message
    .toLowerCase()
    .includes("dom update");
}

export function SiteChrome({
  children,
}: SiteChromeProps) {
  const pathname = usePathname();
  const isAdminRoute =
    pathname.startsWith("/admin");

  useEffect(() => {
    const handleRejection = (
      event: PromiseRejectionEvent,
    ) => {
      if (
        isViewTransitionTimeout(event.reason)
      ) {
        event.preventDefault();
      }
    };

    window.addEventListener(
      "unhandledrejection",
      handleRejection,
    );

    return () => {
      window.removeEventListener(
        "unhandledrejection",
        handleRejection,
      );
    };
  }, []);

  return (
    <>
      {isAdminRoute ? null : <SiteHeader />}

      {children}

      {isAdminRoute ? null : <SiteFooter />}
    </>
  );
}