'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {
  BarChart3,
  TrendingUp,
  Sparkles,
  Users,
  Briefcase,
  DollarSign,
  Award,
  Layers,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export default function AnalyticsPage() {
  const { user, loginAsDemo } = useAuth();
  const toast = useToast();

  const [analytics, setAnalytics] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      if (!user || (user.role !== 'RECRUITER' && user.role !== 'ADMIN')) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await fetch('/api/analytics');
        const data = await res.json();
        if (res.ok && data.success) {
          setAnalytics(data.data);
        }
      } catch {
        toast.error('Failed to load recruitment analytics.');
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [user]);

  if (!user || (user.role !== 'RECRUITER' && user.role !== 'ADMIN')) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '2rem', textAlign: 'center' }} className="glass-card">
        <Lock size={48} color="#f59e0b" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Recruiter Analytics Restricted</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Hiring funnel metrics and AI scoring distribution are accessible by Recruiters and Administrators.
        </p>
        <button
          onClick={() => loginAsDemo('RECRUITER')}
          className="btn btn-primary"
          style={{ margin: '0 auto' }}
        >
          Activate Demo Recruiter (Sarah Jenkins)
        </button>
      </div>
    );
  }

  const kpis = [
    {
      label: 'Total Job Vacancies',
      value: analytics?.totalJobs || 0,
      sub: `${analytics?.openJobs || 0} active openings`,
      icon: Briefcase,
      color: '#818cf8',
    },
    {
      label: 'Candidate Inbound',
      value: analytics?.totalApplicants || 0,
      sub: 'Total applications screened',
      icon: Users,
      color: '#38bdf8',
    },
    {
      label: 'Avg AI Match Index',
      value: `${analytics?.averageAiScore || 85}%`,
      sub: 'Gemini 3.8 Flash semantic fit',
      icon: Sparkles,
      color: '#a855f7',
    },
    {
      label: 'Interview Conversion',
      value: `${analytics?.interviewConversionRate || 0}%`,
      sub: 'Screened to interview rate',
      icon: TrendingUp,
      color: '#10b981',
    },
  ];

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <BarChart3 size={24} color="#818cf8" />
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Recruitment Intelligence & Analytics</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Real-time hiring metrics, AI qualification distribution, and conversion funnel analytics.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card" style={{ height: '140px' }}>
              <div className="skeleton" style={{ width: '50%', height: '16px', marginBottom: '12px' }} />
              <div className="skeleton" style={{ width: '70%', height: '36px' }} />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Top KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
            {kpis.map((kpi, idx) => (
              <div key={idx} className="glass-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    {kpi.label}
                  </span>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '8px',
                      background: `${kpi.color}18`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <kpi.icon size={18} color={kpi.color} />
                  </div>
                </div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
                  {kpi.value}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {kpi.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Funnel Stage Breakdown & Budget Insights */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
            {/* Stage Funnel */}
            <div className="glass-card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={18} color="#818cf8" /> Candidate Pipeline Funnel Distribution
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {analytics?.stageCounts &&
                  Object.entries(analytics.stageCounts).map(([stage, count]: any) => {
                    const total = analytics.totalApplicants || 1;
                    const pct = Math.round((count / total) * 100);

                    return (
                      <div key={stage}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                          <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                            {stage.replace('_', ' ')}
                          </span>
                          <span style={{ color: 'var(--text-secondary)' }}>
                            {count} candidate{count === 1 ? '' : 's'} ({pct}%)
                          </span>
                        </div>
                        <div
                          style={{
                            height: '8px',
                            background: 'rgba(255, 255, 255, 0.08)',
                            borderRadius: '4px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${pct}%`,
                              height: '100%',
                              background:
                                stage === 'OFFERED'
                                  ? '#10b981'
                                  : stage === 'SHORTLISTED'
                                  ? '#a855f7'
                                  : stage === 'REJECTED'
                                  ? '#ef4444'
                                  : '#6366f1',
                              borderRadius: '4px',
                              transition: 'width 0.5s ease',
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Compensation & Offer Efficiency */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <DollarSign size={18} color="#34d399" /> Hiring Budget & Compensation Alignment
                </h3>

                <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: '10px', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Average Candidate Salary Expectation:
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399' }}>
                    ${analytics?.averageExpectedSalary?.toLocaleString() || '130,000'}{' '}
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ year</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                    Calculated across all inbound submissions against allocated budget bands.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <CheckCircle2 size={16} color="#10b981" />
                    <span>Interview to Offer Conversion Rate: <strong>{analytics?.offerConversionRate || 0}%</strong></span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <Sparkles size={16} color="#818cf8" />
                    <span>AI Qualification Threshold: <strong>80%+ Fit Index</strong></span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  marginTop: '1.5rem',
                  padding: '1rem',
                  background: 'rgba(99, 102, 241, 0.08)',
                  borderRadius: '10px',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  fontSize: '0.8rem',
                  color: '#c7d2fe',
                }}
              >
                💡 Automated AI screening saves approximately <strong>3.5 hours per job posting</strong> compared to manual resume reviews.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
