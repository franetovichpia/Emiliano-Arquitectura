import { Link } from "next-view-transitions";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  Sprout,
} from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/app/container";
import { IntegrativeBlueprint } from "@/components/ui/integrative-blueprint";

export function CommunityHeroSection() {
  return (
    <section
      className="relative isolate min-h-[88svh] overflow-hidden bg-blueprint-deep text-ivory"
      id="inicio-integrativo"
    >
      {/* Rejilla blueprint general */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgb(201_220_227/0.16)_1px,transparent_1px),linear-gradient(90deg,rgb(201_220_227/0.16)_1px,transparent_1px)] [background-size:56px_56px]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_78%_30%,rgb(50_123_158/0.34),transparent_34%),linear-gradient(115deg,rgb(6_31_47/0.96)_18%,rgb(6_31_47/0.68)_58%,rgb(6_31_47/0.85)_100%)]"
      />

      <Container className="relative z-10 grid min-h-[88svh] grid-cols-1 items-center gap-12 pb-16 pt-32 lg:grid-cols-12 lg:gap-12 lg:pb-20 lg:pt-36">
        {/* Contenido */}
        <div className="lg:col-span-7">
          <Reveal>
            <Link
              className="group inline-flex items-center gap-3 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-blueprint-line transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
              href="/"
            >
              <ArrowLeft
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:-translate-x-1"
                size={16}
                strokeWidth={1.5}
              />

              Volver a la página profesional
            </Link>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="mt-12 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-sage">
              Proyectos integrativos y soberanos
            </p>
          </Reveal>

          <Reveal delay={0.14}>
            <h1 className="mt-7 max-w-[11ch] font-serif text-[clamp(3.2rem,7vw,6.8rem)] font-medium leading-[0.88] tracking-[-0.045em] text-ivory">
              La colaboración

              <span className="block italic text-sage">
                por encima
              </span>

              <span className="block">
                de la competencia.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-8 max-w-2xl font-sans text-base font-light leading-8 text-ivory/65 sm:text-lg">
              Un espacio para conocer propuestas integrativas, participar y
              construir nuevas formas de habitar orientadas al Bien Común.
            </p>
          </Reveal>

          <Reveal delay={0.26}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className="group inline-flex min-h-11 items-center gap-3 rounded-full border border-terracotta/40 bg-terracotta px-5 py-3 text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-ink transition duration-300 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                href="#proyectos-integrativos"
              >
                Conocer los proyectos

                <ArrowDown
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-y-1"
                  size={15}
                  strokeWidth={1.5}
                />
              </Link>

              <Link
                className="group inline-flex min-h-11 items-center gap-3 rounded-full border border-white/15 bg-white/[0.06] px-5 py-3 text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-ivory backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
                href="/#contacto"
              >
                Proponer una colaboración

                <ArrowUpRight
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  size={15}
                  strokeWidth={1.5}
                />
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Edificio y naturaleza blueprint */}
        <Reveal
          className="lg:col-span-5"
          delay={0.16}
          distance={28}
        >
          <div className="relative min-h-[23rem] overflow-hidden rounded-[1.5rem] border border-blueprint-line/20 bg-[#0b3550]/75 shadow-[0_2rem_6rem_rgb(0_0_0/0.24)] backdrop-blur-xl sm:min-h-[29rem]">
            <IntegrativeBlueprint />

            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-blueprint-deep/90 via-transparent to-transparent"
            />

            <div className="absolute inset-x-5 bottom-5 rounded-[1.25rem] border border-white/10 bg-blueprint-deep/80 p-5 backdrop-blur-xl sm:inset-x-6 sm:bottom-6">
              <Sprout
                aria-hidden="true"
                className="text-sage"
                size={21}
                strokeWidth={1.4}
              />

              <p className="mt-4 text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-sage">
                Comunidad
              </p>

              <p className="mt-2 max-w-sm font-sans text-xl font-light leading-snug tracking-[-0.025em] text-ivory sm:text-2xl">
                Propuestas para participar, encontrarse y construir.
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}