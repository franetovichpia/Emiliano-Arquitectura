import { BarChart3 } from "lucide-react";

import type { ProgressChartType } from "@/lib/db/schemas";

type ProgressEntry = {
  id: string;
  stageName: string;
  plannedPercentage: number;
  actualPercentage: number;
  paidPercentage: number;
  notes?: string;
};

type ConstructionProgressChartProps = {
  entries: readonly ProgressEntry[];
  chartType: ProgressChartType;
  groupLabel?: string;
};

function Donut({
  percentage,
  color,
  label,
  size = 16,
  thickness = 5,
  valueClassName = "text-xs",
}: {
  percentage: number;
  color: string;
  label: string;
  size?: 16 | 24;
  thickness?: number;
  valueClassName?: string;
}) {
  const clamped = Math.min(100, Math.max(0, percentage));
  const sizeClass = size === 24 ? "size-24" : "size-16";

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`relative ${sizeClass} rounded-full`}
        style={{
          background: `conic-gradient(${color} ${clamped}%, rgba(255,255,255,0.1) 0)`,
        }}
      >
        <div
          className="absolute grid place-items-center rounded-full bg-[#0c2438]"
          style={{ inset: thickness }}
        >
          <span
            className={`font-semibold text-[#f7f2e8] ${valueClassName}`}
          >
            {clamped}%
          </span>
        </div>
      </div>

      <span className="text-[0.55rem] font-semibold uppercase tracking-[0.1em] text-white/45">
        {label}
      </span>
    </div>
  );
}

export function ConstructionProgressChart({
  entries,
  chartType,
  groupLabel = "etapa",
}: ConstructionProgressChartProps) {
  const overallActual = Math.round(
    entries.reduce(
      (total, entry) => total + entry.actualPercentage,
      0,
    ) / entries.length,
  );

  const overallPaid = Math.round(
    entries.reduce(
      (total, entry) => total + entry.paidPercentage,
      0,
    ) / entries.length,
  );

  return (
    <div className="rounded-[1.75rem] border border-white/15 bg-white/[0.04] p-6 backdrop-blur-xl sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full border border-[#77a8c1]/25 bg-[#77a8c1]/10 text-[#9dc3d5]">
            <BarChart3
              aria-hidden="true"
              size={16}
              strokeWidth={1.6}
            />
          </span>

          <div>
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-white">
              Avance de obra
            </p>

            <p className="mt-0.5 text-[0.58rem] uppercase tracking-[0.13em] text-white/40">
              Obra realizada y pago correspondiente por{" "}
              {groupLabel}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
          <Donut
            color="#7fa88a"
            label="Avance general"
            percentage={overallActual}
            size={24}
            thickness={7}
            valueClassName="text-base"
          />

          <Donut
            color="#d17c5b"
            label="Pagado general"
            percentage={overallPaid}
            size={24}
            thickness={7}
            valueClassName="text-base"
          />
        </div>
      </div>

      {chartType === "torta" ? (
        <div className="mt-7 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {entries.map((entry) => (
            <div
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-4"
              key={entry.id}
            >
              <p className="mb-3 truncate text-center text-xs font-semibold uppercase tracking-[0.08em] text-white/80">
                {entry.stageName}
              </p>

              <div className="flex items-center justify-center gap-4">
                <Donut
                  color="#7fa88a"
                  label="Obra"
                  percentage={entry.actualPercentage}
                />

                <Donut
                  color="#d17c5b"
                  label="Pagado"
                  percentage={entry.paidPercentage}
                />
              </div>

              {entry.notes ? (
                <p className="mt-3 text-center text-[0.6rem] leading-5 text-white/40">
                  {entry.notes}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-7 space-y-6">
          {entries.map((entry) => (
            <div key={entry.id}>
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-white/80">
                {entry.stageName}
              </p>

              <div className="mt-2 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-14 shrink-0 text-[0.6rem] uppercase tracking-[0.1em] text-white/40">
                    Obra
                  </span>

                  <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 rounded-full border-r-2 border-dashed border-white/40"
                      style={{
                        width: `${Math.min(100, entry.plannedPercentage)}%`,
                      }}
                    />

                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-[#7fa88a] transition-[width] duration-500"
                      style={{
                        width: `${Math.min(100, entry.actualPercentage)}%`,
                      }}
                    />
                  </div>

                  <span className="w-10 shrink-0 text-right text-[0.65rem] text-white/50">
                    {entry.actualPercentage}%
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-14 shrink-0 text-[0.6rem] uppercase tracking-[0.1em] text-white/40">
                    Pagado
                  </span>

                  <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-[#d17c5b] transition-[width] duration-500"
                      style={{
                        width: `${Math.min(100, entry.paidPercentage)}%`,
                      }}
                    />
                  </div>

                  <span className="w-10 shrink-0 text-right text-[0.65rem] text-white/50">
                    {entry.paidPercentage}%
                  </span>
                </div>
              </div>

              <p className="mt-1.5 text-[0.6rem] text-white/30">
                Planificado: {entry.plannedPercentage}%
              </p>

              {entry.notes ? (
                <p className="mt-1 text-[0.65rem] leading-5 text-white/40">
                  {entry.notes}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}