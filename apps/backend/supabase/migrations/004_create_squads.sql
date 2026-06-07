-- Squads: groups of users who compete together on the leaderboard
CREATE TABLE IF NOT EXISTS public.squads (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT         NOT NULL UNIQUE CHECK (length(name) >= 3 AND length(name) <= 30),
  emblem      TEXT         NOT NULL DEFAULT '🛡️',
  description TEXT,
  captain_id  UUID         REFERENCES public.profiles(id) ON DELETE SET NULL,
  total_xp    INTEGER      NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

ALTER TABLE public.squads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "squads_select_all"
  ON public.squads FOR SELECT USING (true);

CREATE POLICY "squads_insert_authenticated"
  ON public.squads FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "squads_update_captain"
  ON public.squads FOR UPDATE USING (auth.uid() = captain_id);

CREATE INDEX IF NOT EXISTS squads_total_xp_desc_idx ON public.squads (total_xp DESC);
CREATE INDEX IF NOT EXISTS profiles_squad_id_idx    ON public.profiles (squad_id);

DROP TRIGGER IF EXISTS squads_updated_at ON public.squads;
CREATE TRIGGER squads_updated_at
  BEFORE UPDATE ON public.squads
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
