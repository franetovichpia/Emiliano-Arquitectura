import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";

import { SiteHeader } from "@/components/layout/site-header";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Emiliano Gabriel Rossotti | Arquitecto Utopista",
    template: "%s | Emiliano Gabriel Rossotti",
  },
  description:
    "Arquitecto UBA, asesor BIM y consultor en proyectos participativos y soberanos.",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es-AR">
      <body className={`${inter.variable} ${cormorant.variable}`}>
        <a
          className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-forest-deep px-5 py-3 text-sm font-semibold text-ivory transition-transform focus:translate-y-0"
          href="#contenido-principal"
        >
          Ir al contenido principal
        </a>

        <SiteHeader />

        {children}
      </body>
    </html>
  );
}