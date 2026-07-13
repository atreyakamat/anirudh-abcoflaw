'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api/client';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  loginWithGoogle: (token: string) => Promise<void>;
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

  const checkAuth = useCallback(async () => {
    try {
      const res = await api.auth.me();
      setUser(res.data.data || res.data);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (username: string, password: string) => {
    const res = await api.auth.login({ username, password });
    setUser(res.data.data?.user || res.data.user);
    // Hard redirect so the browser commits the Set-Cookie header before
    // Next.js middleware checks for access_token on the next request.
    window.location.href = '/dashboard';
  };

  const loginWithGoogle = async (token: string) => {
    const res = await api.auth.googleLogin(token);
    const loggedUser = res.data.data?.user || res.data.user;
    setUser(loggedUser);
    
    // Redirect based on role
    if (loggedUser.role === 'CLIENT') {
      window.location.href = '/portal';
    } else {
      window.location.href = '/dashboard';
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
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