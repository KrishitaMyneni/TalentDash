import { Currency } from "@prisma/client";
import { formatCurrency } from "@/lib/currency";
import { Badge } from "@/components/ui/Badge";

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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <p className="text-sm font-medium text-slate-600">Median Total Comp</p>
        <p className="mt-2 text-2xl font-bold text-slate-900">
          {formatCurrency(medianTotalCompensation, currency)}
        </p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <p className="text-sm font-medium text-slate-600">Salary Range</p>
        <p className="mt-2 text-2xl font-bold text-slate-900">
          {formatCurrency(salaryRange.min, currency)} -{" "}
          {formatCurrency(salaryRange.max, currency)}
        </p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <p className="text-sm font-medium text-slate-600">Level Distribution</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {Object.entries(levelDistribution)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([level, count]) => (
              <div key={level} className="flex items-center gap-1">
                <Badge level={level as never} />
                <span className="text-sm text-slate-600">{count}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
