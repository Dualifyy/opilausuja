import React, { useState } from 'react';
import { Search, Sparkles, Check, ArrowRight, Briefcase, BarChart, Code, Palette, Shield, TrendingUp, Server, Compass, Edit3 } from 'lucide-react';
import { Language, Goal } from '../types';
import { translations } from '../i18n/translations';
import { CURATED_GOALS } from '../config';

interface GoalScreenProps {
  lang: Language;
  onSelectGoal: (goal: Goal) => void;
  onBack: () => void;
  initialGoalTitle?: string;
}

export const GoalScreen: React.FC<GoalScreenProps> = ({
  lang,
  onSelectGoal,
  onBack,
  initialGoalTitle = '',
}) => {
  const t = translations[lang];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(() => {
    if (!initialGoalTitle) return 'data-analyst';
    const match = CURATED_GOALS.find(g => g.title.toLowerCase() === initialGoalTitle.toLowerCase() || (g.titleEt && g.titleEt.toLowerCase() === initialGoalTitle.toLowerCase()));
    return match ? match.id : 'custom';
  });
  const [customGoalTitle, setCustomGoalTitle] = useState(() => {
    const isCurated = CURATED_GOALS.some(g => g.title.toLowerCase() === initialGoalTitle.toLowerCase() || (g.titleEt && g.titleEt.toLowerCase() === initialGoalTitle.toLowerCase()));
    return !isCurated && initialGoalTitle ? initialGoalTitle : '';
  });

  const getGoalIcon = (iconName?: string) => {
    const props = { className: "w-5 h-5 text-teal-600" };
    switch (iconName) {
      case 'chart-bar': return <BarChart {...props} />;
      case 'briefcase': return <Briefcase {...props} />;
      case 'code': return <Code {...props} />;
      case 'palette': return <Palette {...props} />;
      case 'shield-check': return <Shield {...props} />;
      case 'trending-up': return <TrendingUp {...props} />;
      case 'server': return <Server {...props} />;
      default: return <Compass {...props} />;
    }
  };

  const filteredGoals = CURATED_GOALS.filter((g) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    const titleMatch = g.title.toLowerCase().includes(query);
    const titleEtMatch = g.titleEt?.toLowerCase().includes(query);
    const catMatch = g.category?.toLowerCase().includes(query);
    return titleMatch || titleEtMatch || catMatch;
  });

  const handleStartAnalysis = () => {
    if (selectedGoalId === 'custom') {
      if (!customGoalTitle.trim()) return;
      onSelectGoal({
        id: 'custom-' + Date.now(),
        title: customGoalTitle.trim(),
        isCustom: true,
        category: 'Custom Goal',
      });
      return;
    }

    const found = CURATED_GOALS.find(g => g.id === selectedGoalId);
    if (found) {
      onSelectGoal(found);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-20 animate-in fade-in duration-300">
      {/* Step Badge & Back */}
      <div className="flex items-center justify-between">
        <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold tracking-wide">
          {t.goal.stepBadge}
        </span>
        <button
          onClick={onBack}
          className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
        >
          ← {t.common.back}
        </button>
      </div>

      {/* Title */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t.goal.title}
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          {t.goal.subtitle}
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t.goal.searchPlaceholder}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-hidden shadow-2xs"
        />
      </div>

      {/* Curated Goal Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredGoals.map((goal) => {
          const isSelected = selectedGoalId === goal.id;
          return (
            <div
              key={goal.id}
              onClick={() => {
                setSelectedGoalId(goal.id);
                setCustomGoalTitle('');
              }}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group ${
                isSelected
                  ? 'border-teal-500 bg-teal-50/50 shadow-xs ring-2 ring-teal-200'
                  : 'border-slate-200 bg-white hover:border-teal-300 hover:bg-slate-50/70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                      {getGoalIcon(goal.iconName)}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                      {goal.category}
                    </span>
                  </div>
                  {isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : goal.popular ? (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-semibold">
                      {t.goal.popularBadge}
                    </span>
                  ) : null}
                </div>

                <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-900">
                  {lang === 'et' && goal.titleEt ? goal.titleEt : goal.title}
                </h4>
                <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                  {goal.description}
                </p>
              </div>

              {lang === 'et' && goal.titleEt && (
                <div className="mt-2 text-[10px] text-slate-600 font-mono">
                  {goal.title}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Custom Goal Input Box */}
      <div 
        onClick={() => setSelectedGoalId('custom')}
        className={`p-4 rounded-2xl border transition-all bg-white ${
          selectedGoalId === 'custom'
            ? 'border-teal-500 ring-2 ring-teal-200 bg-teal-50/30'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <Edit3 className="w-4 h-4 text-teal-600" />
          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
            {t.goal.customTitle}
          </h4>
        </div>

        <input
          type="text"
          value={customGoalTitle}
          onFocus={() => setSelectedGoalId('custom')}
          onChange={(e) => {
            setCustomGoalTitle(e.target.value);
            setSelectedGoalId('custom');
          }}
          placeholder={t.goal.customPlaceholder}
          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
        />

        <p className="text-[11px] text-slate-600 mt-1.5">
          {t.goal.customHint}
        </p>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          disabled={!selectedGoalId || (selectedGoalId === 'custom' && !customGoalTitle.trim())}
          onClick={handleStartAnalysis}
          className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
            selectedGoalId && (selectedGoalId !== 'custom' || customGoalTitle.trim())
              ? 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-teal-600/30 active:scale-98'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{t.goal.analyzeBtn}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
