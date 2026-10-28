"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CircleAlert,
  CircleCheck,
  Loader2,
  Save,
} from "lucide-react";

import { ProjectBimUploader } from "@/components/admin/project-bim-uploader";
import { ProjectMediaGrid } from "@/components/admin/project-media-grid";
import { ProjectMediaUploader } from "@/components/admin/project-media-uploader";
import { ProjectProgressEditor } from "@/components/admin/project-progress-editor";
import type {
  BimMaterialInfo,
  CategoryProgressEntry,
  MaterialFinish,
  ProgressChartType,
  ProgressSource,
  ProjectStatus,
} from "@/lib/db/schemas";
import { cn } from "@/utils/cn";

type ProgressEntry = {
  id: string;
  stageName: string;
  plannedPercentage: number;
  actualPercentage: number;
  paidPercentage: number;
  notes?: string;
};

type MediaItem = {
  id: string;
  title: string;
  url: string;
  isImage: boolean;
};

type AdminProjectEditorProps = {
  projectId: string;
  projectSlug: string;
  initialStatus: ProjectStatus;
  initialTitle: string;
  initialSlug: string;
  initialSummary?: string;
  initialLocation?: string;
  initialClient?: string;
  initialYearCompleted?: number;
  initialAreaM2?: number;
  initialTools?: string[];
  initialExternalLink?: string;
  media: readonly MediaItem[];
  hasIfc: boolean;
  materials: readonly BimMaterialInfo[];
  initialMaterialOverrides: Record<
    string,
    MaterialFinish
  >;
  categories: readonly string[];
  initialCategoryProgress: Record<
    string,
    CategoryProgressEntry
  >;
  initialChartType: ProgressChartType;
  initialSource: ProgressSource;
  progressEntries: readonly ProgressEntry[];
};

const statusOptions: {
  value: ProjectStatus;
  label: string;
}[] = [
  { value: "borrador", label: "Borrador" },
  { value: "publicado", label: "Publicado" },
  { value: "archivado", label: "Archivado" },
];

const chartTypeOptions: {
  value: ProgressChartType;
  label: string;
}[] = [
  { value: "barra", label: "Barra" },
  { value: "torta", label: "Torta" },
];

const sourceOptions: {
  value: ProgressSource;
  label: string;
}[] = [
  { value: "manual", label: "Manual por etapa" },
  {
    value: "bim-categorias",
    label: "Automático por categoría BIM",
  },
];

const finishLabels: Record<MaterialFinish, string> = {
  auto: "Automático (detectado)",
  vidrio: "Vidrio",
  espejo: "Espejo",
  metal: "Metal pulido",
  "metal-cepillado": "Metal cepillado",
  madera: "Madera",
  hormigon: "Hormigón",
  piedra: "Piedra",
  ceramica: "Cerámica",
  vegetacion: "Vegetación",
  default: "Genérico (mate)",
};

const finishOptions = Object.keys(
  finishLabels,
) as MaterialFinish[];

const inputClasses =
  "min-h-11 w-full rounded-xl border border-white/15 bg-white/[0.07] px-4 text-sm text-paper outline-none focus:border-terracotta";

const textareaClasses =
  "min-h-24 w-full rounded-xl border border-white/15 bg-white/[0.07] px-4 py-3 text-sm text-paper outline-none focus:border-terracotta";

const labelClasses =
  "mb-2 block text-[0.6rem] font-semibold uppercase tracking-[0.13em] text-sage";

const sectionClasses =
  "rounded-2xl border border-white/10 bg-white/[0.04] p-5";

function slugify(value: string) {
  return value
    .trim()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function clampPercentage(value: number) {
  if (Number.isNaN(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round(value)));
}

export function AdminProjectEditor({
  projectId,
  projectSlug,
  initialStatus,
  initialTitle,
  initialSlug,
  initialSummary,
  initialLocation,
  initialClient,
  initialYearCompleted,
  initialAreaM2,
  initialTools,
  initialExternalLink,
  media,
  hasIfc,
  materials,
  initialMaterialOverrides,
  categories,
  initialCategoryProgress,
  initialChartType,
  initialSource,
  progressEntries,
}: AdminProjectEditorProps) {
  const router = useRouter();

  const [status, setStatus] =
    useState<ProjectStatus>(initialStatus);

  const [title, setTitle] = useState(initialTitle);
  const [slug, setSlug] = useState(initialSlug);

  const [isSlugTouched, setIsSlugTouched] =
    useState(false);

  const [summary, setSummary] = useState(
    initialSummary ?? "",
  );

  const [location, setLocation] = useState(
    initialLocation ?? "",
  );

  const [client, setClient] = useState(
    initialClient ?? "",
  );

  const [yearCompleted, setYearCompleted] =
    useState(
      initialYearCompleted
        ? String(initialYearCompleted)
        : "",
    );

  const [areaM2, setAreaM2] = useState(
    initialAreaM2 ? String(initialAreaM2) : "",
  );

  const [tools, setTools] = useState(
    (initialTools ?? []).join(", "),
  );

  const [externalLink, setExternalLink] =
    useState(initialExternalLink ?? "");

  const [materialOverrides, setMaterialOverrides] =
    useState<Record<string, MaterialFinish>>(
      initialMaterialOverrides,
    );

  const [categoryProgress, setCategoryProgress] =
    useState<
      Record<string, CategoryProgressEntry>
    >(initialCategoryProgress);

  const [chartType, setChartType] = useState(
    initialChartType,
  );

  const [source, setSource] = useState(
    initialSource,
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<
    string | null
  >(null);

  const handleCategoryFieldChange = (
    category: string,
    field: keyof CategoryProgressEntry,
    rawValue: string,
  ) => {
    const current = categoryProgress[category] ?? {
      actualPercentage: 0,
      paidPercentage: 0,
    };

    setCategoryProgress((prev) => ({
      ...prev,
      [category]: {
        ...current,
        [field]: clampPercentage(Number(rawValue)),
      },
    }));

    setSaved(false);
  };

  const handleSaveAll = async () => {
    const trimmedTitle = title.trim();
    const normalizedSlug = slugify(slug);

    if (trimmedTitle.length < 2) {
      setError("Ingresá un título más largo.");
      return;
    }

    if (!normalizedSlug) {
      setError("Ingresá un slug válido.");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSaved(false);

    try {
      const requests: Promise<Response>[] = [
        fetch(`/api/admin/projects/${projectId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            title: trimmedTitle,
            slug: normalizedSlug,
            summary: summary.trim(),
            location: location.trim(),
            client: client.trim(),
            yearCompleted: yearCompleted
              ? Number(yearCompleted)
              : undefined,
            areaM2: areaM2
              ? Number(areaM2)
              : undefined,
            tools: tools
              .split(",")
              .map((tool) => tool.trim())
              .filter(Boolean),
            externalLink: externalLink.trim(),
          }),
        }),
        fetch(
          `/api/admin/projects/${projectId}/bim/progress/chart-type`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ chartType }),
          },
        ),
      ];

      if (materials.length > 0) {
        requests.push(
          fetch(
            `/api/admin/projects/${projectId}/bim/materials`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                overrides: materialOverrides,
              }),
            },
          ),
        );
      }

      if (categories.length > 0) {
        requests.push(
          fetch(
            `/api/admin/projects/${projectId}/bim/category-progress`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                categoryProgress,
              }),
            },
          ),
        );

        requests.push(
          fetch(
            `/api/admin/projects/${projectId}/bim/progress/source`,
            {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ source }),
            },
          ),
        );
      }

      const responses = await Promise.all(requests);

      const failed = responses.some(
        (response) => !response.ok,
      );

      if (failed) {
        throw new Error(
          "No se pudieron guardar todos los cambios.",
        );
      }

      setTitle(trimmedTitle);
      setSlug(normalizedSlug);
      setSaved(true);
      router.refresh();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudieron guardar todos los cambios.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="sticky top-4 z-20 flex flex-wrap items-center gap-3 rounded-2xl border border-terracotta/40 bg-[#0c2236]/95 p-4 shadow-[0_1rem_3rem_rgb(0_0_0/0.35)] backdrop-blur-xl">
        <button
          className="glass-interactive inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-terracotta px-6 text-[0.65rem] font-semibold uppercase tracking-[0.13em] text-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSaving}
          onClick={() => void handleSaveAll()}
          type="button"
        >
          {isSaving ? (
            <Loader2
              aria-hidden="true"
              className="animate-spin"
              size={15}
            />
          ) : (
            <Save
              aria-hidden="true"
              size={15}
              strokeWidth={1.8}
            />
          )}
          {isSaving ? "Guardando..." : "Guardar"}
        </button>

        <p className="text-xs text-white/45">
          Guarda el estado, el título, la
          información, los materiales y el avance
          de obra de abajo, todo junto.
        </p>

        {saved ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-sage">
            <CircleCheck
              aria-hidden="true"
              size={14}
            />
            Guardado
          </span>
        ) : null}

        {error ? (
          <span
            className="inline-flex items-center gap-1.5 text-xs text-[#ffb5a0]"
            role="alert"
          >
            <CircleAlert
              aria-hidden="true"
              size={14}
            />
            {error}
          </span>
        ) : null}
      </div>

      <div className={sectionClasses}>
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-sage">
          Estado del proyecto
        </p>

        <div className="mt-4">
          <select
            className="min-h-11 rounded-xl border border-white/15 bg-white/[0.07] px-4 text-sm text-paper outline-none focus:border-terracotta"
            onChange={(event) => {
              setStatus(
                event.target
                  .value as ProjectStatus,
              );
              setSaved(false);
            }}
            value={status}
          >
            {statusOptions.map((option) => (
              <option
                className="bg-forest-deep text-paper"
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={sectionClasses}>
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-sage">
          Título y URL del proyecto
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              className={labelClasses}
              htmlFor="edit-project-title"
            >
              Título
            </label>

            <input
              className={inputClasses}
              id="edit-project-title"
              onChange={(event) => {
                setTitle(event.target.value);

                if (!isSlugTouched) {
                  setSlug(
                    slugify(event.target.value),
                  );
                }

                setSaved(false);
              }}
              type="text"
              value={title}
            />
          </div>

          <div>
            <label
              className={labelClasses}
              htmlFor="edit-project-slug"
            >
              URL (slug)
            </label>

            <input
              className={inputClasses}
              id="edit-project-slug"
              onChange={(event) => {
                setIsSlugTouched(true);
                setSlug(event.target.value);
                setSaved(false);
              }}
              type="text"
              value={slug}
            />
          </div>
        </div>

        <p className="mt-3 text-xs text-white/40">
          Página pública: /modelos/
          {slugify(slug) || "..."}
        </p>

        <p className="mt-2 text-[0.65rem] leading-5 text-[#efad94]">
          Cambiar el slug cambia la URL pública del
          proyecto. Los links que ya compartiste con
          ese slug van a dejar de funcionar.
        </p>
      </div>

      <div className={sectionClasses}>
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-sage">
          Información del proyecto
        </p>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClasses}>
              Resumen (se muestra en la ficha del
              proyecto)
            </label>

            <textarea
              className={textareaClasses}
              onChange={(event) => {
                setSummary(event.target.value);
                setSaved(false);
              }}
              rows={3}
              value={summary}
            />
          </div>

          <div>
            <label className={labelClasses}>
              Ubicación
            </label>

            <input
              className={inputClasses}
              onChange={(event) => {
                setLocation(event.target.value);
                setSaved(false);
              }}
              type="text"
              value={location}
            />
          </div>

          <div>
            <label className={labelClasses}>
              Cliente / autoría
            </label>

            <input
              className={inputClasses}
              onChange={(event) => {
                setClient(event.target.value);
                setSaved(false);
              }}
              type="text"
              value={client}
            />
          </div>

          <div>
            <label className={labelClasses}>
              Año
            </label>

            <input
              className={inputClasses}
              onChange={(event) => {
                setYearCompleted(
                  event.target.value,
                );
                setSaved(false);
              }}
              type="number"
              value={yearCompleted}
            />
          </div>

          <div>
            <label className={labelClasses}>
              Superficie (m²)
            </label>

            <input
              className={inputClasses}
              onChange={(event) => {
                setAreaM2(event.target.value);
                setSaved(false);
              }}
              type="number"
              value={areaM2}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={labelClasses}>
              Lenguaje utilizado (separadas por
              coma)
            </label>

            <input
              className={inputClasses}
              onChange={(event) => {
                setTools(event.target.value);
                setSaved(false);
              }}
              placeholder="Revit, Lumion, AutoCAD"
              type="text"
              value={tools}
            />
          </div>

          <div className="sm:col-span-2">
            <label className={labelClasses}>
              Link externo (opcional, ej. Behance)
            </label>

            <input
              className={inputClasses}
              onChange={(event) => {
                setExternalLink(
                  event.target.value,
                );
                setSaved(false);
              }}
              placeholder="https://..."
              type="url"
              value={externalLink}
            />
          </div>
        </div>
      </div>

      <div className={sectionClasses}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-sage">
            Imágenes y documentos ({media.length})
          </p>

          <ProjectMediaUploader
            projectId={projectId}
            projectSlug={projectSlug}
          />
        </div>

        <ProjectMediaGrid
          media={media}
          projectId={projectId}
        />
      </div>

      <div
        className="scroll-mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5"
        id="materiales"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-sage">
              Contenido BIM (3D)
            </p>

            <p className="mt-3 text-sm text-white/55">
              {hasIfc
                ? "Este proyecto tiene un modelo BIM cargado. Subir un nuevo archivo lo reemplaza."
                : "Subí el archivo IFC de siempre: los materiales se detectan automáticamente."}
            </p>
          </div>

          <ProjectBimUploader
            hasIfc={hasIfc}
            projectId={projectId}
            projectSlug={projectSlug}
          />
        </div>

        {materials.length > 0 ? (
          <div className="mt-5 space-y-2">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white/40">
              Acabados por material (
              {materials.length})
            </p>

            <div className="divide-y divide-white/10 rounded-xl border border-white/10 bg-white/[0.02]">
              {materials.map((material) => {
                const value =
                  materialOverrides[
                    material.key
                  ] ?? "auto";

                return (
                  <div
                    className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                    key={material.key}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="size-3.5 shrink-0 rounded-full border border-white/20"
                        style={{
                          backgroundColor:
                            material.colorHex ??
                            "#5f91ad",
                        }}
                      />

                      <span className="truncate text-sm text-white/80">
                        {material.name}
                      </span>
                    </div>

                    <select
                      className="min-h-9 rounded-full border border-white/15 bg-white/[0.06] px-3 text-xs text-white outline-none focus:border-terracotta"
                      onChange={(event) => {
                        setMaterialOverrides(
                          (prev) => ({
                            ...prev,
                            [material.key]:
                              event.target
                                .value as MaterialFinish,
                          }),
                        );
                        setSaved(false);
                      }}
                      value={value}
                    >
                      {finishOptions.map(
                        (finish) => (
                          <option
                            className="bg-forest-deep text-paper"
                            key={finish}
                            value={finish}
                          >
                            {
                              finishLabels[
                                finish
                              ]
                            }
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {categories.length > 0 ? (
          <div className="mt-5 space-y-2">
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white/40">
              Avance por categoría del modelo BIM (
              {categories.length})
            </p>

            <div className="divide-y divide-white/10 rounded-xl border border-white/10 bg-white/[0.02]">
              {categories.map((category) => {
                const entry = categoryProgress[
                  category
                ] ?? {
                  actualPercentage: 0,
                  paidPercentage: 0,
                };

                return (
                  <div
                    className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                    key={category}
                  >
                    <span className="truncate text-sm text-white/80">
                      {category}
                    </span>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-1.5 text-[0.6rem] uppercase tracking-[0.1em] text-white/40">
                        Obra
                        <input
                          className="min-h-9 w-16 rounded-full border border-white/15 bg-white/[0.06] px-2 text-center text-xs text-white outline-none focus:border-terracotta"
                          max={100}
                          min={0}
                          onChange={(event) =>
                            handleCategoryFieldChange(
                              category,
                              "actualPercentage",
                              event.target
                                .value,
                            )
                          }
                          type="number"
                          value={
                            entry.actualPercentage
                          }
                        />
                        %
                      </label>

                      <label className="flex items-center gap-1.5 text-[0.6rem] uppercase tracking-[0.1em] text-white/40">
                        Pagado
                        <input
                          className="min-h-9 w-16 rounded-full border border-white/15 bg-white/[0.06] px-2 text-center text-xs text-white outline-none focus:border-terracotta"
                          max={100}
                          min={0}
                          onChange={(event) =>
                            handleCategoryFieldChange(
                              category,
                              "paidPercentage",
                              event.target
                                .value,
                            )
                          }
                          type="number"
                          value={
                            entry.paidPercentage
                          }
                        />
                        %
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>

      <div className={sectionClasses}>
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-sage">
          Avance de obra (5D)
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <p className="text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-white/40">
            Tipo de gráfico
          </p>

          <div className="flex gap-1 rounded-full border border-white/10 bg-white/[0.02] p-1">
            {chartTypeOptions.map((option) => (
              <button
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em] transition-colors",
                  option.value === chartType
                    ? "bg-terracotta text-white"
                    : "text-white/50 hover:text-white/80",
                )}
                key={option.value}
                onClick={() => {
                  setChartType(option.value);
                  setSaved(false);
                }}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-white/40">
              Origen del gráfico público
            </p>

            <div className="flex gap-1 rounded-full border border-white/10 bg-white/[0.02] p-1">
              {sourceOptions.map((option) => {
                const isDisabled =
                  option.value ===
                    "bim-categorias" &&
                  categories.length === 0;

                return (
                  <button
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em] transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                      option.value === source
                        ? "bg-terracotta text-white"
                        : "text-white/50 hover:text-white/80",
                    )}
                    disabled={isDisabled}
                    key={option.value}
                    onClick={() => {
                      setSource(option.value);
                      setSaved(false);
                    }}
                    type="button"
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {categories.length === 0 ? (
            <p className="mt-2 text-[0.62rem] leading-5 text-white/35">
              El cálculo automático por categoría se
              habilita cuando el modelo BIM cargado
              tiene categorías detectadas (muros,
              pisos, ventanas, etc.).
            </p>
          ) : null}
        </div>

        <p className="mt-4 text-sm text-white/55">
          {source === "bim-categorias"
            ? "El gráfico público se calcula automáticamente a partir del avance cargado por categoría, arriba en Contenido BIM."
            : "Cargá el porcentaje de avance por etapa. Esto se muestra públicamente en la página del modelo."}
        </p>

        <ProjectProgressEditor
          entries={progressEntries}
          projectId={projectId}
        />
      </div>
    </div>
  );
}