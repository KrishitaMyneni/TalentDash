import Link from "next/link";
import { Company } from "@prisma/client";

interface CompanyHeaderProps {
  company: Company;
  recordCount: number;
}

export function CompanyHeader({ company, recordCount }: CompanyHeaderProps) {
  return (
    <div className="rounded-xl border border-border bg-gradient-to-br from-white to-[#fff8f8] p-8 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            {company.name}
          </h1>
          <p className="mt-2 text-sm text-body-text">
            {company.industry && (
              <span className="font-medium">{company.industry}</span>
            )}
            {company.headquarters && (
              <span className="ml-2 text-muted-text">- {company.headquarters}</span>
            )}
            {company.founded_year && (
              <span className="ml-2 text-muted-text">
                - Founded {company.founded_year}
              </span>
            )}
          </p>
          <p className="mt-3 text-sm font-semibold text-[#ff5a5f]">
            {recordCount} salary record{recordCount !== 1 ? "s" : ""} available
          </p>
        </div>
        <div className="flex flex-wrap gap-3 sm:flex-nowrap">
          <Link
            href={`/salaries?company=${company.slug}`}
            className="rounded-lg bg-[#ff5a5f] px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#ff5a5f]/30 transition-all hover:bg-[#e04b50] hover:shadow-lg hover:shadow-[#ff5a5f]/40"
          >
            View All Salaries
          </Link>
          <Link
            href="/compare"
            className="rounded-lg border-2 border-border bg-surface px-6 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-[#ff5a5f] hover:text-[#ff5a5f] hover:shadow-md"
          >
            Compare
          </Link>
        </div>
      </div>
    </div>
  );
}
