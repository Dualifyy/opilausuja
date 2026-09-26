import React, { useState } from 'react';
import { CheckCircle2, Clock, BookOpen, ExternalLink, Share2, Sparkles, ChevronRight, Award, Compass, ArrowLeft, Layers, Bookmark } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'roadmap' | 'courses' | 'materials'>('roadmap');

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
          className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === 'et' ? 'Tagasi lünkade analüüsi juurde' : 'Back to Skill Gap'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onExport}
            className="text-xs text-slate-600 hover:text-teal-700 font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            title="Export"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.path.sharePathBtn}</span>
          </button>
        </div>
      </div>

      {/* Hero Goal Header (Matching Image 2 middle card top) */}
      <div className="bg-gradient-to-br from-white via-teal-50/40 to-emerald-50/50 rounded-2xl border border-teal-100 p-5 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <Compass className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="text-[11px] text-teal-800 font-bold uppercase tracking-wider">
                {lang === 'et' ? 'Soovitus sinu eesmärgi jaoks' : 'Recommended Path for Goal'}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {analysis.goalTitle}
              </h2>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold shadow-2xs">
            {lang === 'et' ? 'Kõrge prioriteet' : 'High Priority'}
          </span>
        </div>

        {/* Progress Bar & Ratio */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-slate-600">
              {lang === 'et' ? 'Õpiteekonna edenemine' : 'Milestone Progress'}
            </span>
            <span className="text-teal-800 font-mono">
              {completedCount} / {totalCount} {lang === 'et' ? 'oskust läbitud' : 'steps completed'} ({Math.round(progressRatio)}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressRatio}%` }}
            />
          </div>
        </div>

        {isAllCompleted && (
          <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{t.path.congratsAllDone}</span>
          </div>
        )}
      </div>

      {/* Tabs: Roadmap Timeline | Recommended Courses | Materials (From Image 2 mockup) */}
      <div className="flex bg-slate-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'roadmap' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.path.tabRoadmap}
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'courses' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.path.tabCourses}
        </button>
        <button
          onClick={() => setActiveTab('materials')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'materials' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t.path.tabMaterials}
        </button>
      </div>

      {/* Tab 1: Vertical Stepper / Timeline (Matching Image 2 list) */}
      {activeTab === 'roadmap' && (
        <div className="space-y-3">
          {analysis.path.map((step, idx) => {
            const isFirst = idx === 0;
            const statusLabel = step.completed 
              ? (lang === 'et' ? 'Tehtud' : 'Done')
              : isFirst 
                ? (lang === 'et' ? 'Töös' : 'In progress')
                : (lang === 'et' ? 'Soovitatud' : 'Recommended');

            return (
              <div
                key={step.order}
                onClick={() => onSelectStepDetail(step)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer group flex items-start gap-3 sm:gap-4 relative overflow-hidden ${
                  step.completed
                    ? 'bg-slate-50/70 border-slate-200 opacity-80'
                    : 'bg-white border-slate-200/90 hover:border-teal-400 hover:shadow-md'
                }`}
              >
                {/* Step Number Circle */}
                <div
                  onClick={(e) => handleStepCheck(e, step)}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-transform group-hover:scale-105 shadow-2xs cursor-pointer ${
                    step.completed
                      ? 'bg-emerald-600 text-white'
                      : isFirst
                        ? 'bg-teal-600 text-white ring-4 ring-teal-100'
                        : 'bg-slate-100 text-slate-700 hover:bg-teal-50 hover:text-teal-700'
                  }`}
                  title={step.completed ? t.path.completed : t.path.markDone}
                >
                  {step.completed ? <CheckCircle2 className="w-5 h-5 stroke-[2.5]" /> : step.order}
                </div>

                {/* Step Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                    <h4 className={`text-sm sm:text-base font-bold leading-tight ${step.completed ? 'line-through text-slate-500' : 'text-slate-900 group-hover:text-teal-800'}`}>
                      {step.title}
                    </h4>

                    {/* Status Badge */}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        step.completed
                          ? 'bg-emerald-100 text-emerald-800'
                          : isFirst
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-teal-50 text-teal-800 border border-teal-200/60'
                      }`}
                    >
                      {statusLabel}
                    </span>
                  </div>

                  {/* 1-Line Reason "Why" */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-2">
                    {step.why}
                  </p>

                  {/* Meta Pills: Effort & Suggested Resource */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] pt-1 border-t border-slate-100 text-slate-500">
                    <span className="flex items-center gap-1 font-medium text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      {step.estimatedEffort}
                    </span>

                    <span className="flex items-center gap-1 font-semibold text-teal-700">
                      <BookOpen className="w-3.5 h-3.5" />
                      {step.suggestedResource}
                    </span>

                    <span className="ml-auto hidden xs:flex items-center gap-0.5 text-slate-400 group-hover:text-teal-600 font-semibold transition-colors">
                      <span>{lang === 'et' ? 'Vaata detaile' : 'Details'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Recommended Courses list (From Image 2 bottom-right card) */}
      {activeTab === 'courses' && (
        <div className="space-y-3">
          {analysis.path.map((step) => (
            <div
              key={step.order}
              onClick={() => onSelectStepDetail(step)}
              className="bg-white p-4 rounded-xl border border-slate-200 hover:border-teal-400 cursor-pointer shadow-xs flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-teal-800">
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {step.suggestedResource} • {step.estimatedEffort}
                  </p>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Self-study materials & Practice tasks */}
      {activeTab === 'materials' && (
        <div className="space-y-3">
          {analysis.path.map((step) => (
            <div
              key={step.order}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  {step.order}. {step.relatedSkill}
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {step.estimatedEffort}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                {step.details?.handsOnProject || step.why}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(step.details?.recommendedPlatforms || ['Coursera', 'LinkedIn Learning']).map((p, i) => (
                  <span key={i} className="px-2 py-0.5 bg-teal-50 text-teal-700 rounded-md text-[10px] font-semibold border border-teal-100">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Motivation Banner (from Image 2 mockup) */}
      <div className="p-3.5 bg-teal-50/70 border border-teal-200/70 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-teal-900">
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
