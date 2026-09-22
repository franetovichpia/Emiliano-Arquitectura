import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { AdminUsersManager } from "@/components/admin/admin-users-manager";
import { requireAdminSession } from "@/lib/auth/session";
import { listAdminUsers } from "@/lib/db/collections";

export const metadata: Metadata = {
  title: "Usuarios",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminUsersPage() {
  const session = await requireAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  if (session.role !== "admin") {
    redirect("/admin");
  }

  const users = await listAdminUsers();

  return (
    <main className="min-h-screen bg-[#071d31] px-4 py-16 text-white">
      <div className="mx-auto max-w-2xl">
        <Link
          className="inline-flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-white/40 hover:text-white/70"
          href="/admin"
        >
          <ArrowLeft
            aria-hidden="true"
            size={14}
            strokeWidth={1.8}
          />
          Volver al panel
        </Link>

        <p className="mt-6 text-[0.65rem] font-semibold uppercase tracking-[0.17em] text-terracotta">
          Panel de administración
        </p>

        <h1 className="mt-4 font-sans text-3xl font-light tracking-[-0.025em] text-paper">
          Usuarios
        </h1>

        <p className="mt-2 text-sm text-white/50">
          Solo vos podés entrar acá. Creá la
          cuenta de Emiliano con el rol
          &quot;Editor&quot; para que pueda
          gestionar proyectos sin ver esta
          pantalla.
        </p>

        <div className="mt-10">
          <AdminUsersManager
            currentUserId={session.sub}
            initialUsers={users}
          />
        </div>
      </div>
    </main>
  );
}