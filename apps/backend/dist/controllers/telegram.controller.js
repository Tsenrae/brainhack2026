import { z } from 'zod';
import { isMockMode, supabaseAdmin } from '../config/supabase.js';
import { telegramService } from '../services/telegram.service.js';
const analyzeSchema = z.object({
    content: z.string().min(1).max(5000),
    telegram_user_id: z.string().optional(),
    telegram_username: z.string().optional().nullable(),
    profile_id: z.string().optional(),
    message_id: z.union([z.string(), z.number()]).optional().nullable(),
    chat_id: z.union([z.string(), z.number()]).optional().nullable(),
    chat_title: z.string().optional().nullable(),
    source: z.enum(['bot', 'web']).optional(),
});
const linkCodeSchema = z.object({});
const linkSchema = z.object({
    link_code: z.string().min(4),
    telegram_user_id: z.string().min(1),
    telegram_username: z.string().optional().nullable(),
});
const authHeaderSchema = z.string().startsWith('Bearer ');
async function extractAuth(req, res) {
    if (isMockMode)
        return { userId: 'mock-user-id-001', email: 'john.doe@example.com' };
    const header = req.headers.authorization;
    if (!header || !authHeaderSchema.safeParse(header).success) {
        res.status(401).json({ error: 'Missing or invalid Authorization header' });
        return null;
    }
    const token = header.slice(7);
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) {
        res.status(401).json({ error: 'Invalid or expired token' });
        return null;
    }
    return { userId: user.id, email: user.email ?? '' };
}
export const telegramController = {
    getInfo(_req, res) {
        res.json({ data: telegramService.getBotInfo() });
    },
    getCommands(_req, res) {
        res.json({ data: telegramService.getCommands() });
    },
    async getStatus(req, res, next) {
        try {
            const auth = await extractAuth(req, res);
            if (!auth)
                return;
            const data = await telegramService.getStatus(auth.userId);
            res.json({ data });
        }
        catch (err) {
            next(err);
        }
    },
    async createLinkCode(req, res, next) {
        try {
            const auth = await extractAuth(req, res);
            if (!auth)
                return;
            const parsed = linkCodeSchema.safeParse(req.body ?? {});
            if (!parsed.success) {
                res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
                return;
            }
            const data = await telegramService.createLinkCode(auth.userId);
            res.json({ data });
        }
        catch (err) {
            next(err);
        }
    },
    async linkTelegramAccount(req, res, next) {
        try {
            const parsed = linkSchema.safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
                return;
            }
            const data = await telegramService.linkTelegramAccount(parsed.data);
            res.json({ data });
        }
        catch (err) {
            next(err);
        }
    },
    async getStats(req, res, next) {
        try {
            const telegramUserId = typeof req.query.telegram_user_id === 'string' ? req.query.telegram_user_id : undefined;
            const auth = telegramUserId ? null : await extractAuth(req, res);
            if (!auth && !telegramUserId)
                return;
            const data = await telegramService.getStats(auth?.userId, telegramUserId);
            res.json({ data });
        }
        catch (err) {
            next(err);
        }
    },
    async getRecentScans(req, res, next) {
        try {
            const telegramUserId = typeof req.query.telegram_user_id === 'string' ? req.query.telegram_user_id : undefined;
            const auth = telegramUserId ? null : await extractAuth(req, res);
            if (!auth && !telegramUserId)
                return;
            const data = await telegramService.getRecentScans(auth?.userId, telegramUserId);
            res.json({ data });
        }
        catch (err) {
            next(err);
        }
    },
    async getHistory(req, res, next) {
        try {
            const telegramUserId = typeof req.query.telegram_user_id === 'string' ? req.query.telegram_user_id : undefined;
            const auth = telegramUserId ? null : await extractAuth(req, res);
            if (!auth && !telegramUserId)
                return;
            const data = await telegramService.getScanHistory(auth?.userId, telegramUserId);
            res.json({ data });
        }
        catch (err) {
            next(err);
        }
    },
    async analyze(req, res, next) {
        try {
            const parsed = analyzeSchema.safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
                return;
            }
            const data = await telegramService.analyzeMessage(parsed.data);
            res.json({ data });
        }
        catch (err) {
            if (err instanceof Error && err.message.includes('not linked to a profile')) {
                res.status(409).json({ error: err.message });
                return;
            }
            next(err);
        }
    },
};
