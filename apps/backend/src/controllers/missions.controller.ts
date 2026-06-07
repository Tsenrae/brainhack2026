import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { missionsService } from '../services/missions.service.js';
import { supabaseAdmin, isMockMode } from '../config/supabase.js';

interface AuthPayload {
  userId: string;
  email: string;
}

async function extractAuth(req: Request, res: Response): Promise<AuthPayload | null> {
  if (isMockMode) return { userId: 'mock-user-id-001', email: 'john.doe@example.com' };

  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid Authorization header' });
    return null;
  }

  const token = header.slice(7);
  const { data: { user }, error } = await supabaseAdmin!.auth.getUser(token);

  if (error || !user) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return null;
  }

  return { userId: user.id, email: user.email ?? '' };
}

const answerSchema = z.object({
  question_index: z.number().int().min(0).max(9),
  answer: z.enum(['real', 'misleading', 'satire', 'scam']),
});

export const missionsController = {
  async getMissionStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const auth = await extractAuth(req, res);
      if (!auth) return;
      const data = await missionsService.getMissionStatus(auth.userId);
      res.json({ data });
    } catch (err) {
      next(err);
    }
  },

  async getQuizSession(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const auth = await extractAuth(req, res);
      if (!auth) return;
      const data = await missionsService.getQuizSession(auth.userId);
      res.json({ data });
    } catch (err) {
      next(err);
    }
  },

  async submitAnswer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const auth = await extractAuth(req, res);
      if (!auth) return;

      const parsed = answerSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
        return;
      }

      const data = await missionsService.submitAnswer(
        auth.userId,
        parsed.data.question_index,
        parsed.data.answer,
      );
      res.json({ data });
    } catch (err) {
      next(err);
    }
  },

};
