import * as repo from './repo.js';
import { DEMO_USER_ID } from '../config.js';
import { ApiError } from '../utils/ApiError.js';
import type { ResourceRow, SkillStatus } from '../types.js';

export interface RoadmapSkillDto {
  id: number;
  name: string;
  description: string | null;
  order_index: number;
  estimated_hours: number;
  category: string | null;
  status: SkillStatus;
  completed_at: string | null;
  resources: ResourceRow[];
}

export interface RoadmapDetailDto {
  id: number;
  title: string;
  created_at: string;
  career: { id: number; slug: string; title: string; icon: string | null; description: string };
  skills: RoadmapSkillDto[];
  stats: ProgressStats;
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

/** Builds the full roadmap detail (skills + per-skill status + resources + stats). */
export function buildRoadmapDetail(roadmapId: number): RoadmapDetailDto {
  const roadmap = repo.getRoadmapById(roadmapId);
  if (!roadmap) throw ApiError.notFound('Roadmap not found');

  const career = repo.getCareerById(roadmap.career_id);
  if (!career) throw ApiError.notFound('Career for roadmap not found');

  const skills = repo.getSkillsByCareer(career.id);
  const progress = repo.getProgressForRoadmap(roadmapId);
  const progressBySkill = new Map(progress.map((p) => [p.skill_id, p]));

  const skillDtos: RoadmapSkillDto[] = skills.map((s) => {
    const p = progressBySkill.get(s.id);
    return {
      id: s.id,
      name: s.name,
      description: s.description,
      order_index: s.order_index,
      estimated_hours: s.estimated_hours,
      category: s.category,
      status: (p?.status ?? 'not_started') as SkillStatus,
      completed_at: p?.completed_at ?? null,
      resources: repo.getResourcesBySkill(s.id),
    };
  });

  return {
    id: roadmap.id,
    title: roadmap.title,
    created_at: roadmap.created_at,
    career: {
      id: career.id,
      slug: career.slug,
      title: career.title,
      icon: career.icon,
      description: career.description,
    },
    skills: skillDtos,
    stats: computeStats(skillDtos),
  };
}

export function computeStats(skills: RoadmapSkillDto[]): ProgressStats {
  const total = skills.length;
  const completed = skills.filter((s) => s.status === 'completed').length;
  const inProgress = skills.filter((s) => s.status === 'in_progress').length;
  const remaining = total - completed;

  const totalHours = skills.reduce((sum, s) => sum + s.estimated_hours, 0);
  const completedHours = skills
    .filter((s) => s.status === 'completed')
    .reduce((sum, s) => sum + s.estimated_hours, 0);

  const categories = new Map<string, { total: number; completed: number }>();
  for (const s of skills) {
    const key = s.category ?? 'Other';
    const entry = categories.get(key) ?? { total: 0, completed: 0 };
    entry.total += 1;
    if (s.status === 'completed') entry.completed += 1;
    categories.set(key, entry);
  }

  return {
    total,
    completed,
    inProgress,
    remaining,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
    totalHours,
    completedHours,
    remainingHours: totalHours - completedHours,
    byCategory: [...categories.entries()].map(([category, v]) => ({ category, ...v })),
  };
}

/** Creates a roadmap for the demo user for a given career slug (idempotent-ish: reuses existing). */
export function createRoadmapForSlug(slug: string): RoadmapDetailDto {
  const career = repo.getCareerBySlug(slug);
  if (!career) throw ApiError.notFound(`Career "${slug}" not found`);

  // Reuse an existing roadmap for this career if the demo user already has one.
  const existing = repo
    .getRoadmapsForUser(DEMO_USER_ID)
    .find((r) => r.career_slug === slug);

  let roadmapId: number;
  if (existing) {
    roadmapId = existing.id;
  } else {
    roadmapId = repo.createRoadmap(DEMO_USER_ID, career.id, `My ${career.title} Roadmap`);
  }
  repo.seedProgressForRoadmap(roadmapId, career.id);
  return buildRoadmapDetail(roadmapId);
}
