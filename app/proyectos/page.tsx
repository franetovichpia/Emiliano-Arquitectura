import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Container } from "@/app/container";
import { ProjectCardsGrid } from "@/components/projects/project-cards-grid";
import {
  listConstructionProgress,
  listPublicProjects,
} from "@/lib/db/collections";
import { toPortfolioProject } from "@/lib/portfolio-project-adapter";

export const metadata: Metadata = {
  title: "Todos los proyectos | Emiliano Gabriel Rossotti",
  description:
    "Explorá todos los proyectos de Emiliano Gabriel Rossotti: arquitectura, documentación y modelos OpenBIM.",
};

type AllProjectsPageProps = {
  searchParams: Promise<{
    categoria?: string;
    bim?: string;
  }>;
};

export default async function AllProjectsPage({
  searchParams,
}: AllProjectsPageProps) {
  const { categoria, bim } = await searchParams;

  const onlyBim = bim === "1";

  const categorySlugs = categoria
    ? categoria
        .split(",")
        .map((slug) => slug.trim())
        .filter(Boolean)
    : [];

  const rawProjects =
    categorySlugs.length > 0
      ? (
          await Promise.all(
            categorySlugs.map((slug) =>
              listPublicProjects(slug),
            ),
          )
        ).flat()
      : await listPublicProjects();

  const projects = onlyBim
    ? rawProjects.filter(
        (project) => project.hasIfc,
      )
    : rawProjects;

  const progressEntries = await Promise.all(
    projects.map((project) =>
      listConstructionProgress(
        project._id.toString(),
      ),
    ),
  );

  const portfolioProjects = projects.map(
    (project, index) =>
      toPortfolioProject(
        project,
        index,
        progressEntries[index].length > 0,
      ),
  );

  const isAstrocasasOnly =
    categorySlugs.length === 1 &&
    categorySlugs[0] === "astrocasas";

  const isProfessionalOnly =
    categorySlugs.length > 0 &&
    categorySlugs.includes("portfolio-general");

  const eyebrow = onlyBim
    ? "Visualización arquitectónica"
    : isAstrocasasOnly
      ? "Astrocasas"
      : isProfessionalOnly
        ? "Proyectos profesionales"
        : "Portfolio completo";

  const heading = onlyBim
    ? "Dimensión 3D"
    : isAstrocasasOnly
      ? "Astrocasas"
      : isProfessionalOnly
        ? "Proyectos profesionales"
        : "Todos los proyectos";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#071d31] text-[#f7f2e8]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(140, 190, 215, 0.22) 1px, transparent 1px),
            linear-gradient(90deg, rgba(140, 190, 215, 0.22) 1px, transparent 1px)
          `,
          backgroundSize: "5rem 5rem",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 top-20 size-[38rem] rounded-full border border-[#7fb0c8]/20"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 bottom-0 size-[32rem] rounded-full bg-[#c56f4e]/10 blur-[9rem]"
      />

      <Container className="relative pb-20 pt-32 sm:pb-28 sm:pt-36">
        <Link
          className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2.5 text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-white/65 backdrop-blur-xl transition-colors duration-300 hover:border-[#ca7555]/50 hover:bg-white/[0.1] hover:text-white"
          href="/"
        >
          <ArrowLeft
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:-translate-x-1"
            size={15}
            strokeWidth={1.6}
          />

          Volver a la página principal
        </Link>

        <p className="mt-7 text-[0.63rem] font-semibold uppercase tracking-[0.19em] text-[#d17c5b]">
          {eyebrow}
        </p>

        <h1 className="mt-3 max-w-3xl font-serif text-[clamp(2.6rem,5vw,4.8rem)] leading-[0.95] tracking-[-0.04em] text-[#f7f2e8]">
          {heading}
        </h1>

        <p className="mt-5 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
          {portfolioProjects.length}{" "}
          {portfolioProjects.length === 1
            ? "proyecto publicado"
            : "proyectos publicados"}
          . Los que tienen modelo BIM muestran la
          insignia 3D, y los que además tienen
          certificación de obra cargada muestran
          la insignia 5D.
        </p>

        <div className="mt-12">
          <ProjectCardsGrid
            projects={portfolioProjects}
          />
        </div>
      </Container>
    </main>
  );
}