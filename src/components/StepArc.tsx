import React from 'react';
import { FOUR_STEPS_PROMISE } from '../config';
import { Language } from '../types';
import { Check, Sparkles, Target, Lightbulb, Compass } from 'lucide-react';

interface StepArcProps {
  currentStep: number; // 1, 2, 3, 4
  lang: Language;
  onStepClick?: (step: number) => void;
}

export const StepArc: React.FC<StepArcProps> = ({ currentStep, lang, onStepClick }) => {
  const getIcon = (iconName: string, active: boolean) => {
    const props = { className: `w-4 h-4 ${active ? 'text-teal-700' : 'text-slate-400'}` };
    switch (iconName) {
      case 'sparkles': return <Sparkles {...props} />;
      case 'target': return <Target {...props} />;
      case 'lightbulb': return <Lightbulb {...props} />;
      case 'compass': return <Compass {...props} />;
      default: return <Sparkles {...props} />;
    }
  };

  return (
    <div className="w-full bg-white/90 backdrop-blur-sm border-b border-teal-100/80 px-4 py-3 sticky top-0 z-20 shadow-xs">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between relative">
          {/* Connecting line */}
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0">
            <div 
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, ((currentStep - 1) / 3) * 100))}%` }}
            />
          </div>

          {FOUR_STEPS_PROMISE.map((item) => {
            const isCompleted = item.step < currentStep;
            const isCurrent = item.step === currentStep;

            return (
              <div 
                key={item.step}
                onClick={() => onStepClick && onStepClick(item.step)}
                className={`relative z-10 flex flex-col items-center cursor-pointer group transition-all`}
              >
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs transition-all duration-300 shadow-sm ${
                    isCompleted 
                      ? 'bg-teal-600 text-white shadow-teal-200' 
                      : isCurrent 
                        ? 'bg-white border-2 border-teal-500 text-teal-700 ring-4 ring-teal-100 scale-110' 
                        : 'bg-white border border-slate-300 text-slate-400 group-hover:border-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : getIcon(item.icon, isCurrent)}
                </div>

                <span 
                  className={`mt-1.5 text-[11px] font-medium text-center transition-colors max-w-[85px] leading-tight ${
                    isCurrent 
                      ? 'text-teal-900 font-semibold' 
                      : isCompleted 
                        ? 'text-slate-700' 
                        : 'text-slate-600'
                  }`}
                >
                  {lang === 'et' ? item.titleEt : item.titleEn}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
