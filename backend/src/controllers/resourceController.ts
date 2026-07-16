import type { Request, Response } from 'express';
import { queryAll } from '../db/connection.js';
import * as repo from '../services/repo.js';
import { DEMO_USER_ID } from '../config.js';
import { ApiError } from '../utils/ApiError.js';
import type { ResourceRow } from '../types.js';

interface JoinedResource extends ResourceRow {
  skill_name: string;
  career_slug: string;
  career_title: string;
}

function decorate(rows: JoinedResource[]) {
  const favs = repo.getFavoriteResourceIds(DEMO_USER_ID);
  return rows.map((r) => ({ ...r, is_free: !!r.is_free, favorite: favs.has(r.id) }));
}

export function listResources(req: Request, res: Response) {
  const { skillId, type } = req.query as unknown as { skillId?: number; type?: string };

  let sql = `
    SELECT r.*, s.name AS skill_name, c.slug AS career_slug, c.title AS career_title
    FROM learning_resources r
    JOIN skills s ON s.id = r.skill_id
    JOIN careers c ON c.id = s.career_id
    WHERE 1 = 1`;
  const params: unknown[] = [];
  if (skillId) {
    sql += ' AND r.skill_id = ?';
    params.push(skillId);
  }
  if (type) {
    sql += ' AND r.type = ?';
    params.push(type);
  }
  sql += ' ORDER BY c.id, s.order_index, r.id';

  const rows = queryAll<JoinedResource>(sql, ...params);
  res.json({ data: decorate(rows) });
}

export function listFavorites(_req: Request, res: Response) {
  const rows = queryAll<JoinedResource>(
    `SELECT r.*, s.name AS skill_name, c.slug AS career_slug, c.title AS career_title
     FROM favorites f
     JOIN learning_resources r ON r.id = f.resource_id
     JOIN skills s ON s.id = r.skill_id
     JOIN careers c ON c.id = s.career_id
     WHERE f.user_id = ?
     ORDER BY f.created_at DESC`,
    DEMO_USER_ID,
  );
  res.json({ data: decorate(rows) });
}

export function toggleFavorite(req: Request, res: Response) {
  const { id } = req.params as unknown as { id: number };
  const resource = repo.getResourceById(id);
  if (!resource) throw ApiError.notFound('Resource not found');
  const isFavorite = repo.toggleFavorite(DEMO_USER_ID, id);
  res.json({ data: { resourceId: id, favorite: isFavorite } });
}
