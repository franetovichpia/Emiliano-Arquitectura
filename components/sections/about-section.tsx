import {
  Home,
  Layers3,
  Users,
} from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
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
        className="absolute right-0 top-0 size-[30rem] rounded-full bg-sage/10 blur-3xl"
      />

      <Container className="relative py-24 sm:py-28 lg:py-36">
        <div className="grid min-w-0 grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-12">
          {/* Columna editorial */}
          <div className="min-w-0 lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <Reveal className="w-full min-w-0">
                <SectionHeading
                  eyebrow={professionalProfile.eyebrow}
                  id="about-heading"
                  title={professionalProfile.title}
                />
              </Reveal>

              <Reveal
                className="mt-12 w-full min-w-0"
                delay={0.08}
              >
                <blockquote className="border-l border-terracotta py-2 pl-6">
                  <p className="max-w-md font-serif text-2xl italic leading-snug text-forest sm:text-3xl">
                    “{professionalProfile.quote}”
                  </p>
                </blockquote>
              </Reveal>
            </div>
          </div>

          {/* Biografía */}
          <div className="min-w-0 lg:col-span-8 lg:pl-8">
            <Reveal
              className="w-full min-w-0"
              delay={0.08}
            >
              <p className="max-w-[52rem] break-words font-sans text-[clamp(1.45rem,2.2vw,2.45rem)] font-light leading-relaxed tracking-[-0.025em] text-forest-deep">
                {professionalProfile.introduction}
              </p>
            </Reveal>

            <div className="mt-14 grid min-w-0 grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
              {professionalProfile.paragraphs.map(
                (paragraph, index) => (
                  <Reveal
                    className="w-full min-w-0"
                    delay={0.12 + index * 0.06}
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
              className="mt-16 w-full"
              delay={0.24}
            >
              <div className="border-t border-forest-deep/15 pt-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-terracotta">
                      Campos de experiencia
                    </p>

                    <p className="mt-3 max-w-sm font-serif text-2xl leading-snug text-forest-deep">
                      Proyecto, obra y procesos BIM.
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    className="font-serif text-5xl text-forest-deep/10"
                  >
                    01
                  </span>
                </div>

                <ul
                  aria-label="Campos de experiencia profesional"
                  className="mt-8 flex flex-wrap gap-3"
                >
                  {professionalProfile.expertise.map((item) => (
                    <li
                      className="rounded-full border border-forest-deep/15 bg-white/35 px-4 py-2 text-xs font-medium text-forest-deep/70 backdrop-blur-sm transition-colors duration-300 hover:border-terracotta/50 hover:bg-white/60 hover:text-forest-deep"
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
        <div className="mt-24 border-t border-forest-deep/15 pt-10 lg:mt-32">
          <Reveal>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-terracotta">
                  Principios
                </p>

                <h3 className="mt-5 max-w-3xl font-sans text-[clamp(1.65rem,2.6vw,2.75rem)] font-light leading-relaxed tracking-[-0.025em] text-forest-deep">
                  Una práctica orientada a la soberanía, la optimización y la
                  comunidad.
                </h3>
              </div>

              <span className="shrink-0 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-forest-deep/40">
                Filosofía profesional
              </span>
            </div>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            {professionalProfile.principles.map(
              (principle, index) => {
                const Icon = principleIcons[principle.icon];

                return (
                  <Reveal
                    className="h-full"
                    delay={0.08 + index * 0.08}
                    key={principle.title}
                  >
                    <article className="glass-surface glass-interactive group flex h-full min-h-80 flex-col rounded-[1.75rem] p-7 sm:p-9">
                      <div className="flex items-start justify-between">
                        <div className="grid size-12 place-items-center rounded-full border border-forest-deep/15 bg-white/30 text-terracotta">
                          <Icon
                            aria-hidden="true"
                            size={20}
                            strokeWidth={1.5}
                          />
                        </div>

                        <span className="font-sans text-sm font-medium tracking-[0.16em] text-forest-deep/30">
                          {principle.number}
                        </span>
                      </div>

                      <div className="mt-auto pt-16">
                        <h4 className="font-sans text-2xl font-light leading-snug tracking-[-0.025em] text-forest-deep sm:text-3xl">
                          {principle.title}
                        </h4>

                        <p className="mt-5 text-sm font-normal leading-7 text-forest-deep/65">
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