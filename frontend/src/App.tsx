import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { PredictionForm } from './components/PredictionForm';
import { PredictionResult } from './components/PredictionResult';
import { ErrorMessage } from './components/ErrorMessage';
import type { PredictionRequest } from './types';
import { DEFAULT_FORM_VALUES } from './config/carOptions';
import { predictCarPrice, checkBackendHealth } from './services/predictionApi';
import { Sparkles, Database, ShieldCheck, Cpu } from 'lucide-react';

export const App: React.FC = () => {
  const [formData, setFormData] = useState<PredictionRequest>(DEFAULT_FORM_VALUES);
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean | null>(null);

  const resultRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Initial health check
  useEffect(() => {
    let isMounted = true;
    checkBackendHealth().then((healthy) => {
      if (isMounted) {
        setIsBackendHealthy(healthy);
      }
    });

    // Recheck health periodically every 30 seconds
    const interval = setInterval(() => {
      checkBackendHealth().then((healthy) => {
        if (isMounted) setIsBackendHealthy(healthy);
      });
    }, 30000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleFieldChange = (field: keyof PredictionRequest, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleReset = () => {
    setFormData(DEFAULT_FORM_VALUES);
    setErrorMessage(null);
  };

  const handleSelectPreset = (presetData: PredictionRequest) => {
    setFormData(presetData);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await predictCarPrice(formData);
      setPredictedPrice(response.predicted_price);
      setIsBackendHealthy(true);

      // Smooth scroll to result
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during prediction.');
      setIsBackendHealthy(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdjustDetails = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-neutral-100 flex flex-col antialiased selection:bg-blue-500/30 selection:text-blue-200">
      {/* Header */}
      <Header isBackendHealthy={isBackendHealthy} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-10">
        {/* Hero Section */}
        <section className="text-center flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/[0.03] border border-white/10 text-neutral-300 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>FastAPI + scikit-learn Regression</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-2xl leading-[1.15]">
            What’s your car worth?
          </h1>

          <p className="text-sm sm:text-base text-neutral-400 max-w-xl leading-relaxed">
            Enter a few details about your car and get an estimated market price based on historical US market data.
          </p>
        </section>

        {/* Dynamic Prediction Result (Shows prominently when available) */}
        {predictedPrice !== null && (
          <section ref={resultRef} className="w-full">
            <PredictionResult
              basePrice={predictedPrice}
              onAdjustDetails={handleAdjustDetails}
            />
          </section>
        )}

        {/* Error Notice (if any) */}
        {errorMessage && (
          <ErrorMessage
            message={errorMessage}
            onRetry={() => {
              const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
              handleSubmit(fakeEvent);
            }}
          />
        )}

        {/* Prediction Form Section */}
        <section ref={formRef} className="w-full">
          <PredictionForm
            formData={formData}
            onChange={handleFieldChange}
            onSubmit={handleSubmit}
            onReset={handleReset}
            onSelectPreset={handleSelectPreset}
            isLoading={isLoading}
          />
        </section>

        {/* Technical Credibility Badges / Feature Highlights */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/5">
          <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 flex items-start gap-3">
            <Database className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold text-white">72,435 Market Records</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                Trained on listings spanning Audi, BMW, Ford, Hyundai, Skoda, Toyota, and VW.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 flex items-start gap-3">
            <Cpu className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold text-white">Leak-Free Pipeline</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                StandardScaler and OneHotEncoder fitted strictly on training data with drop='first'.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold text-white">Real-Time Currency API</h4>
              <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                Instantly converts predicted GBP values to INR, USD, EUR, and more using live exchange rates.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-6 mt-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center text-xs text-neutral-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            US Used Car Price Predictor &bull; Machine Learning from Scratch Project
          </p>
          <p className="text-[11px] text-neutral-400">
            Valuations are statistical regression estimates, not contractual purchase offers.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
