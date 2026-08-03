import {
  Boxes,
  Layers3,
  Ruler,
  ScanLine,
} from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";

const credentials = [
  {
    overline: "Formación",
    label: "Arquitecto UBA",
  },
  {
    overline: "Especialidad",
    label: "Asesor BIM",
  },
  {
    overline: "Experiencia",
    label: "Dirección y documentación",
  },
  {
    overline: "Procesos",
    label: "2D · 3D · 4D",
  },
] as const;

const viewerFeatures = [
  {
    icon: Layers3,
    label: "Capas",
  },
  {
    icon: Ruler,
    label: "Mediciones",
  },
  {
    icon: ScanLine,
    label: "Selección",
  },
] as const;

export function HeroSection() {
  return (
    <section
      className="relative isolate overflow-hidden bg-forest-deep text-ivory"
      id="inicio"
    >
      <div
        aria-hidden="true"
        className="topographic-field absolute inset-0 opacity-50"
      />

      <Container className="relative grid min-h-[calc(100svh-5rem)] grid-cols-1 items-center gap-12 py-16 lg:grid-cols-12 lg:gap-8 lg:py-20">
        <div className="relative z-10 lg:col-span-5">
          <Reveal>
            <p className="mb-7 max-w-xl text-[0.7rem] font-semibold uppercase tracking-[0.19em] text-sage">
              Arquitecto UBA · Asesor BIM · Maestro Mayor de Obras
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="max-w-[8.5ch] font-serif text-[clamp(4.2rem,8.8vw,8.5rem)] font-medium leading-[0.78] tracking-[-0.055em] text-ivory">
              Emiliano
              <span className="block italic text-sage">
                Gabriel
              </span>
              <span className="block">Rossotti</span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="mt-9 max-w-xl border-l border-terracotta pl-6">
              <p className="font-serif text-3xl leading-none text-paper">
                Arquitecto Utopista
              </p>

              <p className="mt-3 text-sm leading-7 text-ivory/70 sm:text-base">
                Consultor en Proyectos Participativos y Soberanos.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <p className="mt-7 max-w-xl text-sm leading-7 text-ivory/60 sm:text-base">
              Arquitectura, BIM y procesos colaborativos al servicio de
              viviendas soberanas y del Bien Común.
            </p>
          </Reveal>

          <Reveal delay={0.32}>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="#contacto" showArrow>
                Solicitar proyecto integral
              </ButtonLink>

              <ButtonLink href="#sobre-mi" variant="light">
                Conocer mi trayectoria
              </ButtonLink>
            </div>
          </Reveal>
        </div>

        <Reveal
          className="relative lg:col-span-7"
          delay={0.18}
          distance={36}
        >
          <div className="architectural-grid relative min-h-[32rem] overflow-hidden rounded-[2rem] border border-white/15 bg-forest shadow-[0_2rem_6rem_rgb(0_0_0/0.3)] sm:min-h-[40rem]">
            <div
              aria-hidden="true"
              className="absolute inset-8 border border-sage/20 sm:inset-14"
            />

            <div
              aria-hidden="true"
              className="absolute left-[18%] top-[22%] h-[48%] w-[62%] -skew-y-6 border border-sage/40"
            >
              <div className="absolute left-[14%] top-[18%] h-[82%] w-[48%] border border-sage/35" />
              <div className="absolute right-[8%] top-[8%] h-[62%] w-[35%] border border-terracotta/45" />
              <div className="absolute bottom-[18%] left-0 h-px w-full bg-sage/30" />
              <div className="absolute left-[45%] top-0 h-full w-px bg-sage/25" />
            </div>

            <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-white/20 bg-forest-deep/70 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.13em] text-ivory backdrop-blur-md sm:left-7 sm:top-7">
              <Boxes
                aria-hidden="true"
                size={15}
                strokeWidth={1.6}
              />
              Experiencia OpenBIM
            </div>

            <div className="absolute left-1/2 top-1/2 grid size-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-sage/30 bg-forest-deep/50 text-sage backdrop-blur-sm sm:size-36">
              <Boxes
                aria-hidden="true"
                size={62}
                strokeWidth={0.8}
              />
            </div>

            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/15 bg-forest-deep/80 p-5 backdrop-blur-lg sm:bottom-7 sm:left-7 sm:right-7 sm:p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-sage">
                    Visualización arquitectónica
                  </p>

                  <p className="mt-1 font-serif text-3xl text-paper">
                    Visor IFC interactivo
                  </p>
                </div>

                <span className="text-xs uppercase tracking-[0.12em] text-ivory/50">
                  OpenBIM
                </span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                {viewerFeatures.map((feature) => {
                  const Icon = feature.icon;

                  return (
                    <div
                      className="flex items-center justify-center gap-2 rounded-full border border-white/10 px-3 py-2 text-[0.65rem] uppercase tracking-[0.08em] text-ivory/65"
                      key={feature.label}
                    >
                      <Icon
                        aria-hidden="true"
                        size={14}
                        strokeWidth={1.5}
                      />
                      <span className="hidden sm:inline">
                        {feature.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>

      <div className="relative border-t border-white/10 bg-black/10">
        <Container className="grid grid-cols-2 lg:grid-cols-4">
          {credentials.map((item, index) => (
            <div
              className="min-h-28 border-r border-white/10 px-4 py-6 sm:px-7 lg:min-h-32 lg:py-8"
              key={item.label}
            >
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-sage">
                {String(index + 1).padStart(2, "0")} · {item.overline}
              </p>

              <p className="mt-3 max-w-60 font-serif text-xl leading-tight text-paper sm:text-2xl">
                {item.label}
              </p>
            </div>
          ))}
        </Container>
      </div>
    </section>
  );
}