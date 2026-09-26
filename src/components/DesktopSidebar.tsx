import React from 'react';
import { Home, FileText, CheckCircle2, MapPin, History, Settings, Sparkles, User, GitCompare } from 'lucide-react';
import { AppScreen, Language } from '../types';
import { translations } from '../i18n/translations';
import { APP_NAME } from '../config';

interface DesktopSidebarProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  lang: Language;
  hasActiveAnalysis: boolean;
  onOpenSettings: () => void;
  savedCount: number;
}

export const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  currentScreen,
  onNavigate,
  lang,
  hasActiveAnalysis,
  onOpenSettings,
  savedCount,
}) => {
  const t = translations[lang];

  const menuItems = [
    {
      screen: 'welcome' as AppScreen,
      label: t.nav.home,
      icon: Home,
    },
    {
      screen: 'input' as AppScreen,
      label: t.nav.myCv,
      icon: FileText,
    },
    {
      screen: 'gap' as AppScreen,
      label: t.nav.goalAnalysis,
      icon: CheckCircle2,
      disabled: !hasActiveAnalysis,
    },
    {
      screen: 'path' as AppScreen,
      label: t.nav.learningPath,
      icon: MapPin,
      disabled: !hasActiveAnalysis,
    },
    {
      screen: 'history' as AppScreen,
      label: t.nav.history,
      icon: History,
      badge: savedCount > 0 ? savedCount : undefined,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 min-h-[calc(100vh-57px)] p-4 select-none">
      <div className="space-y-6">
        {/* Navigation links */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.screen;
            const isDisabled = item.disabled;

            return (
              <button
                key={item.screen}
                disabled={isDisabled}
                onClick={() => onNavigate(item.screen)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 font-bold shadow-2xs'
                    : isDisabled
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-1.5 py-0.5 rounded-full bg-teal-600 text-white text-[10px] font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick action card */}
        <div className="p-3.5 bg-gradient-to-br from-teal-50 to-emerald-50/60 rounded-2xl border border-teal-100/80 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-teal-900">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>{lang === 'et' ? 'Nutikas teekond' : 'Smart Pathway'}</span>
          </div>
          <p className="text-[11px] text-teal-800/80 leading-relaxed">
            {lang === 'et'
              ? 'Tee teadlikke valikuid — oskused avavad uusi uksi.'
              : 'Make confident choices — new skills unlock new doors.'}
          </p>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <Settings className="w-4 h-4 text-slate-500" />
          <span>{t.nav.settings}</span>
        </button>

        <div className="px-3 py-1">
          <p className="text-[11px] text-slate-600 italic">
            {lang === 'et' ? 'Sinu oskused on sinu tulevik.' : 'Your skills are your future.'}
          </p>
        </div>
      </div>
    </aside>
  );
};
