import React, { useState } from 'react';
import { X, Globe, Cpu, Key, Monitor, Smartphone, Trash2, CheckCircle2, Shield } from 'lucide-react';
import { Language, AISettings } from '../types';
import { translations } from '../i18n/translations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  viewMode: 'mobile' | 'desktop';
  onViewModeChange: (mode: 'mobile' | 'desktop') => void;
  settings: AISettings;
  onSaveSettings: (settings: AISettings) => void;
  onClearData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  lang,
  onLanguageChange,
  viewMode,
  onViewModeChange,
  settings,
  onSaveSettings,
  onClearData,
}) => {
  if (!isOpen) return null;
  const t = translations[lang];

  const [provider, setProvider] = useState<AISettings['provider']>(settings.provider);
  const [apiKey, setApiKey] = useState(settings.apiKey || '');
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSave = () => {
    onSaveSettings({
      provider,
      apiKey: apiKey.trim() || undefined,
    });
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
      onClose();
    }, 600);
  };

  const handleConfirmClear = () => {
    if (window.confirm(t.settings.resetConfirm)) {
      onClearData();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 p-5 sm:p-6 space-y-5 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base sm:text-lg font-black text-slate-900">
            {t.settings.title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Language */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-teal-600" />
            {t.settings.language}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onLanguageChange('et')}
              className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                lang === 'et'
                  ? 'bg-teal-50 border-teal-500 text-teal-900 ring-2 ring-teal-200'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              🇪🇪 Eesti keel
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                lang === 'en'
                  ? 'bg-teal-50 border-teal-500 text-teal-900 ring-2 ring-teal-200'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              🇬🇧 English
            </button>
          </div>
        </div>

        {/* 2. Display View Mode */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Monitor className="w-4 h-4 text-teal-600" />
            {t.settings.viewMode}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onViewModeChange('desktop')}
              className={`py-2 px-2.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'desktop'
                  ? 'bg-teal-50 border-teal-500 text-teal-900 ring-2 ring-teal-200'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>{t.settings.viewModeDesktop}</span>
            </button>
            <button
              onClick={() => onViewModeChange('mobile')}
              className={`py-2 px-2.5 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'mobile'
                  ? 'bg-teal-50 border-teal-500 text-teal-900 ring-2 ring-teal-200'
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>{t.settings.viewModeMobile}</span>
            </button>
          </div>
        </div>

        {/* 3. AI Engine Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-teal-600" />
            {t.settings.aiProvider}
          </label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as any)}
            className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-teal-500"
          >
            <option value="mock">{t.settings.mockMode}</option>
            <option value="gemini">{t.settings.geminiMode}</option>
            <option value="anthropic">{t.settings.anthropicMode}</option>
            <option value="openai">{t.settings.openaiMode}</option>
          </select>
        </div>

        {/* API Key Input (if external provider chosen) */}
        {provider !== 'mock' && (
          <div className="space-y-1.5 animate-in fade-in">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-teal-600" />
              {t.settings.apiKeyLabel}
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:ring-2 focus:ring-teal-500"
            />
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <Shield className="w-3 h-3 text-teal-600 shrink-0" />
              {t.settings.apiKeyHint}
            </p>
          </div>
        )}

        {/* 4. Clear data button */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handleConfirmClear}
            className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.settings.resetData}</span>
          </button>
        </div>

        {/* Save button */}
        <div className="pt-1">
          <button
            onClick={handleSave}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {showSavedToast ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Saved!</span>
              </>
            ) : (
              <span>{t.settings.saveBtn}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
