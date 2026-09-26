import React, { useState } from 'react';
import { History, ArrowRight, Trash2, GitCompare, Sparkles, Plus, Award, CheckCircle2, Calendar } from 'lucide-react';
import { Language, GapAnalysis } from '../types';
import { translations } from '../i18n/translations';

interface HistoryScreenProps {
  lang: Language;
  history: GapAnalysis[];
  onSelectAnalysis: (analysis: GapAnalysis) => void;
  onDeleteAnalysis: (id: string) => void;
  onStartNew: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  lang,
  history,
  onSelectAnalysis,
  onDeleteAnalysis,
  onStartNew,
}) => {
  const t = translations[lang];
  const [compareId1, setCompareId1] = useState<string>(history[0]?.id || '');
  const [compareId2, setCompareId2] = useState<string>(history[1]?.id || history[0]?.id || '');

  const analysis1 = history.find(h => h.id === compareId1);
  const analysis2 = history.find(h => h.id === compareId2);

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(lang === 'et' ? 'et-EE' : 'en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-teal-600" />
            <span>{t.history.title}</span>
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {t.history.subtitle}
          </p>
        </div>

        <button
          onClick={onStartNew}
          className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{lang === 'et' ? 'Uus teekond' : 'New Path'}</span>
        </button>
      </div>

      {/* Empty State */}
      {history.length === 0 ? (
        <div className="p-8 sm:p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 mx-auto flex items-center justify-center">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">
              {t.history.noHistory}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {lang === 'et' 
                ? 'Sisesta oma kogemus ja vali ametikoht, et salvestada oma esimene oskuste ja õpiteekonna analüüs.'
                : 'Enter your background and pick a target goal to save your first skill roadmap.'}
            </p>
          </div>
          <button
            onClick={onStartNew}
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            {t.history.emptyBtn}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => {
            const completed = item.path.filter(s => s.completed).length;
            const total = item.path.length;

            return (
              <div
                key={item.id}
                onClick={() => onSelectAnalysis(item)}
                className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-teal-400 hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex flex-col items-center justify-center shrink-0">
                    <span className="text-base font-extrabold text-teal-800 leading-none">
                      {item.readinessScore}%
                    </span>
                    <span className="text-[9px] font-bold text-teal-600 uppercase">
                      {lang === 'et' ? 'Sobivus' : 'Match'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-800 transition-colors">
                      {item.goalTitle}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {formatDate(item.createdAt)}
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-slate-700">
                        {completed}/{total} {lang === 'et' ? 'sammu tehtud' : 'completed'}
                      </span>
                      <span>•</span>
                      <span className="text-teal-700 font-medium">
                        {item.alreadyHave.length} {lang === 'et' ? 'oskust' : 'skills'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteAnalysis(item.id);
                    }}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title={t.history.deleteBtn}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 text-xs font-bold group-hover:bg-teal-600 group-hover:text-white transition-colors">
                    <span>{t.history.viewBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Side-by-Side Goal Comparison Section (Stretch Goal from Section 11) */}
      {history.length >= 2 && (
        <div className="bg-gradient-to-br from-slate-50 to-teal-50/30 rounded-3xl border border-teal-100/80 p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
              <GitCompare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {t.history.compareTitle}
              </h3>
              <p className="text-xs text-slate-600">
                {t.history.compareDesc}
              </p>
            </div>
          </div>

          {/* Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">
                {t.history.selectRole1}
              </label>
              <select
                value={compareId1}
                onChange={(e) => setCompareId1(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-teal-500"
              >
                {history.map(h => (
                  <option key={h.id} value={h.id}>{h.goalTitle} ({h.readinessScore}%)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase block mb-1">
                {t.history.selectRole2}
              </label>
              <select
                value={compareId2}
                onChange={(e) => setCompareId2(e.target.value)}
                className="w-full p-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-teal-500"
              >
                {history.map(h => (
                  <option key={h.id} value={h.id}>{h.goalTitle} ({h.readinessScore}%)</option>
                ))}
              </select>
            </div>
          </div>

          {/* Comparison Cards Side-by-Side */}
          {analysis1 && analysis2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Card 1 */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">{analysis1.goalTitle}</h4>
                  <span className="text-base font-extrabold text-teal-700">{analysis1.readinessScore}%</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>{lang === 'et' ? 'Olemasolevad oskused:' : 'Existing skills:'}</span>
                    <span className="font-bold text-teal-800">{analysis1.alreadyHave.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{lang === 'et' ? 'Õppimist vajavad lüngad:' : 'Skill gaps:'}</span>
                    <span className="font-bold text-amber-700">{analysis1.stillNeed.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{lang === 'et' ? 'Teekonna samme:' : 'Path steps:'}</span>
                    <span className="font-bold text-slate-800">{analysis1.path.length}</span>
                  </div>
                </div>
                <button
                  onClick={() => onSelectAnalysis(analysis1)}
                  className="w-full py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  {lang === 'et' ? 'Vaata seda teekonda' : 'Open this path'}
                </button>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">{analysis2.goalTitle}</h4>
                  <span className="text-base font-extrabold text-teal-700">{analysis2.readinessScore}%</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>{lang === 'et' ? 'Olemasolevad oskused:' : 'Existing skills:'}</span>
                    <span className="font-bold text-teal-800">{analysis2.alreadyHave.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{lang === 'et' ? 'Õppimist vajavad lüngad:' : 'Skill gaps:'}</span>
                    <span className="font-bold text-amber-700">{analysis2.stillNeed.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{lang === 'et' ? 'Teekonna samme:' : 'Path steps:'}</span>
                    <span className="font-bold text-slate-800">{analysis2.path.length}</span>
                  </div>
                </div>
                <button
                  onClick={() => onSelectAnalysis(analysis2)}
                  className="w-full py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  {lang === 'et' ? 'Vaata seda teekonda' : 'Open this path'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
