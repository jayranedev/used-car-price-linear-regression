import React from 'react';
import type { SliderConfig } from '../config/carOptions';

interface SliderFieldProps {
  config: SliderConfig;
  value: number;
  icon?: React.ReactNode;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export const SliderField: React.FC<SliderFieldProps> = ({
  config,
  value,
  icon,
  onChange,
  disabled = false,
}) => {
  const { min, max, step, label, format, key } = config;

  // Percentage for the gradient track fill
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  const handleStep = (delta: number) => {
    if (disabled) return;
    const nextVal = Math.min(max, Math.max(min, Number((value + delta).toFixed(2))));
    onChange(nextVal);
  };

  return (
    <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
      {/* Top row: Label & Current Value */}
      <div className="flex items-center justify-between">
        <label htmlFor={`slider-${key}`} className="text-xs font-medium uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
          {icon && <span className="text-neutral-400">{icon}</span>}
          {label}
        </label>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleStep(-step)}
            disabled={disabled || value <= min}
            className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold text-neutral-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            aria-label={`Decrease ${label}`}
          >
            -
          </button>
          <span className="text-sm font-semibold text-blue-400 font-mono tracking-tight bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md min-w-16 text-center">
            {format(value)}
          </span>
          <button
            type="button"
            onClick={() => handleStep(step)}
            disabled={disabled || value >= max}
            className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold text-neutral-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            aria-label={`Increase ${label}`}
          >
            +
          </button>
        </div>
      </div>

      {/* Slider Track with fill */}
      <div className="relative py-1">
        <input
          id={`slider-${key}`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #232733 ${percentage}%, #232733 100%)`,
          }}
          className="w-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-label={label}
        />
      </div>

      {/* Bottom Range Indicators */}
      <div className="flex justify-between items-center text-[10px] text-neutral-400 font-mono">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
};
