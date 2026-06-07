export type ScenarioRank   = 'S' | 'A' | 'B' | 'C';
export type ScenarioStatus = 'in_progress' | 'completed';

export interface ScenarioProgress {
  scenario_id: string;
  status: ScenarioStatus;
  best_rank: ScenarioRank | null;
  best_xp: number;
  best_accuracy_pct: number;
  attempts: number;
  last_played_at: string;
  first_completed_at: string | null;
}

export interface CompleteScenarioPayload {
  xp_earned: number;
  rank: ScenarioRank;
  accuracy_pct: number;
}

export interface CompleteScenarioResult {
  xp_awarded: number;
  badge_awarded: string | null;
  is_first_completion: boolean;
}
