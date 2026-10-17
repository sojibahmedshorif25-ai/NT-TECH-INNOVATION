'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { X, Sparkles, Send, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface ApplicationModalProps {
  job: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ApplicationModal({ job, onClose, onSuccess }: ApplicationModalProps) {
  const { user } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    candidateName: user?.name || '',
    candidateEmail: user?.email || '',
    candidatePhone: '+1 (555) 234-8891',
    portfolioUrl: 'https://github.com/developer',
    yearsOfExperience: 5,
    expectedSalary: Math.round((job.salaryMin + job.salaryMax) / 2),
    resumeText: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fillSampleResume = () => {
    setFormData((prev) => ({
      ...prev,
      candidateName: prev.candidateName || 'Alex Rivera',
      candidateEmail: prev.candidateEmail || 'candidate@smarthire.com',
      resumeText: `Senior Software Engineer with 5+ years building scalable web architectures with Next.js, React, Node.js, and MongoDB.
Demonstrated skills: ${job.skills.join(', ')}.
Key Achievements:
- Designed and maintained high-throughput REST APIs handling 5,000 req/sec with 99.98% uptime.
- Led the migration of legacy monolith to Next.js App Router and microservices architecture.
- Integrated generative AI evaluation pipelines reducing manual screening cycle times by 60%.`,
    }));
    toast.info('Sample tech resume loaded into application!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!user) {
      toast.warning('Please sign in or use Demo Candidate login before applying.');
      return;
    }

    if (formData.resumeText.length < 50) {
      setErrorMsg('Please enter or generate at least 50 characters of resume text for the AI evaluator.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job._id,
          ...formData,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Application submitted! Gemini AI Match Score: ${data.application.aiMatchReport?.score || 85}%`);
        onSuccess();
        onClose();
      } else {
        setErrorMsg(data.message || 'Failed to submit application.');
        toast.error(data.message || 'Submission error.');
      }
    } catch {
      setErrorMsg('Network error while communicating with server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-info">{job.type.replace('_', ' ')}</span>
              <span className="badge badge-neutral">{job.experienceLevel} Level</span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginTop: '6px' }}>Apply for {job.title}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{job.department} • {job.location}</p>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {/* Error notification banner */}
        {errorMsg && (
          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'var(--danger-bg)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              color: '#f87171',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '1rem',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.candidateName}
                onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                placeholder="e.g. Alex Rivera"
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.candidateEmail}
                onChange={(e) => setFormData({ ...formData, candidateEmail: e.target.value })}
                placeholder="alex@example.com"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Years of Experience *
              </label>
              <input
                type="number"
                min="0"
                max="40"
                required
                value={formData.yearsOfExperience}
                onChange={(e) => setFormData({ ...formData, yearsOfExperience: Number(e.target.value) })}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Expected Salary ($/yr) *
              </label>
              <input
                type="number"
                min="1000"
                step="1000"
                required
                value={formData.expectedSalary}
                onChange={(e) => setFormData({ ...formData, expectedSalary: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Portfolio / GitHub URL
            </label>
            <input
              type="url"
              value={formData.portfolioUrl}
              onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
              placeholder="https://github.com/username"
            />
          </div>

          {/* Resume Text area with AI screening highlight */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Resume / Key Experience (Screened by Gemini 3.8 Flash) *
              </label>
              <button
                type="button"
                onClick={fillSampleResume}
                style={{
                  fontSize: '0.75rem',
                  color: '#818cf8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 600,
                  textDecoration: 'underline',
                }}
              >
                <Sparkles size={13} /> Auto-Fill Sample Resume
              </button>
            </div>
            <textarea
              rows={5}
              required
              value={formData.resumeText}
              onChange={(e) => setFormData({ ...formData, resumeText: e.target.value })}
              placeholder="Paste your resume content, technical background, projects, and skills here..."
              style={{ resize: 'vertical' }}
            />
          </div>

          <div
            style={{
              padding: '10px 14px',
              backgroundColor: 'rgba(99, 102, 241, 0.08)',
              border: '1px solid rgba(99, 102, 241, 0.25)',
              borderRadius: '8px',
              fontSize: '0.8rem',
              color: '#c7d2fe',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Sparkles size={16} color="#818cf8" style={{ flexShrink: 0 }} />
            <span>
              Upon submission, Gemini 3.8 Flash will evaluate your skills against <strong>{job.skills.join(', ')}</strong> in real-time.
            </span>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={16} className="spin-animate" /> Evaluating with AI...
                </>
              ) : (
                <>
                  <Send size={16} /> Submit & Screen Application
                </>
              )}
            </button>
          </div>
        </form>

        <style jsx>{`
          .spin-animate {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
