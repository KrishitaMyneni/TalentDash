"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Currency } from "@prisma/client";
import { formatCurrency } from "@/lib/currency";
import { SalaryRecord } from "@/types";

interface CompareSelectorProps {
  salaries: SalaryRecord[];
}

export function CompareSelector({ salaries }: CompareSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<string[]>([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const s1 = searchParams.get("s1");
    const s2 = searchParams.get("s2");
    const nextSelected = [s1, s2].filter(
      (value): value is string => Boolean(value)
    );
    setSelected(nextSelected.slice(0, 2));
  }, [searchParams]);

  const filteredSalaries = salaries.filter(
    (s) =>
      s.company.name.toLowerCase().includes(filter.toLowerCase()) ||
      s.role.toLowerCase().includes(filter.toLowerCase()) ||
      s.location.toLowerCase().includes(filter.toLowerCase())
  );

  const toggleSelection = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else if (selected.length < 2) {
      const next = [...selected, id];
      setSelected(next);
      if (next.length === 2) {
        router.push(`/compare?s1=${next[0]}&s2=${next[1]}`);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex-1">
            <span className="mb-2 block text-sm font-medium text-gray-700">
              Search salary records
            </span>
            <input
              type="text"
              placeholder="Search by company, role, or location"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full rounded-lg border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-text shadow-sm hover:border-gray-300 focus:border-[#ff5a5f] focus:outline-none focus:ring-2 focus:ring-[#ff5a5f]/20"
            />
          </label>
          <div className="rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Select {Math.max(0, 2 - selected.length)} more
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSalaries.map((salary) => {
          const isSelected = selected.includes(salary.id);
          const isDisabled =
            !isSelected && selected.length >= 2 && !searchParams.has("s1");

          return (
            <button
              key={salary.id}
              onClick={() => toggleSelection(salary.id)}
              disabled={isDisabled}
              aria-pressed={isSelected}
              className={`rounded-xl border p-5 text-left transition-all ${
                isSelected
                  ? "border-[#ff5a5f] bg-[#ff5a5f]/5 ring-2 ring-[#ff5a5f]/20 shadow-md"
                  : "border-border bg-surface hover:border-gray-300 hover:shadow-sm focus-visible:border-[#ff5a5f] focus-visible:ring-2 focus-visible:ring-[#ff5a5f]/20"
              } ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-gray-900">
                  {salary.company.name}
                </p>
                {isSelected && (
                  <span className="rounded-full bg-[#ff5a5f] px-2 py-0.5 text-xs font-semibold text-white">
                    Selected
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">
                {salary.role} · {salary.level.replace("_", "-")}
              </p>
              <p className="text-sm text-gray-500">{salary.location}</p>
              <p className="mt-3 text-sm font-bold text-[#ff5a5f]">
                {formatCurrency(
                  Number(salary.total_compensation),
                  salary.currency as Currency
                )}
              </p>
            </button>
          );
        })}
      </div>

      {filteredSalaries.length === 0 && (
        <p className="text-center text-sm text-gray-500">
          No salary records match your search.
        </p>
      )}
    </div>
  );
}
