import React from 'react';
import { APP_NAME } from '../config';
import { Language, AppScreen } from '../types';
import { translations } from '../i18n/translations';
import { Smartphone, Monitor, History, Settings, Sparkles, Plus } from 'lucide-react';

interface HeaderProps {
  currentScreen: AppScreen;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  viewMode: 'mobile' | 'desktop';
  onViewModeToggle: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  onNavigateHome: () => void;
  onStartNew: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onLanguageChange,
  viewMode,
  onViewModeToggle,
  onOpenHistory,
  onOpenSettings,
  onNavigateHome,
  onStartNew,
  savedCount,
}) => {
  const t = translations[lang];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 transition-all">
      <div className="max-w-6xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2">
        {/* Brand / Logo */}
        <div 
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          {/* Circular Ring Emblem matching Image 1 */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-teal-600 via-teal-500 to-emerald-400 flex items-center justify-center shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <div className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg sm:text-xl tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors">
              {APP_NAME}
            </span>
            <span className="text-[10px] text-slate-600 font-medium hidden sm:block -mt-1">
              {lang === 'et' ? 'AI Õpitee ja Karjäär' : 'AI Learning & Career Path'}
            </span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Quick Start New button */}
          <button
            onClick={onStartNew}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold transition-colors border border-teal-200/60"
            title={lang === 'et' ? 'Alusta uut analüüsi' : 'Start new analysis'}
          >
            <Plus className="w-3.5 h-3.5 text-teal-600" />
            <span>{lang === 'et' ? 'Uus analüüs' : 'New Path'}</span>
          </button>

          {/* History button with count */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors relative"
            title={t.nav.history}
          >
            <History className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">{t.nav.history}</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-teal-600 text-white text-[10px] font-bold">
                {savedCount}
              </span>
            )}
          </button>

          {/* View Mode Toggle (Mobile simulator frame vs Desktop wide) */}
          <button
            onClick={onViewModeToggle}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
            title={viewMode === 'mobile' ? 'Switch to Full Desktop view' : 'Switch to Mobile Simulator frame'}
          >
            {viewMode === 'mobile' ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-teal-600" />
                <span className="hidden md:inline">Desktop</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-teal-600" />
                <span className="hidden md:inline">Mobile 430px</span>
              </>
            )}
          </button>

          {/* Language Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
            <button
              onClick={() => onLanguageChange('et')}
              className={`px-2 py-1 rounded-md transition-all ${
                lang === 'et'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              ET
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-1 rounded-md transition-all ${
                lang === 'en'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              EN
            </button>
          </div>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
            title={t.nav.settings}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
