-- Scan history: one row per user scan
CREATE TABLE IF NOT EXISTS public.scan_history (
  id               UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type             TEXT        NOT NULL CHECK (type IN ('text', 'url', 'qr')),
  content_preview  TEXT        NOT NULL,
  risk_score       INTEGER     NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  classification   TEXT        NOT NULL,
  threat_level     TEXT        NOT NULL,
  confidence_score INTEGER     NOT NULL,
  result_data      JSONB       NOT NULL DEFAULT '{}',
  xp_awarded       INTEGER     NOT NULL DEFAULT 0,
  scanned_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_scan_history_user_id    ON public.scan_history (user_id);
CREATE INDEX IF NOT EXISTS idx_scan_history_scanned_at ON public.scan_history (scanned_at DESC);

ALTER TABLE public.scan_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scans"
  ON public.scan_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scans"
  ON public.scan_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);
