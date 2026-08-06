export type NavigationItem = {
  label: string;
  href: string;
};

export const mainNavigation: readonly NavigationItem[] = [
  {
    label: "Inicio",
    href: "/#inicio",
  },
  {
    label: "Sobre mí",
    href: "/#sobre-mi",
  },
  {
    label: "Servicios",
    href: "/#servicios",
  },
  {
    label: "Proyectos",
    href: "/#proyectos-profesionales",
  },
  {
    label: "Contacto",
    href: "/#contacto",
  },
];

export const communityNavigation: readonly NavigationItem[] = [
  {
    label: "Inicio",
    href: "/proyectos-comunitarios#inicio-comunitario",
  },
  {
    label: "Propuestas",
    href: "/proyectos-comunitarios#proyectos",
  },
  {
    label: "Proyectos relacionados",
    href: "/proyectos-comunitarios#contenido-soberano",
  },
  {
    label: "Recursos",
    href: "/proyectos-comunitarios#recursos",
  },
];

export const footerNavigation: readonly NavigationItem[] = [
  {
    label: "Reflexiones",
    href: "/#reflexiones",
  },
  {
    label: "Proyectos profesionales",
    href: "/#proyectos-profesionales",
  },
  {
    label: "Proyectos comunitarios",
    href: "/proyectos-comunitarios",
  },
  {
    label: "Recursos",
    href: "/proyectos-comunitarios#recursos",
  },
];