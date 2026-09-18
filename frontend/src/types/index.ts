export interface PredictionRequest {
  make: string;
  fuelType: string;
  transmission: string;
  year: number;
  mileage: number;
  tax: number;
  mpg: number;
  engine_size: number;
}

export interface PredictionResponse {
  predicted_price: number;
}

export interface CurrencyInfo {
  code: string;
  name: string;
  country?: string;
  symbol: string;
  flag?: string;
}

export interface ExchangeRates {
  [currencyCode: string]: number;
}

export interface ConvertedPrice {
  currency: CurrencyInfo;
  amount: number;
  rate: number;
  formatted: string;
}

export interface OptionItem {
  value: string;
  label: string;
}
