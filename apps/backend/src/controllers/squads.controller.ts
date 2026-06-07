import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { squadsService } from '../services/squads.service.js';
import { supabaseAdmin, isMockMode } from '../config/supabase.js';

async function extractUserId(req: Request, res: Response): Promise<string | null> {
  if (isMockMode) return 'mock-user-id-001';

  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing Authorization header' });
    return null;
  }
  const { data: { user }, error } = await supabaseAdmin!.auth.getUser(header.slice(7));
  if (error || !user) { res.status(401).json({ error: 'Invalid token' }); return null; }
  return user.id;
}

const createSchema = z.object({
  name: z.string().min(3).max(30),
  emblem: z.string().min(1).max(8),
  description: z.string().max(200).optional(),
});

export const squadsController = {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await squadsService.getAll();
      res.json({ data });
    } catch (err) { next(err); }
  },

  async getMySquad(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = await extractUserId(req, res);
      if (!userId) return;
      const data = await squadsService.getMySquad(userId);
      res.json({ data });
    } catch (err) { next(err); }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = await extractUserId(req, res);
      if (!userId) return;

      const parsed = createSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
        return;
      }
      const data = await squadsService.create(userId, parsed.data);
      res.status(201).json({ data });
    } catch (err) {
      if (err instanceof Error && (err.message.includes('already in') || err.message.includes('already exists'))) {
        res.status(409).json({ error: err.message });
        return;
      }
      next(err);
    }
  },

  async join(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = await extractUserId(req, res);
      if (!userId) return;
      const squadId = req.params['squadId'] as string;
      const data = await squadsService.join(userId, squadId);
      res.json({ data });
    } catch (err) {
      if (err instanceof Error && err.message.includes('Squad not found')) {
        res.status(404).json({ error: err.message });
        return;
      }
      if (err instanceof Error && err.message.includes('already in')) {
        res.status(409).json({ error: err.message });
        return;
      }
      next(err);
    }
  },

  async leave(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = await extractUserId(req, res);
      if (!userId) return;
      const squadId = req.params['squadId'] as string;
      await squadsService.leave(userId, squadId);
      res.json({ data: null });
    } catch (err) {
      if (err instanceof Error && err.message.includes('not in this squad')) {
        res.status(409).json({ error: err.message });
        return;
      }
      next(err);
    }
  },
};
