import { badgesService } from '../services/badges.service.js';
import { supabaseAdmin, isMockMode } from '../config/supabase.js';
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
export const badgesController = {
    async getAll(req, res, next) {
        try {
            const auth = await extractAuth(req, res);
            if (!auth)
                return;
            const data = await badgesService.getAllWithStatus(auth.userId);
            res.json({ data });
        }
        catch (err) {
            next(err);
        }
    },
};
