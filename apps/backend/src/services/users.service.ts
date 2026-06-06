import { supabaseAdmin, isMockMode } from '../config/supabase.js';
import type {
  UserProfile,
  CreateProfilePayload,
  UpdateProfilePayload,
  AwardXpPayload,
  LevelData,
} from '../types/user.types.js';

// XP required to enter each level (index 0 = Level 1)
const LEVEL_THRESHOLDS = [
  { minXp: 0,    title: 'Recruit' },
  { minXp: 200,  title: 'Scout' },
  { minXp: 500,  title: 'Defender' },
  { minXp: 900,  title: 'Sentinel' },
  { minXp: 1400, title: 'Protector' },
  { minXp: 2000, title: 'Guardian' },
  { minXp: 2700, title: 'Guardian Elite' },
  { minXp: 3500, title: 'Champion Defender' },
  { minXp: 5000, title: 'Shield Master' },
  { minXp: 7000, title: 'Digital Legend' },
] as const;

export function computeLevel(xp: number): LevelData {
  let idx = 0;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i].minXp) { idx = i; break; }
  }
  const next = LEVEL_THRESHOLDS[idx + 1] ?? { minXp: LEVEL_THRESHOLDS[idx].minXp + 2000, title: '' };
  return {
    level: idx + 1,
    level_title: LEVEL_THRESHOLDS[idx].title,
    current_level_xp: LEVEL_THRESHOLDS[idx].minXp,
    next_level_xp: next.minXp,
  };
}

// High-fidelity stub matching what the frontend renders for "John Doe"
const MOCK_PROFILE: UserProfile = {
  id: 'mock-user-id-001',
  email: 'john.doe@example.com',
  full_name: 'John Doe',
  username: 'johndoe_sg',
  age_group: '19–25 (Young Adult)',
  school: 'Other / Not applicable',
  avatar_color: 'red',
  xp: 2450,
  ...computeLevel(2450),
  streak_days: 14,
  last_activity_date: new Date().toISOString().split('T')[0],
  missions_completed: 23,
  accuracy_rate: 92,
  leaderboard_rank: 7,
  squad_id: null,
  subscribe_updates: true,
  created_at: '2026-01-15T08:00:00.000Z',
  updated_at: new Date().toISOString(),
};

export const usersService = {
  async createProfile(
    userId: string,
    email: string,
    payload: CreateProfilePayload,
  ): Promise<UserProfile> {
    const WELCOME_XP = 100;
    const levelData = computeLevel(WELCOME_XP);

    if (isMockMode) {
      return {
        ...MOCK_PROFILE,
        id: userId,
        email,
        ...payload,
        school: payload.school ?? null,
        xp: WELCOME_XP,
        ...levelData,
        streak_days: 0,
        missions_completed: 0,
        accuracy_rate: 0,
        leaderboard_rank: null,
        squad_id: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    const { data, error } = await supabaseAdmin!
      .from('profiles')
      .insert({
        id: userId,
        email,
        full_name: payload.full_name,
        username: payload.username,
        age_group: payload.age_group,
        school: payload.school ?? null,
        avatar_color: payload.avatar_color,
        xp: WELCOME_XP,
        level: levelData.level,
        level_title: levelData.level_title,
        subscribe_updates: payload.subscribe_updates,
      })
      .select()
      .single();

    if (error) throw new Error(`createProfile: ${error.message}`);
    return { ...data, ...computeLevel(data.xp) } as UserProfile;
  },

  async getProfile(userId: string): Promise<UserProfile | null> {
    if (isMockMode) return { ...MOCK_PROFILE, id: userId };

    const { data, error } = await supabaseAdmin!
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error?.code === 'PGRST116') return null;
    if (error) throw new Error(`getProfile: ${error.message}`);
    return { ...data, ...computeLevel(data.xp) } as UserProfile;
  },

  async updateProfile(userId: string, payload: UpdateProfilePayload): Promise<UserProfile> {
    if (isMockMode) {
      return { ...MOCK_PROFILE, id: userId, ...payload, updated_at: new Date().toISOString() };
    }

    const { data, error } = await supabaseAdmin!
      .from('profiles')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new Error(`updateProfile: ${error.message}`);
    return { ...data, ...computeLevel(data.xp) } as UserProfile;
  },

  async awardXp(userId: string, payload: AwardXpPayload): Promise<UserProfile> {
    if (isMockMode) {
      const newXp = MOCK_PROFILE.xp + payload.amount;
      return { ...MOCK_PROFILE, id: userId, xp: newXp, ...computeLevel(newXp) };
    }

    const { data: current, error: fetchErr } = await supabaseAdmin!
      .from('profiles')
      .select('xp')
      .eq('id', userId)
      .single();

    if (fetchErr) throw new Error(`awardXp fetch: ${fetchErr.message}`);

    const newXp = current.xp + payload.amount;
    const levelData = computeLevel(newXp);

    const { data, error } = await supabaseAdmin!
      .from('profiles')
      .update({
        xp: newXp,
        level: levelData.level,
        level_title: levelData.level_title,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw new Error(`awardXp update: ${error.message}`);
    return { ...data, ...levelData } as UserProfile;
  },

  async getProfileByUsername(username: string): Promise<UserProfile | null> {
    if (isMockMode) {
      return username === MOCK_PROFILE.username ? MOCK_PROFILE : null;
    }

    const { data, error } = await supabaseAdmin!
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (error?.code === 'PGRST116') return null;
    if (error) throw new Error(`getProfileByUsername: ${error.message}`);
    return { ...data, ...computeLevel(data.xp) } as UserProfile;
  },
};
