export type AgeGroup =
  | '13–15 (Secondary)'
  | '16–18 (JC / Poly)'
  | '19–25 (Young Adult)'
  | '26+ (Adult)';

export type AvatarColor = 'red' | 'purple' | 'blue' | 'green' | 'pink';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  username: string;
  age_group: AgeGroup;
  school: string | null;
  avatar_color: AvatarColor;
  xp: number;
  level: number;
  level_title: string;
  current_level_xp: number;
  next_level_xp: number;
  streak_days: number;
  last_activity_date: string | null;
  missions_completed: number;
  accuracy_rate: number;
  leaderboard_rank: number | null;
  squad_id: string | null;
  telegram_user_id: string | null;
  telegram_username: string | null;
  telegram_link_code: string | null;
  telegram_linked_at: string | null;
  subscribe_updates: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProfilePayload {
  full_name: string;
  username: string;
  age_group: AgeGroup;
  school?: string;
  avatar_color: AvatarColor;
  subscribe_updates: boolean;
}

export interface UpdateProfilePayload {
  full_name?: string;
  username?: string;
  age_group?: AgeGroup;
  school?: string | null;
  avatar_color?: AvatarColor;
  subscribe_updates?: boolean;
}

export interface AwardXpPayload {
  amount: number;
  reason?: string;
}

export interface LevelData {
  level: number;
  level_title: string;
  current_level_xp: number;
  next_level_xp: number;
}
