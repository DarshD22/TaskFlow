'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import { authService } from '@/lib/auth.service';
import toast from 'react-hot-toast';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const stored = authService.getStoredUser();
    if (stored && authService.isAuthenticated()) {
      setUser(stored);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await authService.login(email, password);
      setUser(data.user);
      router.push('/dashboard');
    },
    [router]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const data = await authService.register(name, email, password);
      setUser(data.user);
      router.push('/dashboard');
    },
    [router]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // continue regardless
    }
    setUser(null);
    toast.success('Logged out successfully');
    router.push('/auth/login');
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}