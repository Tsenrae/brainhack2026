import { supabaseAdmin, isMockMode } from '../config/supabase.js';
import type {
  LeaderboardEntry,
  LeaderboardResponse,
  SquadLeaderboardEntry,
  SquadLeaderboardResponse,
} from '../types/squad.types.js';

// ── Mock data matching the frontend's existing display ─────────────────────
const MOCK_INDIVIDUAL: LeaderboardEntry[] = [
  { rank: 1, user_id: 'u1', username: 'SentinelAlex', full_name: 'SentinelAlex', avatar_color: 'blue',   level: 12, level_title: 'Digital Legend',       xp: 8420, accuracy_rate: 97, streak_days: 42, is_me: false },
  { rank: 2, user_id: 'u2', username: 'GuardianMei',  full_name: 'GuardianMei',  avatar_color: 'purple', level: 11, level_title: 'Shield Master',        xp: 7350, accuracy_rate: 96, streak_days: 38, is_me: false },
  { rank: 3, user_id: 'u3', username: 'ShieldRaj',    full_name: 'ShieldRaj',    avatar_color: 'green',  level: 10, level_title: 'Champion Defender',     xp: 6810, accuracy_rate: 94, streak_days: 29, is_me: false },
  { rank: 4, user_id: 'u4', username: 'NovaPriya',    full_name: 'NovaPriya',    avatar_color: 'pink',   level: 10, level_title: 'Champion Defender',     xp: 5990, accuracy_rate: 93, streak_days: 21, is_me: false },
  { rank: 5, user_id: 'u5', username: 'CipherKai',    full_name: 'CipherKai',    avatar_color: 'blue',   level: 9,  level_title: 'Guardian Elite',        xp: 5340, accuracy_rate: 91, streak_days: 17, is_me: false },
  { rank: 6, user_id: 'u6', username: 'TruthAna',     full_name: 'TruthAna',     avatar_color: 'purple', level: 9,  level_title: 'Guardian Elite',        xp: 4880, accuracy_rate: 90, streak_days: 14, is_me: false },
  { rank: 7, user_id: 'mock-user-id-001', username: 'johndoe_sg', full_name: 'John Doe', avatar_color: 'red', level: 8, level_title: 'Champion Defender', xp: 2450, accuracy_rate: 92, streak_days: 14, is_me: true },
  { rank: 8, user_id: 'u8', username: 'VeilSam',      full_name: 'VeilSam',      avatar_color: 'blue',   level: 8,  level_title: 'Champion Defender',     xp: 2380, accuracy_rate: 88, streak_days: 9,  is_me: false },
  { rank: 9, user_id: 'u9', username: 'DigitalDan',   full_name: 'DigitalDan',   avatar_color: 'green',  level: 7,  level_title: 'Guardian',              xp: 2120, accuracy_rate: 87, streak_days: 6,  is_me: false },
  { rank: 10, user_id: 'u10', username: 'SafetyLin',  full_name: 'SafetyLin',    avatar_color: 'purple', level: 7,  level_title: 'Guardian',              xp: 1970, accuracy_rate: 85, streak_days: 5,  is_me: false },
];

const MOCK_SQUADS: SquadLeaderboardEntry[] = [
  { rank: 1, squad_id: 's1', name: 'Iron Shields',      emblem: '🛡️', member_count: 8, total_xp: 48200, captain_username: 'SentinelAlex', is_my_squad: false },
  { rank: 2, squad_id: 's2', name: 'Cyber Sentinels',   emblem: '⚡', member_count: 7, total_xp: 41750, captain_username: 'GuardianMei',  is_my_squad: false },
  { rank: 3, squad_id: 's3', name: 'Truth Blazers',     emblem: '🔥', member_count: 6, total_xp: 38900, captain_username: 'ShieldRaj',    is_my_squad: false },
  { rank: 4, squad_id: 's4', name: 'Red Sentinels',     emblem: '🔴', member_count: 6, total_xp: 14280, captain_username: 'johndoe_sg',   is_my_squad: true  },
  { rank: 5, squad_id: 's5', name: 'Digital Hawks',     emblem: '🦅', member_count: 5, total_xp: 11430, captain_username: 'NovaPriya',    is_my_squad: false },
  { rank: 6, squad_id: 's6', name: 'SafeNet Crew',      emblem: '🌐', member_count: 5, total_xp: 9870,  captain_username: 'CipherKai',    is_my_squad: false },
  { rank: 7, squad_id: 's7', name: 'QR Busters',        emblem: '📱', member_count: 4, total_xp: 8200,  captain_username: 'TruthAna',     is_my_squad: false },
  { rank: 8, squad_id: 's8', name: 'Scam Hunters',      emblem: '🎯', member_count: 4, total_xp: 7640,  captain_username: 'VeilSam',      is_my_squad: false },
];

export const leaderboardService = {
  async getIndividual(userId: string): Promise<LeaderboardResponse> {
    if (isMockMode) {
      const entries = MOCK_INDIVIDUAL.map(e => ({ ...e, is_me: e.user_id === userId || e.user_id === 'mock-user-id-001' }));
      return { entries, my_entry: entries.find(e => e.is_me) ?? null };
    }

    const { data, error } = await supabaseAdmin!
      .from('profiles')
      .select('id, username, full_name, avatar_color, level, level_title, xp, accuracy_rate, streak_days')
      .order('xp', { ascending: false })
      .limit(50);

    if (error) throw new Error(`leaderboard.getIndividual: ${error.message}`);

    const entries: LeaderboardEntry[] = (data ?? []).map((p, idx) => ({
      rank: idx + 1,
      user_id: p.id,
      username: p.username,
      full_name: p.full_name,
      avatar_color: p.avatar_color,
      level: p.level,
      level_title: p.level_title,
      xp: p.xp,
      accuracy_rate: Number(p.accuracy_rate),
      streak_days: p.streak_days,
      is_me: p.id === userId,
    }));

    let my_entry = entries.find(e => e.is_me) ?? null;

    // User outside top-50: fetch their own data and rank separately
    if (!my_entry) {
      const { data: me } = await supabaseAdmin!
        .from('profiles')
        .select('id, username, full_name, avatar_color, level, level_title, xp, accuracy_rate, streak_days')
        .eq('id', userId)
        .single();

      if (me) {
        const { count } = await supabaseAdmin!
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .gt('xp', me.xp);

        my_entry = {
          rank: (count ?? 0) + 1,
          user_id: me.id,
          username: me.username,
          full_name: me.full_name,
          avatar_color: me.avatar_color,
          level: me.level,
          level_title: me.level_title,
          xp: me.xp,
          accuracy_rate: Number(me.accuracy_rate),
          streak_days: me.streak_days,
          is_me: true,
        };
      }
    }

    return { entries, my_entry };
  },

  async getSquads(userId: string): Promise<SquadLeaderboardResponse> {
    if (isMockMode) {
      return {
        entries: MOCK_SQUADS,
        my_entry: MOCK_SQUADS.find(s => s.is_my_squad) ?? null,
      };
    }

    // Get user's squad_id
    const { data: userProfile } = await supabaseAdmin!
      .from('profiles')
      .select('squad_id')
      .eq('id', userId)
      .single();

    const mySquadId = userProfile?.squad_id ?? null;

    // Top 30 squads by total_xp, with captain username
    const { data: squads, error } = await supabaseAdmin!
      .from('squads')
      .select('id, name, emblem, total_xp, captain_id, profiles!squads_captain_id_fkey(username)')
      .order('total_xp', { ascending: false })
      .limit(30);

    if (error) throw new Error(`leaderboard.getSquads: ${error.message}`);

    // Member counts: one query to get count per squad
    const squadIds = (squads ?? []).map(s => s.id);
    const { data: memberRows } = await supabaseAdmin!
      .from('profiles')
      .select('squad_id')
      .in('squad_id', squadIds);

    const memberCounts = new Map<string, number>();
    for (const row of memberRows ?? []) {
      if (row.squad_id) {
        memberCounts.set(row.squad_id, (memberCounts.get(row.squad_id) ?? 0) + 1);
      }
    }

    const entries: SquadLeaderboardEntry[] = (squads ?? []).map((s, idx) => ({
      rank: idx + 1,
      squad_id: s.id,
      name: s.name,
      emblem: s.emblem,
      member_count: memberCounts.get(s.id) ?? 0,
      total_xp: s.total_xp,
      captain_username: (s.profiles as unknown as { username: string } | null)?.username ?? null,
      is_my_squad: s.id === mySquadId,
    }));

    return {
      entries,
      my_entry: entries.find(e => e.is_my_squad) ?? null,
    };
  },
};
