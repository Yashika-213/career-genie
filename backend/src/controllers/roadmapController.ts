import type { Request, Response } from 'express';
import * as repo from '../services/repo.js';
import { buildRoadmapDetail, createRoadmapForSlug } from '../services/roadmapService.js';
import { DEMO_USER_ID } from '../config.js';

export function listRoadmaps(_req: Request, res: Response) {
  const roadmaps = repo.getRoadmapsForUser(DEMO_USER_ID).map((r) => {
    const detail = buildRoadmapDetail(r.id);
    return {
      id: r.id,
      title: r.title,
      created_at: r.created_at,
      career: { slug: r.career_slug, title: r.career_title, icon: r.icon },
      percent: detail.stats.percent,
      total: detail.stats.total,
      completed: detail.stats.completed,
    };
  });
  res.json({ data: roadmaps });
}

export function createRoadmap(req: Request, res: Response) {
  const { careerSlug } = req.body as { careerSlug: string };
  const detail = createRoadmapForSlug(careerSlug);
  res.status(201).json({ data: detail });
}

export function getRoadmap(req: Request, res: Response) {
  const { id } = req.params as unknown as { id: number };
  const detail = buildRoadmapDetail(id);
  res.json({ data: detail });
}
