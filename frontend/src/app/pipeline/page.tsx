'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import AIMatchModal from '@/components/AIMatchModal';
import { PipelineStage, canTransitionStage, ALLOWED_TRANSITIONS } from '@/lib/pipeline';
import {
  Sparkles,
  Layers,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  User,
  DollarSign,
  Briefcase,
  XCircle,
  Eye,
  Lock,
} from 'lucide-react';

const STAGES: { key: PipelineStage; label: string; color: string }[] = [
  { key: 'APPLIED', label: '1. Inbound Applied', color: '#64748b' },
  { key: 'UNDER_REVIEW', label: '2. Under Review', color: '#38bdf8' },
  { key: 'AI_SCREENED', label: '3. AI Screened', color: '#818cf8' },
  { key: 'SHORTLISTED', label: '4. Shortlisted', color: '#a855f7' },
  { key: 'INTERVIEW_SCHEDULED', label: '5. Interviewing', color: '#f59e0b' },
  { key: 'OFFERED', label: '6. Offer Extended', color: '#10b981' },
  { key: 'REJECTED', label: 'Archived / Rejected', color: '#ef4444' },
];

export default function PipelinePage() {
  const { user, loginAsDemo } = useAuth();
  const toast = useToast();

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState('ALL');
  const [jobs, setJobs] = useState<any[]>([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [minAiScore, setMinAiScore] = useState(0);

  const [inspectingApp, setInspectingApp] = useState<any | null>(null);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      const data = await res.json();
      if (res.ok && data.success) {
        setJobs(data.jobs || []);
      }
    } catch {
      // Ignore
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const url =
        selectedJobId !== 'ALL'
          ? `/api/applications?jobId=${selectedJobId}`
          : '/api/applications';

      const res = await fetch(url);
      const data = await res.json();
      if (res.ok && data.success) {
        setApplications(data.applications || []);
      }
    } catch {
      toast.error('Failed to load candidate pipeline.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (user?.role === 'RECRUITER' || user?.role === 'ADMIN') {
      fetchApplications();
    } else {
      setLoading(false);
    }
  }, [user, selectedJobId]);

  const handleStageTransition = async (
    applicationId: string,
    targetStage: PipelineStage
  ) => {
    try {
      const res = await fetch('/api/pipeline', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId,
          targetStage,
          note: `Advanced to ${targetStage} by recruiter.`,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Candidate advanced to "${targetStage}"!`);
        // Update local state
        setApplications((prev) =>
          prev.map((app) =>
            app._id === applicationId
              ? { ...app, pipelineStage: targetStage }
              : app
          )
        );
      } else {
        toast.error(data.message || 'Illegal stage transition.');
      }
    } catch {
      toast.error('Network error during status transition.');
    }
  };

  if (!user || (user.role !== 'RECRUITER' && user.role !== 'ADMIN')) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '2rem', textAlign: 'center' }} className="glass-card">
        <Lock size={48} color="#f59e0b" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Recruiter Access Only</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          This multi-stage recruitment pipeline is restricted to Recruiters and Hiring Managers. Click below to activate Demo Recruiter Mode instantly:
        </p>
        <button
          onClick={async () => {
            await loginAsDemo('RECRUITER');
            window.location.reload();
          }}
          className="btn btn-primary"
          style={{ margin: '0 auto' }}
        >
          Activate Demo Recruiter (Sarah Jenkins)
        </button>
      </div>
    );
  }

  // Filtered applications
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      !searchFilter ||
      app.candidateName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      app.jobId?.title?.toLowerCase().includes(searchFilter.toLowerCase());

    const score = app.aiMatchReport?.score || 0;
    const matchesScore = score >= minAiScore;

    return matchesSearch && matchesScore;
  });

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Layers size={22} color="#818cf8" />
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Recruitment Pipeline Kanban</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Multi-stage hiring workflow with automated Gemini 3.8 Flash fit index scoring and audit history.
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            style={{ width: 'auto', minWidth: '220px' }}
          >
            <option value="ALL">All Job Openings ({jobs.length})</option>
            {jobs.map((j) => (
              <option key={j._id} value={j._id}>
                {j.title}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Search candidate..."
            style={{ width: '180px' }}
          />

          <button
            onClick={() => setMinAiScore(minAiScore === 80 ? 0 : 80)}
            className={`btn btn-sm ${minAiScore === 80 ? 'btn-primary' : 'btn-secondary'}`}
            style={{ display: 'flex', gap: 6, alignItems: 'center' }}
          >
            <Sparkles size={14} /> AI Score ≥ 80%
          </button>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '1rem',
          alignItems: 'start',
          overflowX: 'auto',
          paddingBottom: '2rem',
        }}
      >
        {STAGES.map((col) => {
          const colApps = filteredApps.filter((a) => a.pipelineStage === col.key);

          return (
            <div
              key={col.key}
              style={{
                background: 'rgba(18, 23, 34, 0.7)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '1rem',
                minHeight: '580px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Column Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                  paddingBottom: '0.75rem',
                  borderBottom: `2px solid ${col.color}`,
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>
                  {col.label}
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {colApps.length}
                </span>
              </div>

              {/* Cards list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                {colApps.length === 0 ? (
                  <div
                    style={{
                      border: '1px dashed rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '2rem 1rem',
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                      fontSize: '0.8rem',
                    }}
                  >
                    No candidates in this stage
                  </div>
                ) : (
                  colApps.map((app) => {
                    const score = app.aiMatchReport?.score || 70;
                    const scoreColor =
                      score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';

                    const allowedNext = ALLOWED_TRANSITIONS[col.key] || [];

                    return (
                      <div
                        key={app._id}
                        className="glass-card"
                        style={{
                          padding: '1rem',
                          borderRadius: '10px',
                          border: '1px solid var(--border-color)',
                          background: 'var(--bg-secondary)',
                        }}
                      >
                        {/* Candidate Top */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>
                              {app.candidateName}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {app.jobId?.title || 'Unknown Position'}
                            </div>
                          </div>

                          {/* AI Fit Index Badge */}
                          <div
                            onClick={() => setInspectingApp(app)}
                            title="Click to view deep AI Evaluation"
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '2px 8px',
                              borderRadius: '8px',
                              background: `${scoreColor}18`,
                              border: `1px solid ${scoreColor}44`,
                              color: scoreColor,
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            <Sparkles size={12} />
                            {score}%
                          </div>
                        </div>

                        {/* Meta info */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                          <span>{app.yearsOfExperience} yrs exp</span>
                          <span style={{ color: '#34d399', fontWeight: 600 }}>
                            ${app.expectedSalary?.toLocaleString()}
                          </span>
                        </div>

                        {/* Quick Action Buttons */}
                        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '0.6rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px' }}>
                          <button
                            onClick={() => setInspectingApp(app)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'flex', gap: 4, alignItems: 'center' }}
                          >
                            <Eye size={12} /> AI Report
                          </button>

                          {/* Next Stage Transitions */}
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {allowedNext
                              .filter((next) => next !== 'REJECTED')
                              .slice(0, 1)
                              .map((next) => (
                                <button
                                  key={next}
                                  onClick={() => handleStageTransition(app._id, next)}
                                  className="btn btn-primary btn-sm"
                                  style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'flex', gap: 4, alignItems: 'center' }}
                                >
                                  Advance <ArrowRight size={12} />
                                </button>
                              ))}

                            {allowedNext.includes('REJECTED') && (
                              <button
                                onClick={() => handleStageTransition(app._id, 'REJECTED')}
                                className="btn btn-danger btn-sm"
                                title="Reject / Archive Candidate"
                                style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                              >
                                <XCircle size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Inspect AI Modal */}
      {inspectingApp && (
        <AIMatchModal
          application={inspectingApp}
          onClose={() => setInspectingApp(null)}
          onUpdate={fetchApplications}
        />
      )}
    </div>
  );
}
