-- Allow Shield Scanner image uploads to be persisted in scan_history.
-- The original scan_history type check only allowed text, url, and qr.
ALTER TABLE public.scan_history
  DROP CONSTRAINT IF EXISTS scan_history_type_check;

ALTER TABLE public.scan_history
  ADD CONSTRAINT scan_history_type_check
  CHECK (type IN ('text', 'url', 'qr', 'upload'));
