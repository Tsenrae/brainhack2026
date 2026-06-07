import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL ?? '';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

export const isMockMode =
  process.env.MOCK_MODE === 'true' || !url || !serviceKey;

export const supabaseAdmin: SupabaseClient | null = isMockMode
  ? null
  : createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
