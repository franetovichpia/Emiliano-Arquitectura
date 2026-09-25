import type { Metadata } from "next";
import localFont from "next/font/local";
import { Montserrat } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";

import { SiteChrome } from "@/components/layout/site-chrome";

import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-site-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const boska = localFont({
  src: [
    {
      path: "./fonts/Boska-Variable.woff2",
      style: "normal",
      weight: "200 900",
    },
    {
      path: "./fonts/Boska-VariableItalic.woff2",
      style: "italic",
      weight: "200 900",
    },
  ],
  variable: "--font-boska",
  display: "swap",
  preload: true,
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const metadata: Metadata = {
  title: {
    default: "Emiliano Gabriel Rossotti | Arquitecto y Asesor BIM",
    template: "%s | Emiliano Gabriel Rossotti",
  },
  description:
    "Arquitecto UBA, asesor BIM y Maestro Mayor de Obras. Consultoría en proyectos integrativos, viviendas soberanas y procesos OpenBIM.",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <ViewTransitions>
      <html
        data-scroll-behavior="smooth"
        lang="es"
      >
        <body
          className={`${montserrat.variable} ${boska.variable} bg-paper font-sans text-ink antialiased`}
        >
          <SiteChrome>{children}</SiteChrome>
        </body>
      </html>
    </ViewTransitions>
  );
}