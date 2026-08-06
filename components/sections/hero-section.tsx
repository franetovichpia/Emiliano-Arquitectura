import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Building2,
  Layers3,
  UsersRound,
} from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { ArchitecturalBlueprint } from "@/components/ui/architectural-blueprint";
import { Container } from "@/components/ui/container";

const decisions = [
  {
    number: "01",
    eyebrow: "Servicio profesional",
    title: "Solicitar un proyecto privado",
    description:
      "Proyecto, dirección de obra, documentación técnica y consultoría BIM.",
    href: "#proyectos-profesionales",
    icon: Building2,
    variant: "construction",
  },
  {
    number: "02",
    eyebrow: "Participación",
    title: "Sumarme a un proyecto comunitario",
    description:
      "Conocer proyectos participativos, comunidades y formas de colaboración.",
    href: "/proyectos-comunitarios",
    icon: UsersRound,
    variant: "nature",
  },
] as const;

export function HeroSection() {
  return (
    <section
      className="relative isolate min-h-svh scroll-mt-28 overflow-hidden bg-[#0b5b89] text-ivory"
      id="inicio"
    >
      {/* Edificio blueprint dibujado mediante SVG */}
      <ArchitecturalBlueprint />

      {/* Oscurecimiento para mantener legible el contenido */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgb(5_30_46/0.92)_0%,rgb(5_30_46/0.72)_36%,rgb(5_30_46/0.28)_70%,rgb(5_30_46/0.38)_100%)]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_76%_28%,rgb(131_174_190/0.12),transparent_38%)]"
      />

      <Container className="relative grid min-h-svh grid-cols-1 items-center gap-12 pb-16 pt-36 lg:grid-cols-12 lg:gap-12 lg:pb-20 lg:pt-36">
        {/* Identidad */}
        <div className="relative z-10 lg:col-span-7">
          <Reveal>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-blueprint-line">
                Arquitecto UBA
              </span>

              <span
                aria-hidden="true"
                className="hidden h-px w-8 bg-terracotta sm:block"
              />

              <span className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-ivory/55">
                Asesor BIM · Maestro Mayor de Obras
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-11 max-w-[8.5ch] font-serif text-[clamp(3.65rem,7vw,7.4rem)] font-medium leading-[0.83] tracking-[-0.045em] text-ivory">
              Emiliano
              <span className="block italic text-sage">
                Gabriel
              </span>
              <span className="block">Rossotti</span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="mt-11 max-w-xl border-l border-terracotta pl-6 sm:pl-8">
              <p className="font-sans text-xl font-light leading-relaxed tracking-[-0.02em] text-ivory sm:text-2xl">
                Arquitecto Utopista
              </p>

              <p className="mt-2.5 max-w-lg text-sm leading-7 text-ivory/65 sm:text-base">
                Consultor en Proyectos Participativos y Soberanos.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <Link
              className="group mt-8 inline-flex items-center gap-3 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-blueprint-line transition-colors duration-300 hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-4 focus-visible:ring-offset-blueprint-deep"
              href="#sobre-mi"
            >
              Conocer su trayectoria

              <ArrowDown
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-y-1"
                size={15}
                strokeWidth={1.5}
              />
            </Link>
          </Reveal>
        </div>

        {/* Selector */}
        <div className="relative z-10 lg:col-span-5">
          <Reveal
            delay={0.16}
            distance={26}
          >
            <div className="mx-auto max-w-[26rem] rounded-[1.4rem] border border-blueprint-line/20 bg-blueprint-deep/65 p-3 shadow-[0_1.25rem_4rem_rgb(0_0_0/0.22)] backdrop-blur-xl">
              <div className="px-2.5 pb-3 pt-1.5">
                <div className="flex items-center gap-2.5">
                  <Layers3
                    aria-hidden="true"
                    className="text-blueprint-line"
                    size={15}
                    strokeWidth={1.5}
                  />

                  <p className="text-[0.56rem] font-semibold uppercase tracking-[0.18em] text-ivory/55">
                    Elegí un camino
                  </p>
                </div>

                <p className="mt-2.5 font-sans text-sm font-light leading-6 text-ivory/75">
                  ¿Qué tipo de proyecto estás buscando?
                </p>
              </div>

              <div className="space-y-2">
                {decisions.map((decision) => {
                  const Icon = decision.icon;
                  const isConstruction =
                    decision.variant === "construction";

                  return (
                    <Link
                      aria-label={decision.title}
                      className={
                        isConstruction
                          ? "group/card relative block overflow-hidden rounded-[1rem] border border-[#d68a6d]/45 bg-[#c66f4e]/[0.15] p-3.5 text-ivory shadow-[0_0.6rem_1.5rem_rgb(0_0_0/0.1)] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-[#e2a087]/70 hover:bg-[#c66f4e]/[0.21] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                          : "group/card relative block overflow-hidden rounded-[1rem] border border-[#a6b79e]/40 bg-[#879d7d]/[0.13] p-3.5 text-ivory shadow-[0_0.6rem_1.5rem_rgb(0_0_0/0.1)] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-[#b8c7b1]/65 hover:bg-[#879d7d]/[0.2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
                      }
                      href={decision.href}
                      key={decision.title}
                    >
                      <div
                        aria-hidden="true"
                        className={
                          isConstruction
                            ? "absolute bottom-0 left-0 h-px w-2/3 bg-terracotta/70"
                            : "absolute bottom-0 left-0 h-px w-2/3 bg-sage/70"
                        }
                      />

                      <div className="relative z-10 flex items-start justify-between gap-4">
                        <div
                          className={
                            isConstruction
                              ? "grid size-8 shrink-0 place-items-center rounded-full border border-[#e2a087]/40 bg-[#c66f4e]/15 text-[#efb29b]"
                              : "grid size-8 shrink-0 place-items-center rounded-full border border-[#b8c7b1]/35 bg-[#879d7d]/15 text-[#c7d2c1]"
                          }
                        >
                          <Icon
                            aria-hidden="true"
                            size={14}
                            strokeWidth={1.45}
                          />
                        </div>

                        <span className="text-[0.52rem] font-semibold tracking-[0.18em] text-ivory/35">
                          {decision.number}
                        </span>
                      </div>

                      <div className="relative z-10 mt-3.5">
                        <p
                          className={
                            isConstruction
                              ? "text-[0.5rem] font-semibold uppercase tracking-[0.16em] text-[#efb29b]"
                              : "text-[0.5rem] font-semibold uppercase tracking-[0.16em] text-[#c7d2c1]"
                          }
                        >
                          {decision.eyebrow}
                        </p>

                        <h2 className="mt-1.5 max-w-sm font-sans text-base font-medium leading-snug tracking-[-0.02em] text-ivory">
                          {decision.title}
                        </h2>

                        <p className="mt-1.5 max-w-md text-[0.7rem] leading-[1.15rem] text-ivory/60">
                          {decision.description}
                        </p>

                        <span className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5 text-[0.5rem] font-semibold uppercase tracking-[0.15em] text-ivory/50 transition-colors duration-300 group-hover/card:text-ivory">
                          Elegir opción

                          <ArrowUpRight
                            aria-hidden="true"
                            className="transition-transform duration-300 group-hover/card:-translate-y-1 group-hover/card:translate-x-1"
                            size={13}
                            strokeWidth={1.5}
                          />
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}