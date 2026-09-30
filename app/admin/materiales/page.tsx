import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Layers } from "lucide-react";

import { requireAdminSession } from "@/lib/auth/session";
import { listAdminProjects } from "@/lib/db/collections";

export const metadata: Metadata = {
  title: "Materiales y propiedades",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminMaterialsPage() {
  const session = await requireAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const allProjects = await listAdminProjects();

  const projectsWithMaterials =
    allProjects.filter(
      (project) =>
        (project.bimModel?.materials.length ??
          0) > 0,
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
          Materiales y propiedades
        </h1>

        <p className="mt-2 text-sm text-white/50">
          Configurá manualmente el acabado de
          cada material detectado en el modelo 3D
          de cada proyecto.
        </p>

        {projectsWithMaterials.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm text-white/50">
              Todavía no hay proyectos con
              materiales detectados. Subí un
              modelo BIM desde &ldquo;Gestionar
              proyectos&rdquo; para que aparezcan
              acá.
            </p>
          </div>
        ) : (
          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
            <div className="divide-y divide-white/10">
              {projectsWithMaterials.map(
                (project) => (
                  <div
                    className="flex flex-wrap items-center justify-between gap-4 p-5"
                    key={project._id.toString()}
                  >
                    <div>
                      <p className="text-sm font-semibold text-paper">
                        {project.title}
                      </p>

                      <p className="mt-1 text-xs text-white/40">
                        {
                          project.bimModel
                            ?.materials.length
                        }{" "}
                        materiales detectados
                      </p>
                    </div>

                    <Link
                      className="inline-flex min-h-9 items-center gap-2 rounded-full border border-white/20 bg-terracotta px-4 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-white"
                      href={`/admin/projects/${project._id.toString()}#materiales`}
                    >
                      <Layers
                        aria-hidden="true"
                        size={13}
                      />
                      Configurar materiales
                    </Link>
                  </div>
                ),
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}