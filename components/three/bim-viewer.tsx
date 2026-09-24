"use client";

import type {
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  ReactNode,
} from "react";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import type {
  OrthoPerspectiveCamera,
  SimpleRenderer,
  SimpleScene,
} from "@thatopen/components";
import type { Box3, Vector3 } from "three";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Boxes,
  Check,
  Footprints,
  Layers,
  Loader2,
  Maximize2,
  Minimize2,
  RotateCcw,
  Shapes,
  SlidersHorizontal,
} from "lucide-react";

import {
  applyBimMaterialFinish,
  createBimVisualEnvironment,
  getMaterialDisplayName,
} from "@/components/three/bim-visual-style";
import { humanizeIfcCategory } from "@/components/three/bim-category-labels";
import type { BimModelFormat } from "@/data/bim-projects";
import type { BimMaterialInfo, MaterialFinish } from "@/lib/db/schemas";
import { cn } from "@/utils/cn";

type BimViewerProps = {
  modelFormat: BimModelFormat;
  modelName: string;
  modelUrl: string;
  materials?: readonly BimMaterialInfo[];
  materialOverrides?: Record<string, MaterialFinish>;
};

type ViewerStatus =
  | "initializing"
  | "loading"
  | "loaded"
  | "error";

type CameraMode =
  | "orbit"
  | "walk";

type NavigationAction =
  | "forward"
  | "backward"
  | "left"
  | "right"
  | "up"
  | "down";

type ResetViewFunction = () => Promise<void>;

type NavigateFunction = (
  action: NavigationAction,
) => Promise<void>;

type StartWalkFunction = (
  clientX: number,
  clientY: number,
) => Promise<boolean>;

type VisibilityMode = "ghost" | "hide";

type ApplySelectionFunction = (
  categories: ReadonlySet<string>,
  materialKeys: ReadonlySet<string>,
  mode: VisibilityMode,
  ghostOpacity: number,
) => Promise<void>;

type MovementButtonProps = {
  action: NavigationAction;
  ariaLabel: string;
  children: ReactNode;
  disabled: boolean;
  onNavigate: (
    action: NavigationAction,
  ) => void;
  className?: string;
};

/*
 * Color con el que se resalta lo seleccionado
 * en modo "Transparentar", para que se distinga
 * claramente sobre el resto del modelo atenuado.
 */
const GHOST_HIGHLIGHT_COLOR = "#3fb6ff";

const navigationByKey: Record<
  string,
  NavigationAction
> = {
  arrowup: "forward",
  w: "forward",
  arrowdown: "backward",
  s: "backward",
  arrowleft: "left",
  a: "left",
  arrowright: "right",
  d: "right",
  q: "up",
  e: "down",
};

function createModelId(modelName: string) {
  const normalizedName = modelName
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return normalizedName || "modelo-openbim";
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "No fue posible preparar el modelo BIM.";
}

function MovementButton({
  action,
  ariaLabel,
  children,
  disabled,
  onNavigate,
  className,
}: MovementButtonProps) {
  return (
    <button
      aria-label={ariaLabel}
      className={cn(
        "glass-interactive grid size-9 place-items-center rounded-lg border border-white/15 bg-white/[0.07] text-white transition-colors duration-200 hover:border-[#85b6ce]/45 hover:bg-[#85b6ce]/15 disabled:cursor-not-allowed disabled:opacity-30",
        className,
      )}
      disabled={disabled}
      onClick={() => {
        onNavigate(action);
      }}
      type="button"
    >
      {children}
    </button>
  );
}

export function BimViewer({
  modelFormat,
  modelName,
  modelUrl,
  materials,
  materialOverrides,
}: BimViewerProps) {
  const viewerContainerRef =
    useRef<HTMLDivElement | null>(null);

  const viewerShellRef =
    useRef<HTMLDivElement | null>(null);

  const resetViewRef =
    useRef<ResetViewFunction | null>(null);

  const navigateRef =
    useRef<NavigateFunction | null>(null);

  const startWalkRef =
    useRef<StartWalkFunction | null>(null);

  const applySelectionRef =
    useRef<ApplySelectionFunction | null>(
      null,
    );

  const activeViewerSessionRef =
    useRef<symbol | null>(null);

  const [
    selectedCategories,
    setSelectedCategories,
  ] = useState<Set<string>>(new Set());

  const [
    selectedMaterialKeys,
    setSelectedMaterialKeys,
  ] = useState<Set<string>>(new Set());

  const [visibilityMode, setVisibilityMode] =
    useState<VisibilityMode>("ghost");

  const [ghostOpacity, setGhostOpacity] =
    useState(0.16);

  const [isFilterPanelOpen, setIsFilterPanelOpen] =
    useState(false);

  const [
    availableMaterialColors,
    setAvailableMaterialColors,
  ] = useState<Set<string>>(new Set());

  const [
    availableCategories,
    setAvailableCategories,
  ] = useState<string[]>([]);

  const [status, setStatus] =
    useState<ViewerStatus>("initializing");

  const [stage, setStage] = useState(
    "Inicializando visor",
  );

  const [progress, setProgress] =
    useState(0);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [isFullscreen, setIsFullscreen] =
    useState(false);

  const [cameraMode, setCameraMode] =
    useState<CameraMode>("orbit");

  const [
    isSelectingWalkStart,
    setIsSelectingWalkStart,
  ] = useState(false);

  const [
    walkSelectionMessage,
    setWalkSelectionMessage,
  ] = useState<string | null>(null);

  useEffect(() => {
    const viewerSessionId = Symbol(
      "bim-viewer-session",
    );

    activeViewerSessionRef.current =
      viewerSessionId;

    let disposed = false;
    let initializationSettled = false;
    let resourcesDisposed = false;

    let activeCameraMode:
      CameraMode = "orbit";

    const abortController =
      new AbortController();

    let componentsInstance:
      | import("@thatopen/components").Components
      | null = null;

    let removeCameraListener:
      | (() => void)
      | null = null;

    let disposeVisualEnvironment:
      | (() => void)
      | null = null;

    const disposeResources = () => {
      if (resourcesDisposed) {
        return;
      }

      resourcesDisposed = true;

      if (
        activeViewerSessionRef.current ===
        viewerSessionId
      ) {
        resetViewRef.current = null;
        navigateRef.current = null;
        startWalkRef.current = null;
        applySelectionRef.current = null;

        activeViewerSessionRef.current = null;
      }

      removeCameraListener?.();
      removeCameraListener = null;

      disposeVisualEnvironment?.();
      disposeVisualEnvironment = null;

      componentsInstance?.dispose();
      componentsInstance = null;
    };

    const initializeViewer = async () => {
      const container =
        viewerContainerRef.current;

      if (!container) {
        throw new Error(
          "No se encontró el contenedor del visor.",
        );
      }

      setStatus("initializing");
      setStage("Inicializando entorno OpenBIM");
      setProgress(0);
      setErrorMessage(null);
      setSelectedCategories(new Set());
      setSelectedMaterialKeys(new Set());
      setIsFilterPanelOpen(false);
      setAvailableMaterialColors(new Set());
      setAvailableCategories([]);

      const [THREE, OBC] =
        await Promise.all([
          import("three"),
          import("@thatopen/components"),
        ]);

      if (disposed) {
        return;
      }

      const components =
        new OBC.Components();

      componentsInstance = components;

      const worlds =
        components.get(OBC.Worlds);

      const world = worlds.create<
        SimpleScene,
        OrthoPerspectiveCamera,
        SimpleRenderer
      >();

      const scene =
        new OBC.SimpleScene(components);

      world.scene = scene;
      scene.setup();

      scene.three.background =
        new THREE.Color("#071d31");

      const renderer =
        new OBC.SimpleRenderer(
          components,
          container,
          {
            antialias: true,
            alpha: false,
            powerPreference:
              "high-performance",
          },
        );

      world.renderer = renderer;

      renderer.three.setPixelRatio(
        Math.min(
          window.devicePixelRatio,
          1.5,
        ),
      );

      renderer.three.outputColorSpace =
        THREE.SRGBColorSpace;

      renderer.three.toneMapping =
        THREE.ACESFilmicToneMapping;

      renderer.three.toneMappingExposure =
        1.1;

      renderer.showLogo = false;

      const visualEnvironment =
        createBimVisualEnvironment({
          scene: scene.three,
          renderer: renderer.three,
        });

      disposeVisualEnvironment =
        visualEnvironment.dispose;

      const camera =
        new OBC.OrthoPerspectiveCamera(
          components,
        );

      world.camera = camera;

      components.init();

      /*
       * Reduce el recorte cuando la cámara
       * está cerca de muros u objetos.
       */
      camera.three.near = 0.05;
      camera.three.updateProjectionMatrix();

      const configureOrbitControls = (
        smoothTime = 0.18,
      ) => {
        activeCameraMode = "orbit";

        camera.controls.stop();

        camera.controls.minDistance = 0.1;
        camera.controls.maxDistance =
          Number.POSITIVE_INFINITY;

        camera.controls.dollyToCursor = true;
        camera.controls.infinityDolly = true;
        camera.controls.verticalDragToForward =
          false;

        camera.controls.azimuthRotateSpeed = 1;
        camera.controls.polarRotateSpeed = 1;
        camera.controls.truckSpeed = 2;
        camera.controls.dollySpeed = 1;

        camera.controls.smoothTime = smoothTime;
        camera.controls.draggingSmoothTime =
          0.08;

        setCameraMode("orbit");
        setIsSelectingWalkStart(false);
        setWalkSelectionMessage(null);
      };

      const configureWalkControls = () => {
        activeCameraMode = "walk";

        camera.controls.stop();

        /*
         * Una distancia fija y pequeña entre
         * la cámara y su objetivo genera una
         * vista similar a primera persona.
         */
        camera.controls.minDistance = 1;
        camera.controls.maxDistance = 1;

        camera.controls.dollyToCursor = false;
        camera.controls.infinityDolly = true;
        camera.controls.verticalDragToForward =
          false;

        camera.controls.azimuthRotateSpeed =
          -0.35;

        camera.controls.polarRotateSpeed =
          -0.35;

        camera.controls.truckSpeed = 1;
        camera.controls.dollySpeed = 0.45;

        camera.controls.smoothTime = 0.12;
        camera.controls.draggingSmoothTime =
          0.06;

        setCameraMode("walk");
        setIsSelectingWalkStart(false);
        setWalkSelectionMessage(null);
      };

      configureOrbitControls();

      await camera.controls.setLookAt(
        20,
        28,
        20,
        0,
        0,
        0,
      );

      const grids =
        components.get(OBC.Grids);

      const grid = grids.create(world);

      grid.config.color.set(0x5f91ad);

      world.dynamicAnchor = false;

      const fragments =
        components.get(
          OBC.FragmentsManager,
        );

      fragments.init(
        "/workers/fragments-worker.mjs",
      );

      fragments.core.models.materials.list.onItemSet.add(
        ({ value: material }) => {
          applyBimMaterialFinish(
            material,
            materialOverrides,
          );
        },
      );

      let latestModelBox:
        | Box3
        | null = null;

      let plannedEntranceFlight: {
        from: {
          position: Vector3;
          target: Vector3;
        };
        to: {
          position: Vector3;
          target: Vector3;
        };
      } | null = null;

      const frameModel = async (
        modelBox: Box3,
        smooth: boolean,
        smoothTime = 0.18,
      ) => {
        configureOrbitControls(smoothTime);

        const center =
          modelBox.getCenter(
            new THREE.Vector3(),
          );

        const size =
          modelBox.getSize(
            new THREE.Vector3(),
          );

        const horizontalSize = Math.max(
          size.x,
          size.z,
          1,
        );

        const cameraDistance = Math.max(
          horizontalSize,
          size.y * 3,
          10,
        );

        camera.controls.normalizeRotations();

        await camera.controls.setLookAt(
          center.x + cameraDistance * 0.72,
          center.y + cameraDistance * 0.82,
          center.z + cameraDistance * 0.72,
          center.x,
          center.y,
          center.z,
          smooth,
        );

        await camera.controls.fitToBox(
          modelBox,
          smooth,
        );

        await fragments.core.update(true);
      };

      /*
       * Encuadre inicial "lejano": deja la cámara bien
       * atrás del modelo, sin ajustar todavía. Se usa
       * mientras el visor sigue tapado por la pantalla
       * de carga, para que la primera vez que el usuario
       * ve el modelo sea con la cámara acercándose
       * (frameModel con smooth=true), no ya encuadrado
       * de golpe.
       */
      const setEstablishingShot = (
        modelBox: Box3,
      ) => {
        const center =
          modelBox.getCenter(
            new THREE.Vector3(),
          );

        const size =
          modelBox.getSize(
            new THREE.Vector3(),
          );

        const horizontalSize = Math.max(
          size.x,
          size.z,
          1,
        );

        const cameraDistance =
          Math.max(
            horizontalSize,
            size.y * 3,
            10,
          ) * 2.4;

        const position = new THREE.Vector3(
          center.x + cameraDistance * 0.72,
          center.y + cameraDistance * 0.82,
          center.z + cameraDistance * 0.72,
        );

        camera.controls.setLookAt(
          position.x,
          position.y,
          position.z,
          center.x,
          center.y,
          center.z,
          false,
        );

        return { position, target: center };
      };

      /*
       * Acercamiento inicial cuadro a cuadro: la
       * transición "suave" propia de camera-controls
       * (setLookAt con enableTransition) puede quedar
       * colgada cuando el salto entre el encuadre lejano
       * y el final es muy grande, así que interpolamos
       * la posición y el objetivo nosotros mismos con
       * requestAnimationFrame y aplicamos cada paso de
       * forma instantánea (sin transición interna).
       *
       * `toPosition`/`toTarget` se calculan ANTES de
       * mover la cámara al encuadre lejano (ver más abajo,
       * justo después de definir esta función) — llamar a
       * fitToBox con la cámara ya lejos y en un ángulo
       * arbitrario le hace perder la dirección de vista y
       * termina encuadrando mal.
       */
      const flyToModel = async (
        fromPosition: Vector3,
        fromTarget: Vector3,
        toPosition: Vector3,
        toTarget: Vector3,
        durationMs = 1100,
      ) => {
        camera.controls.setLookAt(
          fromPosition.x,
          fromPosition.y,
          fromPosition.z,
          fromTarget.x,
          fromTarget.y,
          fromTarget.z,
          false,
        );

        const start =
          typeof performance !== "undefined"
            ? performance.now()
            : Date.now();

        const nextFrame = () =>
          new Promise<void>((resolve) => {
            window.requestAnimationFrame(() => {
              resolve();
            });
          });

        let t = 0;

        /*
         * `camera.controls.setLookAt(...)` (instantáneo)
         * recién se aplica a `camera.three.position`
         * después de que pasa un frame — por eso, en
         * cada paso, esperamos un frame ANTES de forzar
         * el render, y renderizamos llamando al
         * renderer directamente (no fragments.core.update,
         * que puede no disparar un render nuevo si no
         * detecta un cambio "oficial" de cámara).
         */
        while (t < 1 && !disposed) {
          const now =
            typeof performance !== "undefined"
              ? performance.now()
              : Date.now();

          t = Math.min(
            (now - start) / durationMs,
            1,
          );

          const eased =
            1 - Math.pow(1 - t, 3);

          camera.controls.setLookAt(
            fromPosition.x +
              (toPosition.x -
                fromPosition.x) *
                eased,
            fromPosition.y +
              (toPosition.y -
                fromPosition.y) *
                eased,
            fromPosition.z +
              (toPosition.z -
                fromPosition.z) *
                eased,
            fromTarget.x +
              (toTarget.x -
                fromTarget.x) *
                eased,
            fromTarget.y +
              (toTarget.y -
                fromTarget.y) *
                eased,
            fromTarget.z +
              (toTarget.z -
                fromTarget.z) *
                eased,
            false,
          );

          await nextFrame();

          if (disposed) {
            return;
          }

          renderer.update();
          void fragments.core.update();
        }

        if (disposed) {
          return;
        }

        await nextFrame();

        if (disposed) {
          return;
        }

        renderer.update();
        await fragments.core.update(true);
      };

      resetViewRef.current =
        async () => {
          if (!latestModelBox) {
            return;
          }

          await frameModel(
            latestModelBox,
            true,
          );
        };

      setStatus("loading");
      setStage("Descargando modelo");
      setProgress(8);

      const response = await fetch(
        modelUrl,
        {
          cache: "force-cache",
          signal: abortController.signal,
        },
      );

      if (!response.ok) {
        throw new Error(
          `No se pudo descargar el modelo (${response.status}).`,
        );
      }

      const arrayBuffer =
        await response.arrayBuffer();

      if (disposed) {
        return;
      }

      const buffer =
        new Uint8Array(arrayBuffer);

      const modelId =
        createModelId(modelName);

      setProgress(18);

      let loadedModel: Awaited<
        ReturnType<
          typeof fragments.core.load
        >
      >;

      if (modelFormat === "ifc") {
        setStage(
          "Procesando archivo IFC",
        );

        const ifcLoader =
          components.get(OBC.IfcLoader);

        await ifcLoader.setup({
          autoSetWasm: false,
          wasm: {
            path: "/wasm/",
            absolute: true,
          },
        });

        loadedModel =
          await ifcLoader.load(
            buffer,
            false,
            modelId,
            {
              processData: {
                progressCallback: (
                  currentProgress,
                ) => {
                  if (disposed) {
                    return;
                  }

                  const percentage =
                    currentProgress <= 1
                      ? currentProgress * 100
                      : currentProgress;

                  const normalizedProgress =
                    18 +
                    Math.min(
                      77,
                      percentage * 0.77,
                    );

                  setProgress(
                    Math.round(
                      normalizedProgress,
                    ),
                  );
                },
              },
            },
          );
      } else {
        setStage(
          "Preparando modelo optimizado",
        );

        loadedModel =
          await fragments.core.load(
            buffer,
            {
              modelId,
              camera: camera.three,
            },
          );
      }

      if (disposed) {
        return;
      }

      loadedModel.useCamera(
        camera.three,
      );

      scene.three.add(
        loadedModel.object,
      );

      const modelItemIds =
        await loadedModel.getItemsIdsWithGeometry();

      if (disposed) {
        return;
      }

      const rawMaterialGroups =
        modelItemIds.length > 0
          ? await loadedModel.getItemsMaterialDefinition(
              modelItemIds,
            )
          : [];

      if (disposed) {
        return;
      }

      /*
       * El color viaja desde el worker por postMessage
       * y pierde el prototipo de THREE.Color (queda
       * como {r,g,b} planos), así que reconstruimos la
       * instancia acá antes de usar getHexString(). De
       * paso, esto también nos da el set de colores que
       * realmente tienen geometría visible: el listado
       * de materiales del admin puede incluir materiales
       * sin geometría propia, y ofrecerlos como filtro
       * los deja sin hacer nada al seleccionarlos.
       */
      const materialGroups = rawMaterialGroups.map(
        (group) => {
          const rawColor = group.definition.color;

          const hex = new THREE.Color(
            rawColor.r,
            rawColor.g,
            rawColor.b,
          )
            .getHexString()
            .toLowerCase();

          return { ...group, hex };
        },
      );

      setAvailableMaterialColors(
        new Set(
          materialGroups.map((group) => group.hex),
        ),
      );

      /*
       * getItemsOfCategories() devuelve TODAS las
       * categorías del grafo IFC (incluyendo entidades
       * sin geometría propia, como IfcBuilding o los
       * property sets), y aislar una de esas categorías
       * ocultaba el modelo entero. getItemsWithGeometryCategories()
       * en cambio está indexado 1 a 1 con modelItemIds,
       * así que solo agrupa elementos que realmente
       * tienen geometría para mostrar.
       */
      const geometryCategories =
        modelItemIds.length > 0
          ? await loadedModel.getItemsWithGeometryCategories()
          : [];

      if (disposed) {
        return;
      }

      const categoryGroups: Record<
        string,
        number[]
      > = {};

      geometryCategories.forEach(
        (rawCategory, index) => {
          if (!rawCategory) {
            return;
          }

          const id = modelItemIds[index];

          if (id === undefined) {
            return;
          }

          const label =
            humanizeIfcCategory(rawCategory);

          (categoryGroups[label] ??= []).push(
            id,
          );
        },
      );

      setAvailableCategories(
        Object.keys(categoryGroups).sort(),
      );

      /*
       * Modo ghost (por defecto): lo no seleccionado
       * se vuelve semitransparente pero sigue ahí, así
       * que la cámara no necesita moverse — el usuario
       * conserva su punto de vista.
       *
       * Modo hide: lo no seleccionado se oculta del
       * todo, así que si la reencuadramos hacia la
       * selección (igual que "Restaurar vista general"),
       * porque si no puede quedar fuera de cuadro.
       */
      applySelectionRef.current = async (
        categories,
        materialKeys,
        mode,
        ghostOpacityValue,
      ) => {
        const matchSet = new Set<number>();

        for (const category of categories) {
          for (const id of categoryGroups[
            category
          ] ?? []) {
            matchSet.add(id);
          }
        }

        for (const group of materialGroups) {
          if (materialKeys.has(group.hex)) {
            for (const id of group.localIds) {
              matchSet.add(id);
            }
          }
        }

        if (matchSet.size === 0) {
          await loadedModel.resetVisible();
          await loadedModel.resetOpacity(
            undefined,
          );
          await loadedModel.resetColor(
            undefined,
          );

          if (
            mode === "hide" &&
            latestModelBox
          ) {
            await frameModel(
              latestModelBox,
              true,
            );
          } else {
            await fragments.core.update(true);
          }

          return;
        }

        const matchIds = Array.from(matchSet);

        const restIds = modelItemIds.filter(
          (id) => !matchSet.has(id),
        );

        if (mode === "hide") {
          await loadedModel.resetOpacity(
            undefined,
          );
          await loadedModel.resetColor(
            undefined,
          );

          await loadedModel.setVisible(
            restIds,
            false,
          );

          await loadedModel.setVisible(
            matchIds,
            true,
          );

          await fragments.core.update(true);

          const matchBox =
            await loadedModel.getMergedBox(
              matchIds,
            );

          await frameModel(matchBox, true);

          return;
        }

        await loadedModel.resetVisible();

        /*
         * Lo no seleccionado vuelve a su color
         * original (por si venía resaltado de una
         * selección anterior) y se atenúa.
         */
        await loadedModel.resetColor(restIds);
        await loadedModel.setOpacity(
          restIds,
          ghostOpacityValue,
        );

        /*
         * Lo seleccionado se resalta con un color
         * bien distinguible sobre el resto
         * transparentado.
         */
        await loadedModel.setColor(
          matchIds,
          new THREE.Color(
            GHOST_HIGHLIGHT_COLOR,
          ),
        );

        await loadedModel.resetOpacity(matchIds);

        await fragments.core.update(true);
      };

      if (modelItemIds.length > 0) {
        latestModelBox =
          await loadedModel.getMergedBox(
            modelItemIds,
          );

        if (disposed) {
          return;
        }

        const modelSize =
          latestModelBox.getSize(
            new THREE.Vector3(),
          );

        grid.three.position.y =
          latestModelBox.min.y -
          Math.max(
            modelSize.y * 0.02,
            0.25,
          );

        const orbitStep = Math.max(
          Math.max(
            modelSize.x,
            modelSize.z,
          ) * 0.012,
          0.75,
        );

        const orbitVerticalStep = Math.max(
          modelSize.y * 0.08,
          orbitStep * 0.35,
          0.5,
        );

        /*
         * Paso pequeño para desplazarse
         * dentro del edificio.
         */
        const walkingStep = Math.min(
          Math.max(
            modelSize.y * 0.015,
            0.3,
          ),
          1,
        );

        const walkingVerticalStep =
          Math.max(
            walkingStep * 0.5,
            0.2,
          );

        const eyeHeight = Math.min(
          Math.max(
            modelSize.y * 0.025,
            1.6,
          ),
          2,
        );

        navigateRef.current =
          async (
            action: NavigationAction,
          ) => {
            const movementStep =
              activeCameraMode === "walk"
                ? walkingStep
                : orbitStep;

            const verticalStep =
              activeCameraMode === "walk"
                ? walkingVerticalStep
                : orbitVerticalStep;

            switch (action) {
              case "forward":
                await camera.controls.forward(
                  movementStep,
                  true,
                );
                break;

              case "backward":
                await camera.controls.forward(
                  -movementStep,
                  true,
                );
                break;

              case "left":
                await camera.controls.truck(
                  -movementStep,
                  0,
                  true,
                );
                break;

              case "right":
                await camera.controls.truck(
                  movementStep,
                  0,
                  true,
                );
                break;

              case "up":
                await camera.controls.elevate(
                  verticalStep,
                  true,
                );
                break;

              case "down":
                await camera.controls.elevate(
                  -verticalStep,
                  true,
                );
                break;
            }

            await fragments.core.update(true);
          };

        startWalkRef.current =
          async (
            clientX: number,
            clientY: number,
          ) => {
            const mouse =
              new THREE.Vector2(
                clientX,
                clientY,
              );

            const result =
              await loadedModel.raycast({
                camera: camera.three,
                mouse,
                dom:
                  renderer.three
                    .domElement,
              });

            if (!result) {
              return false;
            }

            const currentPosition =
              camera.controls.getPosition(
                new THREE.Vector3(),
                false,
              );

            const currentTarget =
              camera.controls.getTarget(
                new THREE.Vector3(),
                false,
              );

            const viewDirection =
              currentTarget
                .clone()
                .sub(currentPosition);

            /*
             * Conservamos la dirección horizontal
             * desde la que el usuario observaba
             * el punto seleccionado.
             */
            viewDirection.y = 0;

            if (
              viewDirection.lengthSq() <
              0.0001
            ) {
              viewDirection.set(
                0,
                0,
                -1,
              );
            }

            viewDirection.normalize();

            const walkingPosition =
              result.point.clone();

            walkingPosition.y += eyeHeight;

            const walkingTarget =
              walkingPosition
                .clone()
                .add(
                  viewDirection.multiplyScalar(
                    1,
                  ),
                );

            configureWalkControls();

            camera.controls.normalizeRotations();

            await camera.controls.setLookAt(
              walkingPosition.x,
              walkingPosition.y,
              walkingPosition.z,
              walkingTarget.x,
              walkingTarget.y,
              walkingTarget.z,
              true,
            );

            await fragments.core.update(true);

            return true;
          };

        /*
         * Calculamos el encuadre final ANTES de mover la
         * cámara al plano "lejano": fitToBox pierde el
         * ángulo de vista si se lo llama con la cámara ya
         * posicionada lejos y en diagonal, así que hay que
         * calcularlo mientras la cámara sigue en su posición
         * natural (recién inicializada).
         */
        await frameModel(latestModelBox, false);

        await new Promise<void>((resolve) => {
          window.requestAnimationFrame(() => {
            resolve();
          });
        });

        if (disposed) {
          return;
        }

        const framedPosition =
          camera.three.position.clone();

        const framedTarget =
          camera.controls.getTarget(
            new THREE.Vector3(),
          );

        const establishing =
          setEstablishingShot(latestModelBox);

        plannedEntranceFlight = {
          from: establishing,
          to: {
            position: framedPosition,
            target: framedTarget,
          },
        };
      }

      const updateFragments = () => {
        void fragments.core.update();
      };

      camera.controls.addEventListener(
        "update",
        updateFragments,
      );

      removeCameraListener = () => {
        camera.controls.removeEventListener(
          "update",
          updateFragments,
        );
      };

      await fragments.core.update(true);

      if (disposed) {
        return;
      }

      setProgress(100);
      setStage("Modelo cargado");
      setStatus("loaded");

      /*
       * Recién acá se revela el visor (el canvas
       * pasa de opacity-0 a opacity-100), mostrando
       * primero el encuadre lejano. Le damos un
       * respiro breve para que se note ese punto de
       * partida antes de empezar a acercarse — si el
       * acercamiento arranca de inmediato, termina
       * antes de que el fundido del canvas siquiera
       * se note.
       */
      if (plannedEntranceFlight && !disposed) {
        await new Promise((resolve) => {
          window.setTimeout(resolve, 350);
        });

        if (disposed) {
          return;
        }

        await flyToModel(
          plannedEntranceFlight.from.position,
          plannedEntranceFlight.from.target,
          plannedEntranceFlight.to.position,
          plannedEntranceFlight.to.target,
        );
      }
    };

    initializeViewer()
      .catch((error: unknown) => {
        if (disposed) {
          return;
        }

        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        setErrorMessage(
          getErrorMessage(error),
        );

        setStatus("error");
        setStage(
          "No se pudo preparar el modelo",
        );
      })
      .finally(() => {
        initializationSettled = true;

        if (disposed) {
          disposeResources();
        }
      });

    return () => {
      disposed = true;
      abortController.abort();

      if (initializationSettled) {
        disposeResources();
      }
    };
    /*
     * materialOverrides se lee al vuelo dentro del
     * listener de materiales; no dispara una
     * reinicialización completa del visor por sí solo.
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    modelFormat,
    modelName,
    modelUrl,
  ]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        document.fullscreenElement ===
          viewerShellRef.current,
      );
    };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange,
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange,
      );
    };
  }, []);

  const handleResetView = async () => {
    setIsSelectingWalkStart(false);
    setWalkSelectionMessage(null);

    await resetViewRef.current?.();
  };

  const handleNavigate = (
    action: NavigationAction,
  ) => {
    void navigateRef.current?.(action);
  };

  const toggleCategory = (
    category: string,
  ) => {
    const next = new Set(selectedCategories);

    if (next.has(category)) {
      next.delete(category);
    } else {
      next.add(category);
    }

    setSelectedCategories(next);

    void applySelectionRef.current?.(
      next,
      selectedMaterialKeys,
      visibilityMode,
      ghostOpacity,
    );
  };

  const toggleMaterial = (
    material: BimMaterialInfo,
  ) => {
    const next = new Set(selectedMaterialKeys);

    if (next.has(material.key)) {
      next.delete(material.key);
    } else {
      next.add(material.key);
    }

    setSelectedMaterialKeys(next);

    void applySelectionRef.current?.(
      selectedCategories,
      next,
      visibilityMode,
      ghostOpacity,
    );
  };

  const handleClearSelection = () => {
    setSelectedCategories(new Set());
    setSelectedMaterialKeys(new Set());

    void applySelectionRef.current?.(
      new Set(),
      new Set(),
      visibilityMode,
      ghostOpacity,
    );
  };

  const handleSetVisibilityMode = (
    mode: VisibilityMode,
  ) => {
    setVisibilityMode(mode);

    void applySelectionRef.current?.(
      selectedCategories,
      selectedMaterialKeys,
      mode,
      ghostOpacity,
    );
  };

  const handleGhostOpacityChange = (
    value: number,
  ) => {
    setGhostOpacity(value);

    void applySelectionRef.current?.(
      selectedCategories,
      selectedMaterialKeys,
      visibilityMode,
      value,
    );
  };

  const handleViewerKeyDown = (
    event: ReactKeyboardEvent<HTMLDivElement>,
  ) => {
    if (status !== "loaded") {
      return;
    }

    const action =
      navigationByKey[
        event.key.toLowerCase()
      ];

    if (!action) {
      return;
    }

    event.preventDefault();
    handleNavigate(action);
  };

  const handleWalkButton = () => {
    if (status !== "loaded") {
      return;
    }

    if (cameraMode === "walk") {
      void handleResetView();
      return;
    }

    setIsSelectingWalkStart(
      (currentValue) => !currentValue,
    );

    setWalkSelectionMessage(null);

    viewerShellRef.current?.focus();
  };

  const handleViewerDoubleClick = (
    event: ReactMouseEvent<HTMLDivElement>,
  ) => {
    if (
      !isSelectingWalkStart ||
      status !== "loaded"
    ) {
      return;
    }

    if (
      !(
        event.target instanceof
        HTMLCanvasElement
      )
    ) {
      return;
    }

    event.preventDefault();

    void startWalkRef.current
      ?.(
        event.clientX,
        event.clientY,
      )
      .then((success) => {
        if (success) {
          setIsSelectingWalkStart(false);
          setWalkSelectionMessage(null);

          viewerShellRef.current?.focus();
          return;
        }

        setWalkSelectionMessage(
          "No se detectó geometría. Probá nuevamente sobre el suelo.",
        );
      });
  };

  const handleFullscreen = async () => {
    const viewer =
      viewerShellRef.current;

    if (!viewer) {
      return;
    }

    if (
      document.fullscreenElement ===
      viewer
    ) {
      await document.exitFullscreen();
      return;
    }

    await viewer.requestFullscreen();
  };

  const isBusy =
    status === "initializing" ||
    status === "loading";

  const navigationDisabled =
    status !== "loaded";

  /*
   * El listado de materiales guardado en el proyecto
   * puede incluir materiales sin geometría visible en
   * este modelo (por ejemplo, materiales de elementos
   * filtrados). Ofrecerlos como filtro los deja sin
   * efecto al seleccionarlos, así que solo mostramos
   * los que realmente están presentes.
   */
  const visibleMaterials = materials?.filter(
    (material) =>
      material.colorHex &&
      availableMaterialColors.has(
        material.colorHex
          .replace("#", "")
          .toLowerCase(),
      ),
  );

  return (
    <div
      aria-label={`Visor arquitectónico OpenBIM de ${modelName}`}
      className={cn(
        "relative h-[72svh] min-h-[38rem] max-h-[58rem] overflow-hidden bg-[#071d31] text-white outline-none focus-visible:ring-2 focus-visible:ring-[#d17c5b] focus-visible:ring-inset fullscreen:h-screen fullscreen:min-h-0 fullscreen:max-h-none",
        isSelectingWalkStart &&
          "[&_canvas]:cursor-crosshair",
      )}
      onDoubleClick={
        handleViewerDoubleClick
      }
      onKeyDown={handleViewerKeyDown}
      onPointerDown={(event) => {
        if (
          event.target instanceof
          HTMLCanvasElement
        ) {
          viewerShellRef.current?.focus();
        }
      }}
      ref={viewerShellRef}
      role="region"
      tabIndex={0}
    >
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-700 ease-out [&_canvas]:h-full [&_canvas]:w-full [&_canvas]:outline-none",
          status === "loaded"
            ? "opacity-100"
            : "opacity-0",
        )}
        ref={viewerContainerRef}
      />

      <AnimatePresence>
        {isBusy ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="pointer-events-none absolute inset-0 z-[2] grid place-items-center bg-[#071d31]"
            exit={{ opacity: 0 }}
            initial={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className="flex flex-col items-center gap-4"
              initial={{
                opacity: 0,
                scale: 0.92,
              }}
              transition={{ duration: 0.4 }}
            >
              <div className="relative grid size-16 place-items-center">
                <span className="absolute inset-0 animate-spin rounded-full border-2 border-white/10 border-t-[#d17c5b]" />

                <Boxes
                  aria-hidden="true"
                  className="text-[#d17c5b]"
                  size={22}
                  strokeWidth={1.5}
                />
              </div>

              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-white/60">
                {status === "loading"
                  ? `Cargando modelo · ${progress}%`
                  : "Preparando visor"}
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.12]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(146, 198, 222, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(146, 198, 222, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "4rem 4rem",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(circle_at_center,transparent_35%,rgba(3,15,27,0.52)_100%)]"
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="pointer-events-auto inline-flex min-h-12 items-center gap-3 rounded-full border border-white/15 bg-[#071d31]/80 px-4 text-white shadow-[0_1rem_3rem_rgb(0_0_0/0.24)] backdrop-blur-2xl">
            <span className="grid size-8 place-items-center rounded-full border border-[#77a8c1]/25 bg-[#77a8c1]/10 text-[#9dc3d5]">
              <Boxes
                aria-hidden="true"
                size={15}
                strokeWidth={1.5}
              />
            </span>

            <div>
              <p className="text-[0.58rem] font-semibold uppercase tracking-[0.15em] text-white">
                {modelName}
              </p>

              <p className="mt-0.5 text-[0.5rem] uppercase tracking-[0.13em] text-white/45">
                OpenBIM · {modelFormat}
              </p>
            </div>
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
            {availableCategories.length > 0 ||
            (visibleMaterials &&
              visibleMaterials.length > 0) ? (
              <div className="relative">
                <button
                  aria-expanded={
                    isFilterPanelOpen
                  }
                  aria-pressed={
                    selectedCategories.size >
                      0 ||
                    selectedMaterialKeys.size >
                      0
                  }
                  className={cn(
                    "glass-interactive inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-[0.57rem] font-semibold uppercase tracking-[0.13em] shadow-[0_1rem_3rem_rgb(0_0_0/0.24)] backdrop-blur-2xl disabled:cursor-not-allowed disabled:opacity-40",
                    selectedCategories.size >
                      0 ||
                      selectedMaterialKeys.size >
                        0
                      ? "border-[#d17c5b]/60 bg-[#d17c5b] text-white"
                      : "border-white/15 bg-[#071d31]/80 text-white",
                  )}
                  disabled={
                    navigationDisabled
                  }
                  onClick={() =>
                    setIsFilterPanelOpen(
                      (value) => !value,
                    )
                  }
                  type="button"
                >
                  <SlidersHorizontal
                    aria-hidden="true"
                    size={16}
                    strokeWidth={1.6}
                  />

                  <span className="hidden sm:inline">
                    Filtros
                  </span>

                  {selectedCategories.size +
                    selectedMaterialKeys.size >
                  0 ? (
                    <span className="grid size-4 place-items-center rounded-full bg-white/25 text-[0.55rem] font-bold">
                      {selectedCategories.size +
                        selectedMaterialKeys.size}
                    </span>
                  ) : null}
                </button>

                {isFilterPanelOpen ? (
                  <div className="absolute right-0 top-[calc(100%+0.5rem)] z-20 w-[min(92vw,34rem)] rounded-2xl border border-white/15 bg-[#071d31]/95 p-4 shadow-[0_1.5rem_4rem_rgb(0_0_0/0.4)] backdrop-blur-2xl">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                      <div className="flex gap-1 rounded-full border border-white/15 bg-white/[0.03] p-1">
                        <button
                          className={cn(
                            "rounded-full px-3 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.08em]",
                            visibilityMode ===
                              "ghost"
                              ? "bg-[#d17c5b] text-white"
                              : "text-white/55 hover:text-white/80",
                          )}
                          onClick={() =>
                            handleSetVisibilityMode(
                              "ghost",
                            )
                          }
                          type="button"
                        >
                          Transparentar
                        </button>

                        <button
                          className={cn(
                            "rounded-full px-3 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.08em]",
                            visibilityMode ===
                              "hide"
                              ? "bg-[#d17c5b] text-white"
                              : "text-white/55 hover:text-white/80",
                          )}
                          onClick={() =>
                            handleSetVisibilityMode(
                              "hide",
                            )
                          }
                          type="button"
                        >
                          Ocultar
                        </button>
                      </div>

                      <button
                        className="text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-white/45 hover:text-white/75 disabled:cursor-not-allowed disabled:opacity-30"
                        disabled={
                          selectedCategories.size ===
                            0 &&
                          selectedMaterialKeys.size ===
                            0
                        }
                        onClick={
                          handleClearSelection
                        }
                        type="button"
                      >
                        Limpiar selección
                      </button>
                    </div>

                    {visibilityMode ===
                    "ghost" ? (
                      <div className="flex items-center gap-3 border-b border-white/10 py-3">
                        <label
                          className="shrink-0 text-[0.58rem] font-semibold uppercase tracking-[0.1em] text-white/45"
                          htmlFor="ghost-opacity-range"
                        >
                          Transparencia
                        </label>

                        <input
                          className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-white/15 accent-[#d17c5b]"
                          id="ghost-opacity-range"
                          max={1}
                          min={0}
                          onChange={(event) =>
                            handleGhostOpacityChange(
                              Number(
                                event.target
                                  .value,
                              ),
                            )
                          }
                          step={0.05}
                          type="range"
                          value={ghostOpacity}
                        />

                        <span className="w-9 shrink-0 text-right text-[0.6rem] text-white/55">
                          {Math.round(
                            ghostOpacity * 100,
                          )}
                          %
                        </span>
                      </div>
                    ) : null}

                    <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {availableCategories.length >
                      0 ? (
                        <div className="min-w-0">
                          <p className="mb-2 flex items-center gap-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-white/45">
                            <Shapes
                              aria-hidden="true"
                              size={12}
                              strokeWidth={1.8}
                            />
                            Categorías
                          </p>

                          <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
                            {availableCategories.map(
                              (category) => {
                                const checked =
                                  selectedCategories.has(
                                    category,
                                  );

                                return (
                                  <button
                                    className={cn(
                                      "flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs hover:bg-white/[0.08]",
                                      checked
                                        ? "bg-white/[0.1] text-white"
                                        : "text-white/70",
                                    )}
                                    key={
                                      category
                                    }
                                    onClick={() =>
                                      toggleCategory(
                                        category,
                                      )
                                    }
                                    type="button"
                                  >
                                    <span
                                      className={cn(
                                        "grid size-3.5 shrink-0 place-items-center rounded border",
                                        checked
                                          ? "border-[#d17c5b] bg-[#d17c5b]"
                                          : "border-white/30",
                                      )}
                                    >
                                      {checked ? (
                                        <Check
                                          aria-hidden="true"
                                          className="text-white"
                                          size={10}
                                          strokeWidth={3}
                                        />
                                      ) : null}
                                    </span>

                                    <span className="truncate">
                                      {category}
                                    </span>
                                  </button>
                                );
                              },
                            )}
                          </div>
                        </div>
                      ) : null}

                      {visibleMaterials &&
                      visibleMaterials.length >
                        0 ? (
                        <div className="min-w-0">
                          <p className="mb-2 flex items-center gap-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-white/45">
                            <Layers
                              aria-hidden="true"
                              size={12}
                              strokeWidth={1.8}
                            />
                            Materiales
                          </p>

                          <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
                            {visibleMaterials.map(
                              (material) => {
                                const checked =
                                  selectedMaterialKeys.has(
                                    material.key,
                                  );

                                return (
                                  <button
                                    className={cn(
                                      "flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs hover:bg-white/[0.08]",
                                      checked
                                        ? "bg-white/[0.1] text-white"
                                        : "text-white/70",
                                    )}
                                    key={
                                      material.key
                                    }
                                    onClick={() =>
                                      toggleMaterial(
                                        material,
                                      )
                                    }
                                    type="button"
                                  >
                                    <span
                                      className={cn(
                                        "grid size-3.5 shrink-0 place-items-center rounded border",
                                        checked
                                          ? "border-[#d17c5b] bg-[#d17c5b]"
                                          : "border-white/30",
                                      )}
                                    >
                                      {checked ? (
                                        <Check
                                          aria-hidden="true"
                                          className="text-white"
                                          size={10}
                                          strokeWidth={3}
                                        />
                                      ) : null}
                                    </span>

                                    <span
                                      aria-hidden="true"
                                      className="size-3 shrink-0 rounded-full border border-white/25"
                                      style={{
                                        backgroundColor:
                                          material.colorHex ??
                                          "#5f91ad",
                                      }}
                                    />

                                    <span className="truncate">
                                      {getMaterialDisplayName(
                                        material,
                                        materialOverrides,
                                      )}
                                    </span>
                                  </button>
                                );
                              },
                            )}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            <button
              aria-pressed={
                isSelectingWalkStart ||
                cameraMode === "walk"
              }
              className={cn(
                "glass-interactive inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-[0.57rem] font-semibold uppercase tracking-[0.13em] shadow-[0_1rem_3rem_rgb(0_0_0/0.24)] backdrop-blur-2xl disabled:cursor-not-allowed disabled:opacity-40",
                isSelectingWalkStart ||
                  cameraMode === "walk"
                  ? "border-[#d17c5b]/60 bg-[#d17c5b] text-white"
                  : "border-white/15 bg-[#071d31]/80 text-white",
              )}
              disabled={navigationDisabled}
              onClick={handleWalkButton}
              type="button"
            >
              <Footprints
                aria-hidden="true"
                size={16}
                strokeWidth={1.6}
              />

              <span className="hidden sm:inline">
                {cameraMode === "walk"
                  ? "Salir del paseo"
                  : "Paseo"}
              </span>
            </button>

            <button
              aria-label="Restaurar vista general"
              className="glass-interactive grid size-11 place-items-center rounded-full border border-white/15 bg-[#071d31]/80 text-white shadow-[0_1rem_3rem_rgb(0_0_0/0.24)] backdrop-blur-2xl disabled:cursor-not-allowed disabled:opacity-40"
              disabled={navigationDisabled}
              onClick={handleResetView}
              title="Vista general"
              type="button"
            >
              <RotateCcw
                aria-hidden="true"
                size={17}
                strokeWidth={1.6}
              />
            </button>

            <button
              aria-label={
                isFullscreen
                  ? "Salir de pantalla completa"
                  : "Abrir en pantalla completa"
              }
              className="glass-interactive grid size-11 place-items-center rounded-full border border-white/15 bg-[#071d31]/80 text-white shadow-[0_1rem_3rem_rgb(0_0_0/0.24)] backdrop-blur-2xl"
              onClick={handleFullscreen}
              type="button"
            >
              {isFullscreen ? (
                <Minimize2
                  aria-hidden="true"
                  size={17}
                  strokeWidth={1.6}
                />
              ) : (
                <Maximize2
                  aria-hidden="true"
                  size={17}
                  strokeWidth={1.6}
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {isSelectingWalkStart ? (
        <div className="pointer-events-none absolute left-1/2 top-24 z-20 w-[calc(100%-2rem)] max-w-md -translate-x-1/2">
          <div className="rounded-2xl border border-[#d17c5b]/40 bg-[#071d31]/90 px-5 py-4 text-center shadow-[0_1.5rem_4rem_rgb(0_0_0/0.35)] backdrop-blur-2xl">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-[#d98a69]">
              Elegir inicio del paseo
            </p>

            <p className="mt-2 text-xs leading-5 text-white/65">
              Hacé doble clic sobre el suelo cercano al punto donde querés comenzar.
            </p>

            {walkSelectionMessage ? (
              <p className="mt-2 text-xs leading-5 text-[#efad94]">
                {walkSelectionMessage}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {cameraMode === "walk" ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 z-10 size-3 -translate-x-1/2 -translate-y-1/2"
        >
          <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/45" />
          <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/45" />
        </div>
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5">
        <div className="flex items-end justify-between gap-3">
          <div
            aria-live="polite"
            className={cn(
              "min-w-0 max-w-md flex-1 rounded-[1.25rem] border px-4 py-3 shadow-[0_1.5rem_4rem_rgb(0_0_0/0.28)] backdrop-blur-2xl sm:px-5 sm:py-4",
              status === "error"
                ? "border-red-300/30 bg-red-950/90"
                : "border-white/15 bg-[#071d31]/80",
            )}
          >
            <div className="flex items-start gap-3">
              {isBusy ? (
                <Loader2
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 animate-spin text-[#d17c5b]"
                  size={18}
                  strokeWidth={1.7}
                />
              ) : cameraMode === "walk" ? (
                <Footprints
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-[#d17c5b]"
                  size={18}
                  strokeWidth={1.6}
                />
              ) : (
                <Boxes
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-[#d17c5b]"
                  size={18}
                  strokeWidth={1.6}
                />
              )}

              <div className="min-w-0 flex-1">
                <p className="text-[0.59rem] font-semibold uppercase tracking-[0.14em] text-white">
                  {cameraMode === "walk" &&
                  status === "loaded"
                    ? "Paseo peatonal"
                    : stage}
                </p>

                <p className="mt-1.5 text-[0.68rem] leading-5 text-white/55">
                  {status === "initializing"
                    ? "Configurando el visor."
                    : null}

                  {status === "loading"
                    ? `${modelName} · ${progress}%`
                    : null}

                  {status === "loaded" &&
                  cameraMode === "orbit"
                    ? "Mouse para explorar. Presioná Paseo para elegir un punto de ingreso."
                    : null}

                  {status === "loaded" &&
                  cameraMode === "walk"
                    ? "WASD para caminar. Arrastrá el mouse para mirar. Q/E cambia la altura."
                    : null}

                  {status === "error"
                    ? errorMessage
                    : null}
                </p>

                {status === "loading" ? (
                  <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#d17c5b] transition-[width] duration-300"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="pointer-events-auto flex shrink-0 items-end gap-2">
            <div className="hidden flex-col gap-1 rounded-xl border border-white/15 bg-[#071d31]/80 p-1.5 backdrop-blur-2xl sm:flex">
              <MovementButton
                action="up"
                ariaLabel="Subir"
                disabled={navigationDisabled}
                onNavigate={handleNavigate}
              >
                <ArrowUp
                  aria-hidden="true"
                  size={15}
                />
              </MovementButton>

              <MovementButton
                action="down"
                ariaLabel="Bajar"
                disabled={navigationDisabled}
                onNavigate={handleNavigate}
              >
                <ArrowDown
                  aria-hidden="true"
                  size={15}
                />
              </MovementButton>
            </div>

            <div className="grid grid-cols-3 gap-1 rounded-xl border border-white/15 bg-[#071d31]/80 p-1.5 backdrop-blur-2xl">
              <MovementButton
                action="forward"
                ariaLabel="Avanzar"
                className="col-start-2"
                disabled={navigationDisabled}
                onNavigate={handleNavigate}
              >
                <ArrowUp
                  aria-hidden="true"
                  size={16}
                />
              </MovementButton>

              <MovementButton
                action="left"
                ariaLabel="Mover a la izquierda"
                className="col-start-1 row-start-2"
                disabled={navigationDisabled}
                onNavigate={handleNavigate}
              >
                <ArrowLeft
                  aria-hidden="true"
                  size={16}
                />
              </MovementButton>

              <MovementButton
                action="backward"
                ariaLabel="Retroceder"
                className="col-start-2 row-start-2"
                disabled={navigationDisabled}
                onNavigate={handleNavigate}
              >
                <ArrowDown
                  aria-hidden="true"
                  size={16}
                />
              </MovementButton>

              <MovementButton
                action="right"
                ariaLabel="Mover a la derecha"
                className="col-start-3 row-start-2"
                disabled={navigationDisabled}
                onNavigate={handleNavigate}
              >
                <ArrowRight
                  aria-hidden="true"
                  size={16}
                />
              </MovementButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}