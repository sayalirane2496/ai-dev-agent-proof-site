'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { createBrowserSupabase } from '@/lib/supabase/browser';

export type CustomerProfile = {
  id: string;
  display_name: string;
  phone: string | null;
  role: string;
};

export type CustomerUser = {
  id: string;
  email: string | null;
};

type AuthState = {
  loading: boolean;
  user: CustomerUser | null;
  profile: CustomerProfile | null;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

async function fetchMe(): Promise<{ user: CustomerUser | null; profile: CustomerProfile | null }> {
  const response = await fetch('/api/v1/me', { credentials: 'same-origin' });
  const json = await response.json();
  if (!json.ok || !json.data?.user) {
    return { user: null, profile: null };
  }
  return {
    user: json.data.user,
    profile: json.data.profile ?? null,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);

  const refresh = useCallback(async () => {
    try {
      const next = await fetchMe();
      setUser(next.user);
      setProfile(next.profile);
    } catch {
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const supabase = createBrowserSupabase();
    const { data } = supabase.auth.onAuthStateChange(() => {
      void refresh();
    });
    return () => data.subscription.unsubscribe();
  }, [refresh]);

  const signOut = useCallback(async () => {
    await createBrowserSupabase().auth.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  const value = useMemo(
    () => ({ loading, user, profile, refresh, signOut }),
    [loading, user, profile, refresh, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
