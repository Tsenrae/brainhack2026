import { supabaseAdmin, isMockMode } from '../config/supabase.js';
import { ALL_BADGES, BADGE_MAP } from '../data/badges.js';
// Mock: spin-spotter already earned, rest locked
const MOCK_EARNED = new Map([
    ['spin-spotter', '2026-04-20T08:00:00.000Z'],
]);
export const badgesService = {
    async getAllWithStatus(userId) {
        if (isMockMode) {
            return ALL_BADGES.map(b => ({
                ...b,
                earned: MOCK_EARNED.has(b.badge_slug),
                earned_at: MOCK_EARNED.get(b.badge_slug) ?? null,
            }));
        }
        const { data, error } = await supabaseAdmin
            .from('user_badges')
            .select('badge_slug, earned_at')
            .eq('user_id', userId);
        if (error)
            throw new Error(`badges.getAllWithStatus: ${error.message}`);
        const earned = new Map((data ?? []).map((r) => [r.badge_slug, r.earned_at]));
        return ALL_BADGES.map(b => ({
            ...b,
            earned: earned.has(b.badge_slug),
            earned_at: earned.get(b.badge_slug) ?? null,
        }));
    },
    // Returns true if this was a NEW award (not already earned)
    async awardBadge(userId, badgeSlug) {
        if (!BADGE_MAP.has(badgeSlug))
            return false;
        if (isMockMode)
            return !MOCK_EARNED.has(badgeSlug);
        // Check if already earned
        const { data: existing } = await supabaseAdmin
            .from('user_badges')
            .select('badge_slug')
            .eq('user_id', userId)
            .eq('badge_slug', badgeSlug)
            .maybeSingle();
        if (existing)
            return false;
        const { error } = await supabaseAdmin
            .from('user_badges')
            .insert({ user_id: userId, badge_slug: badgeSlug });
        if (error)
            throw new Error(`badges.awardBadge: ${error.message}`);
        return true;
    },
    // Award multiple badges and return slugs that were newly earned
    async awardBadges(userId, slugs) {
        const results = await Promise.all(slugs.map(slug => badgesService.awardBadge(userId, slug)));
        return slugs.filter((_, i) => results[i]);
    },
};
