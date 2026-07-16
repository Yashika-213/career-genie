import type { Request, Response } from 'express';
import * as repo from '../services/repo.js';
import { ApiError } from '../utils/ApiError.js';

export function listProjects(req: Request, res: Response) {
  const { careerSlug } = req.query as { careerSlug?: string };

  if (careerSlug) {
    const career = repo.getCareerBySlug(careerSlug);
    if (!career) throw ApiError.notFound(`Career "${careerSlug}" not found`);
    const projects = repo.getProjectsByCareer(career.id);
    return res.json({ data: projects.map((p) => ({ ...p, careerSlug, careerTitle: career.title })) });
  }

  // All projects across careers, tagged with their career.
  const all = repo.getAllCareers().flatMap((c) =>
    repo.getProjectsByCareer(c.id).map((p) => ({ ...p, careerSlug: c.slug, careerTitle: c.title })),
  );
  res.json({ data: all });
}
