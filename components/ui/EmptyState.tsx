import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  actions?: { label: string; href: string }[];
}

export function EmptyState({ title, description, actions }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#ff5a5f]/10">
        <svg
          className="h-8 w-8 text-[#ff5a5f]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-gray-600">{description}</p>
      {actions && actions.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="rounded-lg bg-[#ff5a5f] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#e04b50] hover:shadow-md"
            >
              {action.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
