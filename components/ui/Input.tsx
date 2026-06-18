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
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-xs font-medium text-gray-600">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-all hover:border-gray-300 focus:border-[#77dd77] focus:outline-none focus:ring-2 focus:ring-[#77dd77]/20"
      />
    </div>
  );
}
