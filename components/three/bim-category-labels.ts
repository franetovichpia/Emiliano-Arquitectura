const CATEGORY_LABELS: Record<string, string> = {
  IFCWALL: "Muros",
  IFCWALLSTANDARDCASE: "Muros",
  IFCCURTAINWALL: "Muro cortina",
  IFCSLAB: "Losas y pisos",
  IFCROOF: "Techos",
  IFCDOOR: "Puertas",
  IFCWINDOW: "Ventanas",
  IFCBEAM: "Vigas",
  IFCCOLUMN: "Columnas",
  IFCMEMBER: "Elementos estructurales",
  IFCPLATE: "Placas",
  IFCSTAIR: "Escaleras",
  IFCSTAIRFLIGHT: "Escaleras",
  IFCRAMP: "Rampas",
  IFCRAMPFLIGHT: "Rampas",
  IFCRAILING: "Barandas",
  IFCFOOTING: "Fundaciones",
  IFCPILE: "Pilotes",
  IFCCOVERING: "Revestimientos",
  IFCFURNISHINGELEMENT: "Mobiliario",
  IFCSPACE: "Espacios",
  IFCBUILDING: "Edificio",
  IFCBUILDINGSTOREY: "Niveles",
  IFCSITE: "Terreno",
  IFCSANITARYTERMINAL: "Artefactos sanitarios",
  IFCLIGHTFIXTURE: "Iluminación",
  IFCFLOWTERMINAL: "Instalaciones",
  IFCFLOWSEGMENT: "Instalaciones",
  IFCFLOWFITTING: "Instalaciones",
  IFCBUILDINGELEMENTPROXY: "Otros elementos",
};

export function humanizeIfcCategory(
  category: string,
): string {
  const mapped = CATEGORY_LABELS[category.toUpperCase()];

  if (mapped) {
    return mapped;
  }

  const withoutPrefix = category
    .toUpperCase()
    .startsWith("IFC")
    ? category.slice(3)
    : category;

  return withoutPrefix
    .toLowerCase()
    .replace(/^./, (char) => char.toUpperCase());
}
