// DB row shapes (mirror schema.sql) and API DTOs.

export interface CareerRow {
  id: number;
  slug: string;
  title: string;
  description: string;
  avg_salary: string | null;
  demand_level: string | null;
  icon: string | null;
}

export interface SkillRow {
  id: number;
  career_id: number;
  name: string;
  description: string | null;
  order_index: number;
  estimated_hours: number;
  category: string | null;
}

export interface ResourceRow {
  id: number;
  skill_id: number;
  type: 'doc' | 'video' | 'practice';
  title: string;
  url: string;
  is_free: number;
}

export interface RoadmapRow {
  id: number;
  user_id: number;
  career_id: number;
  title: string;
  created_at: string;
}

export interface ProgressRow {
  id: number;
  roadmap_id: number;
  skill_id: number;
  status: 'not_started' | 'in_progress' | 'completed';
  completed_at: string | null;
}

export interface ProjectRow {
  id: number;
  career_id: number;
  title: string;
  description: string;
  difficulty: string;
}

export type SkillStatus = ProgressRow['status'];
