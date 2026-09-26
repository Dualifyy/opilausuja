import React from 'react';
import { Home, FileText, CheckCircle2, MapPin, History } from 'lucide-react';
import { AppScreen, Language } from '../types';
import { translations } from '../i18n/translations';

interface BottomNavProps {
  currentScreen: AppScreen;
  onNavigate: (screen: AppScreen) => void;
  lang: Language;
  hasActiveAnalysis: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  lang,
  hasActiveAnalysis,
}) => {
  const t = translations[lang];

  const items = [
    {
      screen: 'welcome' as AppScreen,
      label: t.nav.home,
      icon: Home,
    },
    {
      screen: 'input' as AppScreen,
      label: lang === 'et' ? 'Minu CV' : 'My Skills',
      icon: FileText,
    },
    {
      screen: 'gap' as AppScreen,
      label: lang === 'et' ? 'Võrdlus' : 'Skill Gap',
      icon: CheckCircle2,
      disabled: !hasActiveAnalysis,
    },
    {
      screen: 'path' as AppScreen,
      label: lang === 'et' ? 'Õpitee' : 'Roadmap',
      icon: MapPin,
      disabled: !hasActiveAnalysis,
    },
    {
      screen: 'history' as AppScreen,
      label: t.nav.history,
      icon: History,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-1.5 z-40 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.screen;
          const isDisabled = item.disabled;

          return (
            <button
              key={item.screen}
              disabled={isDisabled}
              onClick={() => onNavigate(item.screen)}
              className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
                isActive
                  ? 'text-teal-700 font-semibold scale-105'
                  : isDisabled
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5] text-teal-600' : 'stroke-[1.8]'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
