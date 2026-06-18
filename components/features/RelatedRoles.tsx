import Link from "next/link";

interface RelatedRolesProps {
  roles: string[];
}

export function RelatedRoles({ roles }: RelatedRolesProps) {
  const uniqueRoles = Array.from(new Set(roles)).slice(0, 8);

  if (uniqueRoles.length === 0) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900">Related Roles</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {uniqueRoles.map((role) => (
          <Link
            key={role}
            href={`/salaries?role=${encodeURIComponent(role)}`}
            className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            {role}
          </Link>
        ))}
      </div>
    </div>
  );
}
