'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import JobCard from '@/components/JobCard';
import ApplicationModal from '@/components/ApplicationModal';
import {
  Sparkles,
  Search,
  Filter,
  Briefcase,
  TrendingUp,
  Cpu,
  Layers,
  CheckCircle2,
  Users,
} from 'lucide-react';

export default function HomePage() {
  const { user, loginAsDemo } = useAuth();
  const toast = useToast();

  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);

  const [activeJobForApply, setActiveJobForApply] = useState<any | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (selectedType !== 'ALL') params.append('type', selectedType);
      if (selectedLevel !== 'ALL') params.append('level', selectedLevel);

      const res = await fetch(`/api/jobs?${params.toString()}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setJobs(data.jobs || []);
      }
    } catch {
      toast.error('Failed to load job listings.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    if (!user || user.role !== 'CANDIDATE') return;
    try {
      const res = await fetch('/api/applications');
      const data = await res.json();
      if (res.ok && data.success) {
        const ids = data.applications.map((a: any) => a.jobId?._id || a.jobId);
        setAppliedJobIds(ids);
      }
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [selectedType, selectedLevel]);

  useEffect(() => {
    fetchMyApplications();
  }, [user]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Hero Section */}
      <section
        style={{
          textAlign: 'center',
          padding: '3rem 1rem 4rem',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '9999px',
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: '#c7d2fe',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1.25rem',
          }}
        >
          <Sparkles size={16} color="#818cf8" />
          <span>Next-Gen Talent Acquisition with Google Gemini 3.8 Flash</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem',
            background: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Autonomous AI Candidate Screening & <br />
          <span
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Multi-Stage Pipeline Management
          </span>
        </h1>

        <p
          style={{
            fontSize: '1.1rem',
            color: 'var(--text-secondary)',
            maxWidth: '680px',
            margin: '0 auto 2rem',
            lineHeight: 1.6,
          }}
        >
          Eliminate manual screening fatigue. Candidates submit applications and receive instant, objective semantic evaluations. Recruiters oversee candidates through a rigorous pipeline state machine.
        </p>

        {/* Quick Demo Switcher Card for Evaluators */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 18px',
            borderRadius: '12px',
            background: 'rgba(18, 23, 34, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: 'var(--shadow-md)',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            ⚡ Instant Review Mode:
          </span>
          <button
            onClick={async () => {
              await loginAsDemo('RECRUITER');
              toast.success('Switched to Recruiter Mode (Sarah Jenkins)');
              window.location.href = '/pipeline';
            }}
            className="btn btn-secondary btn-sm"
            style={{
              background: user?.role === 'RECRUITER' ? '#4f46e5' : 'rgba(255,255,255,0.06)',
              color: '#fff',
            }}
          >
            <Users size={14} /> Recruiter Pipeline View
          </button>
          <button
            onClick={async () => {
              await loginAsDemo('CANDIDATE');
              toast.success('Switched to Candidate Mode (Alex Rivera)');
              window.location.href = '/';
            }}
            className="btn btn-secondary btn-sm"
            style={{
              background: user?.role === 'CANDIDATE' ? '#059669' : 'rgba(255,255,255,0.06)',
              color: '#fff',
            }}
          >
            <CheckCircle2 size={14} /> Candidate 1-Click Apply View
          </button>
        </div>
      </section>

      {/* Search & Filters Bar */}
      <section style={{ marginBottom: '2.5rem' }}>
        <form
          onSubmit={handleSearchSubmit}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            background: 'var(--bg-card)',
            padding: '1.25rem',
            borderRadius: '14px',
            border: '1px solid var(--border-color)',
            alignItems: 'center',
          }}
        >
          <div style={{ flex: '1 1 280px', position: 'relative' }}>
            <Search
              size={18}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by job title, department, or skills (e.g. Next.js, Node.js)..."
              style={{ paddingLeft: '40px' }}
            />
          </div>

          <div style={{ flex: '0 1 180px' }}>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="ALL">All Job Types</option>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="REMOTE">Remote</option>
            </select>
          </div>

          <div style={{ flex: '0 1 180px' }}>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value="ALL">All Seniority</option>
              <option value="ENTRY">Entry Level</option>
              <option value="MID">Mid Level</option>
              <option value="SENIOR">Senior Level</option>
              <option value="LEAD">Lead / Architect</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.5rem' }}>
            Filter Jobs
          </button>
        </form>
      </section>

      {/* Jobs Grid Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>
          Featured Job Vacancies{' '}
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            ({jobs.length} open positions)
          </span>
        </h2>
      </div>

      {/* Loading Skeleton State */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card" style={{ height: 260 }}>
              <div className="skeleton" style={{ width: '40%', height: 24, marginBottom: 16 }} />
              <div className="skeleton" style={{ width: '80%', height: 28, marginBottom: 12 }} />
              <div className="skeleton" style={{ width: '60%', height: 20, marginBottom: 24 }} />
              <div className="skeleton" style={{ width: '100%', height: 60, marginBottom: 20 }} />
              <div className="skeleton" style={{ width: '30%', height: 32 }} />
            </div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div
          className="glass-card"
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            color: 'var(--text-secondary)',
          }}
        >
          <Briefcase size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '6px' }}>No Job Vacancies Found</h3>
          <p style={{ maxWidth: '400px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
            Try adjusting your search filters or click reset to view all open positions.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedType('ALL');
              setSelectedLevel('ALL');
            }}
            className="btn btn-secondary"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              onApply={(j) => setActiveJobForApply(j)}
              hasApplied={appliedJobIds.includes(job._id)}
            />
          ))}
        </div>
      )}

      {/* Application Modal */}
      {activeJobForApply && (
        <ApplicationModal
          job={activeJobForApply}
          onClose={() => setActiveJobForApply(null)}
          onSuccess={() => {
            fetchMyApplications();
            fetchJobs();
          }}
        />
      )}
    </div>
  );
}
