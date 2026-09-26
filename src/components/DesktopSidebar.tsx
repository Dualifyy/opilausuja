import React from 'react';
import { Home, FileText, CheckCircle2, MapPin, History, Settings, Compass } from 'lucide-react';
import { AppScreen, Language } from '../types';
import { translations } from '../i18n/translations';

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
    <aside className="w-64 bg-white border-r border-stone-200/80 flex flex-col justify-between shrink-0 h-full min-h-[calc(100vh-3.5rem)] p-4 select-none">
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
                      ? 'text-stone-300 cursor-not-allowed'
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-700' : 'text-stone-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className="px-1.5 py-0.5 rounded-full bg-teal-700 text-white text-[10px] font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Supportive encouragement card */}
        <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200/70 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <Compass className="w-3.5 h-3.5 text-amber-700" />
            <span>{lang === 'et' ? 'Sinu arengutee' : 'Your Journey'}</span>
          </div>
          <p className="text-[11px] text-amber-800/90 leading-relaxed">
            {lang === 'et'
              ? 'Iga uus oskus viib sind lähemale soovitud eesmärgile. Liigu samm-sammult omas tempos.'
              : 'Every new skill brings you closer to your goals. Take it one step at a time.'}
          </p>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="pt-4 border-t border-stone-100 space-y-3">
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-50 hover:text-stone-900 transition-colors cursor-pointer"
        >
          <Settings className="w-4 h-4 text-stone-500" />
          <span>{t.nav.settings}</span>
        </button>

        <div className="px-3 py-1">
          <p className="text-[11px] text-stone-500">
            {lang === 'et' ? 'Sinu oskused on sinu tugevus.' : 'Your skills are your strength.'}
          </p>
        </div>
      </div>
    </aside>
  );
};
