// Mirrors the backend API response DTOs.

export type SkillStatus = 'not_started' | 'in_progress' | 'completed';
export type ResourceType = 'doc' | 'video' | 'practice';

export interface Career {
  id: number;
  slug: string;
  title: string;
  description: string;
  avg_salary: string | null;
  demand_level: string | null;
  icon: string | null;
  skillCount?: number;
}

export interface Resource {
  id: number;
  skill_id: number;
  type: ResourceType;
  title: string;
  url: string;
  is_free: boolean | number;
  favorite?: boolean;
  skill_name?: string;
  career_slug?: string;
  career_title?: string;
}

export interface Skill {
  id: number;
  career_id: number;
  name: string;
  description: string | null;
  order_index: number;
  estimated_hours: number;
  category: string | null;
  resources?: Resource[];
}

export interface Project {
  id: number;
  career_id: number;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  careerSlug?: string;
  careerTitle?: string;
}

export interface CareerDetail extends Career {
  skills: Skill[];
  projects: Project[];
}

export interface RoadmapSkill {
  id: number;
  name: string;
  description: string | null;
  order_index: number;
  estimated_hours: number;
  category: string | null;
  status: SkillStatus;
  completed_at: string | null;
  resources: Resource[];
}

export interface ProgressStats {
  total: number;
  completed: number;
  inProgress: number;
  remaining: number;
  percent: number;
  totalHours: number;
  completedHours: number;
  remainingHours: number;
  byCategory: { category: string; total: number; completed: number }[];
}

export interface RoadmapDetail {
  id: number;
  title: string;
  created_at: string;
  career: { id: number; slug: string; title: string; icon: string | null; description: string };
  skills: RoadmapSkill[];
  stats: ProgressStats;
}

export interface RoadmapSummary {
  id: number;
  title: string;
  created_at: string;
  career: { slug: string; title: string; icon: string | null };
  percent: number;
  total: number;
  completed: number;
}

export interface PredictionAlternative {
  title: string;
  probability: number;
  slug: string | null;
  icon: string | null;
}

export interface PredictionResult {
  career: string;
  confidence: number;
  probabilities: Record<string, number>;
  alternatives: PredictionAlternative[];
  careerDetails: Career | null;
}

export interface PredictInput {
  skills: string[];
  interests: string[];
  education: string;
  domain: string;
}

export type ChatIntent = string;

export interface ChatResponse {
  reply: string;
  intent: ChatIntent;
  data?: unknown;
}

export interface ProgressSummary extends ProgressStats {
  roadmapId: number;
  title: string;
  career: RoadmapDetail['career'];
}
