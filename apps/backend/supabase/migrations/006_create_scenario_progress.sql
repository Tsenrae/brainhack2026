-- Scenario Academy progress table
-- Run in Supabase SQL Editor after 005.

CREATE TABLE IF NOT EXISTS public.scenario_progress (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  scenario_id          TEXT        NOT NULL,
  status               TEXT        NOT NULL DEFAULT 'in_progress'
                                   CHECK (status IN ('in_progress', 'completed')),
  best_rank            TEXT        CHECK (best_rank IN ('S', 'A', 'B', 'C')),
  best_xp              INTEGER     NOT NULL DEFAULT 0,
  best_accuracy_pct    INTEGER     NOT NULL DEFAULT 0,
  attempts             INTEGER     NOT NULL DEFAULT 0,
  last_played_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  first_completed_at   TIMESTAMPTZ,
  UNIQUE (user_id, scenario_id)
);

CREATE INDEX IF NOT EXISTS idx_scenario_progress_user ON public.scenario_progress (user_id);
CREATE INDEX IF NOT EXISTS idx_scenario_progress_last ON public.scenario_progress (last_played_at DESC);

ALTER TABLE public.scenario_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own scenario progress"
  ON public.scenario_progress FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
