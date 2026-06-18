interface TableProps {
  children: React.ReactNode;
}

export function Table({ children }: TableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <table className="w-full text-left text-sm">{children}</table>
    </div>
  );
}

export function TableHead({ children }: TableProps) {
  return (
    <thead className="border-b border-gray-100 bg-gray-50/50 text-xs uppercase text-gray-600">
      <tr>{children}</tr>
    </thead>
  );
}

export function TableBody({ children }: TableProps) {
  return <tbody className="divide-y divide-gray-100">{children}</tbody>;
}

export function TableHeader({ children }: TableProps) {
  return <th className="px-4 py-3 font-semibold">{children}</th>;
}

export function TableRow({ children }: TableProps) {
  return (
    <tr className="transition-colors hover:bg-gray-50/50">{children}</tr>
  );
}

export function TableCell({ children, className }: TableProps & { className?: string }) {
  return <td className={`px-4 py-3.5 ${className || ''}`}>{children}</td>;
}
