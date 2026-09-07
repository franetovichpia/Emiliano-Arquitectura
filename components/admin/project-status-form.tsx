"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert, Save } from "lucide-react";

import type { ProjectStatus } from "@/lib/db/schemas";

const statusOptions: {
  value: ProjectStatus;
  label: string;
}[] = [
  { value: "borrador", label: "Borrador" },
  { value: "publicado", label: "Publicado" },
  { value: "archivado", label: "Archivado" },
];

type ProjectStatusFormProps = {
  projectId: string;
  currentStatus: ProjectStatus;
};

export function ProjectStatusForm({
  projectId,
  currentStatus,
}: ProjectStatusFormProps) {
  const router = useRouter();

  const [status, setStatus] =
    useState<ProjectStatus>(currentStatus);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/admin/projects/${projectId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        },
      );

      if (!response.ok) {
        throw new Error(
          "No fue posible guardar el estado.",
        );
      }

      router.refresh();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "No fue posible guardar el estado.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-sage">
        Estado del proyecto
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <select
          className="min-h-11 rounded-xl border border-white/15 bg-white/[0.07] px-4 text-sm text-paper outline-none focus:border-terracotta"
          onChange={(event) =>
            setStatus(
              event.target.value as ProjectStatus,
            )
          }
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

        <button
          className="glass-interactive inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 bg-terracotta px-5 text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-white disabled:cursor-not-allowed disabled:opacity-50"
          disabled={
            isSaving || status === currentStatus
          }
          onClick={handleSave}
          type="button"
        >
          {isSaving ? "Guardando" : "Guardar"}
          <Save
            aria-hidden="true"
            size={14}
            strokeWidth={1.8}
          />
        </button>
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