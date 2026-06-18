interface PaginationProps {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}

export function Pagination({ page, totalPages, buildHref }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    if (totalPages <= 5) return i + 1;
    if (page <= 3) return i + 1;
    if (page >= totalPages - 2) return totalPages - 4 + i;
    return page - 2 + i;
  });

  return (
    <nav className="flex items-center justify-center gap-2">
      {page > 1 && (
        <a
          href={buildHref(page - 1)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:border-[#77dd77] hover:text-[#77dd77]"
        >
          Previous
        </a>
      )}

      {pages.map((p) => (
        <a
          key={p}
          href={buildHref(p)}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
            p === page
              ? "bg-[#77dd77] text-white shadow-sm"
              : "text-gray-700 hover:bg-gray-50 hover:text-[#77dd77]"
          }`}
        >
          {p}
        </a>
      ))}

      {page < totalPages && (
        <a
          href={buildHref(page + 1)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:border-[#77dd77] hover:text-[#77dd77]"
        >
          Next
        </a>
      )}
    </nav>
  );
}
