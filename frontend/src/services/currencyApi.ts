import type { ConvertedPrice } from '../types';
import { ALL_CURRENCIES } from '../config/currencies';
import type { CurrencyItem } from '../config/currencies';

const API_KEY = import.meta.env.VITE_EXCHANGE_RATE_API_KEY || 'd08b9420960951a218c416a1';
const LATEST_USD_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

interface CachedRates {
  rates: Record<string, number>;
  timestamp: number;
}

let memoryRates: CachedRates | null = null;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Fetches all world exchange rates based in USD.
 * Caches in memory and sessionStorage.
 */
export async function getAllRates(): Promise<Record<string, number>> {
  const now = Date.now();

  // 1. In-memory check
  if (memoryRates && (now - memoryRates.timestamp) < CACHE_TTL_MS) {
    return memoryRates.rates;
  }

  // 2. Session storage check
  try {
    const stored = sessionStorage.getItem('car_all_rates_cache');
    if (stored) {
      const parsed: CachedRates = JSON.parse(stored);
      if (parsed && (now - parsed.timestamp) < CACHE_TTL_MS) {
        memoryRates = parsed;
        return parsed.rates;
      }
    }
  } catch {
    // sessionStorage not available
  }

  // 3. Network fetch
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(LATEST_USD_URL, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`ExchangeRate API returned HTTP ${response.status}`);
    }

    const data = await response.json();

    if (data.result !== 'success' || !data.conversion_rates) {
      throw new Error('Invalid rate data format from ExchangeRate API');
    }

    memoryRates = {
      rates: data.conversion_rates,
      timestamp: now,
    };

    try {
      sessionStorage.setItem('car_all_rates_cache', JSON.stringify(memoryRates));
    } catch {
      // ignore quota
    }

    return memoryRates.rates;
  } catch (err) {
    console.warn('Failed to fetch latest exchange rates:', err);
    if (memoryRates) {
      return memoryRates.rates;
    }
    throw err;
  }
}

/**
 * Formats amount localized to country/currency conventions.
 */
export function formatCurrencyAmount(amount: number, currency: CurrencyItem): string {
  try {
    const rounded = Math.round(amount);

    if (currency.code === 'INR') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(rounded);
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.code,
      maximumFractionDigits: 0,
    }).format(rounded);
  } catch {
    return `${currency.symbol} ${Math.round(amount).toLocaleString()}`;
  }
}

/**
 * Converts a base model prediction (USD) into the specified target currency.
 */
export async function convertCurrency(
  baseAmount: number,
  targetCode = 'INR'
): Promise<ConvertedPrice> {
  const currency: CurrencyItem = ALL_CURRENCIES.find((c) => c.code === targetCode) || {
    code: targetCode,
    name: targetCode,
    country: 'International',
    symbol: targetCode,
    flag: '🌐',
  };

  // If target is USD itself
  if (targetCode === 'USD') {
    return {
      currency,
      amount: baseAmount,
      rate: 1.0,
      formatted: formatCurrencyAmount(baseAmount, currency),
    };
  }

  // Fetch all rates
  const rates = await getAllRates();
  const rate = rates[targetCode];

  if (typeof rate !== 'number' || isNaN(rate)) {
    throw new Error(`Rate for ${targetCode} not available`);
  }

  const convertedAmount = baseAmount * rate;

  return {
    currency,
    amount: convertedAmount,
    rate,
    formatted: formatCurrencyAmount(convertedAmount, currency),
  };
}
