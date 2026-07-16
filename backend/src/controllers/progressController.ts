import type { Request, Response } from 'express';
import * as repo from '../services/repo.js';
import { buildRoadmapDetail } from '../services/roadmapService.js';
import { ApiError } from '../utils/ApiError.js';
import type { SkillStatus } from '../types.js';

export function updateProgress(req: Request, res: Response) {
  const { skillId } = req.params as unknown as { skillId: number };
  const { roadmapId, status } = req.body as { roadmapId: number; status: SkillStatus };

  const roadmap = repo.getRoadmapById(roadmapId);
  if (!roadmap) throw ApiError.notFound('Roadmap not found');

  const skill = repo.getSkillById(skillId);
  if (!skill) throw ApiError.notFound('Skill not found');
  if (skill.career_id !== roadmap.career_id) {
    throw ApiError.badRequest('Skill does not belong to this roadmap');
  }

  repo.upsertProgress(roadmapId, skillId, status);

  const detail = buildRoadmapDetail(roadmapId);
  res.json({
    data: {
      skillId,
      status,
      stats: detail.stats,
    },
  });
}

export function getProgress(req: Request, res: Response) {
  const { roadmapId } = req.params as unknown as { roadmapId: number };
  const detail = buildRoadmapDetail(roadmapId);
  res.json({
    data: {
      roadmapId,
      career: detail.career,
      title: detail.title,
      ...detail.stats,
    },
  });
}
