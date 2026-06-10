import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { scannerService } from '../services/scanner.service.js';
import { supabaseAdmin, isMockMode } from '../config/supabase.js';

interface AuthPayload { userId: string; email: string; }

async function extractAuth(req: Request, res: Response): Promise<AuthPayload | null> {
  if (isMockMode) return { userId: 'mock-user-id-001', email: 'mock@example.com' };
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) { res.status(401).json({ error: 'Missing or invalid Authorization header' }); return null; }
  const token = header.slice(7);
  const { data: { user }, error } = await supabaseAdmin!.auth.getUser(token);
  if (error || !user) { res.status(401).json({ error: 'Invalid or expired token' }); return null; }
  return { userId: user.id, email: user.email ?? '' };
}

const MAX_IMAGE_B64 = 20 * 1024 * 1024; // Supports 12 MB image files after base64 encoding.

const scanSchema = z.object({
  type:           z.enum(['text', 'url', 'qr', 'upload']),
  content:        z.string().max(5000).optional(),
  image_base64:   z.string().max(MAX_IMAGE_B64).optional(),
  image_mime:     z.string().max(64).optional(),
  image_name:     z.string().max(255).optional(),
}).refine(data => {
  if (data.type === 'text' || data.type === 'url') return !!data.content?.trim();
  if (data.type === 'upload') return !!data.image_base64;
  if (data.type === 'qr') return !!(data.content?.trim() || data.image_base64);
  return true;
}, { message: 'text/url require content; upload requires image; qr requires content or image' });

export const scannerController = {
  async scan(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const auth = await extractAuth(req, res);
      if (!auth) return;

      const parsed = scanSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Validation failed' });
        return;
      }

      const { type, content, image_base64, image_mime, image_name } = parsed.data;
      const data = await scannerService.scan(auth.userId, {
        type,
        content,
        imageBase64: image_base64,
        imageMime:   image_mime,
        imageName:   image_name,
      });
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
    } catch (err) { next(err); }
  },

  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const auth = await extractAuth(req, res);
      if (!auth) return;
      const data = await scannerService.getStats(auth.userId);
      res.json({ data });
    } catch (err) { next(err); }
  },
};
