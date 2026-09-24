"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleAlert, CircleCheck } from "lucide-react";

import type { CategoryProgressEntry } from "@/lib/db/schemas";

type ProjectCategoryProgressEditorProps = {
  projectId: string;
  categories: readonly string[];
  progress: Record<string, CategoryProgressEntry>;
};

const emptyEntry: CategoryProgressEntry = {
  actualPercentage: 0,
  paidPercentage: 0,
};

function clampPercentage(value: number) {
  if (Number.isNaN(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round(value)));
}

export function ProjectCategoryProgressEditor({
  projectId,
  categories,
  progress,
}: ProjectCategoryProgressEditorProps) {
  const router = useRouter();

  const [values, setValues] = useState<
    Record<string, CategoryProgressEntry>
  >(progress);

  const [savingCategory, setSavingCategory] =
    useState<string | null>(null);

  const [savedCategory, setSavedCategory] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const handleFieldChange = (
    category: string,
    field: keyof CategoryProgressEntry,
    rawValue: string,
  ) => {
    const current = values[category] ?? emptyEntry;

    setValues((prev) => ({
      ...prev,
      [category]: {
        ...current,
        [field]: clampPercentage(Number(rawValue)),
      },
    }));

    setSavedCategory(null);
  };

  const handleSave = async (category: string) => {
    setSavingCategory(category);
    setError(null);
    setSavedCategory(null);

    try {
      const response = await fetch(
        `/api/admin/projects/${projectId}/bim/category-progress`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            categoryProgress: values,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          "No se pudo guardar el avance de la categoría.",
        );
      }

      setSavedCategory(category);
      router.refresh();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo guardar el avance de la categoría.",
      );
    } finally {
      setSavingCategory(null);
    }
  };

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="mt-5 space-y-2">
      <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white/40">
        Avance por categoría del modelo BIM (
        {categories.length})
      </p>

      <div className="divide-y divide-white/10 rounded-xl border border-white/10 bg-white/[0.02]">
        {categories.map((category) => {
          const entry =
            values[category] ?? emptyEntry;

          return (
            <div
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
              key={category}
            >
              <div className="flex min-w-0 items-center gap-2">
                <span className="truncate text-sm text-white/80">
                  {category}
                </span>

                {savingCategory === category ? (
                  <span className="text-[0.6rem] text-white/40">
                    Guardando...
                  </span>
                ) : null}

                {savedCategory === category &&
                savingCategory !== category ? (
                  <CircleCheck
                    aria-hidden="true"
                    className="text-sage"
                    size={14}
                  />
                ) : null}
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1.5 text-[0.6rem] uppercase tracking-[0.1em] text-white/40">
                  Obra
                  <input
                    className="min-h-9 w-16 rounded-full border border-white/15 bg-white/[0.06] px-2 text-center text-xs text-white outline-none focus:border-terracotta"
                    max={100}
                    min={0}
                    onBlur={() =>
                      void handleSave(category)
                    }
                    onChange={(event) =>
                      handleFieldChange(
                        category,
                        "actualPercentage",
                        event.target.value,
                      )
                    }
                    type="number"
                    value={entry.actualPercentage}
                  />
                  %
                </label>

                <label className="flex items-center gap-1.5 text-[0.6rem] uppercase tracking-[0.1em] text-white/40">
                  Pagado
                  <input
                    className="min-h-9 w-16 rounded-full border border-white/15 bg-white/[0.06] px-2 text-center text-xs text-white outline-none focus:border-terracotta"
                    max={100}
                    min={0}
                    onBlur={() =>
                      void handleSave(category)
                    }
                    onChange={(event) =>
                      handleFieldChange(
                        category,
                        "paidPercentage",
                        event.target.value,
                      )
                    }
                    type="number"
                    value={entry.paidPercentage}
                  />
                  %
                </label>
              </div>
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