import { supabaseAdmin, isMockMode } from '../config/supabase.js';
import { usersService } from './users.service.js';
import { badgesService } from './badges.service.js';
// Badge awarded on first completion of each scenario
const SCENARIO_BADGE = {
    'deepfake-storm': 'deepfake-detective',
    'scam-chat': 'scam-slayer',
    'fake-news-wave': 'spin-spotter',
    'cyberbully-escape': 'kindness-champion',
    'qr-trap': 'qr-guardian',
};
// ── Mock state ─────────────────────────────────────────────────────────────────
const mockProgress = new Map();
function rankValue(rank) {
    return { S: 4, A: 3, B: 2, C: 1 }[rank];
}
function betterRank(a, b) {
    if (!a)
        return b;
    return rankValue(a) >= rankValue(b) ? a : b;
}
// ── Service ────────────────────────────────────────────────────────────────────
export const scenariosService = {
    async complete(userId, scenarioId, payload) {
        const { xp_earned, rank, accuracy_pct } = payload;
        const now = new Date().toISOString();
        if (isMockMode) {
            const existing = mockProgress.get(scenarioId);
            const isFirst = !existing || existing.status !== 'completed';
            mockProgress.set(scenarioId, {
                scenario_id: scenarioId,
                status: 'completed',
                best_rank: betterRank(existing?.best_rank ?? null, rank),
                best_xp: Math.max(existing?.best_xp ?? 0, xp_earned),
                best_accuracy_pct: Math.max(existing?.best_accuracy_pct ?? 0, accuracy_pct),
                attempts: (existing?.attempts ?? 0) + 1,
                last_played_at: now,
                first_completed_at: existing?.first_completed_at ?? now,
            });
            return { xp_awarded: isFirst ? xp_earned : 0, badge_awarded: isFirst ? (SCENARIO_BADGE[scenarioId] ?? null) : null, is_first_completion: isFirst };
        }
        // Fetch existing row
        const { data: existing } = await supabaseAdmin
            .from('scenario_progress')
            .select('status, best_rank, best_xp, best_accuracy_pct, attempts, first_completed_at')
            .eq('user_id', userId)
            .eq('scenario_id', scenarioId)
            .maybeSingle();
        const isFirst = !existing || existing.status !== 'completed';
        await supabaseAdmin.from('scenario_progress').upsert({
            user_id: userId,
            scenario_id: scenarioId,
            status: 'completed',
            best_rank: betterRank(existing?.best_rank ?? null, rank),
            best_xp: Math.max(existing?.best_xp ?? 0, xp_earned),
            best_accuracy_pct: Math.max(existing?.best_accuracy_pct ?? 0, accuracy_pct),
            attempts: (existing?.attempts ?? 0) + 1,
            last_played_at: now,
            first_completed_at: existing?.first_completed_at ?? now,
        }, { onConflict: 'user_id,scenario_id' });
        let badgeAwarded = null;
        if (isFirst) {
            await usersService.awardXp(userId, { amount: xp_earned });
            const badgeSlug = SCENARIO_BADGE[scenarioId];
            if (badgeSlug && await badgesService.awardBadge(userId, badgeSlug)) {
                badgeAwarded = badgeSlug;
            }
        }
        return { xp_awarded: isFirst ? xp_earned : 0, badge_awarded: badgeAwarded, is_first_completion: isFirst };
    },
    async getProgress(userId) {
        if (isMockMode)
            return Array.from(mockProgress.values());
        const { data, error } = await supabaseAdmin
            .from('scenario_progress')
            .select('scenario_id, status, best_rank, best_xp, best_accuracy_pct, attempts, last_played_at, first_completed_at')
            .eq('user_id', userId);
        if (error)
            throw new Error(`scenarios.getProgress: ${error.message}`);
        return (data ?? []).map(r => ({
            scenario_id: r.scenario_id,
            status: r.status,
            best_rank: r.best_rank ?? null,
            best_xp: r.best_xp,
            best_accuracy_pct: r.best_accuracy_pct,
            attempts: r.attempts,
            last_played_at: r.last_played_at,
            first_completed_at: r.first_completed_at,
        }));
    },
};
