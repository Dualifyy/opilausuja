import React from 'react';
import { X, Clock, Award, CheckCircle2, BookOpen, Laptop, ExternalLink } from 'lucide-react';
import { Language, PathStep } from '../types';
import { translations } from '../i18n/translations';

interface StepDetailModalProps {
  step: PathStep | null;
  lang: Language;
  onClose: () => void;
  onToggleComplete: (order: number, completed: boolean) => void;
}

export const StepDetailModal: React.FC<StepDetailModalProps> = ({
  step,
  lang,
  onClose,
  onToggleComplete,
}) => {
  if (!step) return null;
  const t = translations[lang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-5 sm:p-6 space-y-4 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
              {step.order}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                {t.detailModal.title}
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                {step.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 text-xs font-semibold flex items-center gap-1 border border-teal-100">
            <Clock className="w-3.5 h-3.5" />
            {t.detailModal.effort} {step.estimatedEffort}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 text-xs font-semibold flex items-center gap-1 border border-amber-100">
            <Award className="w-3.5 h-3.5" />
            {t.detailModal.priority} {step.priority || 'high'}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
            {lang === 'et' ? 'Seotud oskus:' : 'Builds:'} {step.relatedSkill}
          </span>
        </div>

        {/* Why this matters */}
        <div className="p-3.5 bg-teal-50/50 border border-teal-100/80 rounded-2xl space-y-1">
          <h4 className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-teal-600" />
            {lang === 'et' ? 'Miks see samm on oluline?' : 'Why is this step important?'}
          </h4>
          <p className="text-xs text-slate-700 leading-relaxed">
            {step.why}
          </p>
        </div>

        {/* Key Learning Objectives */}
        {step.details?.keyLearningPoints && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {t.detailModal.keyPoints}
            </h4>
            <div className="space-y-1.5">
              {step.details.keyLearningPoints.map((pt, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                    ✓
                  </div>
                  <span>{pt}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hands-on Project Milestone */}
        {step.details?.handsOnProject && (
          <div className="p-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-1">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-teal-600" />
              {t.detailModal.project}
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              {step.details.handsOnProject}
            </p>
          </div>
        )}

        {/* Suggested Resource */}
        <div className="space-y-1.5">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            {t.detailModal.platforms}
          </h4>
          <div className="p-3 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>{step.suggestedResource}</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* Action Toggle */}
        <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100">
          <button
            onClick={() => onToggleComplete(step.order, !step.completed)}
            className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              step.completed
                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                : 'bg-teal-600 text-white hover:bg-teal-700 shadow-xs'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{step.completed ? t.path.completed : t.path.markDone}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            {t.detailModal.close}
          </button>
        </div>
      </div>
    </div>
  );
};
