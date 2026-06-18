import { Currency } from "@prisma/client";
import { formatCurrency } from "@/lib/currency";
import { LevelPieChart } from "@/components/features/LevelPieChart";

interface CompanyStatsProps {
  medianTotalCompensation: number;
  salaryRange: { min: number; max: number };
  levelDistribution: Record<string, number>;
  currency: Currency;
}

export function CompanyStats({
  medianTotalCompensation,
  salaryRange,
  levelDistribution,
  currency,
}: CompanyStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <div className="rounded-xl border border-border bg-gradient-to-br from-white to-[#fff8f8] p-6 shadow-sm transition-all hover:shadow-md">
        <p className="text-xs font-semibold uppercase text-muted-text">
          Median Total Comp
        </p>
        <p className="mt-3 text-3xl font-bold bg-gradient-to-r from-[#ff5a5f] to-[#e04b50] bg-clip-text text-transparent">
          {formatCurrency(medianTotalCompensation, currency)}
        </p>
      </div>
      <div className="rounded-xl border border-border bg-gradient-to-br from-white to-[#fff8f8] p-6 shadow-sm transition-all hover:shadow-md">
        <p className="text-xs font-semibold uppercase text-muted-text">
          Salary Range
        </p>
        <p className="mt-3 text-xl font-bold text-foreground">
          <span className="text-2xl bg-gradient-to-r from-[#ff5a5f] to-[#e04b50] bg-clip-text text-transparent">
            {formatCurrency(salaryRange.min, currency)}
          </span>
          <span className="mx-2 text-muted-text">-</span>
          <span className="text-2xl bg-gradient-to-r from-[#ff5a5f] to-[#e04b50] bg-clip-text text-transparent">
            {formatCurrency(salaryRange.max, currency)}
          </span>
        </p>
      </div>
      <div className="rounded-xl border border-border bg-gradient-to-br from-white to-[#fff8f8] p-6 shadow-sm transition-all hover:shadow-md">
        <p className="text-xs font-semibold uppercase text-muted-text">
          Level Distribution
        </p>
        <div className="mt-4">
          <LevelPieChart data={levelDistribution} />
        </div>
      </div>
    </div>
  );
}
