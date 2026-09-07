'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { api } from '@/lib/api/client';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (token?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  loginWithGoogle: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const isRealSupabase = useCallback(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return Boolean(url && !url.includes('placeholder.supabase.co'));
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      // 1. Try local NestJS backend authentication endpoint
      const meRes = await api.auth.me().catch(() => null);
      if (meRes?.data?.data) {
        setUser(meRes.data.data);
        setIsLoading(false);
        return;
      }

      // 2. If Supabase is configured with real credentials, check Supabase session
      if (isRealSupabase()) {
        const { data: { session } } = await supabase.auth.getSession().catch(() => ({ data: { session: null } }));
        if (session) {
          const profileRes = await api.auth.me().catch(() => null);
          setUser(profileRes?.data?.data || null);
          setIsLoading(false);
          return;
        }
      }

      setUser(null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [supabase, isRealSupabase]);

  useEffect(() => {
    checkAuth();

    if (isRealSupabase()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!session) {
          setUser(null);
        } else {
          checkAuth();
        }
      });

      return () => {
        subscription?.unsubscribe();
      };
    }
  }, [checkAuth, supabase, isRealSupabase]);

  const login = async (emailOrUsername: string, password: string) => {
    // Attempt Supabase Auth if real Supabase configuration exists
    if (isRealSupabase()) {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: emailOrUsername,
          password,
        });
        if (!error) {
          window.location.href = '/dashboard';
          return;
        }
      } catch (err) {
        console.warn('Supabase authentication failed, attempting local NestJS backend auth...', err);
      }
    }

    // Default NestJS Backend Authentication (admin / admin123, receptionist, lawyer)
    const res = await api.auth.login({
      username: emailOrUsername,
      password,
    });

    const userData = res.data?.data?.user || res.data?.data;
    if (userData) {
      setUser(userData);
      window.location.href = '/dashboard';
    } else {
      throw new Error(res.data?.message || 'Authentication failed');
    }
  };

  const loginWithGoogle = async (token?: string) => {
    if (token) {
      const res = await api.auth.googleLogin(token);
      const userData = res.data?.data?.user || res.data?.data;
      if (userData) {
        setUser(userData);
        window.location.href = '/dashboard';
        return;
      }
    }

    if (isRealSupabase()) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } else {
      throw new Error('Google Sign-In requires Firebase or Supabase Auth credentials in environment configuration.');
    }
  };

  const logout = async () => {
    try {
      if (isRealSupabase()) {
        await supabase.auth.signOut().catch(() => null);
      }
      await api.auth.logout().catch(() => null);
    } finally {
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
