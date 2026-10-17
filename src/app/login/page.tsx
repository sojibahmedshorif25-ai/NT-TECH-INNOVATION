'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { LogIn, Sparkles, UserCheck, Shield } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginAsDemo } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      setLoading(true);
      const res = await login(email, password);
      if (res.success) {
        toast.success('Logged in successfully!');
        router.push('/');
      } else {
        setErrorMsg(res.message || 'Invalid credentials.');
        toast.error(res.message || 'Login failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role: 'RECRUITER' | 'CANDIDATE') => {
    try {
      setLoading(true);
      await loginAsDemo(role);
      toast.success(
        role === 'RECRUITER'
          ? 'Logged in as Demo Recruiter!'
          : 'Logged in as Demo Candidate!'
      );
      router.push(role === 'RECRUITER' ? '/pipeline' : '/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '440px', margin: '4rem auto', padding: '0 1.5rem' }}>
      <div className="glass-card">
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
            }}
          >
            <LogIn size={22} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Sign in to SmartHire AI</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
            Access candidate pipelines and intelligent screening reports.
          </p>
        </div>

        {/* 1-Click Demo Buttons for Assessment Reviewer */}
        <div style={{ marginBottom: '1.5rem', background: 'var(--bg-tertiary)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#c7d2fe', marginBottom: '8px', textAlign: 'center' }}>
            ⚡ 1-Click Demo Login for Reviewer:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => handleDemo('RECRUITER')}
              className="btn btn-secondary btn-sm"
              disabled={loading}
              style={{ fontSize: '0.75rem' }}
            >
              <Shield size={13} color="#818cf8" /> Recruiter
            </button>
            <button
              type="button"
              onClick={() => handleDemo('CANDIDATE')}
              className="btn btn-secondary btn-sm"
              disabled={loading}
              style={{ fontSize: '0.75rem' }}
            >
              <UserCheck size={13} color="#34d399" /> Candidate
            </button>
          </div>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'var(--danger-bg)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: '#f87171',
              fontSize: '0.85rem',
              marginBottom: '1rem',
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@smarthire.com"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Don’t have an account?{' '}
          <Link href="/register" style={{ color: '#818cf8', fontWeight: 600 }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
