import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  username: string;
  age_group: string;
  school: string | null;
  avatar_color: 'red' | 'purple' | 'blue' | 'green' | 'pink';
  xp: number;
  level: number;
  level_title: string;
  current_level_xp: number;
  next_level_xp: number;
  streak_days: number;
  last_activity_date: string | null;
  missions_completed: number;
  accuracy_rate: number;
  leaderboard_rank: number | null;
  squad_id: string | null;
  telegram_user_id: string | null;
  telegram_username: string | null;
  telegram_link_code: string | null;
  telegram_linked_at: string | null;
  subscribe_updates: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProfilePayload {
  full_name: string;
  username: string;
  age_group: string;
  school?: string;
  avatar_color: 'red' | 'purple' | 'blue' | 'green' | 'pink';
  subscribe_updates: boolean;
}

export type ModuleStatus = 'not_started' | 'in_progress' | 'completed';

export interface ModuleProgress {
  module_slug: string;
  status: ModuleStatus;
  correct_count: number;
  wrong_count: number;
  last_question_index: number;
  completed_at: string | null;
}

export interface MissionStatusResponse {
  modules: ModuleProgress[];
  overall_progress_pct: number;
  completed: boolean;
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  missionStatus: MissionStatusResponse | null;
  loading: boolean;
  missionLoading: boolean;
  needsProfile: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ user: User; session: Session | null }>;
  createProfile: (payload: CreateProfilePayload, accessToken?: string) => Promise<UserProfile>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshMissionStatus: () => Promise<MissionStatusResponse | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:5000';

// Returns null only on 404 (no profile). Throws on network/server errors
// so callers can distinguish "user has no profile" from "backend unreachable".
async function fetchProfileFromBackend(token: string): Promise<UserProfile | null> {
  const res = await fetch(`${BACKEND_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`profile fetch failed: ${res.status}`);
  const { data } = await res.json();
  return data as UserProfile;
}

async function fetchMissionStatusFromBackend(token: string): Promise<MissionStatusResponse | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/missions/digital-shield`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const { data } = await res.json();
    return data as MissionStatusResponse;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [missionStatus, setMissionStatus] = useState<MissionStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [missionLoading, setMissionLoading] = useState(true);
  const [needsProfile, setNeedsProfile] = useState(false);

  async function refreshMissionStatus(): Promise<MissionStatusResponse | null> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setMissionStatus(null);
      return null;
    }

    setMissionLoading(true);
    const status = await fetchMissionStatusFromBackend(session.access_token);
    setMissionStatus(status);
    setMissionLoading(false);
    return status;
  }

  async function hydrateSessionData(activeSession: Session, event?: string): Promise<void> {
    setMissionLoading(true);

    let profileResult: UserProfile | null = null;
    let profileMissing = false;

    const [missionResult] = await Promise.all([
      fetchMissionStatusFromBackend(activeSession.access_token),
      fetchProfileFromBackend(activeSession.access_token)
        .then(p  => { profileResult = p; profileMissing = p === null; })
        .catch(() => { /* backend unreachable — keep profileResult null but don't treat as missing */ }),
    ]);

    setProfile(profileResult);
    setMissionStatus(missionResult);
    setMissionLoading(false);

    if (event === 'SIGNED_IN') {
      if (profileMissing && !window.location.pathname.includes('/signup')) {
        // Definitive 404 — account exists in auth but has no profile row yet
        window.location.href = '/signup?complete=1';
      } else if (!window.location.pathname.startsWith('/dashboard')) {
        // Profile loaded (or backend unreachable) — always proceed to dashboard
        window.location.href = '/dashboard';
      }
    } else {
      setNeedsProfile(profileMissing);
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session) {
        hydrateSessionData(session).finally(() => setLoading(false));
      } else {
        setMissionStatus(null);
        setMissionLoading(false);
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session) {
          await hydrateSessionData(session, event);
        } else {
          setProfile(null);
          setMissionStatus(null);
          setMissionLoading(false);
          setNeedsProfile(false);
        }
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  async function signInWithEmail(email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }

  async function signInWithGoogle(): Promise<void> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) throw error;
  }

  async function signUp(email: string, password: string): Promise<{ user: User; session: Session | null }> {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    if (!data.user) throw new Error('Sign-up failed — no user returned');
    // If email confirmation is disabled in Supabase, a session is returned immediately.
    // Store it in context so createProfile can use it without a round-trip.
    if (data.session) {
      setSession(data.session);
      setUser(data.user);
    }
    return { user: data.user, session: data.session };
  }

  async function createProfile(payload: CreateProfilePayload, accessToken?: string): Promise<UserProfile> {
    let token = accessToken;
    if (!token) {
      const { data: { session } } = await supabase.auth.getSession();
      token = session?.access_token;
    }
    if (!token) throw new Error('No active session');

    const res = await fetch(`${BACKEND_URL}/api/users/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error ?? 'Failed to create profile');
    }

    const { data } = await res.json();
    setProfile(data as UserProfile);
    setNeedsProfile(false);
    return data as UserProfile;
  }

  async function signOut(): Promise<void> {
    await supabase.auth.signOut();
    setProfile(null);
    setMissionStatus(null);
    setNeedsProfile(false);
  }

  async function refreshProfile(): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const p = await fetchProfileFromBackend(session.access_token);
    setProfile(p);
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        missionStatus,
        loading,
        missionLoading,
        needsProfile,
        signInWithEmail,
        signInWithGoogle,
        signUp,
        createProfile,
        signOut,
        refreshProfile,
        refreshMissionStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
