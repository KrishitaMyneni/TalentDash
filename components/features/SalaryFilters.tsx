"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { Level, Currency } from "@prisma/client";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

const levels: { value: string; label: string }[] = [
  { value: "", label: "All levels" },
  ...Object.values(Level).map((level) => ({
    value: level,
    label: level.replace("_", "-"),
  })),
];

const currencies: { value: string; label: string }[] = [
  { value: "", label: "All currencies" },
  ...Object.values(Currency).map((currency) => ({
    value: currency,
    label: currency,
  })),
];

const sortOptions = [
  { value: "total_compensation", label: "Total Compensation" },
  { value: "base_salary", label: "Base Salary" },
  { value: "experience_years", label: "Experience" },
  { value: "submitted_at", label: "Submitted At" },
];

export function SalaryFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // Local state for text inputs to allow typing without navigation on every keystroke
  const [companyValue, setCompanyValue] = useState(
    searchParams.get("company") ?? ""
  );
  const [roleValue, setRoleValue] = useState(searchParams.get("role") ?? "");
  const [locationValue, setLocationValue] = useState(
    searchParams.get("location") ?? ""
  );

  // Sync local state with URL params when they change
  useEffect(() => {
    setCompanyValue(searchParams.get("company") ?? "");
    setRoleValue(searchParams.get("role") ?? "");
    setLocationValue(searchParams.get("location") ?? "");
  }, [searchParams]);

  const createQueryString = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      params.delete("page");

      const query = params.toString();
      return query ? `?${query}` : "";
    },
    [searchParams]
  );

  const updateFilters = useCallback(
    (updates: Record<string, string>) => {
      startTransition(() => {
        router.push(`/salaries${createQueryString(updates)}`);
      });
    },
    [router, createQueryString]
  );

  const handleCompanyChange = useCallback(
    (value: string) => {
      setCompanyValue(value);
    },
    []
  );

  const handleRoleChange = useCallback(
    (value: string) => {
      setRoleValue(value);
    },
    []
  );

  const handleLocationChange = useCallback(
    (value: string) => {
      setLocationValue(value);
    },
    []
  );

  useEffect(() => {
    const currentCompany = searchParams.get("company") ?? "";
    if (companyValue === currentCompany) return;

    const timeoutId = setTimeout(() => {
      updateFilters({ company: companyValue });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [companyValue, searchParams, updateFilters]);

  useEffect(() => {
    const currentRole = searchParams.get("role") ?? "";
    if (roleValue === currentRole) return;

    const timeoutId = setTimeout(() => {
      updateFilters({ role: roleValue });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [roleValue, searchParams, updateFilters]);

  useEffect(() => {
    const currentLocation = searchParams.get("location") ?? "";
    if (locationValue === currentLocation) return;

    const timeoutId = setTimeout(() => {
      updateFilters({ location: locationValue });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [locationValue, searchParams, updateFilters]);

  return (
    <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">Filters</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <Input
          name="company"
          label="Company"
          value={companyValue}
          placeholder="Search company"
          onChange={handleCompanyChange}
        />
        <Input
          name="role"
          label="Role"
          value={roleValue}
          placeholder="e.g. Software Engineer"
          onChange={handleRoleChange}
        />
        <Select
          name="level"
          label="Level"
          value={searchParams.get("level") ?? ""}
          options={levels}
          onChange={(value) => updateFilters({ level: value })}
        />
        <Input
          name="location"
          label="Location"
          value={locationValue}
          placeholder="e.g. Bengaluru"
          onChange={handleLocationChange}
        />
        <Select
          name="currency"
          label="Currency"
          value={searchParams.get("currency") ?? ""}
          options={currencies}
          onChange={(value) => updateFilters({ currency: value })}
        />
        <Select
          name="sort"
          label="Sort By"
          value={searchParams.get("sort") ?? "total_compensation"}
          options={sortOptions}
          onChange={(value) => updateFilters({ sort: value })}
        />
      </div>
    </div>
  );
}
