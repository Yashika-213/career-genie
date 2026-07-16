import type { Request, Response } from 'express';
import { handleChat } from '../services/chatService.js';

export function chat(req: Request, res: Response) {
  const { message, roadmapId } = req.body as { message: string; roadmapId?: number };
  const response = handleChat(message, roadmapId);
  res.json({ data: response });
}
