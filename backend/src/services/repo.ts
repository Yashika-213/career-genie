import { getDb, queryAll, queryOne } from '../db/connection.js';
import type {
  CareerRow,
  SkillRow,
  ResourceRow,
  RoadmapRow,
  ProgressRow,
  ProjectRow,
  SkillStatus,
} from '../types.js';

// ---------- Careers ----------
export function getAllCareers(): CareerRow[] {
  return queryAll<CareerRow>('SELECT * FROM careers ORDER BY id');
}

export function getCareerBySlug(slug: string): CareerRow | undefined {
  return queryOne<CareerRow>('SELECT * FROM careers WHERE slug = ?', slug);
}

export function getCareerByTitle(title: string): CareerRow | undefined {
  return queryOne<CareerRow>('SELECT * FROM careers WHERE title = ?', title);
}

export function getCareerById(id: number): CareerRow | undefined {
  return queryOne<CareerRow>('SELECT * FROM careers WHERE id = ?', id);
}

// ---------- Skills ----------
export function getSkillsByCareer(careerId: number): SkillRow[] {
  return queryAll<SkillRow>('SELECT * FROM skills WHERE career_id = ? ORDER BY order_index', careerId);
}

export function getSkillById(id: number): SkillRow | undefined {
  return queryOne<SkillRow>('SELECT * FROM skills WHERE id = ?', id);
}

// ---------- Resources ----------
export function getResourcesBySkill(skillId: number): ResourceRow[] {
  return queryAll<ResourceRow>(
    'SELECT * FROM learning_resources WHERE skill_id = ? ORDER BY id',
    skillId,
  );
}

export function getResourceById(id: number): ResourceRow | undefined {
  return queryOne<ResourceRow>('SELECT * FROM learning_resources WHERE id = ?', id);
}

// ---------- Projects ----------
export function getProjectsByCareer(careerId: number): ProjectRow[] {
  return queryAll<ProjectRow>('SELECT * FROM project_ideas WHERE career_id = ? ORDER BY id', careerId);
}

// ---------- Roadmaps & progress ----------
export interface RoadmapListRow extends RoadmapRow {
  career_slug: string;
  career_title: string;
  icon: string | null;
}

export function getRoadmapsForUser(userId: number): RoadmapListRow[] {
  return queryAll<RoadmapListRow>(
    `SELECT r.*, c.slug AS career_slug, c.title AS career_title, c.icon AS icon
     FROM roadmaps r JOIN careers c ON c.id = r.career_id
     WHERE r.user_id = ? ORDER BY r.created_at DESC`,
    userId,
  );
}

export function getRoadmapById(id: number): RoadmapRow | undefined {
  return queryOne<RoadmapRow>('SELECT * FROM roadmaps WHERE id = ?', id);
}

export function createRoadmap(userId: number, careerId: number, title: string): number {
  const res = getDb()
    .prepare('INSERT INTO roadmaps (user_id, career_id, title) VALUES (?, ?, ?)')
    .run(userId, careerId, title);
  return Number(res.lastInsertRowid);
}

export function seedProgressForRoadmap(roadmapId: number, careerId: number): void {
  const skills = getSkillsByCareer(careerId);
  const insert = getDb().prepare(
    `INSERT OR IGNORE INTO progress (roadmap_id, skill_id, status) VALUES (?, ?, 'not_started')`,
  );
  for (const skill of skills) insert.run(roadmapId, skill.id);
}

export function getProgressForRoadmap(roadmapId: number): ProgressRow[] {
  return queryAll<ProgressRow>('SELECT * FROM progress WHERE roadmap_id = ?', roadmapId);
}

export function getProgressRow(roadmapId: number, skillId: number): ProgressRow | undefined {
  return queryOne<ProgressRow>(
    'SELECT * FROM progress WHERE roadmap_id = ? AND skill_id = ?',
    roadmapId,
    skillId,
  );
}

export function upsertProgress(roadmapId: number, skillId: number, status: SkillStatus): void {
  const completedAt = status === 'completed' ? new Date().toISOString() : null;
  getDb()
    .prepare(
      `INSERT INTO progress (roadmap_id, skill_id, status, completed_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(roadmap_id, skill_id)
       DO UPDATE SET status = excluded.status, completed_at = excluded.completed_at`,
    )
    .run(roadmapId, skillId, status, completedAt);
}

// ---------- Favorites ----------
export function getFavoriteResourceIds(userId: number): Set<number> {
  const rows = queryAll<{ resource_id: number }>(
    'SELECT resource_id FROM favorites WHERE user_id = ?',
    userId,
  );
  return new Set(rows.map((r) => r.resource_id));
}

export function toggleFavorite(userId: number, resourceId: number): boolean {
  const db = getDb();
  const existing = db
    .prepare('SELECT id FROM favorites WHERE user_id = ? AND resource_id = ?')
    .get(userId, resourceId);
  if (existing) {
    db.prepare('DELETE FROM favorites WHERE user_id = ? AND resource_id = ?').run(userId, resourceId);
    return false; // now not favorite
  }
  db.prepare('INSERT INTO favorites (user_id, resource_id) VALUES (?, ?)').run(userId, resourceId);
  return true; // now favorite
}

// ---------- Recommendations audit ----------
export function saveRecommendation(
  userId: number,
  career: string,
  confidence: number,
  input: unknown,
): void {
  getDb()
    .prepare(
      `INSERT INTO career_recommendations (user_id, predicted_career, confidence, input_json)
       VALUES (?, ?, ?, ?)`,
    )
    .run(userId, career, confidence, JSON.stringify(input));
}
