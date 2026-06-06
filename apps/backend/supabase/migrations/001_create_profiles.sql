-- Run in the Supabase SQL editor or via: supabase db push

CREATE TABLE IF NOT EXISTS public.profiles (
  id                 UUID         PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email              TEXT         NOT NULL,
  full_name          TEXT         NOT NULL,
  username           TEXT         UNIQUE NOT NULL,
  age_group          TEXT         NOT NULL CHECK (age_group IN (
                                   '13–15 (Secondary)',
                                   '16–18 (JC / Poly)',
                                   '19–25 (Young Adult)',
                                   '26+ (Adult)'
                                 )),
  school             TEXT,
  avatar_color       TEXT         NOT NULL DEFAULT 'red' CHECK (avatar_color IN ('red','purple','blue','green','pink')),
  xp                 INTEGER      NOT NULL DEFAULT 100,
  level              INTEGER      NOT NULL DEFAULT 1,
  level_title        TEXT         NOT NULL DEFAULT 'Recruit',
  streak_days        INTEGER      NOT NULL DEFAULT 0,
  last_activity_date DATE,
  missions_completed INTEGER      NOT NULL DEFAULT 0,
  accuracy_rate      NUMERIC(5,2) NOT NULL DEFAULT 0.00,
  leaderboard_rank   INTEGER,
  squad_id           UUID,
  subscribe_updates  BOOLEAN      NOT NULL DEFAULT true,
  created_at         TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Row-level security: only the owning user can read/update their own profile via anon key.
-- The backend service role key bypasses RLS entirely.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Auto-update updated_at on every row change
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Indexes for leaderboard and username lookup
CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles (username);
CREATE INDEX IF NOT EXISTS profiles_xp_desc_idx  ON public.profiles (xp DESC);
