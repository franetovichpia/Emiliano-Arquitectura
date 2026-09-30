import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  ExternalLink,
  LayoutDashboard,
} from "lucide-react";

import { CopyLinkButton } from "@/components/admin/copy-link-button";
import { requireAdminSession } from "@/lib/auth/session";
import {
  listAdminProjects,
  listConstructionProgress,
} from "@/lib/db/collections";

export const metadata: Metadata = {
  title: "Análisis BIM",
  robots: {
    index: false,
    follow: false,
  },
};

const statusLabels: Record<string, string> = {
  borrador: "Borrador",
  publicado: "Publicado",
  archivado: "Archivado",
};

export default async function AdminAnalisisBimPage() {
  const session = await requireAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const allProjects = await listAdminProjects();

  const bimProjects = allProjects.filter(
    (project) => project.hasIfc && project.bimModel,
  );

  const rows = await Promise.all(
    bimProjects.map(async (project) => {
      const hasProgress =
        project.progressSource ===
        "bim-categorias"
          ? Object.keys(
              project.bimModel
                ?.categoryProgress ?? {},
            ).length > 0
          : (
              await listConstructionProgress(
                project._id.toString(),
              )
            ).length > 0;

      return {
        id: project._id.toString(),
        title: project.title,
        slug: project.slug,
        status: project.status,
        materialsCount:
          project.bimModel?.materials.length ?? 0,
        hasProgress,
      };
    }),
  );

  return (
    <main className="min-h-screen bg-[#071d31] px-4 py-16 text-white">
      <div className="mx-auto max-w-4xl">
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
          Análisis BIM
        </h1>

        <p className="mt-2 text-sm text-white/50">
          Proyectos con modelo 3D cargado. Copiá
          el link para compartirlo con el cliente
          — se actualiza solo cuando cambia el
          avance de obra.
        </p>

        {rows.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-white/50">
              Todavía no hay ningún proyecto con
              modelo BIM cargado. Subí un IFC
              desde &ldquo;Gestionar
              proyectos&rdquo; para que aparezca
              acá.
            </p>
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
            <div className="divide-y divide-white/10">
              {rows.map((row) => (
                <div
                  className="flex flex-wrap items-center justify-between gap-4 p-5"
                  key={row.id}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-paper">
                        {row.title}
                      </p>

                      <span className="rounded-full border border-white/15 px-2 py-0.5 text-[0.55rem] font-semibold uppercase tracking-[0.1em] text-white/50">
                        {statusLabels[
                          row.status
                        ] ?? row.status}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-white/40">
                      /modelos/{row.slug} ·{" "}
                      {row.materialsCount}{" "}
                      materiales ·{" "}
                      {row.hasProgress
                        ? "avance cargado"
                        : "sin avance cargado"}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <CopyLinkButton
                      path={`/modelos/${row.slug}`}
                    />

                    <a
                      className="inline-flex min-h-9 items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-white/70 hover:border-terracotta/50 hover:text-white"
                      href={`/modelos/${row.slug}`}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <ExternalLink
                        aria-hidden="true"
                        size={12}
                      />
                      Ver público
                    </a>

                    <Link
                      className="inline-flex min-h-9 items-center gap-2 rounded-full border border-white/20 bg-terracotta px-3 text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-white"
                      href={`/admin/projects/${row.id}`}
                    >
                      <LayoutDashboard
                        aria-hidden="true"
                        size={12}
                      />
                      Gestionar
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}