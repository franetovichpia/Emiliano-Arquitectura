export type NavigationItem = {
  label: string;
  href: `#${string}`;
};

export const navigationItems = [
  {
    label: "Inicio",
    href: "#inicio",
  },
  {
    label: "Sobre mí",
    href: "#sobre-mi",
  },
  {
    label: "Proyectos",
    href: "#proyectos",
  },
  {
    label: "Reflexiones",
    href: "#reflexiones",
  },
  {
    label: "Salud",
    href: "#salud",
  },
  {
    label: "Educación",
    href: "#educacion",
  },
  {
    label: "Servicios",
    href: "#servicios",
  },
  {
    label: "Contacto",
    href: "#contacto",
  },
] as const satisfies readonly NavigationItem[];