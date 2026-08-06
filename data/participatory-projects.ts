export type ParticipatoryProjectIcon =
  | "home"
  | "map"
  | "community"
  | "seeds";

export type ParticipatoryProjectTheme =
  | "dark"
  | "sand"
  | "stone"
  | "earth";

export type ParticipatoryProject = {
  number: string;
  title: string;
  action: string;
  icon: ParticipatoryProjectIcon;
  theme: ParticipatoryProjectTheme;
  href: string | null;
};

export const participatoryProjects: readonly ParticipatoryProject[] = [
  {
    number: "01",
    title: "Comunidad Barrios Soberanos",
    action: "Independizarse",
    icon: "home",
    theme: "dark",
    href: "https://linktr.ee/BarriosSoberanos",
  },
  {
    number: "02",
    title: "Mapa Nacional de Asambleas Soberanas",
    action: "Encontrarse",
    icon: "map",
    theme: "sand",
    href: "https://umap.openstreetmap.fr/es/map/ecoaldeas-argentina-y-sudamerica-barrios-soberanos_796371#7/-33.133000/-66.094000",
  },
  {
    number: "03",
    title: "Mapa de Comunidades Indígenas Argentinas",
    action: "Reconocerse",
    icon: "community",
    theme: "stone",
    href: "https://umap.openstreetmap.fr/es/map/mapa-de-comunidades-indigenas-en-proceso_822049#6/-32.073266/-59.238281",
  },
  {
    number: "04",
    title: "Intercambio de Semillas",
    action: "Sembrar",
    icon: "seeds",
    theme: "earth",
    href: "https://chat.whatsapp.com/HJZyYmIxExxIenJlsBCV8q",
  },
];