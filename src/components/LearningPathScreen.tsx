import React from 'react';
import { CheckCircle2, Clock, BookOpen, Share2, ChevronRight, Compass, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, GapAnalysis, PathStep } from '../types';
import { translations } from '../i18n/translations';

interface LearningPathScreenProps {
  lang: Language;
  analysis: GapAnalysis;
  onToggleStep: (stepOrder: number, completed: boolean) => void;
  onSelectStepDetail: (step: PathStep) => void;
  onBackToGap: () => void;
  onCompareWithAnother: () => void;
  onExport: () => void;
}

export const LearningPathScreen: React.FC<LearningPathScreenProps> = ({
  lang,
  analysis,
  onToggleStep,
  onSelectStepDetail,
  onBackToGap,
  onCompareWithAnother,
  onExport,
}) => {
  const t = translations[lang];

  const completedCount = analysis.path.filter((s) => s.completed).length;
  const totalCount = analysis.path.length;
  const progressRatio = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const isAllCompleted = completedCount === totalCount && totalCount > 0;

  const handleStepCheck = (e: React.MouseEvent, step: PathStep) => {
    e.stopPropagation();
    const nextCompleted = !step.completed;
    onToggleStep(step.order, nextCompleted);

    if (nextCompleted) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#0D9488', '#10B981', '#F59E0B', '#3B82F6'],
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-20 animate-in fade-in duration-300">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToGap}
          className="text-xs text-stone-500 hover:text-stone-800 font-medium flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === 'et' ? 'Tagasi oskuste analüüsi juurde' : 'Back to Skill Analysis'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onExport}
            className="text-xs text-stone-600 hover:text-teal-800 font-semibold flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
            title="Export"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.path.sharePathBtn}</span>
          </button>
        </div>
      </div>

      {/* Hero Goal Header */}
      <div className="bg-gradient-to-br from-white via-teal-50/30 to-emerald-50/40 rounded-2xl border border-teal-100/90 p-5 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-xs">
              <Compass className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-[11px] text-teal-800 font-bold uppercase tracking-wider">
                {lang === 'et' ? 'Isiklik arenguteekond sihile' : 'Personalized Pathway'}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 leading-tight">
                {analysis.goalTitle}
              </h2>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold shadow-2xs">
            {lang === 'et' ? 'Põhisiht' : 'Primary Goal'}
          </span>
        </div>

        {/* Progress Bar & Ratio */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-stone-600">
              {lang === 'et' ? 'Õpiteekonna edenemine' : 'Milestone Progress'}
            </span>
            <span className="text-teal-800 font-mono">
              {completedCount} / {totalCount} {lang === 'et' ? 'sammu tehtud' : 'steps completed'} ({Math.round(progressRatio)}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-stone-200/80 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-teal-600 to-emerald-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressRatio}%` }}
            />
          </div>
        </div>

        {isAllCompleted && (
          <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-2">
            <span>🎉</span>
            <span>{t.path.congratsAllDone}</span>
          </div>
        )}
      </div>

      {/* Stepper Timeline - Main Learning Pathway */}
      <div className="space-y-3">
        {analysis.path.map((step, idx) => {
          const isFirst = idx === 0;
          const statusLabel = step.completed 
            ? (lang === 'et' ? 'Tehtud' : 'Done')
            : isFirst 
              ? (lang === 'et' ? 'Alusta siit' : 'Start here')
              : (lang === 'et' ? 'Järgmine samm' : 'Next step');

          return (
            <div
              key={step.order}
              onClick={() => onSelectStepDetail(step)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer group flex items-start gap-3 sm:gap-4 ${
                step.completed
                  ? 'bg-emerald-50/40 border-emerald-200 shadow-2xs opacity-90'
                  : 'bg-white border-stone-200/90 hover:border-teal-400 hover:shadow-md'
              }`}
            >
              {/* Checkbox trigger button */}
              <button
                onClick={(e) => handleStepCheck(e, step)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer ${
                  step.completed
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'border-stone-300 hover:border-teal-500 bg-stone-50'
                }`}
                title={step.completed ? t.path.completed : t.path.markDone}
              >
                {step.completed ? (
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <span className="text-xs font-bold text-stone-500 group-hover:text-teal-700">
                    {step.order}
                  </span>
                )}
              </button>

              {/* Step Main Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                  <h3
                    className={`text-sm sm:text-base font-bold ${
                      step.completed
                        ? 'line-through text-stone-500'
                        : 'text-stone-900 group-hover:text-teal-800'
                    }`}
                  >
                    {step.title}
                  </h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      step.completed
                        ? 'bg-emerald-100 text-emerald-800'
                        : isFirst
                          ? 'bg-teal-100 text-teal-800 ring-1 ring-teal-300'
                          : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {statusLabel}
                  </span>
                </div>

                {/* 1-Line Reason "Why" */}
                <p className="text-xs text-stone-600 leading-relaxed mb-2.5">
                  {step.why}
                </p>

                {/* Meta Pills: Effort & Suggested Resource */}
                <div className="flex flex-wrap items-center gap-2.5 text-[11px] pt-1.5 border-t border-stone-100 text-stone-500">
                  <span className="flex items-center gap-1 font-medium text-stone-600">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    {step.estimatedEffort}
                  </span>

                  <span className="flex items-center gap-1 font-semibold text-teal-800">
                    <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                    {step.suggestedResource}
                  </span>

                  <span className="ml-auto hidden xs:flex items-center gap-0.5 text-stone-400 group-hover:text-teal-700 font-semibold transition-colors">
                    <span>{lang === 'et' ? 'Vaata detaile' : 'Details'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Motivation Banner */}
      <div className="p-4 bg-teal-50/70 border border-teal-200/70 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-xs font-semibold text-teal-900">
          <span className="text-base">🌱</span>
          <span>{lang === 'et' ? 'Väike samm iga päev viib sind suure eesmärgini!' : 'Small daily steps lead to your biggest career goals!'}</span>
        </div>
        <button
          onClick={onCompareWithAnother}
          className="text-xs text-teal-800 hover:text-teal-950 font-bold underline cursor-pointer shrink-0 ml-2"
        >
          {t.path.compareBtn}
        </button>
      </div>
    </div>
  );
};
