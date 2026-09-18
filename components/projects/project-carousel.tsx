"use client";

import { ArrowLeft, ArrowRight, Maximize2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { ProjectDetailsModal } from "@/components/projects/project-details-modal";
import type { PortfolioProject } from "@/components/projects/portfolio-project";

type ProjectCarouselProps = {
  projects: readonly PortfolioProject[];
};

export function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const [currentIndex, setCurrentIndex] = useState(() =>
    Math.floor((projects.length - 1) / 2),
  );

  const [selectedProject, setSelectedProject] =
    useState<PortfolioProject | null>(null);

  const closeProject = useCallback(
    () => setSelectedProject(null),
    [],
  );

  const applyTransforms = useCallback(
    (liveIndex: number) => {
      const track = trackRef.current;

      if (!track) {
        return;
      }

      const items = track.querySelectorAll<HTMLElement>(
        "[data-project-card]",
      );

      items.forEach((item, i) => {
        const distance = i - liveIndex;
        const absolute = Math.abs(distance);
        const direction = Math.sign(distance);

        const x =
          distance * 62 +
          direction * Math.min(absolute, 1) * 46;

        const rotate = Math.min(
          34,
          Math.max(-34, -distance * 26),
        );

        const z = -absolute * 130;
        const scale = Math.max(0.72, 1 - absolute * 0.14);
        const opacity =
          absolute > 3 ? 0 : Math.max(0, 1 - absolute * 0.32);

        item.style.transform = `translate3d(${x}%, 0%, ${z}px) rotateY(${-rotate}deg) scale(${scale})`;
        item.style.opacity = String(opacity);
        item.style.zIndex = String(100 - Math.round(absolute));
        item.style.pointerEvents =
          absolute > 3 ? "none" : "auto";
      });
    },
    [],
  );

  useEffect(() => {
    applyTransforms(currentIndex);
  }, [currentIndex, applyTransforms]);

  useEffect(() => {
    function handleResize() {
      applyTransforms(currentIndex);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentIndex, applyTransforms]);

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex(
        Math.min(projects.length - 1, Math.max(0, index)),
      );
    },
    [projects.length],
  );

  const dragStartX = useRef<number | null>(null);

  const handlePointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    dragStartX.current = event.clientX;
  };

  const handlePointerUp = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (dragStartX.current === null) {
      return;
    }

    const dx = event.clientX - dragStartX.current;
    dragStartX.current = null;

    if (Math.abs(dx) > 40) {
      goTo(currentIndex + (dx < 0 ? 1 : -1));
    }
  };

  const wheelLock = useRef(false);

  const handleWheel = (
    event: React.WheelEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();

    if (wheelLock.current) {
      return;
    }

    wheelLock.current = true;
    goTo(currentIndex + (event.deltaY > 0 || event.deltaX > 0 ? 1 : -1));

    window.setTimeout(() => {
      wheelLock.current = false;
    }, 420);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(currentIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(currentIndex + 1);
    }
  };

  if (projects.length === 0) {
    return null;
  }

  return (
    <>
      <div>
        <div className="mb-5 flex items-center justify-between gap-4">
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.17em] text-ivory/45">
            Seleccioná un proyecto para conocerlo
          </p>

          <div className="flex gap-2">
            <button
              aria-label="Ver proyecto anterior"
              className="grid size-10 place-items-center rounded-full border border-white/15 bg-white/5 text-ivory transition hover:border-terracotta/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta disabled:cursor-not-allowed disabled:opacity-30"
              disabled={currentIndex === 0}
              onClick={() => goTo(currentIndex - 1)}
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
              className="grid size-10 place-items-center rounded-full border border-white/15 bg-white/5 text-ivory transition hover:border-terracotta/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta disabled:cursor-not-allowed disabled:opacity-30"
              disabled={currentIndex === projects.length - 1}
              onClick={() => goTo(currentIndex + 1)}
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
          aria-label="Proyectos"
          className="relative h-[26rem] cursor-grab touch-pan-y select-none [perspective:1600px] active:cursor-grabbing sm:h-[30rem]"
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onWheel={handleWheel}
          ref={trackRef}
          role="region"
          tabIndex={0}
        >
          {projects.map((project, index) => (
            <button
              aria-label={`Ver detalles de ${project.title}`}
              className="absolute left-1/2 top-1/2 w-[68vw] max-w-[19rem] overflow-hidden rounded-[1.1rem] border border-white/15 bg-blueprint text-left text-ivory shadow-[0_2rem_4.5rem_rgb(11_38_55/0.4)] transition-[transform,opacity] duration-500 [aspect-ratio:3/4] [transform-style:preserve-3d] sm:max-w-[21rem]"
              data-project-card
              key={project.slug}
              onClick={() => {
                if (index === currentIndex) {
                  setSelectedProject(project);
                } else {
                  goTo(index);
                }
              }}
              style={{
                marginLeft: "calc(min(68vw, 19rem) / -2)",
                marginTop:
                  "calc(min(68vw, 19rem) * 4 / 3 / -2)",
              }}
              type="button"
            >
              <div className="relative size-full overflow-hidden bg-blueprint-deep">
                {project.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt={project.title}
                    className="absolute inset-0 size-full object-cover"
                    src={project.images[0]}
                  />
                ) : null}

                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgb(11_38_55/0.82)_100%)]"
                />

                <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">
                  <span className="rounded-full border border-white/20 bg-blueprint-deep/55 px-3 py-1.5 text-[0.54rem] font-semibold uppercase tracking-[0.15em] backdrop-blur-md">
                    {project.category}
                  </span>

                  {project.zodiacSign ? (
                    <span className="rounded-full border border-sage/30 bg-sage/20 px-3 py-1.5 text-[0.54rem] font-semibold uppercase tracking-[0.15em] text-sage backdrop-blur-md">
                      {project.zodiacSign}
                    </span>
                  ) : null}
                </div>

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
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          {projects.map((project, index) => (
            <button
              aria-current={index === currentIndex}
              aria-label={`Ir al proyecto ${project.title}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-6 bg-terracotta"
                  : "w-1.5 bg-white/25 hover:bg-white/45"
              }`}
              key={project.slug}
              onClick={() => goTo(index)}
              type="button"
            />
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