import type { CurrencyInfo, OptionItem, PredictionRequest } from '../types';

export const MAKE_OPTIONS: OptionItem[] = [
  { value: 'audi', label: 'Audi' },
  { value: 'BMW', label: 'BMW' },
  { value: 'Ford', label: 'Ford' },
  { value: 'Hyundai', label: 'Hyundai' },
  { value: 'skoda', label: 'Skoda' },
  { value: 'toyota', label: 'Toyota' },
  { value: 'vw', label: 'Volkswagen (VW)' },
];

export const FUEL_TYPE_OPTIONS: OptionItem[] = [
  { value: 'Petrol', label: 'Petrol' },
  { value: 'Diesel', label: 'Diesel' },
  { value: 'Hybrid', label: 'Hybrid' },
  { value: 'Electric', label: 'Electric' },
  { value: 'Other', label: 'Other' },
];

export const TRANSMISSION_OPTIONS: OptionItem[] = [
  { value: 'Manual', label: 'Manual' },
  { value: 'Automatic', label: 'Automatic' },
  { value: 'Semi-Auto', label: 'Semi-Auto' },
  { value: 'Other', label: 'Other' },
];

export interface SliderConfig {
  key: keyof PredictionRequest;
  label: string;
  description: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
  format: (val: number) => string;
}

export const FIELD_CONFIG: Record<string, SliderConfig> = {
  year: {
    key: 'year',
    label: 'Registration Year',
    description: 'Year vehicle was first registered',
    min: 1996,
    max: 2024,
    step: 1,
    defaultValue: 2019,
    unit: '',
    format: (val: number) => `${val}`,
  },
  mileage: {
    key: 'mileage',
    label: 'Odometer Mileage',
    description: 'Total distance accumulated on vehicle',
    min: 0,
    max: 150000,
    step: 1000,
    defaultValue: 45000,
    unit: 'miles',
    format: (val: number) => `${val.toLocaleString()} mi`,
  },
  tax: {
    key: 'tax',
    label: 'Annual Vehicle Tax / Fees',
    description: 'Estimated annual vehicle tax and registration fee',
    min: 0,
    max: 580,
    step: 5,
    defaultValue: 150,
    unit: '$',
    format: (val: number) => `$${val}`,
  },
  mpg: {
    key: 'mpg',
    label: 'Fuel Economy (MPG)',
    description: 'Manufacturer fuel efficiency rating',
    min: 10,
    max: 100,
    step: 0.5,
    defaultValue: 55,
    unit: 'mpg',
    format: (val: number) => `${val.toFixed(1)} mpg`,
  },
  engine_size: {
    key: 'engine_size',
    label: 'Engine Displacement',
    description: 'Engine cubic capacity in liters',
    min: 0.6,
    max: 6.0,
    step: 0.1,
    defaultValue: 2.0,
    unit: 'L',
    format: (val: number) => `${val.toFixed(1)} L`,
  },
};

export const DEFAULT_FORM_VALUES: PredictionRequest = {
  make: 'BMW',
  fuelType: 'Diesel',
  transmission: 'Automatic',
  year: 2019,
  mileage: 45000,
  tax: 150,
  mpg: 55,
  engine_size: 2.0,
};

export interface CarPreset {
  name: string;
  badge: string;
  data: PredictionRequest;
}

export const SAMPLE_PRESETS: CarPreset[] = [
  {
    name: 'BMW 3-Series Sedan',
    badge: 'Popular',
    data: {
      make: 'BMW',
      fuelType: 'Diesel',
      transmission: 'Automatic',
      year: 2019,
      mileage: 45000,
      tax: 150,
      mpg: 55,
      engine_size: 2.0,
    },
  },
  {
    name: 'Audi A3 Sport Premium',
    badge: 'Luxury Compact',
    data: {
      make: 'audi',
      fuelType: 'Petrol',
      transmission: 'Manual',
      year: 2018,
      mileage: 32000,
      tax: 145,
      mpg: 51.4,
      engine_size: 1.4,
    },
  },
  {
    name: 'Ford Focus EcoBoost',
    badge: 'Commuter',
    data: {
      make: 'Ford',
      fuelType: 'Petrol',
      transmission: 'Manual',
      year: 2017,
      mileage: 48000,
      tax: 140,
      mpg: 58.9,
      engine_size: 1.0,
    },
  },
  {
    name: 'Toyota Corolla Hybrid',
    badge: 'Eco Hybrid',
    data: {
      make: 'toyota',
      fuelType: 'Hybrid',
      transmission: 'Automatic',
      year: 2020,
      mileage: 26000,
      tax: 140,
      mpg: 65.0,
      engine_size: 1.8,
    },
  },
];

export const SUPPORTED_CURRENCIES: CurrencyInfo[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'AED ' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
];
