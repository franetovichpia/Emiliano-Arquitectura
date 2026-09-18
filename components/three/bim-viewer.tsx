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
import type { Box3 } from "three";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Boxes,
  Footprints,
  Layers,
  Loader2,
  Maximize2,
  Minimize2,
  RotateCcw,
  Shapes,
} from "lucide-react";

import {
  applyBimMaterialFinish,
  createBimVisualEnvironment,
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

type IsolateMaterialFunction = (
  colorHex: string | null,
) => Promise<void>;

type IsolateCategoryFunction = (
  category: string | null,
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

  const isolateMaterialRef =
    useRef<IsolateMaterialFunction | null>(
      null,
    );

  const isolateCategoryRef =
    useRef<IsolateCategoryFunction | null>(
      null,
    );

  const activeViewerSessionRef =
    useRef<symbol | null>(null);

  const [
    selectedMaterialKey,
    setSelectedMaterialKey,
  ] = useState<string | null>(null);

  const [
    isMaterialMenuOpen,
    setIsMaterialMenuOpen,
  ] = useState(false);

  const [
    availableCategories,
    setAvailableCategories,
  ] = useState<string[]>([]);

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState<string | null>(null);

  const [
    isCategoryMenuOpen,
    setIsCategoryMenuOpen,
  ] = useState(false);

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
        isolateMaterialRef.current = null;
        isolateCategoryRef.current = null;

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
      setSelectedMaterialKey(null);
      setIsMaterialMenuOpen(false);
      setAvailableCategories([]);
      setSelectedCategory(null);
      setIsCategoryMenuOpen(false);

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

      const configureOrbitControls = () => {
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

        camera.controls.smoothTime = 0.18;
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

      const frameModel = async (
        modelBox: Box3,
        smooth: boolean,
      ) => {
        configureOrbitControls();

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

      const materialGroups =
        modelItemIds.length > 0
          ? await loadedModel.getItemsMaterialDefinition(
              modelItemIds,
            )
          : [];

      if (disposed) {
        return;
      }

      isolateMaterialRef.current = async (
        colorHex,
      ) => {
        if (!colorHex) {
          await loadedModel.resetVisible();
          await fragments.core.update(true);
          return;
        }

        const target = colorHex
          .replace("#", "")
          .toLowerCase();

        const matchIds: number[] = [];
        const restIds: number[] = [];

        for (const group of materialGroups) {
          const hex = group.definition.color
            .getHexString()
            .toLowerCase();

          if (hex === target) {
            matchIds.push(...group.localIds);
          } else {
            restIds.push(...group.localIds);
          }
        }

        if (matchIds.length === 0) {
          return;
        }

        await loadedModel.setVisible(
          restIds,
          false,
        );

        await loadedModel.setVisible(
          matchIds,
          true,
        );

        await fragments.core.update(true);
      };

      const categoryGroups =
        modelItemIds.length > 0
          ? await loadedModel.getItemsOfCategories(
              [/.*/],
            )
          : {};

      if (disposed) {
        return;
      }

      setAvailableCategories(
        Object.keys(categoryGroups).sort(),
      );

      isolateCategoryRef.current = async (
        category,
      ) => {
        if (!category) {
          await loadedModel.resetVisible();
          await fragments.core.update(true);
          return;
        }

        const matchIds =
          categoryGroups[category] ?? [];

        if (matchIds.length === 0) {
          return;
        }

        const matchSet = new Set(matchIds);

        const restIds =
          modelItemIds.filter(
            (id) => !matchSet.has(id),
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

        await frameModel(
          latestModelBox,
          false,
        );
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

  const handleSelectMaterial = (
    material: BimMaterialInfo | null,
  ) => {
    setSelectedMaterialKey(
      material?.key ?? null,
    );

    setIsMaterialMenuOpen(false);
    setSelectedCategory(null);
    setIsCategoryMenuOpen(false);

    void isolateMaterialRef.current?.(
      material?.colorHex ?? null,
    );
  };

  const handleSelectCategory = (
    category: string | null,
  ) => {
    setSelectedCategory(category);
    setIsCategoryMenuOpen(false);
    setSelectedMaterialKey(null);
    setIsMaterialMenuOpen(false);

    void isolateCategoryRef.current?.(
      category,
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
        className="absolute inset-0 [&_canvas]:h-full [&_canvas]:w-full [&_canvas]:outline-none"
        ref={viewerContainerRef}
      />

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
            {materials && materials.length > 0 ? (
              <div className="relative">
                <button
                  aria-expanded={
                    isMaterialMenuOpen
                  }
                  aria-pressed={
                    selectedMaterialKey !==
                    null
                  }
                  className={cn(
                    "glass-interactive inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-[0.57rem] font-semibold uppercase tracking-[0.13em] shadow-[0_1rem_3rem_rgb(0_0_0/0.24)] backdrop-blur-2xl disabled:cursor-not-allowed disabled:opacity-40",
                    selectedMaterialKey !==
                      null
                      ? "border-[#d17c5b]/60 bg-[#d17c5b] text-white"
                      : "border-white/15 bg-[#071d31]/80 text-white",
                  )}
                  disabled={
                    navigationDisabled
                  }
                  onClick={() =>
                    setIsMaterialMenuOpen(
                      (value) => !value,
                    )
                  }
                  type="button"
                >
                  <Layers
                    aria-hidden="true"
                    size={16}
                    strokeWidth={1.6}
                  />

                  <span className="hidden sm:inline">
                    Materiales
                  </span>
                </button>

                {isMaterialMenuOpen ? (
                  <div className="absolute right-0 top-[calc(100%+0.5rem)] z-20 max-h-72 w-56 overflow-y-auto rounded-2xl border border-white/15 bg-[#071d31]/95 p-1.5 shadow-[0_1.5rem_4rem_rgb(0_0_0/0.4)] backdrop-blur-2xl">
                    <button
                      className={cn(
                        "flex w-full items-center rounded-xl px-3 py-2 text-left text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-white/70 hover:bg-white/[0.08]",
                        selectedMaterialKey ===
                          null &&
                          "bg-white/[0.08] text-white",
                      )}
                      onClick={() =>
                        handleSelectMaterial(
                          null,
                        )
                      }
                      type="button"
                    >
                      Ver todo el modelo
                    </button>

                    {materials.map(
                      (material) => (
                        <button
                          className={cn(
                            "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs text-white/80 hover:bg-white/[0.08]",
                            selectedMaterialKey ===
                              material.key &&
                              "bg-white/[0.08] text-white",
                          )}
                          key={material.key}
                          onClick={() =>
                            handleSelectMaterial(
                              material,
                            )
                          }
                          type="button"
                        >
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
                            {material.name}
                          </span>
                        </button>
                      ),
                    )}
                  </div>
                ) : null}
              </div>
            ) : null}

            {availableCategories.length > 0 ? (
              <div className="relative">
                <button
                  aria-expanded={
                    isCategoryMenuOpen
                  }
                  aria-pressed={
                    selectedCategory !== null
                  }
                  className={cn(
                    "glass-interactive inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-[0.57rem] font-semibold uppercase tracking-[0.13em] shadow-[0_1rem_3rem_rgb(0_0_0/0.24)] backdrop-blur-2xl disabled:cursor-not-allowed disabled:opacity-40",
                    selectedCategory !== null
                      ? "border-[#d17c5b]/60 bg-[#d17c5b] text-white"
                      : "border-white/15 bg-[#071d31]/80 text-white",
                  )}
                  disabled={
                    navigationDisabled
                  }
                  onClick={() =>
                    setIsCategoryMenuOpen(
                      (value) => !value,
                    )
                  }
                  type="button"
                >
                  <Shapes
                    aria-hidden="true"
                    size={16}
                    strokeWidth={1.6}
                  />

                  <span className="hidden sm:inline">
                    Categorías
                  </span>
                </button>

                {isCategoryMenuOpen ? (
                  <div className="absolute right-0 top-[calc(100%+0.5rem)] z-20 max-h-72 w-56 overflow-y-auto rounded-2xl border border-white/15 bg-[#071d31]/95 p-1.5 shadow-[0_1.5rem_4rem_rgb(0_0_0/0.4)] backdrop-blur-2xl">
                    <button
                      className={cn(
                        "flex w-full items-center rounded-xl px-3 py-2 text-left text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-white/70 hover:bg-white/[0.08]",
                        selectedCategory ===
                          null &&
                          "bg-white/[0.08] text-white",
                      )}
                      onClick={() =>
                        handleSelectCategory(
                          null,
                        )
                      }
                      type="button"
                    >
                      Ver todo el modelo
                    </button>

                    {availableCategories.map(
                      (category) => (
                        <button
                          className={cn(
                            "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs text-white/80 hover:bg-white/[0.08]",
                            selectedCategory ===
                              category &&
                              "bg-white/[0.08] text-white",
                          )}
                          key={category}
                          onClick={() =>
                            handleSelectCategory(
                              category,
                            )
                          }
                          type="button"
                        >
                          <span className="truncate">
                            {humanizeIfcCategory(
                              category,
                            )}
                          </span>
                        </button>
                      ),
                    )}
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