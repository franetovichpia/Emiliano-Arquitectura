import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Boxes,
} from "lucide-react";

import { BimViewerLoader } from "@/components/three/bim-viewer-loader";
import { ConstructionProgressChart } from "@/components/projects/construction-progress-chart";
import { ExportProgressPdfButton } from "@/components/projects/export-progress-pdf-button";
import { Container } from "@/app/container";
import {
  getPublicProjectBySlug,
  listConstructionProgress,
  listPublicBimProjects,
} from "@/lib/db/collections";
import { getPublicUrl } from "@/lib/storage/r2-client";
import { formatFileSize } from "@/utils/format";

type ModelViewerPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const projects = await listPublicBimProjects();

  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: ModelViewerPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);

  if (!project || !project.hasIfc || !project.bimModel) {
    return {
      title: "Modelo no disponible",
    };
  }

  return {
    title: `${project.title} — Modelo 3D`,
    description: `Visualización OpenBIM del modelo ${project.title}.`,
  };
}

export default async function ModelViewerPage({
  params,
}: ModelViewerPageProps) {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);

  if (!project || !project.hasIfc || !project.bimModel) {
    notFound();
  }

  const { bimModel } = project;

  const storageKey =
    bimModel.ifcStorageKey ?? bimModel.fragStorageKey;

  if (!storageKey) {
    notFound();
  }

  const modelUrl = getPublicUrl("bim", storageKey);
  const modelSize = formatFileSize(bimModel.fileSizeBytes);

  const manualProgressEntries =
    await listConstructionProgress(
      project._id.toString(),
    );

  const categoryProgressEntries = Object.entries(
    bimModel.categoryProgress ?? {},
  ).map(([category, entry]) => ({
    id: category,
    stageName: category,
    plannedPercentage: 100,
    actualPercentage: entry.actualPercentage,
    paidPercentage: entry.paidPercentage,
  }));

  const progressEntries =
    project.progressSource === "bim-categorias"
      ? categoryProgressEntries
      : manualProgressEntries.map((entry) => ({
          id: entry._id.toString(),
          stageName: entry.stageName,
          plannedPercentage:
            entry.plannedPercentage,
          actualPercentage:
            entry.actualPercentage,
          paidPercentage: entry.paidPercentage,
          notes: entry.notes,
        }));

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#071d31] text-[#f7f2e8]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(140, 190, 215, 0.22) 1px, transparent 1px),
            linear-gradient(90deg, rgba(140, 190, 215, 0.22) 1px, transparent 1px)
          `,
          backgroundSize: "5rem 5rem",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 top-20 size-[38rem] rounded-full border border-[#7fb0c8]/20"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-44 size-[28rem] rounded-full border border-[#7fb0c8]/15"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 bottom-0 size-[32rem] rounded-full bg-[#c56f4e]/10 blur-[9rem]"
      />

      <Container className="relative pb-8 pt-32 sm:pb-12 sm:pt-36">
        <div className="mb-7 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <Link
              className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-white/65 backdrop-blur-xl transition-colors duration-300 hover:border-[#ca7555]/50 hover:bg-white/[0.1] hover:text-white"
              href="/"
            >
              <ArrowLeft
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:-translate-x-1"
                size={15}
                strokeWidth={1.6}
              />

              Volver a la página profesional
            </Link>

            <p className="mt-7 text-[0.63rem] font-semibold uppercase tracking-[0.19em] text-[#d17c5b]">
              {project.subtitle ?? "Modelo BIM autogestionado"}
            </p>

            <h1 className="mt-3 max-w-4xl font-serif text-[clamp(2.8rem,5vw,5.5rem)] leading-[0.95] tracking-[-0.04em] text-[#f7f2e8]">
              {project.title}
            </h1>
          </div>

          <div className="flex flex-wrap gap-2 lg:col-span-4 lg:justify-end">
            <div className="inline-flex min-h-11 items-center gap-3 rounded-full border border-white/15 bg-white/[0.07] px-4 backdrop-blur-xl">
              <Boxes
                aria-hidden="true"
                className="text-[#d17c5b]"
                size={17}
                strokeWidth={1.5}
              />

              <span className="text-[0.59rem] font-semibold uppercase tracking-[0.14em] text-white/65">
                OpenBIM
              </span>
            </div>

            <div className="inline-flex min-h-11 items-center rounded-full border border-white/15 bg-white/[0.07] px-4 backdrop-blur-xl">
              <span className="text-[0.59rem] font-semibold uppercase tracking-[0.14em] text-white/65">
                {bimModel.ifcSchema ?? "IFC"}
                {modelSize ? ` · ${modelSize}` : ""}
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[1.75rem] border border-white/15 bg-[#071d31] shadow-[0_2.5rem_8rem_rgb(0_0_0/0.35)]">
          <BimViewerLoader
            materialOverrides={bimModel.materialOverrides}
            materials={bimModel.materials}
            modelFormat={bimModel.format}
            modelName={project.title}
            modelUrl={modelUrl}
          />
        </div>

        {progressEntries.length > 0 ? (
          <div
            className="mt-8 scroll-mt-28"
            id="avance-obra"
          >
            <div className="mb-3 flex justify-end">
              <ExportProgressPdfButton
                entries={progressEntries.map(
                  (entry) => ({
                    stageName: entry.stageName,
                    plannedPercentage:
                      entry.plannedPercentage,
                    actualPercentage:
                      entry.actualPercentage,
                    paidPercentage:
                      entry.paidPercentage,
                  }),
                )}
                projectTitle={project.title}
              />
            </div>

            <ConstructionProgressChart
              chartType={project.progressChartType}
              entries={progressEntries}
              groupLabel={
                project.progressSource ===
                "bim-categorias"
                  ? "categoría"
                  : "etapa"
              }
            />
          </div>
        ) : null}
      </Container>
    </main>
  );
}