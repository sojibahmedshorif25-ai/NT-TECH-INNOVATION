'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {
  Sparkles,
  Briefcase,
  Layers,
  BarChart3,
  UserCheck,
  LogOut,
  LogIn,
  Menu,
  X,
  Shield,
  FileText,
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, loginAsDemo } = useAuth();
  const toast = useToast();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const handleDemoSwitch = async (role: 'RECRUITER' | 'CANDIDATE') => {
    try {
      setDemoLoading(true);
      await loginAsDemo(role);
      toast.success(
        role === 'RECRUITER'
          ? 'Switched to Recruiter Mode (Sarah Jenkins)'
          : 'Switched to Candidate Mode (Alex Rivera)'
      );
      window.location.href = role === 'RECRUITER' ? '/pipeline' : '/';
    } catch {
      toast.error('Failed to switch demo account.');
    } finally {
      setDemoLoading(false);
    }
  };

  const navLinks = [
    { label: 'Explore Jobs', href: '/', icon: Briefcase },
    ...(user?.role === 'CANDIDATE'
      ? [{ label: 'My Applications', href: '/my-applications', icon: FileText }]
      : []),
    ...(user?.role === 'RECRUITER' || user?.role === 'ADMIN'
      ? [
          { label: 'Pipeline Kanban', href: '/pipeline', icon: Layers },
          { label: 'Post a Job', href: '/post-job', icon: Briefcase },
          { label: 'Analytics', href: '/analytics', icon: BarChart3 },
        ]
      : []),
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(16px)',
        backgroundColor: 'rgba(10, 13, 20, 0.85)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '0 1.5rem',
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: 700,
            fontSize: '1.25rem',
            color: '#fff',
            letterSpacing: '-0.02em',
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)',
            }}
          >
            <Sparkles size={20} color="#fff" />
          </div>
          <span>
            Smart<span style={{ color: '#818cf8' }}>Hire</span> <span style={{ fontSize: '0.75rem', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', color: '#c7d2fe', padding: '2px 8px', borderRadius: '12px', verticalAlign: 'middle' }}>AI 3.8</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '1.25rem',
          }}
          className="desktop-nav"
        >
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: active ? '#818cf8' : 'var(--text-secondary)',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  backgroundColor: active ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                  transition: 'var(--transition)',
                }}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls & Demo Switcher */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '10px',
          }}
          className="desktop-actions"
        >
          {/* Quick Demo Switchers for Reviewer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '4px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <button
              onClick={() => handleDemoSwitch('RECRUITER')}
              disabled={demoLoading}
              title="Instant login as Recruiter (Sarah Jenkins)"
              style={{
                fontSize: '0.75rem',
                padding: '4px 8px',
                borderRadius: '6px',
                background: user?.role === 'RECRUITER' ? '#6366f1' : 'transparent',
                color: user?.role === 'RECRUITER' ? '#fff' : '#94a3b8',
                fontWeight: 600,
              }}
            >
              Demo: Recruiter
            </button>
            <button
              onClick={() => handleDemoSwitch('CANDIDATE')}
              disabled={demoLoading}
              title="Instant login as Candidate (Alex Rivera)"
              style={{
                fontSize: '0.75rem',
                padding: '4px 8px',
                borderRadius: '6px',
                background: user?.role === 'CANDIDATE' ? '#10b981' : 'transparent',
                color: user?.role === 'CANDIDATE' ? '#fff' : '#94a3b8',
                fontWeight: 600,
              }}
            >
              Demo: Candidate
            </button>
          </div>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ textAlign: 'right', lineHeight: 1.2 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.name}</div>
                <span
                  className={`badge ${
                    user.role === 'RECRUITER' ? 'badge-info' : 'badge-success'
                  }`}
                  style={{ fontSize: '0.65rem' }}
                >
                  {user.role}
                </span>
              </div>
              <button
                onClick={logout}
                className="btn btn-secondary btn-sm"
                title="Log Out"
                style={{ padding: '6px 8px' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link href="/login" className="btn btn-secondary btn-sm">
                <LogIn size={15} /> Sign In
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: 'flex',
            color: '#fff',
            padding: 8,
          }}
          className="mobile-toggle"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            background: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border-color)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 0',
                color: pathname === item.href ? '#818cf8' : 'var(--text-primary)',
              }}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              onClick={() => {
                handleDemoSwitch('RECRUITER');
                setMobileMenuOpen(false);
              }}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1 }}
            >
              Demo: Recruiter
            </button>
            <button
              onClick={() => {
                handleDemoSwitch('CANDIDATE');
                setMobileMenuOpen(false);
              }}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1 }}
            >
              Demo: Candidate
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-actions {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
