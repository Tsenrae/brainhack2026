import { supabaseAdmin, isMockMode } from '../config/supabase.js';
import { usersService } from './users.service.js';
const XP_PER_REPORT = 50;
const STORAGE_BUCKET = 'community-reports';
// ── Mock state ─────────────────────────────────────────────────────────────────
const MOCK_REPORTS = [
    {
        id: 'r1',
        type: 'text',
        content_preview: 'Free iPhone giveaway scam...',
        description: 'Received on WhatsApp',
        screenshot_url: null,
        status: 'community_verified',
        helped_protect_count: 234,
        xp_awarded: 50,
        created_at: new Date(Date.now() - 172800000).toISOString(),
    },
    {
        id: 'r2',
        type: 'url',
        content_preview: 'fake-gov-sg.xyz',
        description: null,
        screenshot_url: null,
        status: 'shield_squad',
        helped_protect_count: 89,
        xp_awarded: 50,
        created_at: new Date(Date.now() - 432000000).toISOString(),
    },
    {
        id: 'r3',
        type: 'screenshot',
        content_preview: 'WhatsApp phishing attempt',
        description: 'Claimed to be from my bank',
        screenshot_url: null,
        status: 'pending',
        helped_protect_count: 0,
        xp_awarded: 50,
        created_at: new Date(Date.now() - 604800000).toISOString(),
    },
];
let mockTotalXp = 150;
// ── Storage upload helper ──────────────────────────────────────────────────────
async function uploadScreenshot(userId, reportId, base64Data, mime, name) {
    try {
        const ext = name.split('.').pop()?.toLowerCase() ?? 'jpg';
        const path = `${userId}/${reportId}.${ext}`;
        const buffer = Buffer.from(base64Data, 'base64');
        const { error } = await supabaseAdmin.storage
            .from(STORAGE_BUCKET)
            .upload(path, buffer, { contentType: mime, upsert: false });
        if (error) {
            console.warn('[reports] Storage upload failed (bucket may not exist):', error.message);
            return null;
        }
        const { data } = supabaseAdmin.storage.from(STORAGE_BUCKET).getPublicUrl(path);
        return { url: data.publicUrl, path };
    }
    catch (err) {
        console.warn('[reports] Storage upload error:', err.message);
        return null;
    }
}
// ── Service ────────────────────────────────────────────────────────────────────
export const reportsService = {
    async submit(userId, payload) {
        const { type, content, description, screenshot_base64, screenshot_mime, screenshot_name } = payload;
        const preview = buildPreview(type, content, screenshot_name);
        if (isMockMode) {
            const newReport = {
                id: `r-${Date.now()}`,
                type,
                content_preview: preview,
                description: description ?? null,
                screenshot_url: null,
                status: 'pending',
                helped_protect_count: 0,
                xp_awarded: XP_PER_REPORT,
                created_at: new Date().toISOString(),
            };
            MOCK_REPORTS.unshift(newReport);
            mockTotalXp += XP_PER_REPORT;
            return { report: newReport, xp_awarded: XP_PER_REPORT };
        }
        // Insert the report first to get an ID
        const { data: row, error: insertErr } = await supabaseAdmin
            .from('community_reports')
            .insert({
            user_id: userId,
            type,
            content_preview: preview,
            description: description ?? null,
            status: 'pending',
            xp_awarded: XP_PER_REPORT,
        })
            .select('id')
            .single();
        if (insertErr)
            throw new Error(`reports.submit insert: ${insertErr.message}`);
        // Upload screenshot / QR image if provided
        let screenshotUrl = null;
        let screenshotPath = null;
        if (screenshot_base64 && screenshot_mime && screenshot_name) {
            const uploaded = await uploadScreenshot(userId, row.id, screenshot_base64, screenshot_mime, screenshot_name);
            if (uploaded) {
                screenshotUrl = uploaded.url;
                screenshotPath = uploaded.path;
                await supabaseAdmin
                    .from('community_reports')
                    .update({ screenshot_url: screenshotUrl, screenshot_path: screenshotPath })
                    .eq('id', row.id);
            }
        }
        await usersService.awardXp(userId, { amount: XP_PER_REPORT });
        const report = {
            id: row.id,
            type,
            content_preview: preview,
            description: description ?? null,
            screenshot_url: screenshotUrl,
            status: 'pending',
            helped_protect_count: 0,
            xp_awarded: XP_PER_REPORT,
            created_at: new Date().toISOString(),
        };
        return { report, xp_awarded: XP_PER_REPORT };
    },
    async getMine(userId) {
        if (isMockMode)
            return MOCK_REPORTS;
        const { data, error } = await supabaseAdmin
            .from('community_reports')
            .select('id, type, content_preview, description, screenshot_url, status, helped_protect_count, xp_awarded, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(20);
        if (error)
            throw new Error(`reports.getMine: ${error.message}`);
        return (data ?? []).map(r => ({
            id: r.id,
            type: r.type,
            content_preview: r.content_preview,
            description: r.description,
            screenshot_url: r.screenshot_url,
            status: r.status,
            helped_protect_count: r.helped_protect_count,
            xp_awarded: r.xp_awarded,
            created_at: r.created_at,
        }));
    },
    async getStats(userId) {
        if (isMockMode) {
            const total = MOCK_REPORTS.length;
            const protected_ = MOCK_REPORTS.reduce((s, r) => s + r.helped_protect_count, 0);
            return { total_submissions: total, people_protected: protected_, total_xp_earned: mockTotalXp };
        }
        const { data, error } = await supabaseAdmin
            .from('community_reports')
            .select('helped_protect_count, xp_awarded')
            .eq('user_id', userId);
        if (error)
            throw new Error(`reports.getStats: ${error.message}`);
        const rows = data ?? [];
        return {
            total_submissions: rows.length,
            people_protected: rows.reduce((s, r) => s + (r.helped_protect_count ?? 0), 0),
            total_xp_earned: rows.reduce((s, r) => s + (r.xp_awarded ?? 0), 0),
        };
    },
};
// ── Helpers ────────────────────────────────────────────────────────────────────
function buildPreview(type, content, filename) {
    switch (type) {
        case 'url':
            return content ? (content.length > 80 ? content.slice(0, 77) + '...' : content) : 'URL submission';
        case 'text':
            return content ? (content.length > 80 ? content.slice(0, 77) + '...' : content) : 'Text submission';
        case 'screenshot':
            return filename ? `Screenshot: ${filename}` : 'Screenshot uploaded';
        case 'qr':
            return filename ? `QR Code: ${filename}` : 'QR Code image';
    }
}
