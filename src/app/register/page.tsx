'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { UserPlus, Sparkles, Shield, UserCheck } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CANDIDATE',
    title: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      const res = await register(formData);
      if (res.success) {
        toast.success('Registration successful! Welcome to SmartHire.');
        router.push('/');
      } else {
        setErrorMsg(res.message || 'Registration failed.');
        toast.error(res.message || 'Error creating account.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '4rem auto', padding: '0 1.5rem' }}>
      <div className="glass-card">
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #6366f1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
            }}
          >
            <UserPlus size={22} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Create Your Account</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
            Choose whether you are a Hiring Manager or Candidate.
          </p>
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

        {/* Google OAuth Signup Button */}
        <div style={{ marginBottom: '1.25rem' }}>
          <a
            href={`/api/auth/google?role=${formData.role}`}
            className="btn btn-secondary"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '10px',
              background: '#ffffff',
              color: '#1f2937',
              fontWeight: 600,
              fontSize: '0.9rem',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Sign up with Google
          </a>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '1rem 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>or with email</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Role selection radio cards */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              I want to:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'CANDIDATE' })}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: `1px solid ${formData.role === 'CANDIDATE' ? '#10b981' : 'var(--border-color)'}`,
                  background: formData.role === 'CANDIDATE' ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-tertiary)',
                  color: formData.role === 'CANDIDATE' ? '#34d399' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                }}
              >
                <UserCheck size={16} /> Apply for Jobs
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'RECRUITER' })}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  border: `1px solid ${formData.role === 'RECRUITER' ? '#6366f1' : 'var(--border-color)'}`,
                  background: formData.role === 'RECRUITER' ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-tertiary)',
                  color: formData.role === 'RECRUITER' ? '#818cf8' : 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                }}
              >
                <Shield size={16} /> Hire Talent
              </button>
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Alex Rivera"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="alex@example.com"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Professional Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Senior Full Stack Engineer"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Password (min. 6 characters)
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Already registered?{' '}
          <Link href="/login" style={{ color: '#818cf8', fontWeight: 600 }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
