-- Mission progress tracks each user's state per quiz module
CREATE TABLE IF NOT EXISTS mission_progress (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_slug     TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'not_started'
                    CHECK (status IN ('not_started', 'in_progress', 'completed')),
  correct_count   INTEGER NOT NULL DEFAULT 0,
  wrong_count     INTEGER NOT NULL DEFAULT 0,
  last_question_index INTEGER NOT NULL DEFAULT 0,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, module_slug)
);

-- Badges earned by users
CREATE TABLE IF NOT EXISTS user_badges (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_slug TEXT NOT NULL,
  earned_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, badge_slug)
);

ALTER TABLE mission_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their mission progress"
  ON mission_progress FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users own their badges"
  ON user_badges FOR ALL USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS mission_progress_user_idx ON mission_progress (user_id);
CREATE INDEX IF NOT EXISTS user_badges_user_idx ON user_badges (user_id);

CREATE TRIGGER update_mission_progress_updated_at
  BEFORE UPDATE ON mission_progress
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
