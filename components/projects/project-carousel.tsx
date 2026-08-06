"use client";

import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Maximize2,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { ProjectDetailsModal } from "@/components/projects/project-details-modal";
import type { ProfessionalProject } from "@/data/professional-projects";

type ProjectCarouselProps = {
  projects: readonly ProfessionalProject[];
};

export function ProjectCarousel({
  projects,
}: ProjectCarouselProps) {
  const carouselRef =
    useRef<HTMLDivElement>(null);

  const [selectedProject, setSelectedProject] =
    useState<ProfessionalProject | null>(null);

  const [isPaused, setIsPaused] =
    useState(false);

  const closeProject = useCallback(() => {
    setSelectedProject(null);
  }, []);

  const moveCarousel = useCallback(
    (direction: 1 | -1) => {
      const carousel = carouselRef.current;

      if (!carousel) {
        return;
      }

      const firstCard =
        carousel.querySelector<HTMLElement>(
          "[data-project-card]",
        );

      const cardWidth =
        firstCard?.offsetWidth ??
        carousel.clientWidth * 0.8;

      const gap = 16;
      const distance =
        (cardWidth + gap) * direction;

      const maximumScroll =
        carousel.scrollWidth -
        carousel.clientWidth;

      const nextPosition =
        carousel.scrollLeft + distance;

      if (
        direction === 1 &&
        nextPosition >= maximumScroll - 8
      ) {
        carousel.scrollTo({
          left: 0,
          behavior: "smooth",
        });

        return;
      }

      if (
        direction === -1 &&
        nextPosition <= 0
      ) {
        carousel.scrollTo({
          left: maximumScroll,
          behavior: "smooth",
        });

        return;
      }

      carousel.scrollBy({
        left: distance,
        behavior: "smooth",
      });
    },
    [],
  );

  useEffect(() => {
    const prefersReducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

    if (
      isPaused ||
      selectedProject ||
      prefersReducedMotion
    ) {
      return;
    }

    const intervalId = window.setInterval(() => {
      moveCarousel(1);
    }, 5500);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [
    isPaused,
    moveCarousel,
    selectedProject,
  ]);

  return (
    <>
      <div
        onBlurCapture={(event) => {
          const nextFocusedElement =
            event.relatedTarget as Node | null;

          if (
            !event.currentTarget.contains(
              nextFocusedElement,
            )
          ) {
            setIsPaused(false);
          }
        }}
        onFocusCapture={() => setIsPaused(true)}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.17em] text-ivory/45">
            Seleccioná un proyecto para conocerlo
          </p>

          <div className="flex gap-2">
            <button
              aria-label="Ver proyecto anterior"
              className="grid size-10 place-items-center rounded-full border border-white/15 bg-white/5 text-ivory transition hover:border-terracotta/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
              onClick={() => moveCarousel(-1)}
              type="button"
            >
              <ArrowLeft
                aria-hidden="true"
                size={17}
                strokeWidth={1.5}
              />
            </button>

            <button
              aria-label="Ver proyecto siguiente"
              className="grid size-10 place-items-center rounded-full border border-white/15 bg-white/5 text-ivory transition hover:border-terracotta/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
              onClick={() => moveCarousel(1)}
              type="button"
            >
              <ArrowRight
                aria-hidden="true"
                size={17}
                strokeWidth={1.5}
              />
            </button>
          </div>
        </div>

        <div
          aria-label="Proyectos profesionales"
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          ref={carouselRef}
          role="region"
        >
          {projects.map((project) => (
            <button
              aria-label={`Ver detalles de ${project.title}`}
              className="group relative w-[82vw] max-w-[23rem] flex-none snap-start overflow-hidden rounded-[1.25rem] border border-white/15 bg-blueprint text-left text-ivory shadow-[0_1rem_3rem_rgb(0_0_0/0.18)] transition duration-500 hover:-translate-y-1 hover:border-terracotta/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
              data-project-card
              key={project.slug}
              onClick={() =>
                setSelectedProject(project)
              }
              type="button"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  alt={project.coverAlt}
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                  fill
                  sizes="(max-width: 640px) 82vw, 368px"
                  src={project.coverImage}
                />

                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgb(11_38_55/0.82)_100%)]"
                />

                <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-blueprint-deep/55 px-3 py-1.5 text-[0.54rem] font-semibold uppercase tracking-[0.15em] backdrop-blur-md">
                  {project.category}
                </span>

                <span className="absolute right-4 top-4 grid size-9 place-items-center rounded-full border border-white/20 bg-blueprint-deep/55 backdrop-blur-md">
                  <Maximize2
                    aria-hidden="true"
                    size={15}
                    strokeWidth={1.5}
                  />
                </span>

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="text-[0.56rem] font-semibold uppercase tracking-[0.16em] text-sage">
                    {project.number} · {project.year}
                  </span>

                  <h3 className="mt-2 font-sans text-xl font-medium leading-tight tracking-[-0.025em] sm:text-2xl">
                    {project.title}
                  </h3>

                  <p className="mt-2 text-xs text-ivory/60">
                    {project.location}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <ProjectDetailsModal
        onClose={closeProject}
        project={selectedProject}
      />
    </>
  );
}
