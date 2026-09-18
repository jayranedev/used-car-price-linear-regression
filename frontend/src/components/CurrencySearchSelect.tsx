import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Check, X, Globe } from 'lucide-react';
import { ALL_CURRENCIES } from '../config/currencies';
import type { CurrencyItem } from '../config/currencies';

interface CurrencySearchSelectProps {
  selectedCode: string;
  onSelect: (code: string) => void;
  disabled?: boolean;
}

export const CurrencySearchSelect: React.FC<CurrencySearchSelectProps> = ({
  selectedCode,
  onSelect,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedCurrency = useMemo(
    () => ALL_CURRENCIES.find((c) => c.code === selectedCode) || ALL_CURRENCIES[0],
    [selectedCode]
  );

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Filter currencies based on search query (matches country, name, or code)
  const filteredCurrencies = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return ALL_CURRENCIES;

    return ALL_CURRENCIES.filter((c) => {
      return (
        c.country.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  const handleSelect = (code: string) => {
    onSelect(code);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-[#151924] hover:bg-[#1a202e] border border-white/10 hover:border-blue-500/30 text-white text-xs font-medium transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 overflow-hidden text-left">
          <span className="text-base leading-none">{selectedCurrency.flag}</span>
          <span className="font-bold text-white font-mono">{selectedCurrency.code}</span>
          <span className="text-neutral-400 truncate">
            {selectedCurrency.country} ({selectedCurrency.symbol.trim()})
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180 text-blue-400' : ''}`} />
      </button>

      {/* Searchable Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 bottom-full mb-2 w-full sm:w-84 max-w-[calc(100vw-2rem)] rounded-2xl bg-[#121620] border border-blue-500/20 shadow-2xl shadow-black/80 z-50 p-2 flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-150">
          {/* Search Header */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search country or currency..."
              className="w-full pl-8 pr-7 py-2 rounded-lg bg-[#181d2b] text-white placeholder-neutral-500 text-xs border border-white/10 focus:border-blue-500 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Popular Picks (shown when not searching) */}
          {!searchQuery && (
            <div className="flex flex-wrap gap-1 px-1 pt-1 pb-1.5 border-b border-white/5">
              {['INR', 'USD', 'EUR', 'GBP', 'AED', 'CAD'].map((code) => {
                const c = ALL_CURRENCIES.find((item) => item.code === code);
                if (!c) return null;
                const isSelected = c.code === selectedCode;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => handleSelect(code)}
                    className={`px-2 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/5 hover:bg-white/10 text-neutral-300'
                    }`}
                  >
                    <span>{c.flag}</span>
                    <span>{c.code}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Currencies Scroll List */}
          <div className="max-h-56 overflow-y-auto overflow-x-hidden flex flex-col gap-0.5 pr-0.5 text-xs scrollbar-thin">
            {filteredCurrencies.length === 0 ? (
              <div className="py-6 text-center text-neutral-500 text-xs flex flex-col items-center gap-1">
                <Globe className="w-4 h-4 text-neutral-600" />
                <span>No matching countries found</span>
              </div>
            ) : (
              filteredCurrencies.map((c: CurrencyItem) => {
                const isSelected = c.code === selectedCode;
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => handleSelect(c.code)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                      isSelected
                        ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                        : 'hover:bg-white/[0.04] text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className="text-sm shrink-0">{c.flag}</span>
                      <div className="flex flex-col truncate">
                        <span className="font-semibold text-white leading-snug">
                          {c.country}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono truncate">
                          {c.code} • {c.name}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <span className="text-[11px] font-mono text-neutral-400 font-semibold">
                        {c.symbol}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
