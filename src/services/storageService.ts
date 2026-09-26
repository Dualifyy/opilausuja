import { GapAnalysis, Skill, AISettings, Language } from '../types';

const STORAGE_KEYS = {
  HISTORY: 'opilausuja_history_v1',
  ACTIVE_ID: 'opilausuja_active_id',
  SETTINGS: 'opilausuja_settings_v1',
  LANGUAGE: 'opilausuja_language_v1',
  VIEW_MODE: 'opilausuja_view_mode_v1',
};

export const storageService = {
  getAnalysisHistory(): GapAnalysis[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (!data) return [];
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load history:', e);
      return [];
    }
  },

  saveAnalysis(analysis: GapAnalysis): void {
    try {
      const history = this.getAnalysisHistory();
      const existingIdx = history.findIndex(h => h.id === analysis.id);
      if (existingIdx >= 0) {
        history[existingIdx] = analysis;
      } else {
        history.unshift(analysis);
      }
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ID, analysis.id);
    } catch (e) {
      console.error('Failed to save analysis:', e);
    }
  },

  getLatestAnalysis(): GapAnalysis | null {
    try {
      const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_ID);
      const history = this.getAnalysisHistory();
      if (activeId) {
        const found = history.find(h => h.id === activeId);
        if (found) return found;
      }
      return history.length > 0 ? history[0] : null;
    } catch (e) {
      return null;
    }
  },

  getAnalysisById(id: string): GapAnalysis | null {
    const history = this.getAnalysisHistory();
    return history.find(h => h.id === id) || null;
  },

  deleteAnalysis(id: string): void {
    try {
      const history = this.getAnalysisHistory().filter(h => h.id !== id);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to delete analysis:', e);
    }
  },

  updateStepCompletion(analysisId: string, stepOrder: number, completed: boolean): GapAnalysis | null {
    try {
      const history = this.getAnalysisHistory();
      const analysis = history.find(h => h.id === analysisId);
      if (!analysis) return null;

      const step = analysis.path.find(s => s.order === stepOrder);
      if (step) {
        step.completed = completed;
      }

      // Recalculate dynamic readiness score based on steps completed
      const totalSteps = analysis.path.length;
      const completedSteps = analysis.path.filter(s => s.completed).length;
      if (totalSteps > 0) {
        const baseScore = analysis.readinessScore;
        const remainingGap = 100 - baseScore;
        const boost = Math.round((completedSteps / totalSteps) * remainingGap);
        // Store boosted score without exceeding 100
        analysis.readinessScore = Math.min(100, baseScore + boost);
      }

      this.saveAnalysis(analysis);
      return analysis;
    } catch (e) {
      console.error('Failed to update step completion:', e);
      return null;
    }
  },

  updateSkills(analysisId: string, alreadyHave: Skill[], stillNeed: Skill[]): GapAnalysis | null {
    try {
      const history = this.getAnalysisHistory();
      const analysis = history.find(h => h.id === analysisId);
      if (!analysis) return null;

      analysis.alreadyHave = alreadyHave;
      analysis.stillNeed = stillNeed;

      // Recalculate match ratio
      const total = alreadyHave.length + stillNeed.length;
      if (total > 0) {
        analysis.readinessScore = Math.round((alreadyHave.length / total) * 100);
      }

      this.saveAnalysis(analysis);
      return analysis;
    } catch (e) {
      console.error('Failed to update skills:', e);
      return null;
    }
  },

  getSettings(): AISettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) return { provider: 'mock' };
      return JSON.parse(data);
    } catch (e) {
      return { provider: 'mock' };
    }
  },

  saveSettings(settings: AISettings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  },

  getLanguage(): Language {
    try {
      const lang = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as Language;
      return lang === 'et' ? 'et' : 'et'; // Default to Estonian as requested in mockup!
    } catch (e) {
      return 'et';
    }
  },

  saveLanguage(lang: Language): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    } catch (e) {
      console.error('Failed to save language:', e);
    }
  },

  getViewMode(): 'mobile' | 'desktop' {
    try {
      const mode = localStorage.getItem(STORAGE_KEYS.VIEW_MODE);
      return mode === 'mobile' ? 'mobile' : 'desktop';
    } catch (e) {
      return 'desktop';
    }
  },

  saveViewMode(mode: 'mobile' | 'desktop'): void {
    try {
      localStorage.setItem(STORAGE_KEYS.VIEW_MODE, mode);
    } catch (e) {
      console.error('Failed to save view mode:', e);
    }
  },

  clearAllData(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_ID);
    } catch (e) {
      console.error('Failed to clear data:', e);
    }
  }
};
