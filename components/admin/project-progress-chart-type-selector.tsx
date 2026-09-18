"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, Loader2, PieChart } from "lucide-react";

import type { ProgressChartType } from "@/lib/db/schemas";
import { cn } from "@/utils/cn";

type ProjectProgressChartTypeSelectorProps = {
  projectId: string;
  currentChartType: ProgressChartType;
};

const options: {
  value: ProgressChartType;
  label: string;
  icon: typeof BarChart3;
}[] = [
  { value: "barra", label: "Barra", icon: BarChart3 },
  { value: "torta", label: "Torta", icon: PieChart },
];

export function ProjectProgressChartTypeSelector({
  projectId,
  currentChartType,
}: ProjectProgressChartTypeSelectorProps) {
  const router = useRouter();

  const [chartType, setChartType] =
    useState(currentChartType);

  const [isSaving, setIsSaving] = useState(false);

  const handleSelect = async (
    value: ProgressChartType,
  ) => {
    if (value === chartType) {
      return;
    }

    setChartType(value);
    setIsSaving(true);

    try {
      const response = await fetch(
        `/api/admin/projects/${projectId}/bim/progress/chart-type`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chartType: value,
          }),
        },
      );

      if (!response.ok) {
        setChartType(currentChartType);
        return;
      }

      router.refresh();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <p className="text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-white/40">
        Tipo de gráfico
      </p>

      <div className="flex gap-1 rounded-full border border-white/10 bg-white/[0.02] p-1">
        {options.map((option) => {
          const Icon = option.icon;
          const isActive =
            option.value === chartType;

          return (
            <button
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.1em] transition-colors disabled:cursor-not-allowed",
                isActive
                  ? "bg-terracotta text-white"
                  : "text-white/50 hover:text-white/80",
              )}
              disabled={isSaving}
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
  );
}