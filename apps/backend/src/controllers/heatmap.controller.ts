import type { Request, Response } from 'express';
import { getHeatmapData } from '../services/heatmap.service.js';

const VALID_TIMEFRAMES = new Set(['1h', '24h', '7d', '30d']);

export async function getHeatmap(req: Request, res: Response): Promise<void> {
  const timeframe = VALID_TIMEFRAMES.has(String(req.query.timeframe))
    ? String(req.query.timeframe)
    : '24h';

  try {
    const data = await getHeatmapData(timeframe);
    res.json(data);
  } catch (err) {
    console.error('[heatmap] error:', (err as Error).message);
    res.status(500).json({ error: 'Failed to load heatmap data' });
  }
}
