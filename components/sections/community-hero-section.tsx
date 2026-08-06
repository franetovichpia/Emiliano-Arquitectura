import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  Sprout,
  UsersRound,
} from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";

export function CommunityHeroSection() {
  return (
    <section
      className="relative isolate min-h-[88svh] overflow-hidden bg-[#163b35] text-[#f4f0e8]"
      id="inicio-comunitario"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgb(169_182_155/0.25)_1px,transparent_1px),linear-gradient(90deg,rgb(169_182_155/0.25)_1px,transparent_1px)] [background-size:56px_56px]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_75%_30%,rgb(111_146_118/0.3),transparent_34%),linear-gradient(115deg,transparent_25%,rgb(7_28_24/0.65)_100%)]"
      />

      <Container className="relative grid min-h-[88svh] grid-cols-1 items-center gap-14 pb-20 pt-36 lg:grid-cols-12 lg:gap-12 lg:pt-40">
        <div className="lg:col-span-7">
          <Reveal>
            <Link
              className="group inline-flex items-center gap-3 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#b8c9af] transition-colors duration-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c66f4e]"
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
            <p className="mt-16 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[#b8c9af]">
              Proyectos participativos y soberanos
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <h1 className="mt-8 max-w-[11ch] font-serif text-[clamp(3.6rem,7vw,7.5rem)] font-medium leading-[0.87] tracking-[-0.045em]">
              La colaboración
              <span className="block italic text-[#b8c9af]">
                por encima
              </span>
              <span className="block">
                de la competencia.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.24}>
            <p className="mt-10 max-w-2xl font-sans text-base font-light leading-8 text-[#f4f0e8]/65 sm:text-lg">
              Un espacio para conocer propuestas comunitarias,
              participar y construir nuevas formas de habitar
              orientadas al Bien Común.
            </p>
          </Reveal>

          <Reveal delay={0.32}>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                className="group inline-flex min-h-12 items-center gap-3 rounded-full border border-[#d98b6d]/30 bg-[#c66f4e] px-6 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[#151515] transition duration-300 hover:-translate-y-0.5 hover:bg-[#d27b5a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                href="#proyectos"
              >
                Conocer los proyectos

                <ArrowDown
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-y-1"
                  size={16}
                  strokeWidth={1.5}
                />
              </Link>

              <Link
                className="group inline-flex min-h-12 items-center gap-3 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-[#f4f0e8] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8c9af]"
                href="/#contacto"
              >
                Proponer una colaboración

                <ArrowUpRight
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                  size={16}
                  strokeWidth={1.5}
                />
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal
          className="lg:col-span-5"
          delay={0.2}
          distance={30}
        >
          <div className="relative min-h-[26rem] overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.06] p-8 shadow-[0_2rem_6rem_rgb(0_0_0/0.25)] backdrop-blur-xl sm:min-h-[32rem]">
            <div
              aria-hidden="true"
              className="absolute inset-8 border border-[#b8c9af]/15"
            />

            <div
              aria-hidden="true"
              className="absolute left-[18%] top-[22%] h-[52%] w-[64%] rotate-6 border border-[#b8c9af]/30"
            />

            <div
              aria-hidden="true"
              className="absolute left-[30%] top-[34%] h-[48%] w-[44%] -rotate-12 border border-[#c66f4e]/45"
            />

            <div className="absolute left-8 top-8 grid size-14 place-items-center rounded-full border border-white/15 bg-white/5 text-[#b8c9af]">
              <UsersRound
                aria-hidden="true"
                size={24}
                strokeWidth={1.4}
              />
            </div>

            <div className="absolute bottom-8 left-8 right-8 rounded-[1.5rem] border border-white/10 bg-[#0e2d28]/75 p-6 backdrop-blur-xl">
              <Sprout
                aria-hidden="true"
                className="text-[#b8c9af]"
                size={25}
                strokeWidth={1.4}
              />

              <p className="mt-7 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-[#b8c9af]">
                Comunidad
              </p>

              <p className="mt-3 max-w-sm font-sans text-2xl font-light leading-snug tracking-[-0.025em]">
                Propuestas para participar, encontrarse y construir.
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}