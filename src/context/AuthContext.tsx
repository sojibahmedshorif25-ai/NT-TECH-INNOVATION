'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '@/models/User';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title?: string;
  bio?: string;
  skills?: string[];
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  loginAsDemo: (role: 'RECRUITER' | 'CANDIDATE') => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('smarthire_user');
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  // Fetch current session on initial mount
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.user) {
            setUser(data.user);
            localStorage.setItem('smarthire_user', JSON.stringify(data.user));
          } else {
            setUser(null);
            localStorage.removeItem('smarthire_user');
          }
        } else {
          setUser(null);
          localStorage.removeItem('smarthire_user');
        }
      } catch (err) {
        console.error('Session check failed:', err);
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        localStorage.setItem('smarthire_user', JSON.stringify(data.user));
        return { success: true };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch {
      return { success: false, message: 'Network error during login.' };
    }
  };

  const register = async (formData: any) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, message: data.message || 'Registration failed' };
    } catch {
      return { success: false, message: 'Network error during registration.' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/me', { method: 'DELETE' });
    } catch {
      // Continue anyway
    } finally {
      setUser(null);
      localStorage.removeItem('smarthire_user');
      window.location.href = '/';
    }
  };

  const loginAsDemo = async (role: 'RECRUITER' | 'CANDIDATE') => {
    const creds =
      role === 'RECRUITER'
        ? { email: 'admin@smarthire.com', password: 'admin123' }
        : { email: 'candidate@smarthire.com', password: 'user123' };

    await login(creds.email, creds.password);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, loginAsDemo }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
