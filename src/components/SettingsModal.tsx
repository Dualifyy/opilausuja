import React, { useState } from 'react';
import { X, Globe, Cpu, Key, Trash2, CheckCircle2, Shield } from 'lucide-react';
import { Language, AISettings } from '../types';
import { translations } from '../i18n/translations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  viewMode?: 'mobile' | 'desktop';
  onViewModeChange?: (mode: 'mobile' | 'desktop') => void;
  settings: AISettings;
  onSaveSettings: (settings: AISettings) => void;
  onClearData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  lang,
  onLanguageChange,
  settings,
  onSaveSettings,
  onClearData,
}) => {
  const [provider, setProvider] = useState<AISettings['provider']>(settings.provider);
  const [apiKey, setApiKey] = useState(settings.apiKey || '');
  const [showSavedToast, setShowSavedToast] = useState(false);

  if (!isOpen) return null;
  const t = translations[lang];

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 p-5 sm:p-6 space-y-5 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <h3 className="text-base sm:text-lg font-black text-stone-900">
            {t.settings.title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Language */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-teal-700" />
            {t.settings.language}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onLanguageChange('et')}
              className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                lang === 'et'
                  ? 'bg-teal-50 border-teal-600 text-teal-900 ring-2 ring-teal-200'
                  : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
              }`}
            >
              🇪🇪 Eesti keel
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                lang === 'en'
                  ? 'bg-teal-50 border-teal-600 text-teal-900 ring-2 ring-teal-200'
                  : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
              }`}
            >
              🇬🇧 English
            </button>
          </div>
        </div>

        {/* 2. AI Engine Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-teal-700" />
            {t.settings.aiProvider}
          </label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as any)}
            className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-800 focus:ring-2 focus:ring-teal-500"
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
            <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-teal-700" />
              {t.settings.apiKeyLabel}
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-800 focus:ring-2 focus:ring-teal-500"
            />
            <p className="text-[11px] text-stone-500 flex items-center gap-1">
              <Shield className="w-3 h-3 text-teal-700 shrink-0" />
              {t.settings.apiKeyHint}
            </p>
          </div>
        )}

        {/* 3. Clear data button */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
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
            className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {showSavedToast ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Salvestatud!</span>
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
