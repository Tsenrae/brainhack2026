import { supabaseAdmin, isMockMode } from '../config/supabase.js';
import type {
  Squad,
  SquadMember,
  MySquadResponse,
  CreateSquadPayload,
} from '../types/squad.types.js';

// ── Mock state ────────────────────────────────────────────────────────────────
const MOCK_SQUADS_LIST: Squad[] = [
  { id: 's1', name: 'Iron Shields',    emblem: '🛡️', description: 'Elite defenders of digital truth.', captain_id: 'u1', captain_username: 'SentinelAlex', member_count: 8, total_xp: 48200, created_at: '2026-01-01T00:00:00Z' },
  { id: 's2', name: 'Cyber Sentinels', emblem: '⚡', description: 'Fast, accurate, relentless.',        captain_id: 'u2', captain_username: 'GuardianMei',  member_count: 7, total_xp: 41750, created_at: '2026-01-02T00:00:00Z' },
  { id: 's3', name: 'Truth Blazers',   emblem: '🔥', description: 'We set fire to misinformation.',    captain_id: 'u3', captain_username: 'ShieldRaj',    member_count: 6, total_xp: 38900, created_at: '2026-01-03T00:00:00Z' },
  { id: 's4', name: 'Red Sentinels',   emblem: '🔴', description: 'Singapore\'s first line of defence.', captain_id: 'mock-user-id-001', captain_username: 'johndoe_sg', member_count: 6, total_xp: 14280, created_at: '2026-01-05T00:00:00Z' },
  { id: 's5', name: 'Digital Hawks',   emblem: '🦅', description: 'Eyes on every scam.',               captain_id: 'u5', captain_username: 'NovaPriya',    member_count: 5, total_xp: 11430, created_at: '2026-01-06T00:00:00Z' },
];

const MOCK_MY_SQUAD_MEMBERS: SquadMember[] = [
  { user_id: 'mock-user-id-001', username: 'johndoe_sg', full_name: 'John Doe',      avatar_color: 'red',    level: 8,  level_title: 'Champion Defender', xp: 2450, is_captain: true  },
  { user_id: 'u9',               username: 'DigitalDan', full_name: 'Digital Dan',   avatar_color: 'green',  level: 7,  level_title: 'Guardian',          xp: 2120, is_captain: false },
  { user_id: 'u10',              username: 'SafetyLin',  full_name: 'Safety Lin',    avatar_color: 'purple', level: 7,  level_title: 'Guardian',          xp: 1970, is_captain: false },
  { user_id: 'u11',              username: 'ScannerKev', full_name: 'Scanner Kevin', avatar_color: 'blue',   level: 6,  level_title: 'Protector',         xp: 1640, is_captain: false },
  { user_id: 'u12',              username: 'TechPaige',  full_name: 'Tech Paige',    avatar_color: 'pink',   level: 5,  level_title: 'Protector',         xp: 1560, is_captain: false },
  { user_id: 'u13',              username: 'FactRohan',  full_name: 'Fact Rohan',    avatar_color: 'green',  level: 5,  level_title: 'Defender',          xp: 2460, is_captain: false },
];

export const squadsService = {
  async getAll(): Promise<Squad[]> {
    if (isMockMode) return MOCK_SQUADS_LIST;

    const { data: squads, error } = await supabaseAdmin!
      .from('squads')
      .select('id, name, emblem, description, captain_id, total_xp, created_at, profiles!squads_captain_id_fkey(username)')
      .order('total_xp', { ascending: false })
      .limit(50);

    if (error) throw new Error(`squads.getAll: ${error.message}`);

    // Batch member counts
    const ids = (squads ?? []).map(s => s.id);
    const { data: memberRows } = await supabaseAdmin!
      .from('profiles')
      .select('squad_id')
      .in('squad_id', ids);

    const counts = new Map<string, number>();
    for (const r of memberRows ?? []) {
      if (r.squad_id) counts.set(r.squad_id, (counts.get(r.squad_id) ?? 0) + 1);
    }

    return (squads ?? []).map(s => ({
      id: s.id,
      name: s.name,
      emblem: s.emblem,
      description: s.description ?? null,
      captain_id: s.captain_id,
      captain_username: (s.profiles as unknown as { username: string } | null)?.username ?? null,
      member_count: counts.get(s.id) ?? 0,
      total_xp: s.total_xp,
      created_at: s.created_at,
    }));
  },

  async getMySquad(userId: string): Promise<MySquadResponse | null> {
    if (isMockMode) {
      const squad = MOCK_SQUADS_LIST.find(s => s.captain_id === userId || userId === 'mock-user-id-001')
        ?? MOCK_SQUADS_LIST[3]; // Default: Red Sentinels in mock
      return { squad, members: MOCK_MY_SQUAD_MEMBERS, my_rank: 4 };
    }

    // Get user's squad_id
    const { data: profile } = await supabaseAdmin!
      .from('profiles')
      .select('squad_id')
      .eq('id', userId)
      .single();

    if (!profile?.squad_id) return null;

    const squadId = profile.squad_id as string;

    // Fetch squad info
    const { data: squad, error: squadErr } = await supabaseAdmin!
      .from('squads')
      .select('id, name, emblem, description, captain_id, total_xp, created_at, profiles!squads_captain_id_fkey(username)')
      .eq('id', squadId)
      .single();

    if (squadErr || !squad) return null;

    // Fetch members
    const { data: memberProfiles } = await supabaseAdmin!
      .from('profiles')
      .select('id, username, full_name, avatar_color, level, level_title, xp')
      .eq('squad_id', squadId)
      .order('xp', { ascending: false });

    const members: SquadMember[] = (memberProfiles ?? []).map(p => ({
      user_id: p.id,
      username: p.username,
      full_name: p.full_name,
      avatar_color: p.avatar_color,
      level: p.level,
      level_title: p.level_title,
      xp: p.xp,
      is_captain: p.id === squad.captain_id,
    }));

    // Get squad rank
    const { count: higherCount } = await supabaseAdmin!
      .from('squads')
      .select('id', { count: 'exact', head: true })
      .gt('total_xp', squad.total_xp);

    return {
      squad: {
        id: squad.id,
        name: squad.name,
        emblem: squad.emblem,
        description: squad.description ?? null,
        captain_id: squad.captain_id,
        captain_username: (squad.profiles as unknown as { username: string } | null)?.username ?? null,
        member_count: members.length,
        total_xp: squad.total_xp,
        created_at: squad.created_at,
      },
      members,
      my_rank: (higherCount ?? 0) + 1,
    };
  },

  async create(userId: string, payload: CreateSquadPayload): Promise<Squad> {
    if (isMockMode) {
      const newSquad: Squad = {
        id: `s-${Date.now()}`,
        name: payload.name,
        emblem: payload.emblem,
        description: payload.description ?? null,
        captain_id: userId,
        captain_username: 'johndoe_sg',
        member_count: 1,
        total_xp: 2450,
        created_at: new Date().toISOString(),
      };
      MOCK_SQUADS_LIST.push(newSquad);
      return newSquad;
    }

    // Make sure user is not already in a squad
    const { data: profile } = await supabaseAdmin!
      .from('profiles')
      .select('squad_id, xp')
      .eq('id', userId)
      .single();

    if (profile?.squad_id) throw new Error('You are already in a squad. Leave first.');

    // Create squad
    const { data: squad, error } = await supabaseAdmin!
      .from('squads')
      .insert({
        name: payload.name,
        emblem: payload.emblem,
        description: payload.description ?? null,
        captain_id: userId,
        total_xp: profile?.xp ?? 0,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') throw new Error('A squad with that name already exists.');
      throw new Error(`squads.create: ${error.message}`);
    }

    // Set user's squad_id
    await supabaseAdmin!
      .from('profiles')
      .update({ squad_id: squad.id, updated_at: new Date().toISOString() })
      .eq('id', userId);

    return {
      ...squad,
      captain_username: null,
      member_count: 1,
    };
  },

  async join(userId: string, squadId: string): Promise<Squad> {
    if (isMockMode) {
      const squad = MOCK_SQUADS_LIST.find(s => s.id === squadId);
      if (!squad) throw new Error('Squad not found');
      return squad;
    }

    const { data: profile } = await supabaseAdmin!
      .from('profiles')
      .select('squad_id, xp')
      .eq('id', userId)
      .single();

    if (!profile) throw new Error('Profile not found');
    if (profile.squad_id === squadId) throw new Error('You are already in this squad.');
    if (profile.squad_id) await squadsService.leave(userId, profile.squad_id);

    // Fetch squad to validate it exists
    const { data: squad, error: squadErr } = await supabaseAdmin!
      .from('squads')
      .select('id, name, emblem, description, captain_id, total_xp, created_at')
      .eq('id', squadId)
      .single();

    if (squadErr || !squad) throw new Error('Squad not found');

    // Update user's squad_id and increment squad total_xp
    await supabaseAdmin!
      .from('profiles')
      .update({ squad_id: squadId, updated_at: new Date().toISOString() })
      .eq('id', userId);

    await supabaseAdmin!
      .from('squads')
      .update({ total_xp: squad.total_xp + (profile.xp ?? 0), updated_at: new Date().toISOString() })
      .eq('id', squadId);

    // Fetch final member count
    const { count } = await supabaseAdmin!
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('squad_id', squadId);

    return { ...squad, captain_username: null, member_count: count ?? 1 };
  },

  async leave(userId: string, squadId: string): Promise<void> {
    if (isMockMode) return;

    const { data: profile } = await supabaseAdmin!
      .from('profiles')
      .select('squad_id, xp')
      .eq('id', userId)
      .single();

    if (profile?.squad_id !== squadId) throw new Error('You are not in this squad.');

    const { data: squad } = await supabaseAdmin!
      .from('squads')
      .select('captain_id, total_xp')
      .eq('id', squadId)
      .single();

    // Clear user's squad
    await supabaseAdmin!
      .from('profiles')
      .update({ squad_id: null, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (!squad) return;

    // Deduct XP
    const newXp = Math.max(0, squad.total_xp - (profile?.xp ?? 0));
    await supabaseAdmin!
      .from('squads')
      .update({ total_xp: newXp, updated_at: new Date().toISOString() })
      .eq('id', squadId);

    // If captain leaves, promote the member with highest XP
    if (squad.captain_id === userId) {
      const { data: nextCaptain } = await supabaseAdmin!
        .from('profiles')
        .select('id')
        .eq('squad_id', squadId)
        .order('xp', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (nextCaptain) {
        await supabaseAdmin!
          .from('squads')
          .update({ captain_id: nextCaptain.id })
          .eq('id', squadId);
      } else {
        // Squad is now empty — delete it
        await supabaseAdmin!.from('squads').delete().eq('id', squadId);
      }
    }
  },
};
