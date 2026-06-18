interface InputProps {
  name: string;
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export function Input({
  name,
  label,
  value,
  placeholder,
  onChange,
}: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-semibold text-gray-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted-text transition-all shadow-sm hover:border-gray-300 focus:border-[#ff5a5f] focus:outline-none focus:ring-2 focus:ring-[#ff5a5f]/20"
      />
    </div>
  );
}
