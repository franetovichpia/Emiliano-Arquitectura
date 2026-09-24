"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Boxes, Loader2, PenLine } from "lucide-react";

import type { ProgressSource } from "@/lib/db/schemas";
import { cn } from "@/utils/cn";

type ProjectProgressSourceSelectorProps = {
  projectId: string;
  currentSource: ProgressSource;
  hasCategories: boolean;
};

const options: {
  value: ProgressSource;
  label: string;
  icon: typeof Boxes;
}[] = [
  { value: "manual", label: "Manual por etapa", icon: PenLine },
  {
    value: "bim-categorias",
    label: "Automático por categoría BIM",
    icon: Boxes,
  },
];

export function ProjectProgressSourceSelector({
  projectId,
  currentSource,
  hasCategories,
}: ProjectProgressSourceSelectorProps) {
  const router = useRouter();

  const [source, setSource] =
    useState(currentSource);

  const [isSaving, setIsSaving] = useState(false);

  const handleSelect = async (
    value: ProgressSource,
  ) => {
    if (value === source) {
      return;
    }

    setSource(value);
    setIsSaving(true);

    try {
      const response = await fetch(
        `/api/admin/projects/${projectId}/bim/progress/source`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ source: value }),
        },
      );

      if (!response.ok) {
        setSource(currentSource);
        return;
      }

      router.refresh();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-white/40">
          Origen del gráfico público
        </p>

        <div className="flex gap-1 rounded-full border border-white/10 bg-white/[0.02] p-1">
          {options.map((option) => {
            const Icon = option.icon;
            const isActive =
              option.value === source;

            const isDisabled =
              option.value === "bim-categorias" &&
              !hasCategories;

            return (
              <button
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em] transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                  isActive
                    ? "bg-terracotta text-white"
                    : "text-white/50 hover:text-white/80",
                )}
                disabled={isSaving || isDisabled}
                key={option.value}
                onClick={() =>
                  void handleSelect(option.value)
                }
                type="button"
              >
                {isSaving && isActive ? (
                  <Loader2
                    aria-hidden="true"
                    className="animate-spin"
                    size={12}
                  />
                ) : (
                  <Icon
                    aria-hidden="true"
                    size={12}
                    strokeWidth={1.8}
                  />
                )}
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {!hasCategories ? (
        <p className="mt-2 text-[0.62rem] leading-5 text-white/35">
          El cálculo automático por categoría se habilita
          cuando el modelo BIM cargado tiene categorías
          detectadas (muros, pisos, ventanas, etc.).
        </p>
      ) : null}
    </div>
  );
}