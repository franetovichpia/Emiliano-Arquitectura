import type { BimMaterialInfo, MaterialFinish } from "@/lib/db/schemas";
import type { BimModelFormat } from "@/data/bim-projects";
import type { FinishableMaterial } from "@/components/three/bim-visual-style";
import { guessMaterialFinish } from "@/components/three/bim-visual-style";
import { humanizeIfcCategory } from "@/components/three/bim-category-labels";

/**
 * Loads an IFC/fragments buffer headlessly (no renderer, no scene) purely to
 * enumerate its distinct materials, so the admin panel can offer a
 * per-material finish override without Emiliano exporting anything extra.
 */
export async function extractMaterialsFromModel(
  buffer: Uint8Array,
  modelFormat: BimModelFormat,
): Promise<BimMaterialInfo[]> {
  const OBC = await import("@thatopen/components");

  const components = new OBC.Components();
  components.init();

  const fragments = components.get(OBC.FragmentsManager);
  fragments.init("/workers/fragments-worker.mjs");

  const found = new Map<string, BimMaterialInfo>();

  fragments.core.models.materials.list.onItemSet.add(
    ({ value: material }) => {
      const finishableMaterial =
        material as unknown as FinishableMaterial;

      if (
        "isLodMaterial" in material &&
        (material as unknown as { isLodMaterial?: boolean })
          .isLodMaterial
      ) {
        return;
      }

      /*
       * @thatopen/fragments no expone el nombre IFC del
       * material en tiempo de ejecución (solo color/opacidad),
       * así que el color es el único identificador estable
       * disponible tanto acá como en el visor público.
       */
      const colorHex = finishableMaterial.color
        ?.getHexString()
        .toLowerCase();

      const key = colorHex
        ? colorHex
        : `sin-color-${found.size}`;

      if (found.has(key)) {
        return;
      }

      const name =
        finishableMaterial.name?.trim() ||
        (colorHex
          ? `Material #${colorHex}`
          : `Material ${found.size + 1}`);

      found.set(key, {
        key,
        name,
        colorHex: colorHex ? `#${colorHex}` : undefined,
        opacity:
          typeof finishableMaterial.opacity === "number"
            ? finishableMaterial.opacity
            : undefined,
        suggestedFinish: guessMaterialFinish(
          finishableMaterial,
        ) as MaterialFinish,
      });
    },
  );

  const modelId = `extraction-${Date.now()}`;

  try {
    if (modelFormat === "ifc") {
      const ifcLoader = components.get(OBC.IfcLoader);

      await ifcLoader.setup({
        autoSetWasm: false,
        wasm: {
          path: "/wasm/",
          absolute: true,
        },
      });

      await ifcLoader.load(buffer, false, modelId);
    } else {
      await fragments.core.load(buffer, { modelId });
    }

    await fragments.core.update(true);
  } finally {
    components.dispose();
  }

  return Array.from(found.values());
}

/**
 * Loads an IFC/fragments buffer headlessly, igual que
 * extractMaterialsFromModel, pero para enumerar las categorías
 * IFC con geometría propia (muros, pisos, ventanas, etc.), así
 * el admin puede cargar avance por categoría sin volver a abrir
 * el visor 3D.
 */
export async function extractCategoriesFromModel(
  buffer: Uint8Array,
  modelFormat: BimModelFormat,
): Promise<string[]> {
  const OBC = await import("@thatopen/components");

  const components = new OBC.Components();
  components.init();

  const fragments = components.get(OBC.FragmentsManager);
  fragments.init("/workers/fragments-worker.mjs");

  const modelId = `extraction-${Date.now()}`;
  const categories = new Set<string>();

  try {
    let loadedModel;

    if (modelFormat === "ifc") {
      const ifcLoader = components.get(OBC.IfcLoader);

      await ifcLoader.setup({
        autoSetWasm: false,
        wasm: {
          path: "/wasm/",
          absolute: true,
        },
      });

      loadedModel = await ifcLoader.load(
        buffer,
        false,
        modelId,
      );
    } else {
      loadedModel = await fragments.core.load(buffer, {
        modelId,
      });
    }

    await fragments.core.update(true);

    if (loadedModel) {
      const modelItemIds =
        await loadedModel.getItemsIdsWithGeometry();

      const geometryCategories =
        modelItemIds.length > 0
          ? await loadedModel.getItemsWithGeometryCategories()
          : [];

      geometryCategories.forEach((rawCategory) => {
        if (!rawCategory) {
          return;
        }

        categories.add(humanizeIfcCategory(rawCategory));
      });
    }
  } finally {
    components.dispose();
  }

  return Array.from(categories).sort();
}