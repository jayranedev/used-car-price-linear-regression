import React from 'react';
import { Car, Activity } from 'lucide-react';

interface HeaderProps {
  isBackendHealthy: boolean | null;
}

export const Header: React.FC<HeaderProps> = ({ isBackendHealthy }) => {
  return (
    <header className="w-full border-b border-white/5 bg-[#0c0e12]/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-sm shadow-blue-500/10">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold tracking-tight text-white text-base">CarValue</span>
              <span className="text-[10px] uppercase font-medium tracking-wider px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                ML Estimator
              </span>
            </div>
            <p className="text-xs text-neutral-400 hidden sm:block">
              US Used Car Valuation Engine
            </p>
          </div>
        </div>

        {/* Backend health status badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/[0.03] border border-white/5 text-neutral-300">
            <Activity className="w-3.5 h-3.5 text-neutral-400" />
            <span
              className={`w-2 h-2 rounded-full ${
                isBackendHealthy === true
                  ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                  : isBackendHealthy === false
                  ? 'bg-rose-500 shadow-sm shadow-rose-500/50'
                  : 'bg-amber-400 animate-pulse'
              }`}
            />
            <span className="text-[11px] text-neutral-400">
              {isBackendHealthy === true
                ? 'Backend Ready'
                : isBackendHealthy === false
                ? 'Backend Offline'
                : 'Connecting...'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
