import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { OptionItem } from '../types';

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  options: OptionItem[];
  icon?: React.ReactNode;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  id,
  label,
  value,
  options,
  icon,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
        {icon && <span className="text-neutral-400">{icon}</span>}
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full appearance-none bg-[#141822] text-neutral-100 text-sm font-medium rounded-xl border border-white/10 px-3.5 py-2.5 pr-9 hover:border-white/20 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#141822] text-neutral-100">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
