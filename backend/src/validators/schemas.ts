import { z } from 'zod';

export const predictSchema = z.object({
  skills: z.array(z.string()).min(1, 'Select at least one skill'),
  interests: z.array(z.string()).default([]),
  education: z.string().min(1, 'Education is required'),
  domain: z.string().min(1, 'Preferred domain is required'),
});
export type PredictBody = z.infer<typeof predictSchema>;

export const createRoadmapSchema = z.object({
  careerSlug: z.string().min(1, 'careerSlug is required'),
});

export const updateProgressSchema = z.object({
  roadmapId: z.coerce.number().int().positive(),
  status: z.enum(['not_started', 'in_progress', 'completed']),
});

export const skillIdParam = z.object({
  skillId: z.coerce.number().int().positive(),
});

export const roadmapIdParam = z.object({
  id: z.coerce.number().int().positive(),
});

export const roadmapProgressParam = z.object({
  roadmapId: z.coerce.number().int().positive(),
});

export const resourceIdParam = z.object({
  id: z.coerce.number().int().positive(),
});

export const resourcesQuery = z.object({
  skillId: z.coerce.number().int().positive().optional(),
  type: z.enum(['doc', 'video', 'practice']).optional(),
});

export const projectsQuery = z.object({
  careerSlug: z.string().optional(),
});

export const chatSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(500),
  roadmapId: z.coerce.number().int().positive().optional(),
});

export const careerSlugParam = z.object({
  slug: z.string().min(1),
});
