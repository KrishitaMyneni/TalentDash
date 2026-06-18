import Link from "next/link";
import { Company } from "@prisma/client";

interface CompanyHeaderProps {
  company: Company;
  recordCount: number;
}

export function CompanyHeader({ company, recordCount }: CompanyHeaderProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {company.name} Salaries
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {company.industry && <span>{company.industry}</span>}
            {company.headquarters && (
              <span className="ml-2">· {company.headquarters}</span>
            )}
            {company.founded_year && (
              <span className="ml-2">
                · Founded {company.founded_year}
              </span>
            )}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {recordCount} salary record{recordCount !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href={`/salaries?company=${company.slug}`}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            View All Salaries
          </Link>
          <Link
            href="/compare"
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Compare
          </Link>
        </div>
      </div>
    </div>
  );
}
