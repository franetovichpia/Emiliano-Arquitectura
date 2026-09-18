"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import {
  CircleAlert,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";

type ProgressEntry = {
  id: string;
  stageName: string;
  plannedPercentage: number;
  actualPercentage: number;
  paidPercentage: number;
  notes?: string;
};

type ProjectProgressEditorProps = {
  projectId: string;
  entries: readonly ProgressEntry[];
};

const inputClasses =
  "min-h-10 w-full rounded-xl border border-white/15 bg-white/[0.07] px-3 text-sm text-paper outline-none focus:border-terracotta";

const labelClasses =
  "mb-1.5 block text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-white/40";

export function ProjectProgressEditor({
  projectId,
  entries,
}: ProjectProgressEditorProps) {
  const router = useRouter();

  const [stageName, setStageName] =
    useState("");

  const [plannedPercentage, setPlannedPercentage] =
    useState("");

  const [actualPercentage, setActualPercentage] =
    useState("");

  const [paidPercentage, setPaidPercentage] =
    useState("");

  const [notes, setNotes] = useState("");

  const [isSaving, setIsSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!stageName.trim()) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/projects/${projectId}/bim/progress`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stageName: stageName.trim(),
            plannedPercentage:
              Number(plannedPercentage) || 0,
            actualPercentage:
              Number(actualPercentage) || 0,
            paidPercentage:
              Number(paidPercentage) || 0,
            recordDate: new Date().toISOString(),
            notes: notes.trim() || undefined,
            sortOrder: entries.length,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          "No se pudo guardar la etapa.",
        );
      }

      setStageName("");
      setPlannedPercentage("");
      setActualPercentage("");
      setPaidPercentage("");
      setNotes("");
      router.refresh();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo guardar la etapa.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (
    entryId: string,
  ) => {
    setDeletingId(entryId);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/projects/${projectId}/bim/progress/${entryId}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        throw new Error(
          "No se pudo eliminar la etapa.",
        );
      }

      router.refresh();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo eliminar la etapa.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-5 space-y-4">
      {entries.length > 0 ? (
        <div className="divide-y divide-white/10 rounded-xl border border-white/10 bg-white/[0.02]">
          {entries.map((entry) => (
            <div
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
              key={entry.id}
            >
              <div className="min-w-0">
                <p className="text-sm text-white/80">
                  {entry.stageName}
                </p>

                <p className="mt-0.5 text-[0.65rem] text-white/40">
                  {entry.actualPercentage}% obra ·{" "}
                  {entry.paidPercentage}% pagado ·{" "}
                  {entry.plannedPercentage}%
                  planificado
                  {entry.notes
                    ? ` · ${entry.notes}`
                    : ""}
                </p>
              </div>

              <button
                aria-label={`Eliminar etapa ${entry.stageName}`}
                className="glass-interactive grid size-8 shrink-0 place-items-center rounded-lg border border-white/15 text-white/50 hover:border-red-400/40 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={
                  deletingId === entry.id
                }
                onClick={() =>
                  void handleDelete(entry.id)
                }
                type="button"
              >
                {deletingId === entry.id ? (
                  <Loader2
                    aria-hidden="true"
                    className="animate-spin"
                    size={13}
                  />
                ) : (
                  <Trash2
                    aria-hidden="true"
                    size={13}
                  />
                )}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-white/45">
          Todavía no cargaste etapas de avance.
        </p>
      )}

      <form
        className="grid grid-cols-1 gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:grid-cols-3"
        onSubmit={handleSubmit}
      >
        <div className="sm:col-span-3">
          <label className={labelClasses}>
            Etapa / categoría
          </label>

          <input
            className={inputClasses}
            onChange={(event) =>
              setStageName(event.target.value)
            }
            placeholder="Ej: Demolición, Pisos, Mampostería"
            value={stageName}
          />
        </div>

        <div>
          <label className={labelClasses}>
            Planificado (%)
          </label>

          <input
            className={inputClasses}
            max={100}
            min={0}
            onChange={(event) =>
              setPlannedPercentage(
                event.target.value,
              )
            }
            type="number"
            value={plannedPercentage}
          />
        </div>

        <div>
          <label className={labelClasses}>
            Obra realizada (%)
          </label>

          <input
            className={inputClasses}
            max={100}
            min={0}
            onChange={(event) =>
              setActualPercentage(
                event.target.value,
              )
            }
            type="number"
            value={actualPercentage}
          />
        </div>

        <div>
          <label className={labelClasses}>
            Pagado (%)
          </label>

          <input
            className={inputClasses}
            max={100}
            min={0}
            onChange={(event) =>
              setPaidPercentage(
                event.target.value,
              )
            }
            type="number"
            value={paidPercentage}
          />
        </div>

        <div className="sm:col-span-3">
          <label className={labelClasses}>
            Notas (opcional)
          </label>

          <input
            className={inputClasses}
            onChange={(event) =>
              setNotes(event.target.value)
            }
            placeholder="Ej: cubre la seña inicial"
            value={notes}
          />
        </div>

        <div className="sm:col-span-3 flex items-center justify-between gap-3">
          {error ? (
            <p
              className="flex items-center gap-2 text-xs text-[#ffb5a0]"
              role="alert"
            >
              <CircleAlert
                aria-hidden="true"
                size={14}
              />
              {error}
            </p>
          ) : (
            <span />
          )}

          <button
            className="glass-interactive inline-flex min-h-10 items-center gap-2 rounded-full border border-white/20 bg-white/[0.07] px-4 text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-white hover:border-white/35 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={
              isSaving || !stageName.trim()
            }
            type="submit"
          >
            {isSaving ? (
              <Loader2
                aria-hidden="true"
                className="animate-spin"
                size={13}
              />
            ) : (
              <Plus
                aria-hidden="true"
                size={13}
                strokeWidth={1.8}
              />
            )}
            Agregar etapa
          </button>
        </div>
      </form>
    </div>
  );
}