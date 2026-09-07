import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminLogoutButton } from "@/components/admin/admin-logout-button";
import { requireAdminSession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Panel de administración",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminDashboardPage() {
  const session = await requireAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#071d31] px-4 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.17em] text-terracotta">
          Panel de administración
        </p>

        <h1 className="mt-4 font-sans text-3xl font-light tracking-[-0.025em] text-paper">
          Hola, {session.email}
        </h1>

        <p className="mt-4 max-w-lg text-sm leading-6 text-white/55">
          Este es el panel de administración. Todavía no tiene
          funciones para crear o editar proyectos — eso es lo
          próximo que vamos a construir.
        </p>

        <div className="mt-10">
          <AdminLogoutButton />
        </div>
      </div>
    </main>
  );
}