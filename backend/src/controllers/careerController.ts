import type { Request, Response } from 'express';
import * as repo from '../services/repo.js';
import { ApiError } from '../utils/ApiError.js';

export function listCareers(_req: Request, res: Response) {
  const careers = repo.getAllCareers().map((c) => ({
    ...c,
    skillCount: repo.getSkillsByCareer(c.id).length,
  }));
  res.json({ data: careers });
}

export function getCareer(req: Request, res: Response) {
  const { slug } = req.params as { slug: string };
  const career = repo.getCareerBySlug(slug);
  if (!career) throw ApiError.notFound(`Career "${slug}" not found`);

  const skills = repo.getSkillsByCareer(career.id).map((s) => ({
    ...s,
    resources: repo.getResourcesBySkill(s.id),
  }));
  const projects = repo.getProjectsByCareer(career.id);

  res.json({ data: { ...career, skills, projects } });
}
