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
          className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-body-text transition-all hover:border-[#ff5a5f] hover:text-[#ff5a5f] hover:shadow-sm"
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
              ? "bg-[#ff5a5f] text-white shadow-md shadow-[#ff5a5f]/30"
              : "text-body-text hover:bg-hover-surface hover:text-[#ff5a5f]"
          }`}
        >
          {p}
        </a>
      ))}

      {page < totalPages && (
        <a
          href={buildHref(page + 1)}
          className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-body-text transition-all hover:border-[#ff5a5f] hover:text-[#ff5a5f] hover:shadow-sm"
        >
          Next
        </a>
      )}
    </nav>
  );
}
