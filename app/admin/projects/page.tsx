import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";

import { ProjectCreatedBanner } from "@/components/admin/project-created-banner";
import { ProjectsListClient } from "@/components/admin/projects-list-client";
import { requireAdminSession } from "@/lib/auth/session";
import { listAdminProjects } from "@/lib/db/collections";

export const metadata: Metadata = {
  title: "Proyectos",
  robots: {
    index: false,
    follow: false,
  },
};

type AdminProjectsPageProps = {
  searchParams: Promise<{
    created?: string;
  }>;
};

export default async function AdminProjectsPage({
  searchParams,
}: AdminProjectsPageProps) {
  const session = await requireAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const resolvedSearchParams = await searchParams;
  const projects = await listAdminProjects();

  const projectItems = projects.map(
    (project) => ({
      id: project._id.toString(),
      title: project.title,
      slug: project.slug,
      categorySlug: project.categorySlug,
      status: project.status,
      createdAt:
        project.createdAt.toISOString(),
    }),
  );

  return (
    <main className="min-h-screen bg-[#071d31] px-4 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <ProjectCreatedBanner
          show={
            resolvedSearchParams.created ===
            "1"
          }
        />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.17em] text-terracotta">
              Panel de administración
            </p>

            <h1 className="mt-4 font-sans text-3xl font-light tracking-[-0.025em] text-paper">
              Proyectos
            </h1>
          </div>

          <Link
            className="glass-interactive inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-terracotta px-5 text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-white"
            href="/admin/projects/new"
          >
            <Plus
              aria-hidden="true"
              size={15}
              strokeWidth={2}
            />
            Nuevo proyecto
          </Link>
        </div>

        <div className="mt-6">
          <ProjectsListClient
            projects={projectItems}
          />
        </div>

        <div className="mt-10">
          <Link
            className="text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-white/40 hover:text-white/70"
            href="/admin"
          >
            ← Volver al panel
          </Link>
        </div>
      </div>
    </main>
  );
}