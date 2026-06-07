import type { Request, Response } from 'express';
import { z } from 'zod';
import { supabaseAdmin, isMockMode } from '../config/supabase.js';
import { scenariosService } from '../services/scenarios.service.js';

async function extractUserId(req: Request, res: Response): Promise<string | null> {
  if (isMockMode) return 'mock-user-id-001';
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) { res.status(401).json({ error: 'Unauthorized' }); return null; }
  const { data } = await supabaseAdmin!.auth.getUser(auth.slice(7));
  if (!data.user) { res.status(401).json({ error: 'Invalid token' }); return null; }
  return data.user.id;
}

const VALID_SCENARIO_IDS = ['deepfake-storm', 'scam-chat', 'fake-news-wave', 'cyberbully-escape', 'qr-trap'];

const completeSchema = z.object({
  xp_earned:    z.number().int().min(0).max(2000),
  rank:         z.enum(['S', 'A', 'B', 'C']),
  accuracy_pct: z.number().int().min(0).max(100),
});

export const scenariosController = {
  async complete(req: Request, res: Response): Promise<void> {
    const userId = await extractUserId(req, res);
    if (!userId) return;

    const { scenarioId } = req.params;
    if (!VALID_SCENARIO_IDS.includes(scenarioId)) {
      res.status(400).json({ error: 'Unknown scenario ID' });
      return;
    }

    const parsed = completeSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: parsed.error.issues[0]?.message }); return; }

    try {
      const result = await scenariosService.complete(userId, scenarioId, parsed.data);
      res.json({ data: result });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  },

  async getProgress(req: Request, res: Response): Promise<void> {
    const userId = await extractUserId(req, res);
    if (!userId) return;
    try {
      const progress = await scenariosService.getProgress(userId);
      res.json({ data: progress });
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  },
};
