import type { Request, Response, NextFunction } from 'express';
import { leaderboardService } from '../services/leaderboard.service.js';
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

export const leaderboardController = {
  async getIndividual(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = await extractUserId(req, res);
      if (!userId) return;
      const data = await leaderboardService.getIndividual(userId);
      res.json({ data });
    } catch (err) { next(err); }
  },

  async getSquads(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = await extractUserId(req, res);
      if (!userId) return;
      const data = await leaderboardService.getSquads(userId);
      res.json({ data });
    } catch (err) { next(err); }
  },
};
