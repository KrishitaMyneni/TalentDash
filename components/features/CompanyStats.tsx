import { Currency } from "@prisma/client";
import { formatCurrency } from "@/lib/currency";
import { LevelPieChart } from "@/components/features/LevelPieChart";

interface CompanyStatsProps {
  medianTotalCompensation: number;
  salaryRange: { min: number; max: number };
  levelDistribution: Record<string, number>;
  currency: Currency;
  recordCount?: number;
}

export function CompanyStats({
  medianTotalCompensation,
  salaryRange,
  levelDistribution,
  currency,
  recordCount = 0,
}: CompanyStatsProps) {
  const rangeSpread = salaryRange.max - salaryRange.min;
  const rangeSpreadPercent = salaryRange.min > 0 ? ((rangeSpread / salaryRange.min) * 100).toFixed(0) : "0";

  return (
    <div className="space-y-4">
      {/* Row 1: KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Median Total Comp */}
        <div className="rounded-xl border border-border bg-gradient-to-br from-white to-[#fff8f8] p-4 shadow-sm transition-all hover:shadow-md">
          <p className="text-xs font-semibold uppercase text-muted-text">
            Median Total Comp
          </p>
          <p className="mt-1.5 text-3xl font-bold bg-gradient-to-r from-[#ff5a5f] to-[#e04b50] bg-clip-text text-transparent">
            {formatCurrency(medianTotalCompensation, currency)}
          </p>
          <div className="mt-3 flex items-center gap-4 border-t border-border pt-2.5 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-muted-text">Based on</span>
              <span className="font-medium text-foreground">{recordCount} records</span>
            </div>
          </div>
        </div>

        {/* Salary Range */}
        <div className="rounded-xl border border-border bg-gradient-to-br from-white to-[#fff8f8] p-4 shadow-sm transition-all hover:shadow-md">
          <p className="text-xs font-semibold uppercase text-muted-text">
            Salary Range
          </p>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-[#ff5a5f] to-[#e04b50] bg-clip-text text-transparent">
              {formatCurrency(salaryRange.min, currency)}
            </span>
            <span className="text-muted-text">-</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#ff5a5f] to-[#e04b50] bg-clip-text text-transparent">
              {formatCurrency(salaryRange.max, currency)}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-4 border-t border-border pt-2.5 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-muted-text">Spread</span>
              <span className="font-medium text-foreground">+{rangeSpreadPercent}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-muted-text">Diff</span>
              <span className="font-medium text-foreground">{formatCurrency(rangeSpread, currency)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Level Distribution (full width) */}
      <div className="rounded-xl border border-border bg-gradient-to-br from-white to-[#fff8f8] p-5 shadow-sm transition-all hover:shadow-md">
        <p className="text-xs font-semibold uppercase text-muted-text">
          Level Distribution
        </p>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
          <div className="mx-auto h-36 w-36 sm:h-40 sm:w-40">
            <LevelPieChart data={levelDistribution} />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {Object.entries(levelDistribution)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([level, count]) => (
                <div
                  key={level}
                  className="flex items-center gap-2 rounded-lg bg-hover-surface px-3 py-2"
                >
                  <div className="h-2 w-2 rounded-full bg-[#ff5a5f]" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-foreground truncate">
                      {level.replace("_", "-")}
                    </p>
                    <p className="text-xs text-muted-text">{count} records</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
