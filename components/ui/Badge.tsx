interface BadgeProps {
  level: string;
}

const levelColors: Record<string, string> = {
  L3: "bg-blue-50 text-blue-700 ring-blue-600/20",
  L4: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  L5: "bg-purple-50 text-purple-700 ring-purple-600/20",
  L6: "bg-amber-50 text-amber-700 ring-amber-600/20",
  STAFF: "bg-rose-50 text-rose-700 ring-rose-600/20",
  PRINCIPAL: "bg-orange-50 text-orange-700 ring-orange-600/20",
  SDE_I: "bg-blue-50 text-blue-700 ring-blue-600/20",
  SDE_II: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  SDE_III: "bg-purple-50 text-purple-700 ring-purple-600/20",
  IC4: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  IC5: "bg-purple-50 text-purple-700 ring-purple-600/20",
};

export function Badge({ level }: BadgeProps) {
  const colorClass = levelColors[level] || "bg-gray-50 text-gray-700 ring-gray-600/20";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${colorClass}`}
    >
      {level.replace("_", "-")}
    </span>
  );
}
