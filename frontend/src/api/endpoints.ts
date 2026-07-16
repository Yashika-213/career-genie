import { api, unwrap } from './client.js';
import type {
  Career,
  CareerDetail,
  Project,
  Resource,
  RoadmapDetail,
  RoadmapSummary,
  PredictInput,
  PredictionResult,
  ChatResponse,
  ProgressSummary,
  SkillStatus,
} from '../types';

// Careers
export const getCareers = () => unwrap<Career[]>(api.get('/careers'));
export const getCareer = (slug: string) => unwrap<CareerDetail>(api.get(`/careers/${slug}`));

// Recommendation
export const predictCareer = (input: PredictInput) =>
  unwrap<PredictionResult>(api.post('/predict', input));

// Roadmaps
export const getRoadmaps = () => unwrap<RoadmapSummary[]>(api.get('/roadmaps'));
export const getRoadmap = (id: number) => unwrap<RoadmapDetail>(api.get(`/roadmaps/${id}`));
export const createRoadmap = (careerSlug: string) =>
  unwrap<RoadmapDetail>(api.post('/roadmaps', { careerSlug }));

// Progress
export const updateProgress = (skillId: number, roadmapId: number, status: SkillStatus) =>
  unwrap<{ skillId: number; status: SkillStatus; stats: RoadmapDetail['stats'] }>(
    api.patch(`/progress/${skillId}`, { roadmapId, status }),
  );
export const getProgress = (roadmapId: number) =>
  unwrap<ProgressSummary>(api.get(`/progress/${roadmapId}`));

// Resources
export const getResources = (params?: { skillId?: number; type?: string }) =>
  unwrap<Resource[]>(api.get('/resources', { params }));
export const getFavorites = () => unwrap<Resource[]>(api.get('/resources/favorites'));
export const toggleFavorite = (id: number) =>
  unwrap<{ resourceId: number; favorite: boolean }>(api.post(`/resources/${id}/favorite`));

// Projects
export const getProjects = (careerSlug?: string) =>
  unwrap<Project[]>(api.get('/projects', { params: careerSlug ? { careerSlug } : undefined }));

// Chat
export const sendChat = (message: string, roadmapId?: number) =>
  unwrap<ChatResponse>(api.post('/chat', { message, roadmapId }));
