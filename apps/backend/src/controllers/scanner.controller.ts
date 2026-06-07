import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { scannerService } from '../services/scanner.service.js';
import { supabaseAdmin, isMockMode } from '../config/supabase.js';

interface AuthPayload { userId: string; email: string; }

async function extractAuth(req: Request, res: Response): Promise<AuthPayload | null> {
  if (isMockMode) return { userId: 'mock-user-id-001', email: 'mock@example.com' };

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

const scanSchema = z.object({
  type: z.enum(['text', 'url', 'qr']),
  content: z.string().min(1).max(5000),
});

export const scannerController = {
  async scan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const auth = await extractAuth(req, res);
      if (!auth) return;

      const parsed = scanSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
        return;
      }

      const data = await scannerService.scan(auth.userId, parsed.data.type, parsed.data.content);
      res.json({ data });
    } catch (err) {
      next(err);
    }
  },

  async getHistory(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const auth = await extractAuth(req, res);
      if (!auth) return;
      const data = await scannerService.getHistory(auth.userId);
      res.json({ data });
    } catch (err) {
      next(err);
    }
  },

  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const auth = await extractAuth(req, res);
      if (!auth) return;
      const data = await scannerService.getStats(auth.userId);
      res.json({ data });
    } catch (err) {
      next(err);
    }
  },
};
