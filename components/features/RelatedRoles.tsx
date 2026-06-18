import Link from "next/link";

interface RelatedRolesProps {
  roles: string[];
}

export function RelatedRoles({ roles }: RelatedRolesProps) {
  const uniqueRoles = Array.from(new Set(roles)).slice(0, 8);

  if (uniqueRoles.length === 0) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Related Roles</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {uniqueRoles.map((role) => (
          <Link
            key={role}
            href={`/salaries?role=${encodeURIComponent(role)}`}
            className="rounded-full bg-hover-surface px-3 py-1.5 text-sm font-medium text-body-text transition-all hover:bg-[#ff5a5f]/10 hover:text-[#ff5a5f]"
          >
            {role}
          </Link>
        ))}
      </div>
    </div>
  );
}
