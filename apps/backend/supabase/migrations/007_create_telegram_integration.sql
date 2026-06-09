-- Telegram profile linking and scan persistence

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS telegram_user_id TEXT,
  ADD COLUMN IF NOT EXISTS telegram_username TEXT,
  ADD COLUMN IF NOT EXISTS telegram_link_code TEXT,
  ADD COLUMN IF NOT EXISTS telegram_link_code_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS telegram_linked_at TIMESTAMPTZ;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_telegram_user_id_idx ON public.profiles (telegram_user_id);
CREATE UNIQUE INDEX IF NOT EXISTS profiles_telegram_link_code_idx ON public.profiles (telegram_link_code);

CREATE TABLE IF NOT EXISTS public.telegram_scan_history (
  id                 UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id         UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  telegram_user_id   TEXT        NOT NULL,
  telegram_username  TEXT,
  telegram_message_id TEXT,
  source_chat_id     TEXT,
  source_chat_title  TEXT,
  content_preview    TEXT        NOT NULL,
  content_text       TEXT        NOT NULL,
  risk_score         INTEGER     NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  classification     TEXT        NOT NULL,
  threat_level       TEXT        NOT NULL,
  confidence_score   INTEGER     NOT NULL,
  result_data        JSONB       NOT NULL DEFAULT '{}',
  xp_awarded         INTEGER     NOT NULL DEFAULT 0,
  scanned_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_telegram_scan_history_profile_id    ON public.telegram_scan_history (profile_id);
CREATE INDEX IF NOT EXISTS idx_telegram_scan_history_scanned_at    ON public.telegram_scan_history (scanned_at DESC);
CREATE INDEX IF NOT EXISTS idx_telegram_scan_history_telegram_user ON public.telegram_scan_history (telegram_user_id);

ALTER TABLE public.telegram_scan_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own telegram scans"
  ON public.telegram_scan_history FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert own telegram scans"
  ON public.telegram_scan_history FOR INSERT
  WITH CHECK (auth.uid() = profile_id);