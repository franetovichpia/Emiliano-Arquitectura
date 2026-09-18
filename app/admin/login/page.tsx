import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AdminLoginForm } from "@/components/forms/admin-login-form";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#071d31] px-4 py-16 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(140, 190, 215, 0.22) 1px, transparent 1px),
            linear-gradient(90deg, rgba(140, 190, 215, 0.22) 1px, transparent 1px)
          `,
          backgroundSize: "5rem 5rem",
        }}
      />

      <Link
        className="absolute left-4 top-6 inline-flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-white/50 hover:text-white/80 sm:left-8 sm:top-8"
        href="/"
      >
        <ArrowLeft
          aria-hidden="true"
          size={14}
          strokeWidth={1.8}
        />
        Volver a la página principal
      </Link>

      <AdminLoginForm />
    </main>
  );
}