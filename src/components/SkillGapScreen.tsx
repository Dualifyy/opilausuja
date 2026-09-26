import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, AlertTriangle, Plus, X, Compass, Edit2, BarChart2 } from 'lucide-react';
import { Language, GapAnalysis, Skill } from '../types';
import { translations } from '../i18n/translations';

interface SkillGapScreenProps {
  lang: Language;
  analysis: GapAnalysis;
  onViewPath: () => void;
  onUpdateSkills: (alreadyHave: Skill[], stillNeed: Skill[]) => void;
  onBack: () => void;
}

export const SkillGapScreen: React.FC<SkillGapScreenProps> = ({
  lang,
  analysis,
  onViewPath,
  onUpdateSkills,
  onBack,
}) => {
  const t = translations[lang];
  const [alreadyHave, setAlreadyHave] = useState<Skill[]>(analysis.alreadyHave);
  const [stillNeed, setStillNeed] = useState<Skill[]>(analysis.stillNeed);
  const [newSkillText, setNewSkillText] = useState('');
  const [addCategory, setAddCategory] = useState<'have' | 'need'>('have');
  const [isEditing, setIsEditing] = useState(false);

  const handleAddSkill = () => {
    if (!newSkillText.trim()) return;
    const newSkill: Skill = {
      name: newSkillText.trim(),
      level: 'intermediate',
      source: 'user_added',
      category: 'technical',
    };

    if (addCategory === 'have') {
      const updatedHave = [...alreadyHave, newSkill];
      setAlreadyHave(updatedHave);
      onUpdateSkills(updatedHave, stillNeed);
    } else {
      const updatedNeed = [...stillNeed, newSkill];
      setStillNeed(updatedNeed);
      onUpdateSkills(alreadyHave, updatedNeed);
    }
    setNewSkillText('');
  };

  const handleRemoveHave = (idx: number) => {
    const updated = alreadyHave.filter((_, i) => i !== idx);
    setAlreadyHave(updated);
    onUpdateSkills(updated, stillNeed);
  };

  const handleRemoveNeed = (idx: number) => {
    const updated = stillNeed.filter((_, i) => i !== idx);
    setStillNeed(updated);
    onUpdateSkills(alreadyHave, updated);
  };

  const score = analysis.readinessScore;
  const circumference = 2 * Math.PI * 40; // r=40
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const breakdown = analysis.categoryBreakdown || {
    technical: Math.round(score * 0.95),
    soft: Math.min(95, Math.round(score * 1.15)),
    languages: Math.round(score * 0.9)
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Step Badge & Back */}
      <div className="flex items-center justify-between">
        <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold tracking-wide">
          {t.skillGap.stepBadge}
        </span>
        <button
          onClick={onBack}
          className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
        >
          ← {t.common.back}
        </button>
      </div>

      {/* Screen Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t.skillGap.title}
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          {lang === 'et' ? `Eesmärk: "${analysis.goalTitle}"` : `Target: "${analysis.goalTitle}"`}
        </p>
      </div>

      {/* Readiness Gauge Hero Card (Matching Image 2 circular score) */}
      <div className="bg-gradient-to-br from-white via-teal-50/30 to-emerald-50/40 rounded-2xl border border-teal-100 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Circular Score Gauge */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                className="text-slate-100 stroke-current"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                className="text-teal-600 stroke-current transition-all duration-1000 ease-out"
                strokeWidth="8"
                strokeLinecap="round"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-none">
                {score}%
              </span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-1">
                {lang === 'et' ? 'Sobivus' : 'Match'}
              </span>
            </div>
          </div>

          {/* Encouraging Headline & Summary */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100/80 text-teal-800 text-xs font-semibold">
              <Compass className="w-3.5 h-3.5 text-teal-700" />
              <span>{analysis.encouragingHeadline || t.skillGap.encouragingTagline}</span>
            </div>

            <p className="text-sm text-slate-700 leading-relaxed font-medium">
              {analysis.summaryNote || (
                lang === 'et'
                  ? "Sinu oskused kattuvad hästi, kuid töökoha jaoks on veel olulisi oskusi, mida saad teekonna abil tugevdada."
                  : "Your background provides a strong head-start. Here is exactly what skills will bridge the gap."
              )}
            </p>

            {/* Quick stats pill */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-slate-600">
              <span className="flex items-center gap-1 font-semibold text-teal-700">
                <span className="w-2 h-2 rounded-full bg-teal-500" />
                {alreadyHave.length} {lang === 'et' ? 'oskust olemas' : 'skills present'}
              </span>
              <span className="flex items-center gap-1 font-semibold text-amber-700">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                {stillNeed.length} {lang === 'et' ? 'oskust vajalikud' : 'gaps to learn'}
              </span>
              <span className="flex items-center gap-1 font-semibold text-slate-600">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                {analysis.path.length} {lang === 'et' ? 'sammu teekonnal' : 'roadmap steps'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown Bars (from Image 2 mockup) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
        <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-teal-600" />
          {t.skillGap.breakdownTitle}
        </h4>

        <div className="space-y-3">
          {/* Technical Skills Bar */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-700">{t.skillGap.technical}</span>
              <span className="text-teal-700 font-mono">{breakdown.technical}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-teal-500 rounded-full transition-all duration-700" 
                style={{ width: `${breakdown.technical}%` }}
              />
            </div>
          </div>

          {/* Soft Skills Bar */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-700">{t.skillGap.soft}</span>
              <span className="text-emerald-700 font-mono">{breakdown.soft}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-700" 
                style={{ width: `${breakdown.soft}%` }}
              />
            </div>
          </div>

          {/* Languages & Tools Bar */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-700">{t.skillGap.languages}</span>
              <span className="text-cyan-700 font-mono">{breakdown.languages}%</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-cyan-600 rounded-full transition-all duration-700" 
                style={{ width: `${breakdown.languages}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Two Clearly Separated Skill Columns: Already Have (Green) vs Still Need (Amber) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Column 1: What You Already Have (Green/Teal) */}
        <div className="bg-teal-50/40 rounded-2xl border border-teal-200/80 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-teal-950">
                  {t.skillGap.haveTitle}
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold">
                {alreadyHave.length}
              </span>
            </div>
            <p className="text-xs text-teal-900/70 mb-3">
              {t.skillGap.haveDesc}
            </p>

            {/* Badges List */}
            <div className="flex flex-wrap gap-2">
              {alreadyHave.map((skill, idx) => (
                <div
                  key={idx}
                  className="group px-3 py-1.5 rounded-xl bg-white border border-teal-200 text-slate-800 text-xs font-semibold shadow-2xs flex items-center gap-1.5 hover:border-teal-400 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  <span>{skill.name}</span>
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveHave(idx)}
                      className="ml-1 text-slate-400 hover:text-red-500 cursor-pointer"
                      title="Remove"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
              {alreadyHave.length === 0 && (
                <p className="text-xs text-slate-600 italic">
                  {t.skillGap.emptyHave}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Column 2: What You'll Need (Amber/Orange) */}
        <div className="bg-amber-50/40 rounded-2xl border border-amber-200/80 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-amber-950">
                  {t.skillGap.needTitle}
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                {stillNeed.length}
              </span>
            </div>
            <p className="text-xs text-amber-900/70 mb-3">
              {t.skillGap.needDesc}
            </p>

            {/* Badges List */}
            <div className="flex flex-wrap gap-2">
              {stillNeed.map((skill, idx) => (
                <div
                  key={idx}
                  className="group px-3 py-1.5 rounded-xl bg-white border border-amber-200 text-slate-800 text-xs font-semibold shadow-2xs flex items-center gap-1.5 hover:border-amber-400 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>{skill.name}</span>
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveNeed(idx)}
                      className="ml-1 text-slate-400 hover:text-red-500 cursor-pointer"
                      title="Remove"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
              {stillNeed.length === 0 && (
                <p className="text-xs text-slate-600 italic">
                  {t.skillGap.emptyNeed}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Editable Skills Tool (Add/Edit Skills) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Edit2 className="w-3.5 h-3.5 text-teal-600" />
            {lang === 'et' ? 'Täpsusta oskusi käsitsi' : 'Customize & fine-tune extracted skills'}
          </span>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs text-teal-700 hover:text-teal-900 font-semibold cursor-pointer"
          >
            {isEditing ? (lang === 'et' ? 'Lõpeta muutmine' : 'Done editing') : (lang === 'et' ? 'Halda / Kustuta oskusi' : 'Manage / Remove skills')}
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex bg-slate-100 rounded-lg p-0.5 text-xs font-medium shrink-0">
            <button
              onClick={() => setAddCategory('have')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                addCategory === 'have' ? 'bg-white text-teal-800 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              + {lang === 'et' ? 'Oskan' : 'I know'}
            </button>
            <button
              onClick={() => setAddCategory('need')}
              className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                addCategory === 'need' ? 'bg-white text-amber-800 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              + {lang === 'et' ? 'Vajan' : 'Need'}
            </button>
          </div>

          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={newSkillText}
              onChange={(e) => setNewSkillText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
              placeholder={t.skillGap.addSkillPrompt}
              className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
            <button
              onClick={handleAddSkill}
              className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.skillGap.addBtn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Action CTA: View Learning Path */}
      <div className="pt-2">
        <button
          onClick={onViewPath}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-base shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer"
        >
          <span>{t.skillGap.viewPathBtn}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
