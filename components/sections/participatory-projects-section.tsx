import Link from "next/link";
import {
  ArrowUpRight,
  Home,
  Map,
  Sprout,
  Users,
} from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/app/container";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  participatoryProjects,
  type ParticipatoryProjectIcon,
  type ParticipatoryProjectTheme,
} from "@/data/participatory-projects";
import { cn } from "@/utils/cn";

const projectIcons: Record<
  ParticipatoryProjectIcon,
  typeof Home
> = {
  home: Home,
  map: Map,
  community: Users,
  seeds: Sprout,
};

const projectThemes: Record<
  ParticipatoryProjectTheme,
  {
    card: string;
    muted: string;
    line: string;
    icon: string;
    panel: string;
    link: string;
  }
> = {
  dark: {
    card: "border-white/15 bg-forest-deep text-ivory",
    muted: "text-ivory/50",
    line: "border-white/10",
    icon: "border-white/15 bg-white/10 text-sage",
    panel: "border-white/15 bg-white/[0.07]",
    link: "text-sage",
  },
  sand: {
    card: "border-forest-deep/10 bg-sand/55 text-forest-deep",
    muted: "text-forest-deep/50",
    line: "border-forest-deep/10",
    icon: "border-forest-deep/15 bg-white/25 text-terracotta",
    panel: "border-white/40 bg-white/25",
    link: "text-forest-deep/60",
  },
  stone: {
    card: "border-forest-deep/10 bg-concrete/70 text-forest-deep",
    muted: "text-forest-deep/50",
    line: "border-forest-deep/10",
    icon: "border-forest-deep/15 bg-white/25 text-terracotta",
    panel: "border-white/40 bg-white/25",
    link: "text-forest-deep/60",
  },
  earth: {
    card: "border-white/15 bg-terracotta text-ivory",
    muted: "text-ivory/55",
    line: "border-white/15",
    icon: "border-white/20 bg-white/10 text-ivory",
    panel: "border-white/20 bg-white/10",
    link: "text-ivory/70",
  },
};

export function ParticipatoryProjectsSection() {
  return (
    <section
      aria-labelledby="participatory-projects-heading"
      className="relative overflow-hidden bg-ivory text-forest-deep"
      id="proyectos-integrativos"
    >
      <div
        aria-hidden="true"
        className="absolute left-0 top-0 size-[32rem] rounded-full bg-sand/20 blur-[8rem]"
      />

      <div
        aria-hidden="true"
        className="absolute -right-32 bottom-0 size-[30rem] rounded-full bg-sage/15 blur-[8rem]"
      />

      <Container className="relative py-24 sm:py-28 lg:py-36">
        {/* Encabezado */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionHeading
                eyebrow="Comunidad y territorio"
                id="participatory-projects-heading"
                title="Proyectos integrativos."
              />
            </Reveal>
          </div>

          <div className="flex items-end lg:col-span-7 lg:pl-8">
            <Reveal delay={0.08}>
              <div className="max-w-3xl">
                <p className="font-sans text-[clamp(1.55rem,2.7vw,3rem)] font-light leading-relaxed tracking-[-0.025em] text-forest-deep">
                  Independizarse. Encontrarse. Reconocerse. Sembrar.
                </p>

                <p className="mt-6 max-w-2xl text-sm leading-8 text-forest-deep/60 sm:text-base">
                  Iniciativas vinculadas a comunidades, territorio, soberanía
                  y colaboración.
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Rejilla asimétrica */}
        <div className="mt-20 grid grid-cols-1 gap-4 lg:grid-cols-12">
          {participatoryProjects.map((project, index) => {
            const Icon = projectIcons[project.icon];
            const theme = projectThemes[project.theme];

            const columnClass =
              index === 0 || index === 3
                ? "lg:col-span-7"
                : "lg:col-span-5";

            return (
              <Reveal
                className={cn("h-full", columnClass)}
                delay={0.06 + index * 0.07}
                key={project.title}
              >
                <article
                  className={cn(
                    "glass-interactive group relative isolate flex min-h-[28rem] h-full flex-col overflow-hidden rounded-[2rem] border p-7 shadow-[0_2rem_5rem_rgb(20_24_20/0.12)] sm:p-9 lg:min-h-[31rem]",
                    theme.card,
                  )}
                >
                  {/* Rejilla decorativa */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage:
                        "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
                      backgroundSize: "4rem 4rem",
                    }}
                  />

                  <div
                    aria-hidden="true"
                    className={cn(
                      "absolute right-[10%] top-[14%] h-[38%] w-[50%] rotate-6 border",
                      theme.line,
                    )}
                  >
                    <div
                      className={cn(
                        "absolute -bottom-[22%] -left-[18%] h-[75%] w-[55%] border",
                        theme.line,
                      )}
                    />
                  </div>

                  {/* Parte superior */}
                  <div className="relative flex items-start justify-between">
                    <div
                      className={cn(
                        "grid size-12 place-items-center rounded-full border backdrop-blur-xl",
                        theme.icon,
                      )}
                    >
                      <Icon
                        aria-hidden="true"
                        size={21}
                        strokeWidth={1.4}
                      />
                    </div>

                    <span
                      className={cn(
                        "text-[0.65rem] font-medium tracking-[0.16em]",
                        theme.muted,
                      )}
                    >
                      {project.number}
                    </span>
                  </div>

                  {/* Información */}
                  <div
                    className={cn(
                      "relative mt-auto rounded-[1.5rem] border p-6 backdrop-blur-xl sm:p-7",
                      theme.panel,
                    )}
                  >
                    <p
                      className={cn(
                        "text-[0.65rem] font-semibold uppercase tracking-[0.17em]",
                        theme.muted,
                      )}
                    >
                      {project.action}
                    </p>

                    <h3 className="mt-4 max-w-xl font-sans text-[clamp(1.65rem,2.7vw,2.8rem)] font-light leading-snug tracking-[-0.03em]">
                      {project.title}
                    </h3>

                    <div className="mt-8 border-t border-current/10 pt-5">
                      {project.href ? (
                        <Link
                          aria-label={`Abrir ${project.title}`}
                          className={cn(
                            "group/link inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.15em]",
                            theme.link,
                          )}
                          href={project.href}
                          rel="noreferrer"
                          target="_blank"
                        >
                          Abrir proyecto

                          <ArrowUpRight
                            aria-hidden="true"
                            className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                            size={15}
                            strokeWidth={1.6}
                          />
                        </Link>
                      ) : (
                        <span
                          className={cn(
                            "text-[0.62rem] font-medium uppercase tracking-[0.14em]",
                            theme.muted,
                          )}
                        >
                          Enlace pendiente de incorporar
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

