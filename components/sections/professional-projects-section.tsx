import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { ProjectCarousel } from "@/components/projects/project-carousel";
import { Container } from "@/app/container";
import { listPublicProjects } from "@/lib/db/collections";
import { toPortfolioProject } from "@/lib/portfolio-project-adapter";

export async function ProfessionalProjectsSection() {
  const [portfolioProjects, newProjects] =
    await Promise.all([
      listPublicProjects("portfolio-general"),
      listPublicProjects("nuevos-proyectos"),
    ]);

  const projects = [
    ...portfolioProjects,
    ...newProjects,
  ].map((project, index) =>
    toPortfolioProject(project, index),
  );

  return (
    <section
      aria-labelledby="professional-projects-heading"
      className="relative scroll-mt-28 overflow-hidden bg-blueprint-deep text-ivory"
      id="proyectos-profesionales"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgb(131_174_190/0.5)_1px,transparent_1px),linear-gradient(90deg,rgb(131_174_190/0.5)_1px,transparent_1px)] [background-size:48px_48px]"
      />

      <div
        aria-hidden="true"
        className="absolute -right-40 top-0 size-[32rem] rounded-full bg-blueprint-soft/25 blur-3xl"
      />

      <Container className="relative py-20 sm:py-24 lg:py-28">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.19em] text-terracotta">
              Proyectos profesionales
            </p>

            <h2
              className="mt-6 max-w-4xl font-serif text-[clamp(3rem,6vw,6.5rem)] font-medium leading-[0.88] tracking-[-0.04em]"
              id="professional-projects-heading"
            >
              Arquitectura,
              <span className="block italic text-sage">
                documentación
              </span>
              <span className="block">y BIM.</span>
            </h2>
          </Reveal>

          <Reveal
            className="lg:col-span-5"
            delay={0.08}
          >
            <div className="lg:pl-8">
              <p className="max-w-lg text-sm leading-7 text-ivory/60 sm:text-base">
                Selección de trabajos de arquitectura,
                representación y procesos BIM.
              </p>

              <Link
                className="group mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-ivory transition duration-300 hover:-translate-y-0.5 hover:bg-white/10"
                href="/proyectos?categoria=portfolio-general,nuevos-proyectos"
              >
                Ver todos los proyectos profesionales

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

        <Reveal
          className="mt-12"
          delay={0.14}
        >
          {projects.length === 0 ? (
            <p className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-sm text-ivory/50">
              Todavía no hay proyectos publicados
              en esta categoría.
            </p>
          ) : (
            <ProjectCarousel projects={projects} />
          )}
        </Reveal>
      </Container>
    </section>
  );
}