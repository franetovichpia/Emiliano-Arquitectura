import { Reveal } from "@/components/motion/reveal";
import { AstrocasasWall } from "@/components/projects/astrocasas-wall";
import { Container } from "@/app/container";
import { listPublicProjects } from "@/lib/db/collections";
import { toPortfolioProject } from "@/lib/portfolio-project-adapter";

export async function AstrocasasSection() {
  const astrocasasProjects = await listPublicProjects(
    "astrocasas",
  );

  const projects = astrocasasProjects.map(
    (project, index) =>
      toPortfolioProject(project, index),
  );

  return (
    <section
      aria-labelledby="astrocasas-heading"
      className="relative scroll-mt-28 overflow-hidden bg-paper text-ink"
      id="astrocasas"
    >
      <div
        aria-hidden="true"
        className="absolute -left-40 top-10 size-[28rem] rounded-full bg-sage/10 blur-[9rem]"
      />

      <div
        aria-hidden="true"
        className="absolute -right-32 bottom-0 size-[24rem] rounded-full bg-terracotta/10 blur-[8rem]"
      />

      <Container className="relative py-20 sm:py-24 lg:py-28">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-7">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.19em] text-terracotta">
              Astrocasas
            </p>

            <h2
              className="mt-6 max-w-4xl font-serif text-[clamp(3rem,6vw,6.5rem)] font-medium leading-[0.88] tracking-[-0.04em] text-ink"
              id="astrocasas-heading"
            >
              Una casa
              <span className="block italic text-sage">
                para cada
              </span>
              <span className="block">
                signo.
              </span>
            </h2>
          </Reveal>

          <Reveal
            className="lg:col-span-5"
            delay={0.08}
          >
            <div className="lg:pl-8">
              <p className="max-w-lg text-sm leading-7 text-ink/60 sm:text-base">
                Doce proyectos residenciales, uno
                por cada signo del zodíaco,
                explorando cómo el carácter de
                cada casa dialoga con quien la
                habita.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal
          className="mt-12"
          delay={0.14}
        >
          <AstrocasasWall projects={projects} />
        </Reveal>
      </Container>
    </section>
  );
}