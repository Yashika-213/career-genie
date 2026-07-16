import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import * as career from '../controllers/careerController.js';
import * as recommend from '../controllers/recommendController.js';
import * as roadmap from '../controllers/roadmapController.js';
import * as progress from '../controllers/progressController.js';
import * as resource from '../controllers/resourceController.js';
import * as project from '../controllers/projectController.js';
import * as chat from '../controllers/chatController.js';
import {
  predictSchema,
  createRoadmapSchema,
  updateProgressSchema,
  skillIdParam,
  roadmapIdParam,
  roadmapProgressParam,
  resourceIdParam,
  resourcesQuery,
  projectsQuery,
  chatSchema,
  careerSlugParam,
} from '../validators/schemas.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ data: { status: 'ok', service: 'careergenie-backend' } });
});

// Careers
router.get('/careers', asyncHandler(career.listCareers));
router.get('/careers/:slug', validate(careerSlugParam, 'params'), asyncHandler(career.getCareer));

// Recommendation (ML)
router.post('/predict', validate(predictSchema), asyncHandler(recommend.predict));

// Roadmaps
router.get('/roadmaps', asyncHandler(roadmap.listRoadmaps));
router.post('/roadmaps', validate(createRoadmapSchema), asyncHandler(roadmap.createRoadmap));
router.get('/roadmaps/:id', validate(roadmapIdParam, 'params'), asyncHandler(roadmap.getRoadmap));

// Progress
router.patch(
  '/progress/:skillId',
  validate(skillIdParam, 'params'),
  validate(updateProgressSchema),
  asyncHandler(progress.updateProgress),
);
router.get(
  '/progress/:roadmapId',
  validate(roadmapProgressParam, 'params'),
  asyncHandler(progress.getProgress),
);

// Resources
router.get('/resources', validate(resourcesQuery, 'query'), asyncHandler(resource.listResources));
router.get('/resources/favorites', asyncHandler(resource.listFavorites));
router.post(
  '/resources/:id/favorite',
  validate(resourceIdParam, 'params'),
  asyncHandler(resource.toggleFavorite),
);

// Projects
router.get('/projects', validate(projectsQuery, 'query'), asyncHandler(project.listProjects));

// Chatbot
router.post('/chat', validate(chatSchema), asyncHandler(chat.chat));

export default router;
