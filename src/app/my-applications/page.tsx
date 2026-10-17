'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  Clock,
  Briefcase,
  AlertCircle,
  ExternalLink,
  Lock,
} from 'lucide-react';

export default function MyApplicationsPage() {
  const { user, loginAsDemo } = useAuth();
  const toast = useToast();

  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadApps() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await fetch('/api/applications');
        const data = await res.json();
        if (res.ok && data.success) {
          setApplications(data.applications || []);
        }
      } catch {
        toast.error('Failed to load your submitted applications.');
      } finally {
        setLoading(false);
      }
    }
    loadApps();
  }, [user]);

  if (!user) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '2rem', textAlign: 'center' }} className="glass-card">
        <Lock size={48} color="#818cf8" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Sign in to View Applications</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Please sign in to track the live stage of your job applications and review AI fit feedback.
        </p>
        <button
          onClick={() => loginAsDemo('CANDIDATE')}
          className="btn btn-primary"
          style={{ margin: '0 auto' }}
        >
          Activate Demo Candidate (Alex Rivera)
        </button>
      </div>
    );
  }

  const stageSteps = [
    'APPLIED',
    'UNDER_REVIEW',
    'AI_SCREENED',
    'SHORTLISTED',
    'INTERVIEW_SCHEDULED',
    'OFFERED',
  ];

  const getStageIndex = (stage: string) => {
    return stageSteps.indexOf(stage);
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <FileText size={22} color="#10b981" />
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>My Job Applications</h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Track real-time hiring pipeline progress and review your personalized Gemini 3.8 Flash technical fit reports.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {[1, 2].map((i) => (
            <div key={i} className="glass-card" style={{ height: '180px' }}>
              <div className="skeleton" style={{ width: '40%', height: '24px', marginBottom: '16px' }} />
              <div className="skeleton" style={{ width: '70%', height: '20px', marginBottom: '20px' }} />
              <div className="skeleton" style={{ width: '100%', height: '40px' }} />
            </div>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Briefcase size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '8px' }}>
            No Active Applications Yet
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            You haven’t applied for any positions yet. Explore our open vacancies and get screened instantly!
          </p>
          <Link href="/" className="btn btn-primary" style={{ display: 'inline-flex' }}>
            Browse Job Vacancies
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {applications.map((app) => {
            const currentIdx = getStageIndex(app.pipelineStage);
            const isRejected = app.pipelineStage === 'REJECTED';
            const aiScore = app.aiMatchReport?.score || 85;

            return (
              <div key={app._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Top info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span className="badge badge-info">{app.jobId?.type?.replace('_', ' ') || 'FULL TIME'}</span>
                      <span className="badge badge-neutral">{app.jobId?.location || 'Remote'}</span>
                    </div>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>
                      {app.jobId?.title || 'Engineering Role'}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      Applied on {new Date(app.createdAt).toLocaleDateString()} • Ask: ${app.expectedSalary?.toLocaleString()}/yr
                    </p>
                  </div>

                  {/* AI Score pill */}
                  <div
                    style={{
                      background: 'rgba(99, 102, 241, 0.1)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      borderRadius: '10px',
                      padding: '8px 14px',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#818cf8', fontSize: '0.75rem', fontWeight: 600 }}>
                      <Sparkles size={13} /> Gemini AI Fit
                    </div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff' }}>
                      {aiScore}%
                    </div>
                  </div>
                </div>

                {/* Pipeline Stage Tracker */}
                <div style={{ background: 'var(--bg-tertiary)', borderRadius: '10px', padding: '1.25rem', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    Application Pipeline Status:
                  </div>

                  {isRejected ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', fontSize: '0.9rem' }}>
                      <AlertCircle size={18} />
                      <span>Application Archived / Not selected for this opening.</span>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        position: 'relative',
                        flexWrap: 'wrap',
                        gap: '8px',
                      }}
                    >
                      {stageSteps.map((st, idx) => {
                        const isDone = idx <= currentIdx;
                        const isCurrent = idx === currentIdx;

                        return (
                          <div
                            key={st}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '0.75rem',
                              fontWeight: isCurrent ? 700 : 500,
                              color: isCurrent
                                ? '#818cf8'
                                : isDone
                                ? '#34d399'
                                : 'var(--text-muted)',
                            }}
                          >
                            <div
                              style={{
                                width: 22,
                                height: 22,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: isCurrent
                                  ? '#6366f1'
                                  : isDone
                                  ? '#059669'
                                  : 'rgba(255, 255, 255, 0.08)',
                                color: '#fff',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                              }}
                            >
                              {isDone ? '✓' : idx + 1}
                            </div>
                            <span>{st.replace('_', ' ')}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* AI Feedback Box */}
                {app.aiMatchReport && (
                  <div
                    style={{
                      background: 'rgba(26, 34, 51, 0.5)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '10px',
                      padding: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c7d2fe', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
                      <Sparkles size={14} color="#818cf8" /> AI Screening Summary & Feedback
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '8px' }}>
                      {app.aiMatchReport.summary}
                    </p>

                    {/* Matched skills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {app.aiMatchReport.matchedSkills?.map((skill: string, sIdx: number) => (
                        <span key={sIdx} className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                          ✓ {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
