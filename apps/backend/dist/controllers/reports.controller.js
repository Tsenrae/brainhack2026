import { z } from 'zod';
import { supabaseAdmin, isMockMode } from '../config/supabase.js';
import { reportsService } from '../services/reports.service.js';
async function extractUserId(req) {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer '))
        return null;
    const token = auth.slice(7);
    if (isMockMode)
        return 'mock-user-id-001';
    const { data } = await supabaseAdmin.auth.getUser(token);
    return data.user?.id ?? null;
}
const submitSchema = z.object({
    type: z.enum(['screenshot', 'url', 'text', 'qr']),
    content: z.string().max(2000).optional(),
    description: z.string().max(500).optional(),
    screenshot_base64: z.string().max(10_000_000).optional(), // ~7.5 MB file
    screenshot_mime: z.string().optional(),
    screenshot_name: z.string().max(255).optional(),
});
export const reportsController = {
    async submit(req, res) {
        const userId = await extractUserId(req);
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const parsed = submitSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid input' });
            return;
        }
        const { type, content, description } = parsed.data;
        // Require actual content for url/text
        if ((type === 'url' || type === 'text') && !content?.trim()) {
            res.status(400).json({ error: 'Content is required for URL and text submissions.' });
            return;
        }
        // Require screenshot for screenshot/qr
        if ((type === 'screenshot' || type === 'qr') && !parsed.data.screenshot_base64) {
            res.status(400).json({ error: 'Image is required for screenshot and QR submissions.' });
            return;
        }
        try {
            const result = await reportsService.submit(userId, parsed.data);
            res.status(201).json({ data: result });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    async getMine(req, res) {
        const userId = await extractUserId(req);
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        try {
            const reports = await reportsService.getMine(userId);
            res.json({ data: reports });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    async getStats(req, res) {
        const userId = await extractUserId(req);
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        try {
            const stats = await reportsService.getStats(userId);
            res.json({ data: stats });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
};
