-- Add optional region field to community_reports.
-- Run in Supabase SQL Editor.

ALTER TABLE public.community_reports
  ADD COLUMN IF NOT EXISTS region TEXT
  CHECK (region IN ('central', 'north', 'northeast', 'east', 'west'));

-- Existing rows will have NULL region (treated as "unspecified" by the heatmap service).
