import { z } from 'zod';
import { usersService } from '../services/users.service.js';
import { supabaseAdmin, isMockMode } from '../config/supabase.js';
const AGE_GROUPS = [
    '13–15 (Secondary)',
    '16–18 (JC / Poly)',
    '19–25 (Young Adult)',
    '26+ (Adult)',
];
const AVATAR_COLORS = ['red', 'purple', 'blue', 'green', 'pink'];
const createProfileSchema = z.object({
    full_name: z.string().min(1).max(100),
    username: z
        .string()
        .min(2)
        .max(30)
        .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed'),
    age_group: z.enum(AGE_GROUPS),
    school: z.string().max(100).optional(),
    avatar_color: z.enum(AVATAR_COLORS),
    subscribe_updates: z.boolean(),
});
const updateProfileSchema = z.object({
    full_name: z.string().min(1).max(100).optional(),
    username: z
        .string()
        .min(2)
        .max(30)
        .regex(/^[a-zA-Z0-9_]+$/)
        .optional(),
    age_group: z.enum(AGE_GROUPS).optional(),
    school: z.string().max(100).nullable().optional(),
    avatar_color: z.enum(AVATAR_COLORS).optional(),
    subscribe_updates: z.boolean().optional(),
});
const awardXpSchema = z.object({
    amount: z.number().int().positive().max(10_000),
    reason: z.string().optional(),
});
async function extractAuth(req, res) {
    if (isMockMode)
        return { userId: 'mock-user-id-001', email: 'john.doe@example.com' };
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
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
export const usersController = {
    async createProfile(req, res, next) {
        try {
            const auth = await extractAuth(req, res);
            if (!auth)
                return;
            const parsed = createProfileSchema.safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
                return;
            }
            const profile = await usersService.createProfile(auth.userId, auth.email, parsed.data);
            res.status(201).json({ data: profile });
        }
        catch (err) {
            next(err);
        }
    },
    async getMe(req, res, next) {
        try {
            const auth = await extractAuth(req, res);
            if (!auth)
                return;
            const profile = await usersService.getProfile(auth.userId);
            if (!profile) {
                res.status(404).json({ error: 'Profile not found' });
                return;
            }
            res.json({ data: profile });
        }
        catch (err) {
            next(err);
        }
    },
    async updateMe(req, res, next) {
        try {
            const auth = await extractAuth(req, res);
            if (!auth)
                return;
            const parsed = updateProfileSchema.safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
                return;
            }
            const profile = await usersService.updateProfile(auth.userId, parsed.data);
            res.json({ data: profile });
        }
        catch (err) {
            next(err);
        }
    },
    async awardXp(req, res, next) {
        try {
            const auth = await extractAuth(req, res);
            if (!auth)
                return;
            const parsed = awardXpSchema.safeParse(req.body);
            if (!parsed.success) {
                res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
                return;
            }
            const profile = await usersService.awardXp(auth.userId, parsed.data);
            res.json({ data: profile });
        }
        catch (err) {
            next(err);
        }
    },
    async getByUsername(req, res, next) {
        try {
            const username = req.params['username'];
            const profile = await usersService.getProfileByUsername(username);
            if (!profile) {
                res.status(404).json({ error: 'User not found' });
                return;
            }
            res.json({ data: profile });
        }
        catch (err) {
            next(err);
        }
    },
};
