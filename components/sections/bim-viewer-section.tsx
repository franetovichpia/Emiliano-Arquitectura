import Link from "next/link";
import { ArrowUpRight, Boxes } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/app/container";

export function BimViewerSection() {
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

      <Container className="relative py-24 sm:py-28 lg:py-32">
        <Reveal>
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-blueprint-deep text-ivory shadow-[0_2rem_6rem_rgb(11_38_55/0.2)]">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.13] [background-image:linear-gradient(rgb(131_174_190/0.7)_1px,transparent_1px),linear-gradient(90deg,rgb(131_174_190/0.7)_1px,transparent_1px)] [background-size:42px_42px]"
            />

            <svg
              aria-hidden="true"
              className="absolute inset-0 h-full w-full opacity-40"
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

            <div className="relative flex flex-col gap-8 p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between lg:p-14">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-sage backdrop-blur-xl">
                  <Boxes
                    aria-hidden="true"
                    size={15}
                    strokeWidth={1.5}
                  />

                  Visualización arquitectónica
                </div>

                <h2
                  className="mt-5 font-serif text-[clamp(2.2rem,4.2vw,3.4rem)] leading-[0.98] tracking-[-0.03em] text-paper"
                  id="bim-viewer-heading"
                >
                  Dimensión 3D.
                </h2>

                <p className="mt-4 max-w-md text-sm leading-7 text-ivory/60 sm:text-base">
                  Explorá los proyectos con modelo arquitectónico abierto en
                  una experiencia OpenBIM independiente.
                </p>
              </div>

              <Link
                aria-label="Explorar todos los proyectos con dimensión 3D"
                className="group/link inline-flex min-h-12 shrink-0 items-center gap-3 rounded-full bg-terracotta px-7 py-3.5 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-ivory transition duration-300 hover:-translate-y-0.5 hover:bg-terracotta/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-4 focus-visible:ring-offset-blueprint-deep"
                href="/proyectos?bim=1"
              >
                Explorar Dimensión 3D

                <ArrowUpRight
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                  size={16}
                  strokeWidth={1.5}
                />
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}