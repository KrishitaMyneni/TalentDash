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
    <span className="inline-flex items-center rounded-full bg-[#ff5a5f]/15 px-2.5 py-1 text-xs font-semibold text-[#ff5a5f]">
      Better total pay
    </span>
  );
}

function TieBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
      Same total pay
    </span>
  );
}

function MetricBarRow({
  label,
  leftLabel,
  rightLabel,
  leftSideName,
  rightSideName,
  leftValue,
  rightValue,
  currency,
  leftWins,
  rightWins,
  tie,
}: {
  label: string;
  leftLabel: string;
  rightLabel: string;
  leftSideName: string;
  rightSideName: string;
  leftValue: number;
  rightValue: number;
  currency: Currency;
  leftWins: boolean;
  rightWins: boolean;
  tie: boolean;
}) {
  const max = Math.max(Math.abs(leftValue), Math.abs(rightValue), 1);
  const leftPct = Math.max(12, (Math.abs(leftValue) / max) * 100);
  const rightPct = Math.max(12, (Math.abs(rightValue) / max) * 100);
  const leftIsWinner = leftWins && !tie;
  const rightIsWinner = rightWins && !tie;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-sm font-semibold text-foreground">{label}</h4>
        <p className="text-xs text-muted-text">
          {tie
            ? "Even"
            : rightValue >= leftValue
              ? `${rightSideName} ahead`
              : `${leftSideName} ahead`}
        </p>
      </div>

      <div className="mt-4 space-y-3">
        <div className="grid grid-cols-[120px_1fr_auto] items-center gap-3">
          <span
            className={`text-sm font-medium ${
              leftIsWinner ? "text-[#ff5a5f]" : "text-muted-text"
            }`}
          >
            {leftLabel}
          </span>
          <div className="h-3 rounded-full bg-hover-surface">
            <div
              className={`h-3 rounded-full ${
                leftIsWinner ? "bg-[#ff5a5f]" : "bg-slate-300"
              }`}
              style={{ width: `${leftPct}%` }}
            />
          </div>
          <span
            className={`text-sm font-semibold ${
              leftIsWinner ? "text-[#ff5a5f]" : "text-muted-text"
            }`}
          >
            {formatCurrency(leftValue, currency)}
          </span>
        </div>

        <div className="grid grid-cols-[120px_1fr_auto] items-center gap-3">
          <span
            className={`text-sm font-medium ${
              rightIsWinner ? "text-[#ff5a5f]" : "text-muted-text"
            }`}
          >
            {rightLabel}
          </span>
          <div className="h-3 rounded-full bg-hover-surface">
            <div
              className={`h-3 rounded-full ${
                rightIsWinner ? "bg-[#ff5a5f]" : "bg-slate-300"
              }`}
              style={{ width: `${rightPct}%` }}
            />
          </div>
          <span
            className={`text-sm font-semibold ${
              rightIsWinner ? "text-[#ff5a5f]" : "text-muted-text"
            }`}
          >
            {formatCurrency(rightValue, currency)}
          </span>
        </div>
      </div>

      <p className="mt-3 text-sm font-semibold text-body-text">
        Delta: {formatDelta(rightValue - leftValue, currency)}
      </p>
    </div>
  );
}

export function ComparisonView({
  salary1,
  salary2,
  delta,
}: ComparisonViewProps) {
  const isTie = delta.tc_delta === 0;
  const tcWinner = delta.tc_delta > 0 ? salary2 : salary1;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {[salary1, salary2].map((salary, index) => (
          <div
            key={salary.id}
            className="rounded-lg border border-border bg-surface p-6"
          >
            <div className="mb-3 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-text">
                  Offer {index + 1}
                </p>
                <h2 className="text-xl font-bold text-foreground">
                  <Link
                    href={`/companies/${salary.company.slug}`}
                    className="rounded-sm transition-colors hover:text-[#ff5a5f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff5a5f]/30"
                  >
                    {salary.company.name}
                  </Link>
                </h2>
              </div>
              {isTie ? (
                <TieBadge />
              ) : salary.id === tcWinner.id ? (
                <WinnerBadge />
              ) : null}
            </div>
            <p className="text-sm text-body-text">
              {salary.role} · {salary.level.replace("_", "-")} · {salary.location}
            </p>
            <div className="mt-4 flex items-center justify-between rounded-md bg-hover-surface px-3 py-2 text-sm">
              <span className="text-muted-text">Total compensation</span>
              <span className="font-semibold text-foreground">
                {formatCurrency(
                  Number(salary.total_compensation),
                  salary.currency as Currency
                )}
              </span>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-body-text">Base Salary</span>
                <span className="font-medium">
                  {formatCurrency(
                    Number(salary.base_salary),
                    salary.currency as Currency
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-body-text">Bonus</span>
                <span className="font-medium">
                  {formatCurrency(
                    Number(salary.bonus),
                    salary.currency as Currency
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-body-text">Stock</span>
                <span className="font-medium">
                  {formatCurrency(
                    Number(salary.stock),
                    salary.currency as Currency
                  )}
                </span>
              </div>
              <div className="flex justify-between border-t border-border pt-2">
                <span className="font-semibold text-foreground">
                  Total Compensation
                </span>
                <span className="font-bold text-foreground">
                  {formatCurrency(
                    Number(salary.total_compensation),
                    salary.currency as Currency
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-body-text">Experience</span>
                <span className="font-medium">
                  {salary.experience_years} years
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-surface p-6">
        <h3 className="text-lg font-semibold text-foreground">
          Inline Comparison
        </h3>
        <p className="text-sm text-body-text">
          Bars help you compare the offers faster than reading the numbers alone.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4">
          <MetricBarRow
            label="Base Salary"
            leftLabel={salary1.company.name}
            rightLabel={salary2.company.name}
            leftSideName="Offer 1"
            rightSideName="Offer 2"
            leftValue={Number(salary1.base_salary)}
            rightValue={Number(salary2.base_salary)}
            currency={salary1.currency as Currency}
            leftWins={Number(salary1.base_salary) > Number(salary2.base_salary)}
            rightWins={Number(salary2.base_salary) > Number(salary1.base_salary)}
            tie={Number(salary1.base_salary) === Number(salary2.base_salary)}
          />
          <MetricBarRow
            label="Bonus"
            leftLabel={salary1.company.name}
            rightLabel={salary2.company.name}
            leftSideName="Offer 1"
            rightSideName="Offer 2"
            leftValue={Number(salary1.bonus)}
            rightValue={Number(salary2.bonus)}
            currency={salary1.currency as Currency}
            leftWins={Number(salary1.bonus) > Number(salary2.bonus)}
            rightWins={Number(salary2.bonus) > Number(salary1.bonus)}
            tie={Number(salary1.bonus) === Number(salary2.bonus)}
          />
          <MetricBarRow
            label="Stock"
            leftLabel={salary1.company.name}
            rightLabel={salary2.company.name}
            leftSideName="Offer 1"
            rightSideName="Offer 2"
            leftValue={Number(salary1.stock)}
            rightValue={Number(salary2.stock)}
            currency={salary1.currency as Currency}
            leftWins={Number(salary1.stock) > Number(salary2.stock)}
            rightWins={Number(salary2.stock) > Number(salary1.stock)}
            tie={Number(salary1.stock) === Number(salary2.stock)}
          />
          <MetricBarRow
            label="Total Compensation"
            leftLabel={salary1.company.name}
            rightLabel={salary2.company.name}
            leftSideName="Offer 1"
            rightSideName="Offer 2"
            leftValue={Number(salary1.total_compensation)}
            rightValue={Number(salary2.total_compensation)}
            currency={salary1.currency as Currency}
            leftWins={Number(salary1.total_compensation) > Number(salary2.total_compensation)}
            rightWins={Number(salary2.total_compensation) > Number(salary1.total_compensation)}
            tie={Number(salary1.total_compensation) === Number(salary2.total_compensation)}
          />
        </div>
      </div>
    </div>
  );
}
