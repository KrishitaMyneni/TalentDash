interface SelectProps {
  name: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

export function Select({
  name,
  label,
  value,
  options,
  onChange,
}: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-xs font-medium text-gray-600">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 transition-all hover:border-gray-300 focus:border-[#77dd77] focus:outline-none focus:ring-2 focus:ring-[#77dd77]/20"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
