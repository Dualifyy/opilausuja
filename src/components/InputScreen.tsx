import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, ArrowRight, X, Plus, ShieldCheck } from 'lucide-react';
import { Language, UserProfile } from '../types';
import { translations } from '../i18n/translations';
import { COMMON_SKILLS } from '../config';
import { extractTextFromFile } from '../services/pdfService';

interface InputScreenProps {
  lang: Language;
  initialMode?: 'upload' | 'text';
  onContinue: (profile: Partial<UserProfile>) => void;
  onBack: () => void;
  initialInput?: string;
  initialFileName?: string;
}

export const InputScreen: React.FC<InputScreenProps> = ({
  lang,
  initialMode = 'text',
  onContinue,
  onBack,
  initialInput = '',
  initialFileName = '',
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'upload' | 'text'>(initialMode);
  const [rawText, setRawText] = useState(initialInput);
  const [fileName, setFileName] = useState(initialFileName);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setIsParsing(true);
    setParseError(null);
    try {
      const extracted = await extractTextFromFile(file);
      setFileName(file.name);
      setRawText(extracted);
    } catch (err: any) {
      setParseError(err.message || 'Failed to read file');
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleAddSkillChip = (skill: string) => {
    if (!rawText.toLowerCase().includes(skill.toLowerCase())) {
      const addition = rawText ? `, ${skill}` : `Experienced with ${skill}`;
      setRawText((prev) => prev.trim() + addition);
    }
  };


  const handleProceed = () => {
    if (!rawText.trim()) return;
    onContinue({
      id: 'profile-' + Date.now(),
      rawInput: rawText.trim(),
      inputType: activeTab === 'upload' ? 'cv' : 'freeText',
      fileName: fileName || undefined,
      createdAt: new Date().toISOString(),
    });
  };

  const wordCount = rawText.trim() ? rawText.trim().split(/\s+/).length : 0;
  const lineCount = rawText.trim() ? rawText.split('\n').filter(Boolean).length : 0;

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-20 animate-in fade-in duration-300">
      {/* Step Badge */}
      <div className="flex items-center justify-between">
        <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold tracking-wide">
          {t.input.stepBadge}
        </span>
        <button
          onClick={onBack}
          className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
        >
          ← {t.common.back}
        </button>
      </div>

      {/* Screen Title */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t.input.title}
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          {t.input.subtitle}
        </p>
      </div>

      {/* Tabs Switcher: Upload CV vs Describe Yourself */}
      <div className="flex bg-slate-100 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'upload'
              ? 'bg-white text-teal-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UploadCloud className="w-4 h-4 text-teal-600" />
          <span>{t.input.tabUpload}</span>
        </button>

        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === 'text'
              ? 'bg-white text-teal-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4 text-teal-600" />
          <span>{t.input.tabText}</span>
        </button>
      </div>

      {/* Tab 1: Upload CV Content */}
      {activeTab === 'upload' && (
        <div className="space-y-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
              isDragOver
                ? 'border-teal-500 bg-teal-50/60 scale-[1.01]'
                : fileName
                  ? 'border-emerald-400 bg-emerald-50/30'
                  : 'border-slate-300 hover:border-teal-400 hover:bg-teal-50/20 bg-white'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
              accept=".pdf,.txt,.md,text/plain,application/pdf"
              className="hidden"
            />

            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-3 shadow-xs">
              <UploadCloud className="w-6 h-6 stroke-[2]" />
            </div>

            <h4 className="text-sm sm:text-base font-bold text-slate-800">
              {fileName ? fileName : t.input.dropzoneTitle}
            </h4>

            <p className="text-xs text-slate-600 mt-1">
              {fileName
                ? `${lineCount} ${t.input.linesExtracted} (${wordCount} words)`
                : t.input.dropzoneHint}
            </p>

            {isParsing && (
              <div className="mt-3 flex items-center gap-2 text-xs text-teal-700 font-semibold animate-pulse">
                <div className="w-3 h-3 rounded-full border-2 border-teal-600 border-t-transparent animate-spin" />
                <span>{t.input.parsingPdf}</span>
              </div>
            )}

            {fileName && !isParsing && (
              <span className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {t.input.parsedSuccess}
              </span>
            )}
          </div>

          {parseError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{parseError}</span>
            </div>
          )}

          {/* Extracted preview textarea */}
          {rawText && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>{lang === 'et' ? 'Tuvastatud teksti eelvaade:' : 'Extracted content preview:'}</span>
                <button
                  onClick={() => { setRawText(''); setFileName(''); }}
                  className="text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>{t.input.clearBtn}</span>
                </button>
              </div>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                rows={5}
                className="w-full p-3 text-xs text-slate-700 bg-white border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
              />
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Describe Yourself Free Text */}
      {activeTab === 'text' && (
        <div className="space-y-3">
          <div className="relative">
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              rows={7}
              placeholder={t.input.textAreaPlaceholder}
              className="w-full p-4 text-sm text-slate-800 bg-white border border-slate-300 rounded-2xl shadow-xs focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:outline-hidden leading-relaxed resize-y"
            />
            {rawText && (
              <button
                onClick={() => setRawText('')}
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1"
                title={t.input.clearBtn}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>{wordCount} words ({rawText.length} characters)</span>
            <span>{wordCount > 15 ? '✓ Good detail for AI' : 'Add a bit more for optimal matching'}</span>
          </div>

          {/* Quick Add Common Skill Chips */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-slate-700 block">
              {t.input.quickAddTitle}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_SKILLS.map((skill) => (
                <button
                  key={skill}
                  onClick={() => handleAddSkillChip(skill)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 text-xs font-medium border border-slate-200/80 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3 text-slate-400" />
                  <span>{skill}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* Privacy Guarantee Note */}
      <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center gap-2 text-xs text-slate-600">
        <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
        <span>{t.input.privacyNote}</span>
      </div>

      {/* Action Buttons */}
      <div className="pt-2">
        <button
          disabled={!rawText.trim() || isParsing}
          onClick={handleProceed}
          className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer ${
            rawText.trim() && !isParsing
              ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-600/25 active:scale-98'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          <span>{t.input.continueBtn}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
