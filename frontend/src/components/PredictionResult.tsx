import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowDownCircle, AlertCircle, Loader2, Check } from 'lucide-react';
import type { ConvertedPrice } from '../types';
import { ALL_CURRENCIES } from '../config/currencies';
import type { CurrencyItem } from '../config/currencies';
import { convertCurrency } from '../services/currencyApi';
import { CurrencySearchSelect } from './CurrencySearchSelect';

interface PredictionResultProps {
  basePrice: number;
  onAdjustDetails: () => void;
}

export const PredictionResult: React.FC<PredictionResultProps> = ({
  basePrice,
  onAdjustDetails,
}) => {
  // Default to USD
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [convertedData, setConvertedData] = useState<ConvertedPrice | null>(() => ({
    currency: {
      code: 'USD',
      name: 'US Dollar',
      country: 'United States',
      symbol: '$',
      flag: '🇺🇸',
    },
    amount: basePrice,
    rate: 1.0,
    formatted: `$${Math.round(basePrice).toLocaleString()}`,
  }));
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [conversionError, setConversionError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function handleConvert() {
      if (selectedCurrency === 'USD') {
        setIsConverting(false);
        setConversionError(null);
        setConvertedData({
          currency: {
            code: 'USD',
            name: 'US Dollar',
            country: 'United States',
            symbol: '$',
            flag: '🇺🇸',
          },
          amount: basePrice,
          rate: 1.0,
          formatted: `$${Math.round(basePrice).toLocaleString()}`,
        });
        return;
      }

      setIsConverting(true);
      setConversionError(null);

      try {
        const result = await convertCurrency(basePrice, selectedCurrency);
        if (isMounted) {
          setConvertedData(result);
        }
      } catch (err: any) {
        if (isMounted) {
          console.warn('Currency conversion failed:', err);
          setConversionError('Live exchange rate temporarily unavailable.');
        }
      } finally {
        if (isMounted) {
          setIsConverting(false);
        }
      }
    }

    handleConvert();

    return () => {
      isMounted = false;
    };
  }, [basePrice, selectedCurrency]);

  const handleCopy = () => {
    const textToCopy = convertedData?.formatted || `$${Math.round(basePrice).toLocaleString()}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentCurrencyInfo: CurrencyItem = ALL_CURRENCIES.find((c) => c.code === selectedCurrency) || {
    code: selectedCurrency,
    name: selectedCurrency,
    country: 'Selected Country',
    symbol: selectedCurrency,
    flag: '🌐',
  };

  return (
    <div className="w-full rounded-2xl bg-gradient-to-b from-[#161c28] to-[#10141e] border border-blue-500/20 shadow-2xl shadow-blue-500/5 p-6 sm:p-8 flex flex-col items-center text-center transition-all animate-in fade-in zoom-in-95 duration-300">
      {/* Top pill badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Estimated Market Valuation</span>
      </div>

      <p className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
        Estimated Value
      </p>

      {/* Main Price Display */}
      <div className="my-4 min-h-[4.5rem] flex items-center justify-center">
        {isConverting ? (
          <div className="flex items-center gap-2.5 text-neutral-400">
            <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
            <span className="text-sm font-medium">Converting to {currentCurrencyInfo.country} ({currentCurrencyInfo.code})...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-mono">
              {convertedData?.formatted || `$${Math.round(basePrice).toLocaleString()}`}
            </h2>

            {/* Reference & exchange rate badge */}
            <div className="text-xs sm:text-sm text-neutral-400 font-mono mt-2 flex flex-wrap items-center justify-center gap-2">
              <span>Model baseline: ${Math.round(basePrice).toLocaleString()} USD</span>
              {convertedData && convertedData.currency.code !== 'USD' && (
                <>
                  <span className="text-neutral-500">•</span>
                  <span className="text-blue-400/90 text-xs font-medium">
                    1 USD = {convertedData.rate.toFixed(2)} {convertedData.currency.code} ({currentCurrencyInfo.country})
                  </span>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Supporting text */}
      <p className="text-xs text-neutral-400 max-w-md mb-5 leading-relaxed">
        Based on vehicle specifications, mileage wear, and depreciation patterns from 72,400+ car listings.
      </p>

      {/* Searchable Currency Selector */}
      <div className="w-full max-w-md pt-4 border-t border-white/5 flex flex-col items-center gap-2">
        <div className="w-full flex flex-col gap-1 text-left">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-neutral-400 font-medium">Target Currency / Country:</span>
            <span className="text-[11px] text-blue-400 font-medium">Search by country name</span>
          </div>
          <CurrencySearchSelect
            selectedCode={selectedCurrency}
            onSelect={(code) => setSelectedCurrency(code)}
            disabled={isConverting}
          />
        </div>

        {/* Currency error alert (if any) */}
        {conversionError && (
          <div className="flex items-center gap-1.5 text-[11px] text-amber-400/90 bg-amber-400/10 px-2.5 py-1 rounded-md mt-1 w-full">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{conversionError} Displaying baseline USD value.</span>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-white/5 w-full max-w-sm">
        <button
          type="button"
          onClick={onAdjustDetails}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-semibold bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/10 transition-colors cursor-pointer"
        >
          <ArrowDownCircle className="w-4 h-4 text-neutral-400" />
          Adjust Details
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-semibold bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 transition-colors cursor-pointer"
          title="Copy price to clipboard"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : null}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </div>
  );
};
