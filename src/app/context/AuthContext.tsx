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

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  needsProfile: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ user: User; session: Session | null }>;
  createProfile: (payload: CreateProfilePayload, accessToken?: string) => Promise<UserProfile>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:5000';

async function fetchProfileFromBackend(token: string): Promise<UserProfile | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    const { data } = await res.json();
    return data as UserProfile;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsProfile, setNeedsProfile] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session) {
        fetchProfileFromBackend(session.access_token).then(p => {
          setProfile(p);
          setNeedsProfile(p === null);
        }).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session) {
          const p = await fetchProfileFromBackend(session.access_token);
          setProfile(p);
          // OAuth users who don't have a profile yet get redirected to finish sign-up
          if (p === null && event === 'SIGNED_IN' && !window.location.pathname.includes('/signup')) {
            window.location.href = '/signup?complete=1';
          } else {
            setNeedsProfile(p === null);
          }
        } else {
          setProfile(null);
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
        loading,
        needsProfile,
        signInWithEmail,
        signInWithGoogle,
        signUp,
        createProfile,
        signOut,
        refreshProfile,
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
