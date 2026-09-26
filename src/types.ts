export interface Skill {
  name: string;
  level?: "beginner" | "intermediate" | "advanced";
  source: "ai_extracted" | "user_added";
  category?: "technical" | "soft" | "tool" | "language";
}

export interface Goal {
  id: string;
  title: string;
  titleEt?: string;
  isCustom: boolean;
  category?: string;
  description?: string;
  popular?: boolean;
  iconName?: string;
}

export interface PathStep {
  order: number;
  title: string;
  why: string;
  estimatedEffort: string;
  suggestedResource: string;
  relatedSkill: string;
  completed: boolean;
  resourceType?: "course" | "project" | "certification" | "reading" | "tool";
  priority?: "high" | "medium" | "low";
  details?: {
    overview: string;
    keyLearningPoints: string[];
    handsOnProject: string;
    recommendedPlatforms: string[];
  };
}

export interface CategoryBreakdown {
  technical: number;
  soft: number;
  languages: number;
}

export interface GapAnalysis {
  id: string;
  profileId: string;
  goalId: string;
  goalTitle: string;
  readinessScore: number; // 0-100
  alreadyHave: Skill[];
  stillNeed: Skill[];
  path: PathStep[];
  createdAt: string;
  categoryBreakdown?: CategoryBreakdown;
  summaryNote?: string;
  encouragingHeadline?: string;
}

export interface UserProfile {
  id: string;
  rawInput: string;
  inputType: "cv" | "freeText";
  fileName?: string;
  extractedSkills: Skill[];
  createdAt: string;
}

export type AppScreen = 
  | "welcome" 
  | "input" 
  | "goal" 
  | "analyzing" 
  | "gap" 
  | "path" 
  | "history" 
  | "compare";

export type Language = "en" | "et";

export interface AISettings {
  provider: "mock" | "gemini" | "anthropic" | "openai";
  apiKey?: string;
  modelName?: string;
}
