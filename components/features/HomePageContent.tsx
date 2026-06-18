"use client";

import Link from "next/link";
import { SearchBar } from "@/components/features/SearchBar";

interface Company {
  name: string;
  slug: string;
  salaryCount: number;
}

interface HomePageContentProps {
  allCompanies: Company[];
  topCompanies: Company[];
  companyCount: number;
  salaryCount: number;
  avgValue: string;
}

export function HomePageContent({
  allCompanies,
  topCompanies,
  companyCount,
  salaryCount,
  avgValue,
}: HomePageContentProps) {
  return (
    <div className="bg-background">
      {/* Hero Section with Search */}
      <section className="relative overflow-visible px-4 pt-12 pb-4 sm:px-6 sm:pt-16 sm:pb-6 lg:px-8">
        <div className="absolute inset-x-0 top-0 h-[300px] bg-gradient-to-br from-[#ff5a5f]/12 via-white to-white" />
        <div className="absolute left-[8%] top-10 h-44 w-44 rounded-full bg-[#ff5a5f]/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Salary Insights{" "}
            <span className="bg-gradient-to-r from-[#ff5a5f] to-[#e04b50] bg-clip-text text-transparent">
              That Matter
            </span>
          </h1>
          <p className="mt-3 text-base text-body-text sm:text-lg">
            Search across {companyCount}+ companies and {salaryCount}+ salary records
          </p>

          {/* Search Bar - High z-index wrapper */}
          <div className="relative z-[100] mt-6 mx-auto max-w-2xl">
            <SearchBar allCompanies={allCompanies} />
          </div>

          {/* Quick Stats - Closer to search */}
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-text">
            <div>
              <span className="font-bold text-foreground">{salaryCount}+</span>{" "}
              <span className="hidden sm:inline">salary records</span>
              <span className="sm:hidden">records</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div>
              <span className="font-bold text-foreground">{companyCount}+</span>{" "}
              <span className="hidden sm:inline">companies</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div>
              <span className="font-bold text-foreground">{avgValue}</span>{" "}
              <span className="hidden sm:inline">avg TC</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Companies */}
      <section className="px-4 pt-6 pb-12 sm:px-6 sm:pt-8 sm:pb-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-end justify-between sm:mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                Most active employers
              </h2>
              <p className="mt-2 text-sm text-muted-text sm:text-base">
                Browse salary data from top companies
              </p>
            </div>
            <Link
              href="/salaries"
              className="text-sm font-semibold text-[#ff5a5f] transition-colors hover:text-[#e04b50]"
            >
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {topCompanies.map((company) => (
              <Link
                key={company.slug}
                href={`/companies/${company.slug}`}
                className="group rounded-xl border border-border bg-surface p-4 transition-all hover:-translate-y-0.5 hover:border-[#ff5a5f]/40 hover:bg-hover-surface hover:shadow-md sm:rounded-2xl sm:p-5"
              >
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-[#ff5a5f]/10 text-lg font-bold text-[#ff5a5f] transition-colors group-hover:bg-[#ff5a5f]/15 sm:mb-3 sm:h-11 sm:w-11 sm:rounded-xl sm:text-base">
                  {company.name.charAt(0)}
                </div>
                <h3 className="text-sm font-semibold text-foreground transition-colors group-hover:text-[#ff5a5f] sm:text-base">
                  {company.name}
                </h3>
                <p className="mt-1 text-xs text-muted-text">
                  {company.salaryCount} salaries
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-[#ff5a5f]/15 bg-gradient-to-r from-white via-[#fff8f8] to-[#ff5a5f]/8 px-6 py-8 shadow-lg shadow-[#ff5a5f]/5 sm:rounded-[2rem] sm:px-10 sm:py-12">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-2xl font-bold text-foreground sm:text-3xl lg:text-4xl">
                  Turn two offers into a clear decision.
                </h2>
                <p className="mt-2 text-sm text-body-text sm:text-base">
                  See total compensation, base, bonus, stock, and experience in one place.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/compare"
                  className="rounded-lg bg-[#ff5a5f] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#e04b50] sm:rounded-xl sm:px-6 sm:py-3 sm:text-base"
                >
                  Start Comparing
                </Link>
                <Link
                  href="/salaries"
                  className="rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-[#ff5a5f] hover:text-[#ff5a5f] sm:rounded-xl sm:px-6 sm:py-3 sm:text-base"
                >
                  Explore Data
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
