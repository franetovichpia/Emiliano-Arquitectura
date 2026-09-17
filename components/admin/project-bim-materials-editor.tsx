"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert, CircleCheck } from "lucide-react";

import type {
  BimMaterialInfo,
  MaterialFinish,
} from "@/lib/db/schemas";

type ProjectBimMaterialsEditorProps = {
  projectId: string;
  materials: readonly BimMaterialInfo[];
  overrides: Record<string, MaterialFinish>;
};

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

export function ProjectBimMaterialsEditor({
  projectId,
  materials,
  overrides,
}: ProjectBimMaterialsEditorProps) {
  const router = useRouter();

  const [currentOverrides, setCurrentOverrides] =
    useState<Record<string, MaterialFinish>>(
      overrides,
    );

  const [savingKey, setSavingKey] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const [savedKey, setSavedKey] =
    useState<string | null>(null);

  const handleChange = async (
    materialKey: string,
    finish: MaterialFinish,
  ) => {
    const nextOverrides = {
      ...currentOverrides,
      [materialKey]: finish,
    };

    setCurrentOverrides(nextOverrides);
    setSavingKey(materialKey);
    setError(null);
    setSavedKey(null);

    try {
      const response = await fetch(
        `/api/admin/projects/${projectId}/bim/materials`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            overrides: nextOverrides,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          "No se pudo guardar el acabado del material.",
        );
      }

      setSavedKey(materialKey);
      router.refresh();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo guardar el acabado del material.",
      );
    } finally {
      setSavingKey(null);
    }
  };

  if (materials.length === 0) {
    return null;
  }

  return (
    <div className="mt-5 space-y-2">
      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white/40">
        Acabados por material ({materials.length})
      </p>

      <div className="divide-y divide-white/10 rounded-xl border border-white/10 bg-white/[0.02]">
        {materials.map((material) => {
          const value =
            currentOverrides[material.key] ??
            "auto";

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

                {savingKey === material.key ? (
                  <span className="text-[0.6rem] text-white/40">
                    Guardando...
                  </span>
                ) : null}

                {savedKey === material.key &&
                savingKey !== material.key ? (
                  <CircleCheck
                    aria-hidden="true"
                    className="text-sage"
                    size={14}
                  />
                ) : null}
              </div>

              <select
                className="min-h-9 rounded-full border border-white/15 bg-white/[0.06] px-3 text-xs text-white outline-none focus:border-terracotta"
                onChange={(event) =>
                  void handleChange(
                    material.key,
                    event.target
                      .value as MaterialFinish,
                  )
                }
                value={value}
              >
                {finishOptions.map((finish) => (
                  <option key={finish} value={finish}>
                    {finishLabels[finish]}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      {error ? (
        <p
          className="flex items-center gap-2 text-xs text-[#ffb5a0]"
          role="alert"
        >
          <CircleAlert aria-hidden="true" size={14} />
          {error}
        </p>
      ) : null}
    </div>
  );
}