import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  FolderKanban,
  Layers,
  Users,
} from "lucide-react";

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
    <main className="min-h-screen bg-[#071d31] px-4 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <Link
          className="inline-flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-white/40 hover:text-white/70"
          href="/"
        >
          <ArrowLeft
            aria-hidden="true"
            size={14}
            strokeWidth={1.8}
          />
          Volver al sitio
        </Link>

        <p className="mt-6 text-[0.65rem] font-semibold uppercase tracking-[0.17em] text-terracotta">
          Panel de administración
        </p>

        <h1 className="mt-4 font-sans text-3xl font-light tracking-[-0.025em] text-paper">
          Hola, Emiliano
        </h1>

        <p className="mt-2 text-sm text-white/50">
          Elegí qué querés gestionar.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-colors hover:border-terracotta/40"
            href="/admin/projects"
          >
            <FolderKanban
              aria-hidden="true"
              className="text-terracotta"
              size={22}
              strokeWidth={1.6}
            />

            <p className="mt-4 text-sm font-semibold text-paper">
              Gestionar proyectos
            </p>

            <p className="mt-1 text-xs text-white/45">
              Crear, editar y publicar proyectos, subir imágenes y modelos BIM.
            </p>
          </Link>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 opacity-50">
            <Layers
              aria-hidden="true"
              className="text-white/40"
              size={22}
              strokeWidth={1.6}
            />

            <p className="mt-4 text-sm font-semibold text-paper">
              Materiales y propiedades
            </p>

            <p className="mt-1 text-xs text-white/45">
              Próximamente.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 opacity-50">
            <BarChart3
              aria-hidden="true"
              className="text-white/40"
              size={22}
              strokeWidth={1.6}
            />

            <p className="mt-4 text-sm font-semibold text-paper">
              Análisis BIM
            </p>

            <p className="mt-1 text-xs text-white/45">
              Próximamente.
            </p>
          </div>

          {session.role === "admin" ? (
            <Link
              className="group rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-colors hover:border-terracotta/40"
              href="/admin/users"
            >
              <Users
                aria-hidden="true"
                className="text-terracotta"
                size={22}
                strokeWidth={1.6}
              />

              <p className="mt-4 text-sm font-semibold text-paper">
                Usuarios
              </p>

              <p className="mt-1 text-xs text-white/45">
                Crear o eliminar accesos al panel.
              </p>
            </Link>
          ) : null}
        </div>

        <div className="mt-10">
          <AdminLogoutButton />
        </div>
      </div>
    </main>
  );
}