import Link from "next/link";
import {
  ArrowUpRight,
  Boxes,
  Maximize2,
  RotateCcw,
  ScanLine,
} from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/app/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { bimProjects } from "@/data/bim-projects";
import { listPublicBimProjects } from "@/lib/db/collections";
import { formatFileSize } from "@/utils/format";

type BimShowcaseItem = {
  slug: string;
  number: string;
  title: string;
  label: string;
  schema: string;
  modelSize: string;
};

async function getShowcaseItems(): Promise<
  readonly BimShowcaseItem[]
> {
  const projects = await listPublicBimProjects();

  if (projects.length === 0) {
    return bimProjects;
  }

  return projects.map((project, index) => ({
    slug: project.slug,
    number: String(index + 1).padStart(2, "0"),
    title: project.title,
    label: project.subtitle ?? "Proyecto autogestionado",
    schema: project.bimModel?.ifcSchema ?? "IFC",
    modelSize:
      formatFileSize(project.bimModel?.fileSizeBytes) ??
      "—",
  }));
}

const viewerCapabilities = [
  {
    icon: Boxes,
    label: "Navegación orbital",
  },
  {
    icon: ScanLine,
    label: "Carga bajo demanda",
  },
  {
    icon: RotateCcw,
    label: "Ajuste de cámara",
  },
  {
    icon: Maximize2,
    label: "Pantalla completa",
  },
] as const;

export async function BimViewerSection() {
  const showcaseItems = await getShowcaseItems();

  return (
    <section
      aria-labelledby="bim-viewer-heading"
      className="relative overflow-hidden bg-paper text-forest-deep"
      id="visor-bim"
    >
      <div
        aria-hidden="true"
        className="absolute -right-40 top-0 size-[34rem] rounded-full bg-sage/20 blur-[9rem]"
      />

      <div
        aria-hidden="true"
        className="absolute -left-40 bottom-0 size-[30rem] rounded-full bg-blueprint-soft/15 blur-[9rem]"
      />

      <Container className="relative py-24 sm:py-28 lg:py-36">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHeading
                eyebrow="Visualización arquitectónica"
                id="bim-viewer-heading"
                title="Dimensión 3D."
              />
            </Reveal>
          </div>

          <div className="flex items-end lg:col-span-7 lg:pl-8">
            <Reveal delay={0.08}>
              <div className="max-w-3xl">
                <p className="font-sans text-[clamp(1.55rem,2.7vw,3rem)] font-light leading-relaxed tracking-[-0.025em] text-forest-deep">
                  Arquitectura explorada desde el modelo.
                </p>

                <p className="mt-6 max-w-2xl text-sm leading-8 text-forest-deep/60 sm:text-base">
                  Seleccioná un proyecto para abrir su modelo arquitectónico
                  en una experiencia OpenBIM independiente.
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal
          className="mt-14"
          delay={0.12}
        >
          <ul
            aria-label="Funciones del visor"
            className="flex flex-wrap gap-2"
          >
            {viewerCapabilities.map((capability) => {
              const Icon = capability.icon;

              return (
                <li
                  className="inline-flex items-center gap-2 rounded-full border border-forest-deep/10 bg-white/35 px-4 py-2 text-[0.6rem] font-medium uppercase tracking-[0.12em] text-forest-deep/55 backdrop-blur-xl"
                  key={capability.label}
                >
                  <Icon
                    aria-hidden="true"
                    size={14}
                    strokeWidth={1.5}
                  />

                  {capability.label}
                </li>
              );
            })}
          </ul>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {showcaseItems.map((project, index) => (
            <Reveal
              delay={0.14 + index * 0.08}
              key={project.slug}
            >
              <article className="group relative min-h-[24rem] overflow-hidden rounded-[1.75rem] border border-white/15 bg-blueprint-deep text-ivory shadow-[0_2rem_6rem_rgb(11_38_55/0.2)]">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-[0.13] [background-image:linear-gradient(rgb(131_174_190/0.7)_1px,transparent_1px),linear-gradient(90deg,rgb(131_174_190/0.7)_1px,transparent_1px)] [background-size:42px_42px]"
                />

                <svg
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full opacity-55 transition-transform duration-700 group-hover:scale-[1.025]"
                  fill="none"
                  preserveAspectRatio="xMidYMid slice"
                  viewBox="0 0 800 500"
                >
                  <g
                    stroke="#faf7ef"
                    strokeWidth="1.2"
                  >
                    <path d="M95 395 213 151 488 85 704 220 676 395Z" />
                    <path d="M213 151 239 395" />
                    <path d="M488 85 480 395" />
                    <path d="M704 220 594 395" />
                    <path d="M190 205 682 249" />
                    <path d="M163 262 652 302" />
                    <path d="M136 320 622 348" />
                    <path d="M285 134 319 395" />
                    <path d="M366 115 389 395" />
                    <path d="M447 96 458 395" />
                    <path d="M557 130 532 395" />
                  </g>

                  <path
                    d="M95 395 213 151 488 85"
                    stroke="#879d7d"
                    strokeWidth="3"
                  />

                  <path
                    d="M488 85 704 220 676 395"
                    stroke="#c66f4e"
                    strokeWidth="3"
                  />
                </svg>

                <div className="relative flex min-h-[24rem] flex-col p-6 sm:p-8">
                  <div className="flex items-start justify-between gap-5">
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-sage backdrop-blur-xl">
                      <Boxes
                        aria-hidden="true"
                        size={15}
                        strokeWidth={1.5}
                      />

                      {project.label}
                    </div>

                    <span className="text-[0.62rem] font-medium tracking-[0.16em] text-ivory/40">
                      {project.number}
                    </span>
                  </div>

                  <div className="mt-auto pt-20">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.17em] text-blueprint-line">
                      {project.schema} · {project.modelSize}
                    </p>

                    <h3 className="mt-4 font-serif text-[clamp(2.6rem,5vw,4.8rem)] leading-none tracking-[-0.035em] text-paper">
                      {project.title}
                    </h3>

                    <Link
                      aria-label={`Abrir modelo 3D de ${project.title} en una pestaña nueva`}
                      className="group/link mt-8 inline-flex items-center gap-3 rounded-full bg-terracotta px-5 py-3 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-ivory transition duration-300 hover:-translate-y-0.5 hover:bg-terracotta/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-4 focus-visible:ring-offset-blueprint-deep"
                      href={`/modelos/${project.slug}`}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Explorar dimensión 3D

                      <ArrowUpRight
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                        size={16}
                        strokeWidth={1.5}
                      />
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}