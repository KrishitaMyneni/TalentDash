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
    <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Related Companies</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {related.map((company) => (
          <Link
            key={company.slug}
            href={`/companies/${company.slug}`}
            className="rounded-full bg-hover-surface px-3 py-1.5 text-sm font-medium text-body-text transition-all hover:bg-[#ff5a5f]/10 hover:text-[#ff5a5f]"
          >
            {company.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
