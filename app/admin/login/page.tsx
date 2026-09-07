import type { Metadata } from "next";

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

      <AdminLoginForm />
    </main>
  );
}