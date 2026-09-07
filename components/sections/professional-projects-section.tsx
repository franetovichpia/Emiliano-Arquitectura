import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { ProjectCarousel } from "@/components/projects/project-carousel";
import { Container } from "@/app/container";
import { professionalProjects } from "@/data/professional-projects";

export function ProfessionalProjectsSection() {
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
                className="group mt-6 inline-flex items-center gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-blueprint-line transition-colors hover:text-ivory"
                href="https://www.behance.net/emilianobim"
                rel="noopener noreferrer"
                target="_blank"
              >
                Ver portfolio completo

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
          <ProjectCarousel
            projects={professionalProjects}
          />
        </Reveal>
      </Container>
    </section>
  );
}