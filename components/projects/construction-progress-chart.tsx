import { BarChart3 } from "lucide-react";

type ProgressEntry = {
  id: string;
  stageName: string;
  plannedPercentage: number;
  actualPercentage: number;
  notes?: string;
};

type ConstructionProgressChartProps = {
  entries: readonly ProgressEntry[];
};

export function ConstructionProgressChart({
  entries,
}: ConstructionProgressChartProps) {
  const overallActual = Math.round(
    entries.reduce(
      (total, entry) => total + entry.actualPercentage,
      0,
    ) / entries.length,
  );

  return (
    <div className="rounded-[1.75rem] border border-white/15 bg-white/[0.04] p-6 backdrop-blur-xl sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
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
              Cada etapa refleja lo efectivamente ejecutado
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-[#d17c5b]/40 bg-[#d17c5b]/10 px-4 py-2">
          <span className="text-[0.58rem] font-semibold uppercase tracking-[0.13em] text-[#efad94]">
            Avance general
          </span>

          <span className="text-sm font-semibold text-[#f7f2e8]">
            {overallActual}%
          </span>
        </div>
      </div>

      <div className="mt-7 space-y-5">
        {entries.map((entry) => (
          <div key={entry.id}>
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-white/80">
                {entry.stageName}
              </p>

              <p className="shrink-0 text-[0.68rem] text-white/50">
                {entry.actualPercentage}%{" "}
                <span className="text-white/30">
                  de {entry.plannedPercentage}% planificado
                </span>
              </p>
            </div>

            <div className="relative mt-2.5 h-2.5 overflow-hidden rounded-full bg-white/10">
              <div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 rounded-full border-r-2 border-dashed border-white/40"
                style={{
                  width: `${Math.min(100, entry.plannedPercentage)}%`,
                }}
              />

              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#7fa88a] to-[#d17c5b] transition-[width] duration-500"
                style={{
                  width: `${Math.min(100, entry.actualPercentage)}%`,
                }}
              />
            </div>

            {entry.notes ? (
              <p className="mt-1.5 text-[0.65rem] leading-5 text-white/40">
                {entry.notes}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}