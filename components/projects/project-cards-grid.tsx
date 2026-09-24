"use client";

import { useCallback, useState } from "react";
import { Boxes, LineChart, Maximize2 } from "lucide-react";

import { ProjectDetailsModal } from "@/components/projects/project-details-modal";
import type { PortfolioProject } from "@/components/projects/portfolio-project";

type ProjectCardsGridProps = {
  projects: readonly PortfolioProject[];
};

export function ProjectCardsGrid({
  projects,
}: ProjectCardsGridProps) {
  const [selectedProject, setSelectedProject] =
    useState<PortfolioProject | null>(null);

  const closeProject = useCallback(
    () => setSelectedProject(null),
    [],
  );

  if (projects.length === 0) {
    return (
      <p className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-sm text-white/50">
        Todavía no hay proyectos publicados.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <button
            aria-label={`Ver detalles de ${project.title}`}
            className="group relative overflow-hidden rounded-[1.25rem] border border-white/15 bg-[#0c2438] text-left text-white shadow-[0_1.5rem_4rem_rgb(0_0_0/0.28)] transition-transform duration-300 hover:-translate-y-1 [aspect-ratio:4/5]"
            key={project.slug}
            onClick={() =>
              setSelectedProject(project)
            }
            type="button"
          >
            <div className="relative size-full overflow-hidden bg-[#071d31]">
              {project.images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt={project.title}
                  className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  src={project.images[0]}
                />
              ) : null}

              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgb(7_29_49/0.88)_100%)]"
              />

              <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
                <span className="rounded-full border border-white/20 bg-[#071d31]/70 px-3 py-1.5 text-[0.54rem] font-semibold uppercase tracking-[0.15em] backdrop-blur-md">
                  {project.category}
                </span>

                {project.bimSlug ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#77a8c1]/40 bg-[#77a8c1]/15 px-3 py-1.5 text-[0.54rem] font-semibold uppercase tracking-[0.15em] text-[#9dc3d5] backdrop-blur-md">
                    <Boxes
                      aria-hidden="true"
                      size={11}
                      strokeWidth={1.8}
                    />
                    3D
                  </span>
                ) : null}

                {project.has5D ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-sage/40 bg-sage/15 px-3 py-1.5 text-[0.54rem] font-semibold uppercase tracking-[0.15em] text-sage backdrop-blur-md">
                    <LineChart
                      aria-hidden="true"
                      size={11}
                      strokeWidth={1.8}
                    />
                    5D
                  </span>
                ) : null}
              </div>

              <span className="absolute right-4 top-4 grid size-9 place-items-center rounded-full border border-white/20 bg-[#071d31]/70 backdrop-blur-md">
                <Maximize2
                  aria-hidden="true"
                  size={15}
                  strokeWidth={1.5}
                />
              </span>

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className="text-[0.56rem] font-semibold uppercase tracking-[0.16em] text-sage">
                  {project.number}
                  {project.year
                    ? ` · ${project.year}`
                    : ""}
                </span>

                <h3 className="mt-2 font-sans text-lg font-medium leading-tight tracking-[-0.02em] sm:text-xl">
                  {project.title}
                </h3>
              </div>
            </div>
          </button>
        ))}
      </div>

      <ProjectDetailsModal
        onClose={closeProject}
        project={selectedProject}
      />
    </>
  );
}