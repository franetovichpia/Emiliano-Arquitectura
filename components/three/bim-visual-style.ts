import type {
  Color,
  Material,
  MeshStandardMaterial,
  Scene,
  WebGLRenderer,
} from "three";
import {
  DirectionalLight,
  DoubleSide,
  HemisphereLight,
  PMREMGenerator,
} from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

type FinishableMaterial = Material & {
  color?: Color;
  roughness?: MeshStandardMaterial["roughness"];
  metalness?: MeshStandardMaterial["metalness"];
  envMapIntensity?: MeshStandardMaterial["envMapIntensity"];
};

type MaterialProfile = {
  roughness: number;
  metalness: number;
  envMapIntensity: number;
  opacity?: number;
  doubleSided?: boolean;
};

type BimVisualEnvironmentOptions = {
  scene: Scene;
  renderer: WebGLRenderer;
};

type BimVisualEnvironment = {
  dispose: () => void;
};

const metalColors = new Set([
  "949fa6",
  "b88029",
  "4d575e",
  "616b73",
  "576e7a",
  "adb8bf",
  "a3b0b8",
  "9eabb3",
  "758f9e",
  "99a8b3",
  "8f9ea8",
  "4d5963",
]);

const woodColors = new Set([
  "8c5c2e",
  "c29c6b",
  "b8ad91",
  "ad7a45",
  "7a4a29",
  "94663b",
  "a18052",
]);

const vegetationColors = new Set([
  "4e7d3a",
  "5b8f45",
  "769b55",
  "698b4c",
  "496d37",
]);

const concreteColors = new Set([
  "aaa7a0",
  "a8a39a",
  "99968f",
  "b2aea5",
  "8f8980",
]);

const ceramicColors = new Set([
  "dedbd2",
  "e6e2da",
  "f0ede6",
  "d7d4ce",
]);

const glassProfiles = new Map<
  string,
  MaterialProfile
>([
  [
    "7ac2db",
    {
      roughness: 0.08,
      metalness: 0,
      envMapIntensity: 1.35,
      opacity: 0.28,
      doubleSided: true,
    },
  ],
  [
    "214f6b",
    {
      roughness: 0.12,
      metalness: 0,
      envMapIntensity: 1.2,
      opacity: 0.62,
      doubleSided: true,
    },
  ],
  [
    "941214",
    {
      roughness: 0.1,
      metalness: 0,
      envMapIntensity: 1.25,
      opacity: 0.42,
      doubleSided: true,
    },
  ],
]);

const defaultProfile: MaterialProfile = {
  roughness: 0.72,
  metalness: 0,
  envMapIntensity: 0.65,
};

const metalProfile: MaterialProfile = {
  roughness: 0.23,
  metalness: 0.88,
  envMapIntensity: 1.2,
};

const brushedMetalProfile: MaterialProfile = {
  roughness: 0.38,
  metalness: 0.76,
  envMapIntensity: 1,
};

const mirrorProfile: MaterialProfile = {
  roughness: 0.06,
  metalness: 0.92,
  envMapIntensity: 1.45,
};

const woodProfile: MaterialProfile = {
  roughness: 0.7,
  metalness: 0,
  envMapIntensity: 0.5,
};

const concreteProfile: MaterialProfile = {
  roughness: 0.92,
  metalness: 0,
  envMapIntensity: 0.32,
};

const stoneProfile: MaterialProfile = {
  roughness: 0.76,
  metalness: 0,
  envMapIntensity: 0.48,
};

const ceramicProfile: MaterialProfile = {
  roughness: 0.26,
  metalness: 0,
  envMapIntensity: 0.72,
};

const vegetationProfile: MaterialProfile = {
  roughness: 0.94,
  metalness: 0,
  envMapIntensity: 0.24,
};

function normalizeMaterialName(
  value: string,
) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function getMaterialProfile(
  material: FinishableMaterial,
): MaterialProfile {
  const colorHex =
    material.color
      ?.getHexString()
      .toLowerCase() ?? "";

  const materialName =
    normalizeMaterialName(
      material.name ?? "",
    );

  const glassProfile =
    glassProfiles.get(colorHex);

  if (glassProfile) {
    return glassProfile;
  }

  if (
    /espejo|mirror/.test(materialName) ||
    colorHex === "adc9d6"
  ) {
    return mirrorProfile;
  }

  if (
    /vidrio|glass|cristal|transparente|tonalizado/.test(
      materialName,
    ) ||
    (material.transparent &&
      material.opacity < 0.85)
  ) {
    return {
      roughness: 0.1,
      metalness: 0,
      envMapIntensity: 1.25,
      opacity:
        material.opacity > 0 &&
        material.opacity < 1
          ? material.opacity
          : 0.4,
      doubleSided: true,
    };
  }

  if (
    metalColors.has(colorHex) ||
    /acero|aluminio|metal|cromo|chrome|brass|perfil|bulon/.test(
      materialName,
    )
  ) {
    if (
      /inoxidable|chrome|cromo|brass/.test(
        materialName,
      )
    ) {
      return metalProfile;
    }

    return brushedMetalProfile;
  }

  if (
    woodColors.has(colorHex) ||
    /madera|pino|mdf|holz|birke|placa/.test(
      materialName,
    )
  ) {
    return woodProfile;
  }

  if (
    concreteColors.has(colorHex) ||
    /hormig|concrete|revoque|cemento/.test(
      materialName,
    )
  ) {
    return concreteProfile;
  }

  if (
    /piedra|granito|solado|vereda|ladrillo/.test(
      materialName,
    )
  ) {
    return stoneProfile;
  }

  if (
    ceramicColors.has(colorHex) ||
    /ceram|porcelana|vitreous|sanitario/.test(
      materialName,
    )
  ) {
    return ceramicProfile;
  }

  if (
    vegetationColors.has(colorHex) ||
    /arbol|pasto|hoja|cantero/.test(
      materialName,
    )
  ) {
    return vegetationProfile;
  }

  return defaultProfile;
}

function hasPbrProperties(
  material: FinishableMaterial,
) {
  return (
    typeof material.roughness === "number" &&
    typeof material.metalness === "number"
  );
}

export function applyBimMaterialFinish(
  material: Material,
) {
  if (
    "isLodMaterial" in material &&
    material.isLodMaterial
  ) {
    return false;
  }

  const finishableMaterial =
    material as FinishableMaterial;

  const profile = getMaterialProfile(
    finishableMaterial,
  );

  if (
    hasPbrProperties(finishableMaterial)
  ) {
    finishableMaterial.roughness =
      profile.roughness;

    finishableMaterial.metalness =
      profile.metalness;

    if (
      typeof finishableMaterial.envMapIntensity ===
      "number"
    ) {
      finishableMaterial.envMapIntensity =
        profile.envMapIntensity;
    }
  }

  if (profile.opacity !== undefined) {
    finishableMaterial.transparent = true;
    finishableMaterial.opacity =
      profile.opacity;
    finishableMaterial.depthWrite = false;
    finishableMaterial.depthTest = true;
  }

  if (profile.doubleSided) {
    finishableMaterial.side = DoubleSide;
  }

  finishableMaterial.needsUpdate = true;

  return true;
}

export function createBimVisualEnvironment({
  scene,
  renderer,
}: BimVisualEnvironmentOptions): BimVisualEnvironment {
  const previousEnvironment =
    scene.environment;

  const roomEnvironment =
    new RoomEnvironment();

  const pmremGenerator =
    new PMREMGenerator(renderer);

  const environmentTarget =
    pmremGenerator.fromScene(
      roomEnvironment,
      0.04,
    );

  scene.environment =
    environmentTarget.texture;

  const hemisphereLight =
    new HemisphereLight(
      "#dcecf3",
      "#26323b",
      0.48,
    );

  hemisphereLight.name =
    "BIM Hemisphere Light";

  const keyLight =
    new DirectionalLight(
      "#fff1dc",
      0.72,
    );

  keyLight.name = "BIM Key Light";
  keyLight.position.set(35, 55, 25);

  const fillLight =
    new DirectionalLight(
      "#8ab9d0",
      0.28,
    );

  fillLight.name = "BIM Fill Light";
  fillLight.position.set(
    -30,
    25,
    -35,
  );

  scene.add(
    hemisphereLight,
    keyLight,
    fillLight,
  );

  roomEnvironment.dispose();
  pmremGenerator.dispose();

  return {
    dispose() {
      scene.remove(
        hemisphereLight,
        keyLight,
        fillLight,
      );

      if (
        scene.environment ===
        environmentTarget.texture
      ) {
        scene.environment =
          previousEnvironment;
      }

      environmentTarget.dispose();
    },
  };
}