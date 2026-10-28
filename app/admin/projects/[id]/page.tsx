import type { Metadata } from "next";
import Link from "next/link";
import {
  notFound,
  redirect,
} from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { AdminProjectEditor } from "@/components/admin/admin-project-editor";
import { requireAdminSession } from "@/lib/auth/session";
import {
  getAdminProjectById,
  listConstructionProgress,
} from "@/lib/db/collections";
import { getPublicUrl } from "@/lib/storage/r2-client";

export const metadata: Metadata = {
  title: "Editar proyecto",
  robots: {
    index: false,
    follow: false,
  },
};

type AdminProjectPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminProjectPage({
  params,
}: AdminProjectPageProps) {
  const session = await requireAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const project = await getAdminProjectById(id);

  if (!project) {
    notFound();
  }

  const progressEntries =
    await listConstructionProgress(id);

  return (
    <main className="min-h-screen bg-[#071d31] px-4 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <Link
          className="inline-flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-white/40 hover:text-white/70"
          href="/admin/projects"
        >
          <ArrowLeft
            aria-hidden="true"
            size={14}
            strokeWidth={1.8}
          />
          Volver a proyectos
        </Link>

        <p className="mt-6 text-[0.65rem] font-semibold uppercase tracking-[0.17em] text-terracotta">
          {project.categorySlug}
        </p>

        <h1 className="mt-4 font-sans text-3xl font-light tracking-[-0.025em] text-paper">
          {project.title}
        </h1>

        <p className="mt-2 text-xs text-white/40">
          /modelos/{project.slug}
        </p>

        <div className="mt-10">
          <AdminProjectEditor
            categories={
              project.bimModel?.categories ?? []
            }
            hasIfc={project.hasIfc}
            initialAreaM2={project.areaM2}
            initialCategoryProgress={
              project.bimModel
                ?.categoryProgress ?? {}
            }
            initialChartType={
              project.progressChartType
            }
            initialClient={project.client}
            initialExternalLink={
              project.externalLink
            }
            initialLocation={project.location}
            initialMaterialOverrides={
              project.bimModel
                ?.materialOverrides ?? {}
            }
            initialSlug={project.slug}
            initialSource={
              project.progressSource ?? "manual"
            }
            initialStatus={project.status}
            initialSummary={project.summary}
            initialTitle={project.title}
            initialTools={project.tools}
            initialYearCompleted={
              project.yearCompleted
            }
            materials={
              project.bimModel?.materials ?? []
            }
            media={project.media.map((item) => ({
              id: item.id,
              title: item.title ?? "este archivo",
              url: getPublicUrl(
                "media",
                item.storageKey,
              ),
              isImage:
                item.mediaType === "imagen" ||
                item.mediaType === "render",
            }))}
            progressEntries={progressEntries.map(
              (entry) => ({
                id: entry._id.toString(),
                stageName: entry.stageName,
                plannedPercentage:
                  entry.plannedPercentage,
                actualPercentage:
                  entry.actualPercentage,
                paidPercentage:
                  entry.paidPercentage,
                notes: entry.notes,
              }),
            )}
            projectId={project._id.toString()}
            projectSlug={project.slug}
          />
        </div>
      </div>
    </main>
  );
}