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
    href: "/proyectos-integrativos#inicio-integrativo",
  },
  {
    label: "Propuestas",
    href: "/proyectos-integrativos#proyectos",
  },
  {
    label: "Proyectos relacionados",
    href: "/proyectos-integrativos#contenido-soberano",
  },
  {
    label: "Recursos",
    href: "/proyectos-integrativos#recursos",
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
    label: "Proyectos integrativos",
    href: "/proyectos-integrativos",
  },
  {
    label: "Recursos",
    href: "/proyectos-integrativos#recursos",
  },
];
