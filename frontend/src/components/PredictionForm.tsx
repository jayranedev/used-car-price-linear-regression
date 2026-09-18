import React from 'react';
import {
  Car,
  Fuel,
  Settings,
  Calendar,
  Gauge,
  ReceiptText,
  Zap,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import type { PredictionRequest } from '../types';
import {
  FIELD_CONFIG,
  MAKE_OPTIONS,
  FUEL_TYPE_OPTIONS,
  TRANSMISSION_OPTIONS,
  SAMPLE_PRESETS,
} from '../config/carOptions';
import { SelectField } from './SelectField';
import { SliderField } from './SliderField';

interface PredictionFormProps {
  formData: PredictionRequest;
  onChange: (field: keyof PredictionRequest, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
  onSelectPreset: (preset: PredictionRequest) => void;
  isLoading: boolean;
}

export const PredictionForm: React.FC<PredictionFormProps> = ({
  formData,
  onChange,
  onSubmit,
  onReset,
  onSelectPreset,
  isLoading,
}) => {
  return (
    <form onSubmit={onSubmit} className="w-full flex flex-col gap-6">
      {/* Presets Bar */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Quick Example Configurations
          </span>
          <button
            type="button"
            onClick={onReset}
            disabled={isLoading}
            className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-3 h-3" />
            Reset to default
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_PRESETS.map((preset) => (
            <button
              key={preset.name}
              type="button"
              disabled={isLoading}
              onClick={() => onSelectPreset(preset.data)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.03] hover:bg-blue-500/10 border border-white/5 hover:border-blue-500/30 text-neutral-300 hover:text-blue-300 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <span>{preset.name}</span>
              <span className="text-[10px] text-neutral-400 bg-white/5 px-1.5 py-0.2 rounded">
                {preset.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Section 1: Categorical Attributes (Dropdowns) */}
      <div className="p-5 rounded-2xl bg-[#10141d] border border-white/5 shadow-lg shadow-black/20 flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
          <div className="w-6 h-6 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Car className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Vehicle Specifications</h3>
            <p className="text-[11px] text-neutral-400">Select manufacturer brand and drivetrain mechanisms</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SelectField
            id="car-make"
            label="Manufacturer (Make)"
            value={formData.make}
            options={MAKE_OPTIONS}
            icon={<Car className="w-3.5 h-3.5" />}
            onChange={(val) => onChange('make', val)}
            disabled={isLoading}
          />
          <SelectField
            id="car-fuel"
            label="Fuel Type"
            value={formData.fuelType}
            options={FUEL_TYPE_OPTIONS}
            icon={<Fuel className="w-3.5 h-3.5" />}
            onChange={(val) => onChange('fuelType', val)}
            disabled={isLoading}
          />
          <SelectField
            id="car-transmission"
            label="Transmission"
            value={formData.transmission}
            options={TRANSMISSION_OPTIONS}
            icon={<Settings className="w-3.5 h-3.5" />}
            onChange={(val) => onChange('transmission', val)}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Section 2: Numerical Metrics (Interactive Sliders) */}
      <div className="p-5 rounded-2xl bg-[#10141d] border border-white/5 shadow-lg shadow-black/20 flex flex-col gap-4">
        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
          <div className="w-6 h-6 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Gauge className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Condition & Engine Metrics</h3>
            <p className="text-[11px] text-neutral-400">Adjust the sliders to reflect the car's current status</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SliderField
            config={FIELD_CONFIG.year}
            value={formData.year}
            icon={<Calendar className="w-3.5 h-3.5 text-neutral-400" />}
            onChange={(val) => onChange('year', val)}
            disabled={isLoading}
          />
          <SliderField
            config={FIELD_CONFIG.mileage}
            value={formData.mileage}
            icon={<Gauge className="w-3.5 h-3.5 text-neutral-400" />}
            onChange={(val) => onChange('mileage', val)}
            disabled={isLoading}
          />
          <SliderField
            config={FIELD_CONFIG.engine_size}
            value={formData.engine_size}
            icon={<Zap className="w-3.5 h-3.5 text-neutral-400" />}
            onChange={(val) => onChange('engine_size', val)}
            disabled={isLoading}
          />
          <SliderField
            config={FIELD_CONFIG.mpg}
            value={formData.mpg}
            icon={<Fuel className="w-3.5 h-3.5 text-neutral-400" />}
            onChange={(val) => onChange('mpg', val)}
            disabled={isLoading}
          />
        </div>

        {/* Tax Slider spans full width on wide screen */}
        <div className="mt-1">
          <SliderField
            config={FIELD_CONFIG.tax}
            value={formData.tax}
            icon={<ReceiptText className="w-3.5 h-3.5 text-neutral-400" />}
            onChange={(val) => onChange('tax', val)}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Main Submit Button CTA */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 px-6 rounded-xl font-semibold text-base text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/25 hover:shadow-blue-500/35 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Estimating Price...</span>
          </>
        ) : (
          <>
            <span>Estimate Price</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </form>
  );
};
