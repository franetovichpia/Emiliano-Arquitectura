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
        href: null,
        links: [
          {
            label: "Video introductorio",
            type: "YouTube",
            href: "https://youtu.be/IQadR-Bsgqo",
          },
          {
            label: "Objetivos y acuerdos de participación",
            type: "Documento",
            href: "https://www.dropbox.com/scl/fi/1qpe8txjhhys3712q280i/OBJETIVOS-Y-ACUERDOS-ACTIVAT.pdf?rlkey=aq2u9lsmqcpgtsp7nhg3x87cg&dl=0",
          },
          {
            label: "Acuerdos para coordinar grupos de integración",
            type: "Documento",
            href: "https://www.dropbox.com/scl/fi/jsr85gkgqrptirbjyuv19/ACUERDOS-COORDINADORES-ACTIVAT.pdf?rlkey=n9zflvd3389vykl6etei92j7h&dl=0",
          },
          {
            label: "Inscripción a los cuatro acuerdos fundamentales",
            type: "Formulario",
            href: "https://docs.google.com/forms/d/e/1FAIpQLSc7JYzydn41w36QhttMMcrGZ8IcYkM-n3Es28SSzjr8u6YtJA/viewform",
          },
          {
            label: "Grupo de Activación Nacional",
            type: "WhatsApp",
            href: "https://chat.whatsapp.com/L5DQ64Q9czmKg04UTKSlFx",
          },
          {
            label: "Grupos de Integración",
            type: "Telegram",
            href: "https://t.me/integraciondeactivados",
          },
          {
            label: "Mapa ActivaT — Grupos de Integración",
            type: "Mapa",
            href: "https://umap.openstreetmap.fr/es/map/activatargentina-grupos-de-integracion_860240#5/-38.805470/-59.062500",
          },
          {
            label: "Información, noticias y novedades",
            type: "Telegram",
            href: "https://t.me/activat2022Arg",
          },
          {
            label: "Canal de YouTube",
            type: "YouTube",
            href: "https://www.youtube.com/channel/UColWsMev30F1fua2LOjgs9g",
          },
          {
            label: "ActivaTArgentina",
            type: "Instagram",
            href: "https://www.instagram.com/activatargentina/",
          },
          {
            label: "activatargentina@gmail.com",
            type: "Correo electrónico",
            href: "mailto:activatargentina@gmail.com",
          },
        ],
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