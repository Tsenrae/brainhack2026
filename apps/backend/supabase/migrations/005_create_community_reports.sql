-- Community Reports table
-- Run in Supabase SQL Editor.
-- Also create a Storage bucket named "community-reports" (Storage → New Bucket → public).

CREATE TABLE IF NOT EXISTS public.community_reports (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type             TEXT        NOT NULL CHECK (type IN ('screenshot', 'url', 'text', 'qr')),
  content_preview  TEXT        NOT NULL DEFAULT '',
  description      TEXT,
  screenshot_url   TEXT,
  screenshot_path  TEXT,
  status           TEXT        NOT NULL DEFAULT 'pending'
                               CHECK (status IN ('pending', 'ai_reviewing', 'community_verified', 'shield_squad', 'rejected')),
  helped_protect_count INTEGER NOT NULL DEFAULT 0,
  xp_awarded       INTEGER     NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_community_reports_user_id ON public.community_reports (user_id);
CREATE INDEX IF NOT EXISTS idx_community_reports_status  ON public.community_reports (status);
CREATE INDEX IF NOT EXISTS idx_community_reports_created ON public.community_reports (created_at DESC);

-- RLS
ALTER TABLE public.community_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own reports"
  ON public.community_reports FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reports"
  ON public.community_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);
