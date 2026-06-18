"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Company {
  name: string;
  slug: string;
  salaryCount: number;
}

export function SearchBar({ allCompanies }: { allCompanies: Company[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<Company[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce input
  const handleChange = useCallback((value: string) => {
    setQuery(value);
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedQuery(value);
    }, 250);
  }, []);

  // Filter companies based on debounced query
  useEffect(() => {
    if (debouncedQuery.trim().length > 0) {
      const matches = allCompanies.filter((c) =>
        c.name.toLowerCase().includes(debouncedQuery.toLowerCase())
      ).slice(0, 8);
      setFiltered(matches);
      setIsOpen(true);
    } else {
      setFiltered([]);
      setIsOpen(false);
    }
  }, [debouncedQuery, allCompanies]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const selectCompany = (company: Company) => {
    router.push(`/companies/${company.slug}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query && filtered.length > 0) {
      selectCompany(filtered[0]);
    } else if (query) {
      router.push(`/salaries?company=${encodeURIComponent(query)}`);
    }
  };

  const highlightMatch = (name: string, query: string) => {
    if (!query) return name;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = name.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="font-semibold text-[#ff5a5f]">
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  };

  return (
    <div ref={wrapperRef} className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Search companies (e.g., Google, Amazon, Microsoft)"
          className="w-full rounded-xl border border-border bg-surface px-6 py-4 pr-24 text-base text-foreground placeholder:text-muted-text shadow-lg transition-all hover:border-[#ff5a5f]/40 focus:border-[#ff5a5f] focus:outline-none focus:ring-2 focus:ring-[#ff5a5f]/20"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-[#ff5a5f] px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#e04b50]"
        >
          Search
        </button>
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div 
          className="absolute left-0 right-0 z-[9999] mt-2 rounded-lg border border-border bg-surface shadow-lg"
          style={{ maxHeight: "300px" }}
        >
          <ul className="overflow-y-auto" style={{ maxHeight: "300px" }}>
            {filtered.length > 0 ? (
              filtered.map((company) => (
                <li key={company.slug}>
                  <button
                    onClick={() => selectCompany(company)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-hover-surface"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#ff5a5f]/10 text-base font-bold text-[#ff5a5f]">
                      {company.name.charAt(0)}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="text-sm font-medium text-foreground">
                        {highlightMatch(company.name, debouncedQuery)}
                      </span>
                      <span className="text-xs text-muted-text">
                        {company.salaryCount} salary record{company.salaryCount !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </button>
                </li>
              ))
            ) : (
              <li className="px-4 py-8 text-center">
                <p className="text-sm font-medium text-foreground">
                  No companies found
                </p>
                <p className="mt-1 text-xs text-muted-text">
                  Try another search term
                </p>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
