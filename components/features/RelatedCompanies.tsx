import Link from "next/link";

interface RelatedCompaniesProps {
  currentSlug: string;
  companies: { name: string; slug: string }[];
}

export function RelatedCompanies({
  currentSlug,
  companies,
}: RelatedCompaniesProps) {
  const related = companies.filter((c) => c.slug !== currentSlug).slice(0, 6);

  if (related.length === 0) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900">Related Companies</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {related.map((company) => (
          <Link
            key={company.slug}
            href={`/companies/${company.slug}`}
            className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            {company.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
