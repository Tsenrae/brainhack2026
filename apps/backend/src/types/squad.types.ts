export interface Squad {
  id: string;
  name: string;
  emblem: string;
  description: string | null;
  captain_id: string | null;
  captain_username: string | null;
  member_count: number;
  total_xp: number;
  created_at: string;
}

export interface SquadMember {
  user_id: string;
  username: string;
  full_name: string;
  avatar_color: string;
  level: number;
  level_title: string;
  xp: number;
  is_captain: boolean;
}

export interface MySquadResponse {
  squad: Squad;
  members: SquadMember[];
  my_rank: number | null;
}

export interface CreateSquadPayload {
  name: string;
  emblem: string;
  description?: string;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string;
  full_name: string;
  avatar_color: string;
  level: number;
  level_title: string;
  xp: number;
  accuracy_rate: number;
  streak_days: number;
  is_me: boolean;
}

export interface SquadLeaderboardEntry {
  rank: number;
  squad_id: string;
  name: string;
  emblem: string;
  member_count: number;
  total_xp: number;
  captain_username: string | null;
  is_my_squad: boolean;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  my_entry: LeaderboardEntry | null;
}

export interface SquadLeaderboardResponse {
  entries: SquadLeaderboardEntry[];
  my_entry: SquadLeaderboardEntry | null;
}
