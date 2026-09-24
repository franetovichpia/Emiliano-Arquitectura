import type { WithId } from "mongodb";

import type {
  PortfolioProject,
  PortfolioProjectFact,
} from "@/components/projects/portfolio-project";
import type { Project } from "@/lib/db/schemas";
import { getPublicUrl } from "@/lib/storage/r2-client";

const categoryLabels: Record<string, string> = {
  "portfolio-general": "Portfolio General",
  astrocasas: "Astrocasas",
  "nuevos-proyectos": "Nuevos Proyectos",
};

const zodiacLabels: Record<string, string> = {
  aries: "Aries",
  tauro: "Tauro",
  geminis: "Géminis",
  cancer: "Cáncer",
  leo: "Leo",
  virgo: "Virgo",
  libra: "Libra",
  escorpio: "Escorpio",
  sagitario: "Sagitario",
  capricornio: "Capricornio",
  acuario: "Acuario",
  piscis: "Piscis",
};

export function toPortfolioProject(
  project: WithId<Project>,
  index: number,
  has5D = false,
): PortfolioProject {
  const images = project.media
    .filter(
      (item) =>
        item.mediaType === "imagen" ||
        item.mediaType === "render",
    )
    .map((item) =>
      getPublicUrl("media", item.storageKey),
    );

  const zodiacLabel = project.zodiacSign
    ? zodiacLabels[project.zodiacSign]
    : undefined;

  const facts: PortfolioProjectFact[] = [];

  if (project.location) {
    facts.push({
      label: "Ubicación",
      value: project.location,
    });
  }

  if (project.yearCompleted) {
    facts.push({
      label: "Año",
      value: String(project.yearCompleted),
    });
  }

  if (project.areaM2) {
    facts.push({
      label: "Superficie",
      value: `${project.areaM2} m²`,
    });
  }

  if (project.client) {
    facts.push({
      label: "Autoría",
      value: project.client,
    });
  }

  if (zodiacLabel) {
    facts.push({
      label: "Signo zodiacal",
      value: zodiacLabel,
    });
  }

  return {
    slug: project.slug,
    number: String(index + 1).padStart(2, "0"),
    title: project.title,
    category:
      categoryLabels[project.categorySlug] ??
      project.categorySlug,
    year: project.yearCompleted
      ? String(project.yearCompleted)
      : "",
    summary: project.summary ?? "",
    images,
    externalLink: project.externalLink,
    bimSlug: project.hasIfc
      ? project.slug
      : undefined,
    has5D,
    zodiacSign: zodiacLabel,
    tools: project.tools ?? [],
    facts,
  };
}