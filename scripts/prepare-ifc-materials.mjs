import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptsDirectory = path.dirname(
  fileURLToPath(import.meta.url),
);

const projectRoot = path.resolve(
  scriptsDirectory,
  "..",
);

const inputPath = path.join(
  projectRoot,
  "public",
  "models",
  "crea-studios-ifc4.ifc",
);

const outputPath = path.join(
  projectRoot,
  "public",
  "models",
  "crea-studios-materials.ifc",
);

const styleRules = new Map([
  ["Acero inoxidable", {
    color: "#949fa6",
  }],
  ["Arboles - Copa", {
    color: "#3d6b33",
  }],
  ["Arboles - Tronco", {
    color: "#57331a",
  }],
  ["Asc MASA", {
    color: "#808587",
  }],
  ["Brass - Zurn", {
    color: "#b88029",
  }],
  ["Bulones 1", {
    color: "#4d575e",
  }],
  ["Bulones 2", {
    color: "#616b73",
  }],
  ["Cantero", {
    color: "#665c45",
  }],
  ["Carpinteria Aluminio1", {
    color: "#576e7a",
  }],
  ["Cer\\X\\E1mica blanca", {
    color: "#e0e0d6",
  }],
  [
    "Chrome - Zurn - Nickel Plated - Polished",
    {
      color: "#adb8bf",
    },
  ],
  ["Chrome Finish", {
    color: "#a3b0b8",
  }],
  ["Columna CantoA", {
    color: "#7a8082",
  }],
  ["cORDON pIEDRA V3", {
    color: "#6b6e69",
  }],
  ["Cromo", {
    color: "#9eabb3",
  }],
  ["Default Floor", {
    color: "#8a857a",
  }],
  ["Espejo", {
    color: "#adc9d6",
    transparency: 0.04,
  }],
  ["Granito Gris Mara", {
    color: "#616466",
  }],
  ["Hoja", {
    color: "#8c5c2e",
  }],
  ["Holz - Birke", {
    color: "#c29c6b",
  }],
  ["Hormig\\X\\F3n", {
    color: "#8a8f91",
  }],
  ["Ladrillo Hueco 12cm", {
    color: "#94452e",
  }],
  ["Laminado - Lino, Mate", {
    color: "#b8ad91",
  }],
  ["Madera - Pino", {
    color: "#ad7a45",
  }],
  ["Maderas - MDF", {
    color: "#7a4a29",
  }],
  ["Maderas - Placa", {
    color: "#94663b",
  }],
  ["Metal - Aluminio", {
    color: "#758f9e",
  }],
  ["Metal - Cromo", {
    color: "#99a8b3",
  }],
  ["Metales - Acero Inoxidable", {
    color: "#8f9ea8",
  }],
  ["Paint - Zurn - Black", {
    color: "#0a0d0f",
  }],
  ["Panel 1 - Opaco", {
    color: "#b8bdb8",
    transparency: 0,
  }],
  ["Panel 2 - Transparente", {
    color: "#7ac2db",
    transparency: 0.72,
  }],
  ["Panel 3 - Tonalizado", {
    color: "#214f6b",
    transparency: 0.38,
  }],
  ["Pasto3", {
    color: "#4a7a38",
  }],
  ["Peinture - Blanc", {
    color: "#dedbd0",
  }],
  ["Perfil Fracteel", {
    color: "#4d5963",
  }],
  ["Plastic", {
    color: "#576166",
  }],
  ["Porcelana Blanca", {
    color: "#e8e6d9",
  }],
  ["Revestimiento - Sanitarios Vip", {
    color: "#8caab5",
  }],
  ["Revoque Bajo Revestimento", {
    color: "#b3ada1",
  }],
  ["Revoque Gr+Fino Interior", {
    color: "#d1ccbd",
  }],
  ["Solado Exterior", {
    color: "#7a7363",
  }],
  ["Solado Intermedio EXT", {
    color: "#807563",
  }],
  ["Solado Intermedio EXT2", {
    color: "#636e70",
  }],
  ["Terminaciones - Espejo", {
    color: "#adc9d6",
    transparency: 0.04,
  }],
  ["Textil - Bamb\\X\\FA entrelazado", {
    color: "#a18052",
  }],
  ["Vereda Garage", {
    color: "#6e706b",
  }],
  ["Vidrio Rojo", {
    color: "#941214",
    transparency: 0.58,
  }],
  ["Viga Canto A", {
    color: "#757a7d",
  }],
  ["Vitreous China", {
    color: "#e6e6db",
  }],
]);

const numberPattern =
  "[+-]?(?:\\d+(?:\\.\\d*)?|\\.\\d+)(?:E[+-]?\\d+)?";

function escapeRegex(value) {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&",
  );
}

function hexToRgb(hexColor) {
  const value = Number.parseInt(
    hexColor.replace("#", ""),
    16,
  );

  return [
    ((value >> 16) & 255) / 255,
    ((value >> 8) & 255) / 255,
    (value & 255) / 255,
  ];
}

function format(value) {
  return value.toFixed(3);
}

function findSurfaceItemId(
  source,
  styleName,
) {
  const pattern = new RegExp(
    [
      "#\\d+=IFCSURFACESTYLE\\(",
      "\\s*'",
      escapeRegex(styleName),
      "'\\s*,",
      "\\s*\\.[A-Z]+\\.\\s*,",
      "\\s*\\(\\s*(#\\d+)\\s*\\)",
      "\\s*\\);",
    ].join(""),
    "i",
  );

  return source.match(pattern)?.[1] ?? null;
}

function findColorId(
  source,
  surfaceItemId,
) {
  const pattern = new RegExp(
    [
      escapeRegex(surfaceItemId),
      "=IFCSURFACESTYLE",
      "(?:RENDERING|SHADING)",
      "\\(\\s*(#\\d+)",
    ].join(""),
    "i",
  );

  return source.match(pattern)?.[1] ?? null;
}

function updateColor(
  source,
  colorId,
  hexColor,
) {
  const pattern = new RegExp(
    [
      "(",
      escapeRegex(colorId),
      "=IFCCOLOURRGB\\(",
      "\\s*(?:\\$|'(?:''|[^'])*')",
      "\\s*,\\s*",
      ")",
      numberPattern,
      "(\\s*,\\s*)",
      numberPattern,
      "(\\s*,\\s*)",
      numberPattern,
      "(\\s*\\);)",
    ].join(""),
    "i",
  );

  if (!pattern.test(source)) {
    return null;
  }

  const [
    red,
    green,
    blue,
  ] = hexToRgb(hexColor);

  return source.replace(
    pattern,
    (
      _,
      prefix,
      separator1,
      separator2,
      suffix,
    ) => {
      return [
        prefix,
        format(red),
        separator1,
        format(green),
        separator2,
        format(blue),
        suffix,
      ].join("");
    },
  );
}

function updateTransparency(
  source,
  surfaceItemId,
  transparency,
) {
  const escapedId =
    escapeRegex(surfaceItemId);

  const existingTransparency =
    new RegExp(
      [
        "(",
        escapedId,
        "=IFCSURFACESTYLE",
        "(?:RENDERING|SHADING)",
        "\\(\\s*#\\d+\\s*,\\s*",
        ")",
        "(?:\\$|",
        numberPattern,
        ")",
        "(\\s*[,\\)])",
      ].join(""),
      "i",
    );

  if (
    existingTransparency.test(source)
  ) {
    return source.replace(
      existingTransparency,
      (_, prefix, suffix) => {
        return [
          prefix,
          format(transparency),
          suffix,
        ].join("");
      },
    );
  }

  const shadingWithoutTransparency =
    new RegExp(
      [
        "(",
        escapedId,
        "=IFCSURFACESTYLESHADING\\(",
        "\\s*#\\d+",
        ")",
        "(\\s*\\);)",
      ].join(""),
      "i",
    );

  if (
    shadingWithoutTransparency.test(
      source,
    )
  ) {
    return source.replace(
      shadingWithoutTransparency,
      (_, prefix, suffix) => {
        return [
          prefix,
          ",",
          format(transparency),
          suffix,
        ].join("");
      },
    );
  }

  return null;
}

async function prepareIfcMaterials() {
  console.log(
    "Leyendo modelo IFC original...",
  );

  const inputBuffer = await fs.readFile(
    inputPath,
  );

  let source =
    inputBuffer.toString("latin1");

  if (
    !source.includes("ISO-10303-21;") ||
    !source.includes(
      "END-ISO-10303-21;",
    )
  ) {
    throw new Error(
      "El archivo de origen no parece ser un IFC STEP válido.",
    );
  }

  let updated = 0;
  const skipped = [];

  for (
    const [
      styleName,
      rule,
    ] of styleRules
  ) {
    const surfaceItemId =
      findSurfaceItemId(
        source,
        styleName,
      );

    if (!surfaceItemId) {
      skipped.push(
        `${styleName}: estilo no encontrado`,
      );
      continue;
    }

    const colorId = findColorId(
      source,
      surfaceItemId,
    );

    if (!colorId) {
      skipped.push(
        `${styleName}: referencia de color no encontrada`,
      );
      continue;
    }

    const sourceWithColor = updateColor(
      source,
      colorId,
      rule.color,
    );

    if (!sourceWithColor) {
      skipped.push(
        `${styleName}: color no modificable`,
      );
      continue;
    }

    source = sourceWithColor;

    if (
      typeof rule.transparency ===
      "number"
    ) {
      const sourceWithTransparency =
        updateTransparency(
          source,
          surfaceItemId,
          rule.transparency,
        );

      if (!sourceWithTransparency) {
        skipped.push(
          `${styleName}: transparencia no modificable`,
        );
      } else {
        source =
          sourceWithTransparency;
      }
    }

    updated += 1;

    console.log(
      `✓ ${styleName}`,
    );
  }

  await fs.writeFile(
    outputPath,
    Buffer.from(source, "latin1"),
  );

  const outputStats = await fs.stat(
    outputPath,
  );

  console.log("");
  console.log(
    `Estilos actualizados: ${updated}`,
  );

  if (skipped.length > 0) {
    console.log("");
    console.log(
      "Estilos omitidos o parcialmente modificados:",
    );

    for (const message of skipped) {
      console.log(`- ${message}`);
    }
  }

  console.log("");
  console.log(
    "Modelo IFC preparado correctamente:",
  );
  console.log(outputPath);

  console.log(
    `Tamaño: ${(
      outputStats.size /
      1024 /
      1024
    ).toFixed(2)} MB`,
  );
}

prepareIfcMaterials().catch(
  (error) => {
    console.error("");
    console.error(
      "No se pudo preparar el modelo IFC.",
    );

    console.error(
      error instanceof Error
        ? error.message
        : error,
    );

    process.exitCode = 1;
  },
);