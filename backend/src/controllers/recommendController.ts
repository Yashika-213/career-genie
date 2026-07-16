import type { Request, Response } from 'express';
import { predictCareer } from '../services/mlService.js';
import * as repo from '../services/repo.js';
import { DEMO_USER_ID } from '../config.js';
import type { PredictBody } from '../validators/schemas.js';

export async function predict(req: Request, res: Response) {
  const body = req.body as PredictBody;

  const result = await predictCareer({
    skills: body.skills,
    interests: body.interests ?? [],
    education: body.education,
    domain: body.domain,
  });

  // Map predicted title -> career details (for the roadmap CTA).
  const career = repo.getCareerByTitle(result.career);

  repo.saveRecommendation(DEMO_USER_ID, result.career, result.confidence, body);

  // Top-3 alternatives for a richer UI.
  const alternatives = Object.entries(result.probabilities)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([title, probability]) => {
      const c = repo.getCareerByTitle(title);
      return { title, probability, slug: c?.slug ?? null, icon: c?.icon ?? null };
    });

  res.json({
    data: {
      career: result.career,
      confidence: result.confidence,
      probabilities: result.probabilities,
      alternatives,
      careerDetails: career
        ? {
            id: career.id,
            slug: career.slug,
            title: career.title,
            description: career.description,
            icon: career.icon,
            avg_salary: career.avg_salary,
            demand_level: career.demand_level,
          }
        : null,
    },
  });
}
