import Image from "next/image";
import {
  Home,
  Layers3,
  Users,
} from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/app/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { professionalProfile } from "@/data/profile";

const principleIcons = {
  home: Home,
  process: Layers3,
  community: Users,
} as const;

export function AboutSection() {
  return (
    <section
      aria-labelledby="about-heading"
      className="relative scroll-mt-28 overflow-hidden bg-paper text-forest-deep"
      id="sobre-mi"
    >
      <div
        aria-hidden="true"
        className="absolute right-0 top-0 size-[26rem] rounded-full bg-sage/[0.08] blur-3xl"
      />

      <Container className="relative py-20 sm:py-24 lg:py-28">
        <div className="grid min-w-0 grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12">
          {/* Columna editorial */}
          <div className="min-w-0 lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Reveal className="w-full min-w-0">
                <SectionHeading
                  eyebrow={professionalProfile.eyebrow}
                  id="about-heading"
                  title={professionalProfile.title}
                />
              </Reveal>

              {/* Fotografía */}
              <Reveal
                className="mt-8 w-full min-w-0"
                delay={0.06}
                distance={24}
              >
                <figure className="group relative max-w-md overflow-hidden rounded-[1.5rem] border border-forest-deep/10 bg-blueprint-deep shadow-[0_1.5rem_4rem_rgb(11_38_55/0.14)]">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      alt="Retrato profesional de Emiliano Gabriel Rossotti"
                      className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                      fill
                      quality={75}
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 60vw, 100vw"
                      src="/images/emiliano/emiliano-rossotti.jpeg"
                    />

                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-blueprint-deep/75 via-transparent to-transparent"
                    />

                    <div
                      aria-hidden="true"
                      className="absolute inset-4 rounded-[1rem] border border-white/20"
                    />

                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <p className="text-[0.6rem] font-semibold uppercase tracking-[0.17em] text-blueprint-line">
                        Arquitecto · Asesor BIM
                      </p>

                      <figcaption className="mt-2 font-serif text-2xl leading-tight text-ivory">
                        Emiliano Gabriel Rossotti
                      </figcaption>
                    </div>
                  </div>
                </figure>
              </Reveal>

              {/* Cita */}
              <Reveal
                className="mt-7 w-full min-w-0"
                delay={0.1}
              >
                <blockquote className="border-l border-terracotta py-1 pl-5">
                  <p className="max-w-md font-serif text-xl italic leading-snug text-forest sm:text-2xl">
                    “{professionalProfile.quote}”
                  </p>
                </blockquote>
              </Reveal>
            </div>
          </div>

          {/* Biografía */}
          <div className="min-w-0 lg:col-span-8 lg:pl-6">
            <Reveal
              className="w-full min-w-0"
              delay={0.06}
            >
              <p className="max-w-[50rem] break-words font-sans text-[clamp(1.4rem,2.05vw,2.25rem)] font-light leading-relaxed tracking-[-0.025em] text-forest-deep">
                {professionalProfile.introduction}
              </p>
            </Reveal>

            {/* Columnas sin filas rígidas */}
            <div className="mt-10 columns-1 gap-10 md:columns-2 lg:gap-12">
              {professionalProfile.paragraphs.map(
                (paragraph, index) => (
                  <Reveal
                    className="mb-8 break-inside-avoid"
                    delay={0.1 + index * 0.05}
                    key={paragraph}
                  >
                    <p className="break-words text-sm leading-8 text-forest-deep/70 sm:text-base">
                      {paragraph}
                    </p>
                  </Reveal>
                ),
              )}
            </div>

            {/* Experiencia */}
            <Reveal
              className="mt-8 w-full"
              delay={0.2}
            >
              <div className="border-t border-forest-deep/15 pt-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-terracotta">
                      Campos de experiencia
                    </p>

                    <p className="mt-3 max-w-sm font-serif text-2xl leading-snug text-forest-deep">
                      Proyecto, obra y procesos BIM.
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    className="font-serif text-4xl text-forest-deep/10"
                  >
                    01
                  </span>
                </div>

                <ul
                  aria-label="Campos de experiencia profesional"
                  className="mt-7 flex flex-wrap gap-2"
                >
                  {professionalProfile.expertise.map((item) => (
                    <li
                      className="rounded-full border border-forest-deep/15 bg-white/35 px-3.5 py-2 text-xs font-medium text-forest-deep/70 backdrop-blur-sm transition-colors duration-300 hover:border-terracotta/50 hover:bg-white/60 hover:text-forest-deep"
                      key={item}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Principios */}
        <div className="mt-20 border-t border-forest-deep/15 pt-9 lg:mt-24">
          <Reveal>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-terracotta">
                  Principios
                </p>

                <h3 className="mt-4 max-w-3xl font-sans text-[clamp(1.5rem,2.3vw,2.4rem)] font-light leading-relaxed tracking-[-0.025em] text-forest-deep">
                  Una práctica orientada a la soberanía, la optimización y la
                  comunidad.
                </h3>
              </div>

              <span className="shrink-0 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-forest-deep/40">
                Filosofía profesional
              </span>
            </div>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-3">
            {professionalProfile.principles.map(
              (principle, index) => {
                const Icon = principleIcons[principle.icon];

                return (
                  <Reveal
                    className="h-full"
                    delay={0.07 + index * 0.07}
                    key={principle.title}
                  >
                    <article className="glass-surface glass-interactive group flex h-full min-h-64 flex-col rounded-[1.5rem] p-6 sm:p-7">
                      <div className="flex items-start justify-between">
                        <div className="grid size-10 place-items-center rounded-full border border-forest-deep/15 bg-white/30 text-terracotta">
                          <Icon
                            aria-hidden="true"
                            size={18}
                            strokeWidth={1.5}
                          />
                        </div>

                        <span className="font-sans text-xs font-medium tracking-[0.16em] text-forest-deep/30">
                          {principle.number}
                        </span>
                      </div>

                      <div className="mt-auto pt-10">
                        <h4 className="font-sans text-2xl font-light leading-snug tracking-[-0.025em] text-forest-deep">
                          {principle.title}
                        </h4>

                        <p className="mt-4 text-sm font-normal leading-7 text-forest-deep/65">
                          {principle.description}
                        </p>
                      </div>
                    </article>
                  </Reveal>
                );
              },
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}