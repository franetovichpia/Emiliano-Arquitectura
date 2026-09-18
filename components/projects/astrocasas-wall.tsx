"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import { ProjectDetailsModal } from "@/components/projects/project-details-modal";
import type { PortfolioProject } from "@/components/projects/portfolio-project";

type AstrocasasWallProps = {
  projects: readonly PortfolioProject[];
};

type WallItem = {
  key: string;
  sign: string;
  label: string;
  project: PortfolioProject | null;
};

const ZODIAC_ORDER = [
  "aries",
  "tauro",
  "geminis",
  "cancer",
  "leo",
  "virgo",
  "libra",
  "escorpio",
  "sagitario",
  "capricornio",
  "acuario",
  "piscis",
] as const;

const ZODIAC_LABELS: Record<string, string> = {
  aries: "Aries",
  tauro: "Tauro",
  geminis: "Géminis",
  cancer: "Cáncer",
  leo: "Leo",
  virgo: "Virgo",
  libra: "Libra",
  escorpio: "Escorpio",
  sagitario: "Sagitario",
  capricornio: "Capricornio",
  acuario: "Acuario",
  piscis: "Piscis",
};

const ZODIAC_PATHS: Record<string, string> = {
  aries: "M20,70 C20,40 35,25 50,48 C65,25 80,40 80,70",
  tauro:
    "M50,80 A22,22 0 1 0 49.9,80 M25,45 C15,20 35,8 50,30 C65,8 85,20 75,45",
  geminis: "M20,20 L80,20 M20,80 L80,80 M32,20 L32,80 M68,20 L68,80",
  cancer:
    "M25,35 A12,12 0 1 1 25,35.1 M35,45 C35,65 65,65 65,45 M75,65 A12,12 0 1 1 75,65.1",
  leo: "M65,32 A14,14 0 1 1 64.9,32 M65,46 C65,70 40,78 28,68 C20,60 24,50 32,52",
  virgo:
    "M20,25 L20,65 C20,75 32,75 32,65 L32,25 M32,65 C32,75 44,75 44,65 L44,25 M44,45 C44,75 56,75 56,60 C60,75 78,80 80,60 C82,45 65,42 60,55",
  libra: "M20,60 L80,60 M50,60 L50,25 M28,30 L72,30 M50,75 L50,85 M35,85 L65,85",
  escorpio:
    "M20,25 L20,65 C20,75 32,75 32,65 L32,25 M32,65 C32,75 44,75 44,65 L44,25 M44,45 L44,62 L75,80 M64,80 L75,80 L75,70",
  sagitario: "M22,78 L78,22 M55,22 L78,22 L78,45 M40,60 L58,42",
  capricornio:
    "M20,25 C20,55 35,55 38,40 C40,30 30,25 28,35 M38,45 C38,65 55,70 60,55 A14,14 0 1 0 59.9,55.3",
  acuario: "M15,38 L30,48 L45,38 L60,48 L75,38 M15,62 L30,72 L45,62 L60,72 L75,62",
  piscis: "M32,18 C15,35 15,65 32,82 M68,18 C85,35 85,65 68,82 M18,50 L82,50",
};

const LABEL_TO_SIGN: Record<string, string> =
  Object.fromEntries(
    Object.entries(ZODIAC_LABELS).map(
      ([sign, label]) => [
        label.toLowerCase(),
        sign,
      ],
    ),
  );

function normalizeSign(
  value: string | undefined,
): string | null {
  if (!value) {
    return null;
  }

  const key = value.trim().toLowerCase();

  if (LABEL_TO_SIGN[key]) {
    return LABEL_TO_SIGN[key];
  }

  return (
    ZODIAC_ORDER as readonly string[]
  ).includes(key)
    ? key
    : null;
}

function ZodiacGlyph({
  sign,
  className,
}: {
  sign: string;
  className?: string;
}) {
  const path = ZODIAC_PATHS[sign];

  if (!path) {
    return null;
  }

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={5.5}
      viewBox="0 0 100 100"
    >
      <path d={path} />
    </svg>
  );
}

export function AstrocasasWall({
  projects,
}: AstrocasasWallProps) {
  const isPlaceholder = projects.length === 0;

  const items: WallItem[] = isPlaceholder
    ? ZODIAC_ORDER.map((sign) => ({
        key: sign,
        sign,
        label: ZODIAC_LABELS[sign],
        project: null,
      }))
    : projects.map((project) => {
        const sign =
          normalizeSign(project.zodiacSign) ??
          "aries";

        return {
          key: project.slug,
          sign,
          label: ZODIAC_LABELS[sign],
          project,
        };
      });

  const trackRef = useRef<HTMLDivElement | null>(
    null,
  );

  const stageRef = useRef<HTMLDivElement | null>(
    null,
  );

  const itemRefs = useRef<
    (HTMLDivElement | null)[]
  >([]);

  const [currentIndex, setCurrentIndex] = useState(
    () => Math.floor((items.length - 1) / 2),
  );

  const [selectedProject, setSelectedProject] =
    useState<PortfolioProject | null>(null);

  const closeProject = useCallback(
    () => setSelectedProject(null),
    [],
  );

  const offsetForIndex = useCallback(
    (index: number) => {
      const stage = stageRef.current;
      const item = itemRefs.current[index];

      if (!stage || !item) {
        return 0;
      }

      const stageCenter = stage.clientWidth / 2;

      const itemCenter =
        item.offsetLeft + item.offsetWidth / 2;

      return stageCenter - itemCenter;
    },
    [],
  );

  const applyOffset = useCallback(
    (offset: number, animate: boolean) => {
      const track = trackRef.current;

      if (!track) {
        return;
      }

      track.style.transition = animate
        ? "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)"
        : "none";

      track.style.transform = `translate3d(${offset}px, 0, 0)`;
    },
    [],
  );

  const render = useCallback(() => {
    applyOffset(offsetForIndex(currentIndex), true);
  }, [currentIndex, offsetForIndex, applyOffset]);

  useEffect(() => {
    render();
  }, [render]);

  useEffect(() => {
    window.addEventListener("resize", render);
    return () =>
      window.removeEventListener("resize", render);
  }, [render]);

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex(
        Math.min(
          items.length - 1,
          Math.max(0, index),
        ),
      );
    },
    [items.length],
  );

  const DRAG_THRESHOLD = 6;

  const dragState = useRef({
    dragging: false,
    captured: false,
    pointerId: 0,
    startX: 0,
    startOffset: 0,
  });

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    dragState.current = {
      dragging: true,
      captured: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      startOffset: offsetForIndex(currentIndex),
    };
  };

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (!dragState.current.dragging) {
      return;
    }

    const dx =
      event.clientX - dragState.current.startX;

    if (!dragState.current.captured) {
      if (Math.abs(dx) < DRAG_THRESHOLD) {
        return;
      }

      dragState.current.captured = true;

      stageRef.current?.setPointerCapture(
        dragState.current.pointerId,
      );
    }

    applyOffset(
      dragState.current.startOffset + dx,
      false,
    );
  };

  const handlePointerUp = (
    event: ReactPointerEvent<HTMLDivElement>,
  ) => {
    if (!dragState.current.dragging) {
      return;
    }

    dragState.current.dragging = false;

    if (!dragState.current.captured) {
      return;
    }

    const dx =
      event.clientX - dragState.current.startX;

    const referenceItem =
      itemRefs.current[1] ??
      itemRefs.current[0];

    const step = referenceItem
      ? referenceItem.offsetWidth + 32
      : 200;

    goTo(currentIndex - Math.round(dx / step));
  };

  return (
    <>
      <div
        className="relative overflow-hidden py-6"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        ref={stageRef}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-paper to-transparent sm:w-28"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-paper to-transparent sm:w-28"
        />

        <div
          className="flex cursor-grab touch-pan-y select-none items-center gap-8 px-[40vw] active:cursor-grabbing sm:gap-10"
          ref={trackRef}
        >
          {items.map((item, index) => {
            const isActive = index === currentIndex;
            const imageUrl =
              item.project?.images[0];

            return (
              <div
                className="w-56 shrink-0 sm:w-64"
                key={item.key}
                ref={(element) => {
                  itemRefs.current[index] =
                    element;
                }}
              >
                <button
                  aria-label={
                    item.project
                      ? `Ver detalles de ${item.project.title}`
                      : item.label
                  }
                  className={`group relative block aspect-[3/4] w-full overflow-hidden rounded-lg border-[10px] border-paper bg-ink shadow-[0_1.5rem_3rem_rgb(11_38_55/0.22)] transition-all duration-500 ${
                    isActive
                      ? "scale-100 opacity-100"
                      : "scale-90 opacity-50"
                  }`}
                  onClick={() => {
                    if (index !== currentIndex) {
                      goTo(index);
                      return;
                    }

                    if (item.project) {
                      setSelectedProject(
                        item.project,
                      );
                    }
                  }}
                  type="button"
                >
                  {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt={
                        item.project?.title ??
                        item.label
                      }
                      className="absolute inset-0 size-full object-cover"
                      src={imageUrl}
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center bg-blueprint-deep text-sage/70">
                      <ZodiacGlyph
                        className="size-24"
                        sign={item.sign}
                      />
                    </div>
                  )}

                  {imageUrl ? (
                    <span className="absolute bottom-3 right-3 grid size-9 place-items-center rounded-full border border-white/25 bg-blueprint-deep/60 text-ivory backdrop-blur-md">
                      <ZodiacGlyph
                        className="size-5"
                        sign={item.sign}
                      />
                    </span>
                  ) : null}

                  {item.project ? (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-left">
                      <p className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-sage">
                        {item.label}
                      </p>

                      <p className="mt-1 font-sans text-sm font-medium text-ivory">
                        {item.project.title}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-14 top-7 z-10 w-52 rotate-45 bg-terracotta py-1.5 text-center text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-ivory shadow-[0_0.5rem_1rem_rgb(0_0_0/0.25)]"
                      >
                        Próximamente
                      </div>

                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-left">
                        <p className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-sage">
                          {item.label}
                        </p>
                      </div>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        {items.map((item, index) => (
          <button
            aria-current={index === currentIndex}
            aria-label={`Ir a ${item.label}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "w-6 bg-terracotta"
                : "w-1.5 bg-forest-deep/20 hover:bg-forest-deep/40"
            }`}
            key={item.key}
            onClick={() => goTo(index)}
            type="button"
          />
        ))}
      </div>

      <ProjectDetailsModal
        onClose={closeProject}
        project={selectedProject}
      />
    </>
  );
}