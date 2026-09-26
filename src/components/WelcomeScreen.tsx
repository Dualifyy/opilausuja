import React from 'react';
import { ArrowRight, UploadCloud, Play, Sparkles, CheckCircle2, Search, Target, BookOpen, Star, Compass } from 'lucide-react';
import { Language, GapAnalysis } from '../types';
import { translations } from '../i18n/translations';
import { DEMO_PRESETS, FOUR_STEPS_PROMISE, DemoPreset } from '../config';
import { WindingRoadHero } from './WindingRoadHero';

interface WelcomeScreenProps {
  lang: Language;
  onStart: (initialMode?: 'upload' | 'text') => void;
  onSelectPreset: (preset: DemoPreset) => void;
  latestAnalysis: GapAnalysis | null;
  onResumeLatest: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  lang,
  onStart,
  onSelectPreset,
  latestAnalysis,
  onResumeLatest,
}) => {
  const t = translations[lang];

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-300">
      {/* 4-Step Promise Arc Hero Banner */}
      <div className="bg-gradient-to-r from-teal-50/80 via-emerald-50/50 to-teal-50/80 border border-teal-100 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="text-center mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100/80 text-teal-800 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            {t.hero.badge}
          </span>
        </div>

        {/* 4 Steps Visual Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-3xl mx-auto">
          {FOUR_STEPS_PROMISE.map((step, idx) => (
            <div 
              key={step.step}
              className="bg-white/90 backdrop-blur-xs p-3 rounded-xl border border-teal-100/70 shadow-xs flex flex-col items-center text-center group hover:border-teal-300 transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-teal-50 text-teal-700 font-bold text-xs flex items-center justify-center mb-1.5 ring-2 ring-teal-200/50 group-hover:scale-105 transition-transform">
                {step.step}
              </div>
              <h4 className="text-xs font-bold text-slate-800 leading-tight">
                {lang === 'et' ? step.titleEt : step.titleEn}
              </h4>
              <p className="text-[11px] text-slate-600 mt-1 leading-tight line-clamp-2">
                {lang === 'et' ? step.descEt : step.descEn}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Section matching Image 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            {t.hero.titleStart}
            <span className="text-teal-600">{t.hero.titleHighlight1}</span>
            <br />
            {t.hero.titleMiddle}
            <span className="bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-transparent">
              {t.hero.titleHighlight2}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            {t.hero.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
            <button
              onClick={() => onStart('text')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-bold text-sm shadow-md shadow-teal-600/25 hover:shadow-lg hover:shadow-teal-600/30 flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer"
            >
              <span>{t.hero.startBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onStart('upload')}
              className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-sm flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4 text-teal-600" />
              <span>{t.hero.uploadCvBtn}</span>
            </button>
          </div>

          {/* Resume Previous Analysis Card if exists */}
          {latestAnalysis && (
            <div className="mt-4 p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-center justify-between text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {latestAnalysis.readinessScore}%
                </div>
                <div>
                  <div className="text-xs font-semibold text-emerald-950">
                    {lang === 'et' ? 'Viimane aktiivne analüüs:' : 'Active roadmap ready:'}
                  </div>
                  <div className="text-sm font-bold text-slate-900">
                    {latestAnalysis.goalTitle}
                  </div>
                </div>
              </div>
              <button
                onClick={onResumeLatest}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <span>{lang === 'et' ? 'Ava tulemused' : 'View Results'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Winding Road Graphic Motif from Image 1 */}
        <div className="lg:col-span-5">
          <WindingRoadHero lang={lang} />
        </div>
      </div>

      {/* 1-Click Judge & Hackathon Demo Presets */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Play className="w-4 h-4 text-teal-600 fill-teal-600" />
              {t.hero.demoPresetsTitle}
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              {t.hero.demoPresetsHint}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DEMO_PRESETS.map((preset) => (
            <div
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/40 cursor-pointer transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 text-[10px] font-bold">
                    {preset.roleBadge}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-teal-800">
                  {lang === 'et' ? preset.nameEt : preset.name}
                </h4>
                <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                  {lang === 'et' ? preset.summaryEt : preset.summary}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-teal-700 font-semibold">
                <span>{lang === 'et' ? 'Vali ja ava ->' : 'Run demo ->'}</span>
                <span className="text-slate-600">{preset.goalTitle}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Feature Cards (Images 1 & 2 inspired) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1.5">
              {t.features.card1Title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.features.card1Desc}
            </p>
          </div>
          <button 
            onClick={() => onStart('upload')}
            className="mt-4 text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 pt-2 border-t border-slate-100"
          >
            <span>{t.features.card1Action}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1.5">
              {t.features.card2Title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.features.card2Desc}
            </p>
          </div>
          <button 
            onClick={() => onStart('text')}
            className="mt-4 text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 pt-2 border-t border-slate-100"
          >
            <span>{t.features.card2Action}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1.5">
              {t.features.card3Title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.features.card3Desc}
            </p>
          </div>
          <button 
            onClick={() => onStart('text')}
            className="mt-4 text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 pt-2 border-t border-slate-100"
          >
            <span>{t.features.card3Action}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Star className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1.5">
              {t.features.card4Title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.features.card4Desc}
            </p>
          </div>
          <button 
            onClick={() => onStart('text')}
            className="mt-4 text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 pt-2 border-t border-slate-100"
          >
            <span>{t.features.card4Action}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
