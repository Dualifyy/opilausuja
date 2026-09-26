import React from 'react';
import { APP_NAME } from '../config';
import { Language, AppScreen } from '../types';
import { translations } from '../i18n/translations';
import { History, Settings, Plus } from 'lucide-react';

interface HeaderProps {
  currentScreen?: AppScreen;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  viewMode?: 'mobile' | 'desktop';
  onViewModeToggle?: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  onNavigateHome: () => void;
  onStartNew: () => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onLanguageChange,
  onOpenHistory,
  onOpenSettings,
  onNavigateHome,
  onStartNew,
  savedCount,
}) => {
  const t = translations[lang];

  return (
    <header className="h-14 bg-white/95 backdrop-blur-md border-b border-stone-200/80 sticky top-0 z-30 transition-all select-none">
      <div className="max-w-6xl mx-auto h-full px-4 flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div 
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          {/* Circular Ring Emblem */}
          <div className="w-8 h-8 rounded-xl bg-teal-700 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <div className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-stone-900 group-hover:text-teal-800 transition-colors">
              {APP_NAME}
            </span>
            <span className="text-[10px] text-stone-500 font-medium hidden sm:block -mt-1">
              {lang === 'et' ? 'Sinu teekond uute oskusteni' : 'Your Path to New Skills'}
            </span>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Start New button */}
          <button
            onClick={onStartNew}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-semibold transition-colors border border-teal-200/70 cursor-pointer"
            title={lang === 'et' ? 'Alusta uut analüüsi' : 'Start new analysis'}
          >
            <Plus className="w-3.5 h-3.5 text-teal-700" />
            <span>{lang === 'et' ? 'Uus analüüs' : 'New Path'}</span>
          </button>

          {/* History button with count */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-stone-100 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
            title={t.nav.history}
          >
            <History className="w-4 h-4 text-stone-600" />
            <span className="hidden sm:inline">{t.nav.history}</span>
            {savedCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-teal-700 text-white text-[10px] font-bold">
                {savedCount}
              </span>
            )}
          </button>

          {/* Language Switcher */}
          <div className="flex items-center bg-stone-100 p-0.5 rounded-lg text-xs font-semibold">
            <button
              onClick={() => onLanguageChange('et')}
              className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                lang === 'et'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              ET
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                lang === 'en'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              EN
            </button>
          </div>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg hover:bg-stone-100 text-stone-600 transition-colors cursor-pointer"
            title={t.nav.settings}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
