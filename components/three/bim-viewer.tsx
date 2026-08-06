"use client";

import type {
  ChangeEvent,
} from "react";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import type {
  OrthoPerspectiveCamera,
  SimpleScene,
} from "@thatopen/components";
import type {
  PostproductionRenderer,
} from "@thatopen/components-front";
import type {
  Box3,
} from "three";
import {
  Boxes,
  Loader2,
  Maximize2,
  Minimize2,
  RotateCcw,
  Upload,
} from "lucide-react";

import { cn } from "@/utils/cn";

type ViewerStatus =
  | "initializing"
  | "ready"
  | "loading"
  | "loaded"
  | "error";

type LoadIfcFunction = (
  file: File,
) => Promise<void>;

type ResetViewFunction = () => Promise<void>;

function getModelId(fileName: string) {
  const normalizedName = fileName
    .replace(/\.ifc$/i, "")
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalizedName || `modelo-${Date.now()}`;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "No fue posible procesar el archivo IFC.";
}

export function BimViewer() {
  const viewerContainerRef =
    useRef<HTMLDivElement | null>(null);

  const viewerShellRef =
    useRef<HTMLDivElement | null>(null);

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const loadIfcRef =
    useRef<LoadIfcFunction | null>(null);

  const resetViewRef =
    useRef<ResetViewFunction | null>(null);

  const [status, setStatus] =
    useState<ViewerStatus>("initializing");

  const [progress, setProgress] = useState(0);

  const [fileName, setFileName] =
    useState<string | null>(null);

  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const [isFullscreen, setIsFullscreen] =
    useState(false);

  useEffect(() => {
    let disposed = false;

    let componentsInstance:
      | import("@thatopen/components").Components
      | null = null;

    let workerUrl: string | null = null;
    let removeCameraListener: (() => void) | null = null;

    const initializeViewer = async () => {
      const container = viewerContainerRef.current;

      if (!container) {
        throw new Error(
          "No se encontró el contenedor del visor.",
        );
      }

      const [
        THREE,
        OBC,
        OBF,
      ] = await Promise.all([
        import("three"),
        import("@thatopen/components"),
        import("@thatopen/components-front"),
      ]);

      if (disposed) {
        return;
      }

      const components = new OBC.Components();
      componentsInstance = components;

      const worlds = components.get(OBC.Worlds);

      const world = worlds.create<
        SimpleScene,
        OrthoPerspectiveCamera,
        PostproductionRenderer
      >();

      /*
       * Escena
       */
      const scene = new OBC.SimpleScene(components);

      world.scene = scene;

      scene.setup();

      scene.three.background = new THREE.Color(
        "#ded8ce",
      );

      /*
       * Renderer con postproducción
       */
      const renderer =
        new OBF.PostproductionRenderer(
          components,
          container,
        );

      world.renderer = renderer;

      renderer.three.setPixelRatio(
        Math.min(window.devicePixelRatio, 1.5),
      );

      /*
       * Cámara orbital
       */
      const camera =
        new OBC.OrthoPerspectiveCamera(
          components,
        );

      world.camera = camera;

      await camera.controls.setLookAt(
        18,
        14,
        18,
        0,
        0,
        0,
      );

      /*
       * Inicialización de Components
       */
      components.init();

      /*
       * Rejilla
       */
      const grids = components.get(OBC.Grids);
      const grid = grids.create(world);

      grid.config.color.set(0x6f756e);

      /*
       * Postproducción
       */
      renderer.postproduction.enabled = true;
      renderer.postproduction.style =
        OBF.PostproductionAspect.COLOR_PEN;

      renderer.postproduction.edgesPass.width = 1.1;

      renderer.postproduction.edgesPass.color.set(
        "#314139",
      );

      renderer.postproduction.basePass.isolatedMaterials.push(
        grid.material,
      );

      world.dynamicAnchor = false;

      /*
       * FragmentsManager
       */
      workerUrl =
        await OBC.FragmentsManager.getWorker();

      if (disposed) {
        return;
      }

      const fragments = components.get(
        OBC.FragmentsManager,
      );

      fragments.init(workerUrl);

      const updateFragments = () => {
        fragments.core.update();
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

      let latestModelBox: Box3 | null = null;

      fragments.list.onItemSet.add(
        async ({ value: model }) => {
          model.useCamera(camera.three);

          scene.three.add(model.object);

          fragments.core.update(true);

          const ids =
            await model.getItemsIdsWithGeometry();

          if (ids.length === 0) {
            return;
          }

          latestModelBox =
            await model.getMergedBox(ids);

          await camera.controls.fitToBox(
            latestModelBox,
            true,
          );

          fragments.core.update(true);
        },
      );

      /*
       * Corrección de superficies coplanares
       */
      fragments.core.models.materials.list.onItemSet.add(
        ({ value: material }) => {
          if (
            !(
              "isLodMaterial" in material &&
              material.isLodMaterial
            )
          ) {
            material.polygonOffset = true;
            material.polygonOffsetUnits = 1;
            material.polygonOffsetFactor =
              Math.random();
          }
        },
      );

      /*
       * IfcLoader
       */
      const ifcLoader = components.get(
        OBC.IfcLoader,
      );

      await ifcLoader.setup({
        autoSetWasm: false,
        wasm: {
          path: "/wasm/",
          absolute: true,
        },
      });

      /*
       * Función para cargar archivos IFC
       */
      loadIfcRef.current = async (
        file: File,
      ) => {
        if (
          !file.name.toLowerCase().endsWith(".ifc")
        ) {
          throw new Error(
            "Seleccioná un archivo con extensión .ifc.",
          );
        }

        setStatus("loading");
        setProgress(0);
        setFileName(file.name);
        setErrorMessage(null);

        /*
         * Liberamos modelos anteriores.
         */
        const loadedModelIds = [
          ...fragments.list.keys(),
        ];

        for (const modelId of loadedModelIds) {
          fragments.core.disposeModel(modelId);
        }

        latestModelBox = null;

        const arrayBuffer =
          await file.arrayBuffer();

        const buffer = new Uint8Array(
          arrayBuffer,
        );

        const modelId = getModelId(
          file.name,
        );

        await ifcLoader.load(
          buffer,
          false,
          modelId,
          {
            processData: {
              progressCallback: (
                currentProgress,
              ) => {
                const normalizedProgress =
                  currentProgress <= 1
                    ? currentProgress * 100
                    : currentProgress;

                setProgress(
                  Math.min(
                    100,
                    Math.round(
                      normalizedProgress,
                    ),
                  ),
                );
              },
            },
          },
        );

        fragments.core.update(true);

        setProgress(100);
        setStatus("loaded");
      };

      /*
       * Restablecer cámara.
       */
      resetViewRef.current = async () => {
        if (latestModelBox) {
          await camera.controls.fitToBox(
            latestModelBox,
            true,
          );

          fragments.core.update(true);

          return;
        }

        await camera.controls.setLookAt(
          18,
          14,
          18,
          0,
          0,
          0,
          true,
        );
      };

      if (!disposed) {
        setStatus("ready");
      }
    };

    initializeViewer().catch((error: unknown) => {
      if (disposed) {
        return;
      }

      setErrorMessage(getErrorMessage(error));
      setStatus("error");
    });

    return () => {
      disposed = true;

      loadIfcRef.current = null;
      resetViewRef.current = null;

      removeCameraListener?.();

      componentsInstance?.dispose();

      if (
        workerUrl &&
        workerUrl.startsWith("blob:")
      ) {
        URL.revokeObjectURL(workerUrl);
      }
    };
  }, []);

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

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelection = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file || !loadIfcRef.current) {
      return;
    }

    try {
      await loadIfcRef.current(file);
    } catch (error: unknown) {
      setErrorMessage(getErrorMessage(error));
      setStatus("error");
    }
  };

  const handleResetView = async () => {
    await resetViewRef.current?.();
  };

  const handleFullscreen = async () => {
    const viewer = viewerShellRef.current;

    if (!viewer) {
      return;
    }

    if (
      document.fullscreenElement === viewer
    ) {
      await document.exitFullscreen();

      return;
    }

    await viewer.requestFullscreen();
  };

  const isBusy =
    status === "initializing" ||
    status === "loading";

  return (
    <div
      aria-label="Visor arquitectónico OpenBIM"
      className="relative h-[72svh] min-h-[36rem] max-h-[56rem] overflow-hidden bg-[#ded8ce] text-forest-deep"
      ref={viewerShellRef}
      role="region"
    >
      <input
        accept=".ifc,application/octet-stream"
        className="sr-only"
        onChange={handleFileSelection}
        ref={fileInputRef}
        tabIndex={-1}
        type="file"
      />

      {/* Canvas OpenBIM */}
      <div
        className="absolute inset-0 [&_canvas]:h-full [&_canvas]:w-full [&_canvas]:outline-none"
        ref={viewerContainerRef}
      />

      {/* Barra superior */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="pointer-events-auto flex flex-wrap items-center gap-2">
            <button
              className="glass-interactive inline-flex min-h-11 items-center gap-2 rounded-full border border-white/50 bg-paper/75 px-4 text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-forest-deep shadow-lg backdrop-blur-xl disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isBusy}
              onClick={openFileSelector}
              type="button"
            >
              <Upload
                aria-hidden="true"
                size={15}
                strokeWidth={1.7}
              />

              Cargar IFC
            </button>

            <div className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/50 bg-paper/70 px-4 text-[0.62rem] font-medium uppercase tracking-[0.12em] text-forest-deep/60 shadow-lg backdrop-blur-xl">
              <Boxes
                aria-hidden="true"
                size={15}
                strokeWidth={1.5}
              />

              OpenBIM
            </div>
          </div>

          <div className="pointer-events-auto flex items-center gap-2">
            <button
              aria-label="Ajustar la cámara al modelo"
              className="glass-interactive grid size-11 place-items-center rounded-full border border-white/50 bg-paper/75 text-forest-deep shadow-lg backdrop-blur-xl disabled:cursor-not-allowed disabled:opacity-35"
              disabled={status !== "loaded"}
              onClick={handleResetView}
              title="Ajustar al modelo"
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
              className="glass-interactive grid size-11 place-items-center rounded-full border border-white/50 bg-paper/75 text-forest-deep shadow-lg backdrop-blur-xl"
              onClick={handleFullscreen}
              title={
                isFullscreen
                  ? "Salir de pantalla completa"
                  : "Pantalla completa"
              }
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

      {/* Estado */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 p-4 sm:p-5">
        <div
          className={cn(
            "max-w-xl rounded-[1.25rem] border px-5 py-4 shadow-xl backdrop-blur-2xl",
            status === "error"
              ? "border-red-300/40 bg-red-950/85 text-white"
              : "border-white/50 bg-paper/75 text-forest-deep",
          )}
        >
          <div className="flex items-start gap-3">
            {isBusy ? (
              <Loader2
                aria-hidden="true"
                className="mt-0.5 shrink-0 animate-spin text-terracotta"
                size={18}
                strokeWidth={1.7}
              />
            ) : (
              <Boxes
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-terracotta"
                size={18}
                strokeWidth={1.6}
              />
            )}

            <div className="min-w-0">
              <p className="text-[0.63rem] font-semibold uppercase tracking-[0.14em]">
                {status === "initializing"
                  ? "Inicializando visor"
                  : null}

                {status === "ready"
                  ? "Visor preparado"
                  : null}

                {status === "loading"
                  ? `Procesando IFC · ${progress}%`
                  : null}

                {status === "loaded"
                  ? "Modelo cargado"
                  : null}

                {status === "error"
                  ? "No se pudo cargar el modelo"
                  : null}
              </p>

              <p className="mt-2 truncate text-xs leading-5 opacity-60">
                {status === "initializing"
                  ? "Configurando Components, Fragments y Web-IFC."
                  : null}

                {status === "ready"
                  ? "Seleccioná un archivo IFC desde tu computadora."
                  : null}

                {status === "loading"
                  ? fileName
                  : null}

                {status === "loaded"
                  ? fileName
                  : null}

                {status === "error"
                  ? errorMessage
                  : null}
              </p>

              {status === "loading" ? (
                <div className="mt-3 h-1 overflow-hidden rounded-full bg-forest-deep/10">
                  <div
                    className="h-full rounded-full bg-terracotta transition-[width] duration-300"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}