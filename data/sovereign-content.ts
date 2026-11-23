export type SovereignContentIcon =
  | "health"
  | "education";

export type SovereignContentTheme =
  | "dark"
  | "light";

export type SovereignContentLink = {
  label: string;
  type: string;
  href: string;
};

export type SovereignContentItem = {
  number: string;
  title: string;
  action: string;
  href: string | null;
  links?: readonly SovereignContentLink[];
};

export type SovereignContentGroup = {
  number: string;
  title: string;
  icon: SovereignContentIcon;
  theme: SovereignContentTheme;
  items: readonly SovereignContentItem[];
};

export const sovereignContentGroups: readonly SovereignContentGroup[] = [
  {
    number: "01",
    title: "Salud soberana",
    icon: "health",
    theme: "dark",
    items: [
      {
        number: "01",
        title: "ActivaTArgentina",
        action: "Informarse",
        href: "https://linktr.ee/activaTargentina",
      },
      {
        number: "02",
        title: "Agua de Mar, Salud Celular",
        action: "Restaurar",
        href: "https://t.me/+xjc0x-1RINozODY5",
      },
    ],
  },
  {
    number: "02",
    title: "Educación soberana",
    icon: "education",
    theme: "light",
    items: [
      {
        number: "01",
        title: "Libros de Autoconstrucción",
        action: "Aprender",
        href: "https://t.me/librosdeautoconstruccion",
      },
      {
        number: "02",
        title: "Libros para la Salud",
        action: "Sanar",
        href: "https://t.me/+bUVX42LfoKs2MDEx",
      },
    ],
  },
];