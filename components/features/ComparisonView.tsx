import Link from "next/link";
import { Currency } from "@prisma/client";
import { formatCurrency } from "@/lib/currency";
import { SalaryRecord } from "@/types";

interface ComparisonViewProps {
  salary1: SalaryRecord;
  salary2: SalaryRecord;
  delta: {
    base_delta: number;
    bonus_delta: number;
    stock_delta: number;
    tc_delta: number;
    experience_delta: number;
  };
}

function formatDelta(value: number, currency: Currency) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatCurrency(value, currency)}`;
}

function WinnerBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
      Winner
    </span>
  );
}

export function ComparisonView({ salary1, salary2, delta }: ComparisonViewProps) {
  const tcWinner = delta.tc_delta > 0 ? salary2 : salary1;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {[salary1, salary2].map((salary) => (
          <div
            key={salary.id}
            className="rounded-lg border border-slate-200 bg-white p-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                <Link
                  href={`/companies/${salary.company.slug}`}
                  className="hover:text-[#77dd77]"
                >
                  {salary.company.name}
                </Link>
              </h2>
              {salary.id === tcWinner.id && <WinnerBadge />}
            </div>
            <p className="mt-1 text-sm text-gray-600">
              {salary.role} · {salary.level.replace("_", "-")} ·{" "}
              {salary.location}
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Base Salary</span>
                <span className="font-medium">
                  {formatCurrency(
                    Number(salary.base_salary),
                    salary.currency as Currency
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Bonus</span>
                <span className="font-medium">
                  {formatCurrency(
                    Number(salary.bonus),
                    salary.currency as Currency
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Stock</span>
                <span className="font-medium">
                  {formatCurrency(
                    Number(salary.stock),
                    salary.currency as Currency
                  )}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2">
                <span className="text-gray-900 font-semibold">Total Compensation</span>
                <span className="font-bold text-slate-900">
                  {formatCurrency(
                    Number(salary.total_compensation),
                    salary.currency as Currency
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Experience</span>
                <span className="font-medium">
                  {salary.experience_years} years
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900">Deltas</h3>
        <p className="text-sm text-gray-600">
          Difference: {salary2.company.name} vs {salary1.company.name}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-5">
          <div className="rounded-md bg-slate-50 p-4">
            <p className="text-xs text-slate-600">Base Delta</p>
            <p
              className={`mt-1 text-lg font-semibold ${
                delta.base_delta >= 0 ? "text-green-700" : "text-red-700"
              }`}
            >
              {formatDelta(delta.base_delta, salary1.currency as Currency)}
            </p>
          </div>
          <div className="rounded-md bg-slate-50 p-4">
            <p className="text-xs text-slate-600">Bonus Delta</p>
            <p
              className={`mt-1 text-lg font-semibold ${
                delta.bonus_delta >= 0 ? "text-green-700" : "text-red-700"
              }`}
            >
              {formatDelta(delta.bonus_delta, salary1.currency as Currency)}
            </p>
          </div>
          <div className="rounded-md bg-slate-50 p-4">
            <p className="text-xs text-slate-600">Stock Delta</p>
            <p
              className={`mt-1 text-lg font-semibold ${
                delta.stock_delta >= 0 ? "text-green-700" : "text-red-700"
              }`}
            >
              {formatDelta(delta.stock_delta, salary1.currency as Currency)}
            </p>
          </div>
          <div className="rounded-md bg-slate-50 p-4">
            <p className="text-xs text-slate-600">TC Delta</p>
            <p
              className={`mt-1 text-lg font-semibold ${
                delta.tc_delta >= 0 ? "text-green-700" : "text-red-700"
              }`}
            >
              {formatDelta(delta.tc_delta, salary1.currency as Currency)}
            </p>
          </div>
          <div className="rounded-md bg-slate-50 p-4">
            <p className="text-xs text-slate-600">Experience Delta</p>
            <p
              className={`mt-1 text-lg font-semibold ${
                delta.experience_delta >= 0
                  ? "text-green-700"
                  : "text-red-700"
              }`}
            >
              {delta.experience_delta > 0 ? "+" : ""}
              {delta.experience_delta} yrs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
