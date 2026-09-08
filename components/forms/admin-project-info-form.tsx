"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert, Save } from "lucide-react";

type AdminProjectInfoFormProps = {
  projectId: string;
  initialValues: {
    summary?: string;
    location?: string;
    client?: string;
    yearCompleted?: number;
    areaM2?: number;
    tools?: string[];
    externalLink?: string;
  };
};

const inputClasses =
  "min-h-11 w-full rounded-xl border border-white/15 bg-white/[0.07] px-4 text-sm text-paper outline-none focus:border-terracotta";

const textareaClasses =
  "min-h-24 w-full rounded-xl border border-white/15 bg-white/[0.07] px-4 py-3 text-sm text-paper outline-none focus:border-terracotta";

const labelClasses =
  "mb-2 block text-[0.6rem] font-semibold uppercase tracking-[0.13em] text-sage";

export function AdminProjectInfoForm({
  projectId,
  initialValues,
}: AdminProjectInfoFormProps) {
  const router = useRouter();

  const [summary, setSummary] = useState(
    initialValues.summary ?? "",
  );

  const [location, setLocation] = useState(
    initialValues.location ?? "",
  );

  const [client, setClient] = useState(
    initialValues.client ?? "",
  );

  const [yearCompleted, setYearCompleted] =
    useState(
      initialValues.yearCompleted
        ? String(initialValues.yearCompleted)
        : "",
    );

  const [areaM2, setAreaM2] = useState(
    initialValues.areaM2
      ? String(initialValues.areaM2)
      : "",
  );

  const [tools, setTools] = useState(
    (initialValues.tools ?? []).join(", "),
  );

  const [externalLink, setExternalLink] =
    useState(initialValues.externalLink ?? "");

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSaved(false);

    try {
      const response = await fetch(
        `/api/admin/projects/${projectId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
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
        },
      );

      if (!response.ok) {
        throw new Error(
          "No fue posible guardar la información.",
        );
      }

      setSaved(true);
      router.refresh();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "No fue posible guardar la información.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
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
            onChange={(event) =>
              setSummary(event.target.value)
            }
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
            onChange={(event) =>
              setLocation(event.target.value)
            }
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
            onChange={(event) =>
              setClient(event.target.value)
            }
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
            onChange={(event) =>
              setYearCompleted(
                event.target.value,
              )
            }
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
            onChange={(event) =>
              setAreaM2(event.target.value)
            }
            type="number"
            value={areaM2}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClasses}>
            Herramientas (separadas por coma)
          </label>

          <input
            className={inputClasses}
            onChange={(event) =>
              setTools(event.target.value)
            }
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
            onChange={(event) =>
              setExternalLink(
                event.target.value,
              )
            }
            placeholder="https://..."
            type="url"
            value={externalLink}
          />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          className="glass-interactive inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-terracotta px-5 text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSaving}
          onClick={handleSave}
          type="button"
        >
          {isSaving
            ? "Guardando"
            : "Guardar información"}
          <Save
            aria-hidden="true"
            size={14}
            strokeWidth={1.8}
          />
        </button>

        {saved ? (
          <span className="text-xs text-sage">
            Guardado ✓
          </span>
        ) : null}
      </div>

      {error ? (
        <p
          className="mt-3 flex items-center gap-2 text-xs text-[#ffb5a0]"
          role="alert"
        >
          <CircleAlert
            aria-hidden="true"
            size={14}
          />
          {error}
        </p>
      ) : null}
    </div>
  );
}