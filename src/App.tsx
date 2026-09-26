import React, { useState } from 'react';
import { AppScreen, Language, GapAnalysis, PathStep, UserProfile, Goal, AISettings, Skill } from './types';
import { storageService } from './services/storageService';
import { analyzeProfileWithAI } from './services/aiService';
import { DemoPreset } from './config';

import { Header } from './components/Header';
import { StepArc } from './components/StepArc';
import { BottomNav } from './components/BottomNav';
import { DesktopSidebar } from './components/DesktopSidebar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { InputScreen } from './components/InputScreen';
import { GoalScreen } from './components/GoalScreen';
import { AnalyzingScreen } from './components/AnalyzingScreen';
import { SkillGapScreen } from './components/SkillGapScreen';
import { LearningPathScreen } from './components/LearningPathScreen';
import { StepDetailModal } from './components/StepDetailModal';
import { HistoryScreen } from './components/HistoryScreen';
import { SettingsModal } from './components/SettingsModal';
import { ExportModal } from './components/ExportModal';

export const App: React.FC = () => {
  // Core state
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('welcome');
  const [lang, setLang] = useState<Language>(() => storageService.getLanguage());
  const [settings, setSettings] = useState<AISettings>(() => storageService.getSettings());
  const [history, setHistory] = useState<GapAnalysis[]>(() => storageService.getAnalysisHistory());
  const [activeAnalysis, setActiveAnalysis] = useState<GapAnalysis | null>(() => storageService.getLatestAnalysis());

  // Input & Workflow Draft
  const [draftInput, setDraftInput] = useState<string>('');
  const [draftFileName, setDraftFileName] = useState<string>('');
  const [draftMode, setDraftMode] = useState<'upload' | 'text'>('text');
  const [selectedGoalTitle, setSelectedGoalTitle] = useState<string>('');

  // Modals & Async States
  const [selectedStepDetail, setSelectedStepDetail] = useState<PathStep | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [_isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingError, setAnalyzingError] = useState<string | null>(null);

  // Sync language changes to localStorage
  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    storageService.saveLanguage(newLang);
  };

  const handleSaveSettings = (newSettings: AISettings) => {
    setSettings(newSettings);
    storageService.saveSettings(newSettings);
  };

  const handleClearData = () => {
    storageService.clearAllData();
    setHistory([]);
    setActiveAnalysis(null);
    setDraftInput('');
    setDraftFileName('');
    setCurrentScreen('welcome');
  };

  // Workflow Handlers
  const handleStartFromWelcome = (initialTab: 'upload' | 'text' = 'text') => {
    setDraftMode(initialTab);
    setCurrentScreen('input');
  };

  const handleSelectPreset = (preset: DemoPreset) => {
    setDraftInput(preset.input);
    setDraftFileName(preset.fileName || '');
    setDraftMode(preset.fileName ? 'upload' : 'text');
    setSelectedGoalTitle(preset.goalTitle);
    runAnalysis(preset.input, preset.goalTitle);
  };

  const handleInputContinue = (profile: Partial<UserProfile>) => {
    if (profile.rawInput) {
      setDraftInput(profile.rawInput);
    }
    if (profile.fileName) {
      setDraftFileName(profile.fileName);
    }
    setCurrentScreen('goal');
  };

  const handleGoalSelect = (goal: Goal) => {
    const title = lang === 'et' && goal.titleEt ? goal.titleEt : goal.title;
    setSelectedGoalTitle(title);
    runAnalysis(draftInput, title);
  };

  const runAnalysis = async (input: string, goalTitle: string) => {
    setIsAnalyzing(true);
    setAnalyzingError(null);
    setCurrentScreen('analyzing');

    try {
      const result = await analyzeProfileWithAI(input, goalTitle, settings, lang);
      setActiveAnalysis(result);
      storageService.saveAnalysis(result);
      setHistory(storageService.getAnalysisHistory());
      setCurrentScreen('gap');
    } catch (err: any) {
      setAnalyzingError(err.message || 'Analysis failed. Please check network connection or try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleToggleStepCompletion = (stepOrder: number, completed: boolean) => {
    if (!activeAnalysis) return;
    const updated = storageService.updateStepCompletion(activeAnalysis.id, stepOrder, completed);
    if (updated) {
      setActiveAnalysis({ ...updated });
      setHistory(storageService.getAnalysisHistory());
      // Also update modal if open
      if (selectedStepDetail && selectedStepDetail.order === stepOrder) {
        setSelectedStepDetail({ ...selectedStepDetail, completed });
      }
    }
  };

  const handleUpdateSkills = (alreadyHave: Skill[], stillNeed: Skill[]) => {
    if (!activeAnalysis) return;
    const updated = storageService.updateSkills(activeAnalysis.id, alreadyHave, stillNeed);
    if (updated) {
      setActiveAnalysis({ ...updated });
      setHistory(storageService.getAnalysisHistory());
    }
  };

  const handleDeleteAnalysis = (id: string) => {
    storageService.deleteAnalysis(id);
    const updatedHistory = storageService.getAnalysisHistory();
    setHistory(updatedHistory);
    if (activeAnalysis?.id === id) {
      setActiveAnalysis(updatedHistory[0] || null);
    }
  };

  // Step Arc step calculation
  const getStepNumber = (): number => {
    switch (currentScreen) {
      case 'input': return 1;
      case 'goal': return 2;
      case 'analyzing': return 3;
      case 'gap': return 3;
      case 'path': return 4;
      default: return 1;
    }
  };

  const handleStepArcClick = (stepNum: number) => {
    if (stepNum === 1) setCurrentScreen('input');
    else if (stepNum === 2) setCurrentScreen('goal');
    else if (stepNum === 3 && activeAnalysis) setCurrentScreen('gap');
    else if (stepNum === 4 && activeAnalysis) setCurrentScreen('path');
  };

  // Screen Content Renderer
  const renderScreenContent = () => {
    switch (currentScreen) {
      case 'welcome':
        return (
          <WelcomeScreen
            lang={lang}
            onStart={handleStartFromWelcome}
            onSelectPreset={handleSelectPreset}
            latestAnalysis={activeAnalysis}
            onResumeLatest={() => setCurrentScreen('path')}
          />
        );

      case 'input':
        return (
          <InputScreen
            lang={lang}
            initialMode={draftMode}
            onContinue={handleInputContinue}
            onBack={() => setCurrentScreen('welcome')}
            initialInput={draftInput}
            initialFileName={draftFileName}
          />
        );

      case 'goal':
        return (
          <GoalScreen
            lang={lang}
            onSelectGoal={handleGoalSelect}
            onBack={() => setCurrentScreen('input')}
            initialGoalTitle={selectedGoalTitle}
          />
        );

      case 'analyzing':
        return (
          <AnalyzingScreen
            lang={lang}
            goalTitle={selectedGoalTitle}
            error={analyzingError}
            onRetry={() => runAnalysis(draftInput, selectedGoalTitle)}
          />
        );

      case 'gap':
        return activeAnalysis ? (
          <SkillGapScreen
            lang={lang}
            analysis={activeAnalysis}
            onViewPath={() => setCurrentScreen('path')}
            onUpdateSkills={handleUpdateSkills}
            onBack={() => setCurrentScreen('goal')}
          />
        ) : (
          <WelcomeScreen
            lang={lang}
            onStart={handleStartFromWelcome}
            onSelectPreset={handleSelectPreset}
            latestAnalysis={null}
            onResumeLatest={() => {}}
          />
        );

      case 'path':
        return activeAnalysis ? (
          <LearningPathScreen
            lang={lang}
            analysis={activeAnalysis}
            onToggleStep={handleToggleStepCompletion}
            onSelectStepDetail={(step) => setSelectedStepDetail(step)}
            onBackToGap={() => setCurrentScreen('gap')}
            onCompareWithAnother={() => setCurrentScreen('history')}
            onExport={() => setIsExportOpen(true)}
          />
        ) : (
          <WelcomeScreen
            lang={lang}
            onStart={handleStartFromWelcome}
            onSelectPreset={handleSelectPreset}
            latestAnalysis={null}
            onResumeLatest={() => {}}
          />
        );

      case 'history':
        return (
          <HistoryScreen
            lang={lang}
            history={history}
            onSelectAnalysis={(analysis) => {
              setActiveAnalysis(analysis);
              setCurrentScreen('path');
            }}
            onDeleteAnalysis={handleDeleteAnalysis}
            onStartNew={() => {
              setDraftInput('');
              setDraftFileName('');
              setCurrentScreen('input');
            }}
          />
        );

      default:
        return null;
    }
  };

  const showStepArc = ['input', 'goal', 'analyzing', 'gap', 'path'].includes(currentScreen);

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col text-stone-900 font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Top Application Header */}
      <Header
        currentScreen={currentScreen}
        lang={lang}
        onLanguageChange={handleLanguageChange}
        onOpenHistory={() => setCurrentScreen('history')}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onNavigateHome={() => setCurrentScreen('welcome')}
        onStartNew={() => {
          setDraftInput('');
          setDraftFileName('');
          setCurrentScreen('input');
        }}
        savedCount={history.length}
      />

      {/* Main Content Layout Container */}
      <div className="flex-1 flex min-h-0">
        {/* Left Desktop Sidebar: STICKY so it scrolls along with user and does not stay behind! */}
        <div className="hidden md:block shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
          <DesktopSidebar
            currentScreen={currentScreen}
            onNavigate={(screen) => setCurrentScreen(screen)}
            lang={lang}
            hasActiveAnalysis={!!activeAnalysis}
            onOpenSettings={() => setIsSettingsOpen(true)}
            savedCount={history.length}
          />
        </div>

        {/* Right Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {showStepArc && (
            <StepArc
              currentStep={getStepNumber()}
              lang={lang}
              onStepClick={handleStepArcClick}
            />
          )}

          <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 md:p-8 pb-24 md:pb-12">
            {renderScreenContent()}
          </main>
        </div>
      </div>

      {/* Mobile Bottom Navigation: Docked at bottom for small screens */}
      <div className="md:hidden">
        <BottomNav
          currentScreen={currentScreen}
          onNavigate={(screen) => setCurrentScreen(screen)}
          lang={lang}
          hasActiveAnalysis={!!activeAnalysis}
        />
      </div>

      {/* Step Detail Modal */}
      <StepDetailModal
        step={selectedStepDetail}
        lang={lang}
        onClose={() => setSelectedStepDetail(null)}
        onToggleComplete={handleToggleStepCompletion}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        lang={lang}
        onLanguageChange={handleLanguageChange}
        viewMode="desktop"
        onViewModeChange={() => {}}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        onClearData={handleClearData}
      />

      {/* Export / Share Modal */}
      {activeAnalysis && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          analysis={activeAnalysis}
          lang={lang}
        />
      )}
    </div>
  );
};

export default App;
