import React, { useEffect, useState } from 'react';
import { Brain, RefreshCw, AlertCircle } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface AnalyzingScreenProps {
  lang: Language;
  goalTitle: string;
  onRetry?: () => void;
  error?: string | null;
}

export const AnalyzingScreen: React.FC<AnalyzingScreenProps> = ({
  lang,
  goalTitle,
  onRetry,
  error,
}) => {
  const t = translations[lang];
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [progressPercent, setProgressPercent] = useState(15);

  const steps = [
    t.analyzing.step1,
    t.analyzing.step2,
    t.analyzing.step3,
    t.analyzing.step4,
  ];

  useEffect(() => {
    if (error) return;

    const interval = setInterval(() => {
      setActiveStepIdx((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
      setProgressPercent((prev) => Math.min(95, prev + 22));
    }, 450);

    return () => clearInterval(interval);
  }, [error, steps.length]);

  return (
    <div className="max-w-md mx-auto py-12 px-4 text-center space-y-6 animate-in fade-in duration-300">
      {/* Central Glowing Radar / Brain Icon */}
      <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
        {/* Pulsing ring waves */}
        <div className="absolute inset-0 rounded-full bg-teal-400/20 animate-ping opacity-75" />
        <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-teal-500/20 to-emerald-400/20 animate-pulse" />
        
        {/* Core circle */}
        <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center shadow-lg shadow-teal-500/30">
          <Brain className="w-11 h-11 animate-bounce" />
        </div>
      </div>

      {/* Title */}
      <div className="space-y-1.5">
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          {t.analyzing.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600">
          {lang === 'et' ? `Eesmärk: "${goalTitle}"` : `Target: "${goalTitle}"`}
        </p>
      </div>

      {/* Error state if failed */}
      {error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-left space-y-3">
          <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{lang === 'et' ? 'Analüüs ebaõnnestus' : 'Analysis encountered an error'}</span>
          </div>
          <p className="text-xs text-red-600">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{lang === 'et' ? 'Proovi uuesti' : 'Retry analysis'}</span>
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              {progressPercent}%
            </div>
          </div>

          {/* Stepper text messages */}
          <div className="space-y-2 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs text-left">
            {steps.map((text, idx) => {
              const isDone = idx < activeStepIdx;
              const isCurrent = idx === activeStepIdx;

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-2.5 text-xs transition-all duration-300 ${
                    isCurrent
                      ? 'text-teal-900 font-bold scale-[1.02]'
                      : isDone
                        ? 'text-emerald-700 line-through opacity-70'
                        : 'text-slate-400 opacity-50'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                      isDone
                        ? 'bg-emerald-500 text-white'
                        : isCurrent
                          ? 'bg-teal-600 text-white ring-2 ring-teal-200 animate-pulse'
                          : 'border border-slate-300 text-slate-400'
                    }`}
                  >
                    {isDone ? '✓' : idx + 1}
                  </div>
                  <span>{text}</span>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-slate-600 italic">
            "{t.analyzing.encouragement}"
          </p>
        </>
      )}
    </div>
  );
};
