"use client";

import { useState } from "react";
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
      <input
        type="text"
        placeholder="Search by company, role, or location"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 transition-all hover:border-gray-300 focus:border-[#77dd77] focus:outline-none focus:ring-2 focus:ring-[#77dd77]/20"
      />
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
              className={`rounded-xl border p-5 text-left transition-all ${
                isSelected
                  ? "border-[#77dd77] bg-[#77dd77]/5 ring-2 ring-[#77dd77]/20"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
              } ${isDisabled ? "opacity-50" : ""}`}
            >
              <p className="font-semibold text-gray-900">
                {salary.company.name}
              </p>
              <p className="text-sm text-gray-600">
                {salary.role} · {salary.level.replace("_", "-")}
              </p>
              <p className="text-sm text-gray-500">{salary.location}</p>
              <p className="mt-3 text-sm font-bold text-[#77dd77]">
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
