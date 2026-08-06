export type ProfessionalProjectFact = {
  label: string;
  value: string;
};

export type ProfessionalProject = {
  slug: string;
  number: string;
  title: string;
  category: string;
  location: string;
  year: string;
  summary: string;
  coverImage: string;
  coverAlt: string;
  behanceUrl: string;
  tools: readonly string[];
  facts: readonly ProfessionalProjectFact[];
};

export const professionalProjects: readonly ProfessionalProject[] = [
  {
    slug: "casa-pr-new-zealand",
    number: "01",
    title: "Casa PR",
    category: "Arquitectura residencial",
    location: "Wanaka, Nueva Zelanda",
    year: "2025",
    summary:
      "Proyecto residencial de 250 m² desarrollado por Rosenblat + Rossotti Architects.",
    coverImage: "/images/projects/casa-pr.png",
    coverAlt:
      "Vista arquitectónica del proyecto Casa PR en Nueva Zelanda",
    behanceUrl:
      "https://www.behance.net/gallery/217969235/Casa-PR-New-Zealand",
    tools: [
      "Autodesk Revit",
      "Enscape",
      "AutoCAD",
    ],
    facts: [
      {
        label: "Ubicación",
        value: "Wanaka, Nueva Zelanda",
      },
      {
        label: "Año",
        value: "2025",
      },
      {
        label: "Superficie",
        value: "250 m² cubiertos",
      },
      {
        label: "Autoría",
        value: "Rosenblat + Rossotti Architects",
      },
    ],
  },
  {
    slug: "kent-avenue",
    number: "02",
    title: "Kent Avenue",
    category: "Documentación arquitectónica",
    location: "Brooklyn",
    year: "2023",
    summary:
      "Proyecto de documentación arquitectónica y representación técnica para Kent Avenue.",
    coverImage: "/images/projects/kent-avenue.webp",
    coverAlt:
      "Documentación arquitectónica del proyecto Kent Avenue",
    behanceUrl:
      "https://www.behance.net/gallery/183700735/Kent-Avenue-Revenue-Documentation",
    tools: [
      "Autodesk Revit",
      "Documentación técnica",
      "Representación",
    ],
    facts: [
      {
        label: "Ubicación",
        value: "Brooklyn",
      },
      {
        label: "Área",
        value: "Documentación arquitectónica",
      },
      {
        label: "Sistema",
        value: "BIM",
      },
      {
        label: "Publicación",
        value: "2023",
      },
    ],
  },
  {
    slug: "art-studio",
    number: "03",
    title: "Art Studio",
    category: "Arquitectura modular",
    location: "Información no especificada",
    year: "2023",
    summary:
      "Estudio arquitectónico modular desarrollado mediante modelado y visualización digital.",
    coverImage: "/images/projects/art-studio.jpg",
    coverAlt:
      "Visualización arquitectónica del proyecto Art Studio",
    behanceUrl:
      "https://www.behance.net/gallery/183694127/Art-Studio",
    tools: [
      "Autodesk Revit",
      "Lumion",
      "Photoshop",
    ],
    facts: [
      {
        label: "Tipología",
        value: "Estudio de arte",
      },
      {
        label: "Enfoque",
        value: "Arquitectura modular",
      },
      {
        label: "Proceso",
        value: "Modelado y visualización",
      },
      {
        label: "Publicación",
        value: "2023",
      },
    ],
  },
  {
    slug: "turistic-point",
    number: "04",
    title: "Turistic Point",
    category: "Equipamiento y accesibilidad",
    location: "Riachuelo, Argentina",
    year: "2023",
    summary:
      "Punto turístico vinculado al Riachuelo, desarrollado con criterios de accesibilidad y diseño inclusivo.",
    coverImage: "/images/projects/turistic-point.jpg",
    coverAlt:
      "Proyecto arquitectónico Turistic Point junto al Riachuelo",
    behanceUrl:
      "https://www.behance.net/gallery/183699821/Turistic-Point",
    tools: [
      "Autodesk Revit",
      "Lumion",
      "GIS",
    ],
    facts: [
      {
        label: "Ubicación",
        value: "Riachuelo, Argentina",
      },
      {
        label: "Tipología",
        value: "Punto turístico",
      },
      {
        label: "Enfoque",
        value: "Accesibilidad",
      },
      {
        label: "Publicación",
        value: "2023",
      },
    ],
  },
  {
    slug: "udla",
    number: "05",
    title: "University of Americas",
    category: "Arquitectura educativa",
    location: "Ecuador",
    year: "2023",
    summary:
      "Trabajo de arquitectura educativa desarrollado mediante esquemas axonométricos y procesos BIM.",
    coverImage: "/images/projects/udla.webp",
    coverAlt:
      "Proyecto para University of Americas en Ecuador",
    behanceUrl:
      "https://www.behance.net/gallery/183697801/University-of-Americas-Ecuator-%28UDLA%29",
    tools: [
      "Autodesk Revit",
      "AutoCAD",
      "BIM",
    ],
    facts: [
      {
        label: "Ubicación",
        value: "Ecuador",
      },
      {
        label: "Tipología",
        value: "Arquitectura educativa",
      },
      {
        label: "Representación",
        value: "Axonometrías y esquemas",
      },
      {
        label: "Publicación",
        value: "2023",
      },
    ],
  },
  {
    slug: "bim-documentation",
    number: "06",
    title: "BIM Documentation",
    category: "Modelado y documentación",
    location: "Información no especificada",
    year: "2023",
    summary:
      "Trabajo de modelado 3D y documentación BIM aplicado a sistemas arquitectónicos, mecánicos y eléctricos.",
    coverImage: "/images/projects/bim-documentation.webp",
    coverAlt:
      "Planos y documentación técnica del proyecto BIM Documentation",
    behanceUrl:
      "https://www.behance.net/gallery/183699571/BIM-Documentation",
    tools: [
      "Autodesk Revit",
      "Modelado 3D",
      "Documentación BIM",
    ],
    facts: [
      {
        label: "Área",
        value: "Documentación BIM",
      },
      {
        label: "Alcance",
        value: "Arquitectura e instalaciones",
      },
      {
        label: "Proceso",
        value: "Modelado 3D",
      },
      {
        label: "Publicación",
        value: "2023",
      },
    ],
  },
];