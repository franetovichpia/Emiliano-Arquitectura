import type { Metadata } from "next";
import Link from "next/link";
import {
  notFound,
  redirect,
} from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { AdminProjectInfoForm } from "@/components/forms/admin-project-info-form";
import { ProjectBimMaterialsEditor } from "@/components/admin/project-bim-materials-editor";
import { ProjectBimUploader } from "@/components/admin/project-bim-uploader";
import { ProjectCategoryProgressEditor } from "@/components/admin/project-category-progress-editor";
import { ProjectMediaGrid } from "@/components/admin/project-media-grid";
import { ProjectMediaUploader } from "@/components/admin/project-media-uploader";
import { ProjectProgressChartTypeSelector } from "@/components/admin/project-progress-chart-type-selector";
import { ProjectProgressEditor } from "@/components/admin/project-progress-editor";
import { ProjectProgressSourceSelector } from "@/components/admin/project-progress-source-selector";
import { ProjectStatusForm } from "@/components/admin/project-status-form";
import { ProjectTitleSlugForm } from "@/components/admin/project-title-slug-form";
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

        <div className="mt-10 space-y-6">
          <ProjectStatusForm
            currentStatus={project.status}
            projectId={project._id.toString()}
          />

          <ProjectTitleSlugForm
            initialSlug={project.slug}
            initialTitle={project.title}
            projectId={project._id.toString()}
          />

          <AdminProjectInfoForm
            initialValues={{
              summary: project.summary,
              location: project.location,
              client: project.client,
              yearCompleted:
                project.yearCompleted,
              areaM2: project.areaM2,
              tools: project.tools,
              externalLink:
                project.externalLink,
            }}
            projectId={project._id.toString()}
          />

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-sage">
                Imágenes y documentos (
                {project.media.length})
              </p>

              <ProjectMediaUploader
                projectId={project._id.toString()}
                projectSlug={project.slug}
              />
            </div>

            <ProjectMediaGrid
              media={project.media.map((item) => ({
                id: item.id,
                title:
                  item.title ?? "este archivo",
                url: getPublicUrl(
                  "media",
                  item.storageKey,
                ),
                isImage:
                  item.mediaType === "imagen" ||
                  item.mediaType === "render",
              }))}
              projectId={project._id.toString()}
            />
          </div>

          <div
            className="scroll-mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5"
            id="materiales"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-sage">
                  Contenido BIM (3D)
                </p>

                <p className="mt-3 text-sm text-white/55">
                  {project.hasIfc
                    ? "Este proyecto tiene un modelo BIM cargado. Subir un nuevo archivo lo reemplaza."
                    : "Subí el archivo IFC de siempre: los materiales se detectan automáticamente."}
                </p>
              </div>

              <ProjectBimUploader
                hasIfc={project.hasIfc}
                projectId={project._id.toString()}
                projectSlug={project.slug}
              />
            </div>

            {project.bimModel &&
            project.bimModel.materials.length > 0 ? (
              <ProjectBimMaterialsEditor
                materials={
                  project.bimModel.materials
                }
                overrides={
                  project.bimModel
                    .materialOverrides
                }
                projectId={project._id.toString()}
              />
            ) : null}

            {project.bimModel &&
            (project.bimModel.categories?.length ?? 0) >
              0 ? (
              <ProjectCategoryProgressEditor
                categories={
                  project.bimModel.categories ?? []
                }
                progress={
                  project.bimModel
                    .categoryProgress ?? {}
                }
                projectId={project._id.toString()}
              />
            ) : null}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-sage">
                Avance de obra (5D)
              </p>

              <ProjectProgressChartTypeSelector
                currentChartType={
                  project.progressChartType
                }
                projectId={project._id.toString()}
              />
            </div>

            <div className="mt-4">
              <ProjectProgressSourceSelector
                currentSource={
                  project.progressSource ?? "manual"
                }
                hasCategories={Boolean(
                  project.bimModel &&
                    (project.bimModel.categories
                      ?.length ?? 0) > 0,
                )}
                projectId={project._id.toString()}
              />
            </div>

            <p className="mt-4 text-sm text-white/55">
              {project.progressSource ===
              "bim-categorias"
                ? "El gráfico público se calcula automáticamente a partir del avance cargado por categoría, arriba en Contenido BIM."
                : "Cargá el porcentaje de avance por etapa. Esto se muestra públicamente en la página del modelo."}
            </p>

            <ProjectProgressEditor
              entries={progressEntries.map(
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
            />
          </div>
        </div>
      </div>
    </main>
  );
}