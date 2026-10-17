'use client';

import React, { useState } from 'react';
import { useToast } from '@/context/ToastContext';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Award,
  ChevronRight,
  TrendingUp,
  FileText,
} from 'lucide-react';

interface AIMatchModalProps {
  application: any;
  onClose: () => void;
  onUpdate: () => void;
}

export default function AIMatchModal({ application, onClose, onUpdate }: AIMatchModalProps) {
  const toast = useToast();
  const [reEvaluating, setReEvaluating] = useState(false);
  const [appData, setAppData] = useState(application);

  const report = appData.aiMatchReport || {
    score: 75,
    summary: 'Awaiting AI deep evaluation.',
    matchedSkills: [],
    missingSkills: [],
    strengths: ['Application received.'],
    weaknesses: ['Evaluation in progress.'],
    recommendation: 'POTENTIAL_FIT',
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#f59e0b'; // Amber
    return '#ef4444'; // Red
  };

  const getRecommendationBadge = (rec: string) => {
    switch (rec) {
      case 'HIGHLY_RECOMMENDED':
        return <span className="badge badge-success">Highly Recommended</span>;
      case 'POTENTIAL_FIT':
        return <span className="badge badge-warning">Potential Fit</span>;
      case 'NEEDS_UPSKILLING':
        return <span className="badge badge-danger">Needs Upskilling</span>;
      default:
        return <span className="badge badge-neutral">Standard</span>;
    }
  };

  const handleReEvaluate = async () => {
    try {
      setReEvaluating(true);
      const res = await fetch('/api/ai/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: appData._id }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAppData((prev: any) => ({
          ...prev,
          aiMatchReport: data.aiMatchReport,
          pipelineStage: data.pipelineStage,
        }));
        toast.success(`Gemini 3.8 Flash re-evaluation finished! New score: ${data.aiMatchReport.score}%`);
        onUpdate();
      } else {
        toast.error(data.message || 'Re-evaluation failed.');
      }
    } catch {
      toast.error('Network error during AI evaluation.');
    } finally {
      setReEvaluating(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span className="badge badge-neutral">{appData.jobId?.title || 'Target Job'}</span>
              {getRecommendationBadge(report.recommendation)}
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>
              AI Match Evaluation: {appData.candidateName}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              {appData.candidateEmail} • {appData.yearsOfExperience} yrs exp • Ask: ${appData.expectedSalary?.toLocaleString()}
            </p>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {/* Score & AI Summary Callout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '130px 1fr',
            gap: '1.5rem',
            background: 'rgba(26, 34, 51, 0.6)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '1.25rem',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}
        >
          {/* Circular Score Meter */}
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: `4px solid ${getScoreColor(report.score)}`,
                boxShadow: `0 0 20px ${getScoreColor(report.score)}33`,
              }}
            >
              <span style={{ fontSize: '1.7rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                {report.score}
              </span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>/ 100</span>
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: getScoreColor(report.score), marginTop: '6px' }}>
              Fit Index
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c7d2fe', fontSize: '0.8rem', fontWeight: 600, marginBottom: '4px' }}>
              <Sparkles size={14} color="#818cf8" /> Executive AI Assessment (Gemini 3.8 Flash)
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
              {report.summary}
            </p>
          </div>
        </div>

        {/* Skills Breakdown Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          {/* Matched Skills */}
          <div style={{ background: 'var(--bg-tertiary)', borderRadius: '10px', padding: '1rem', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#34d399', marginBottom: '8px' }}>
              <CheckCircle2 size={16} /> Verified Matched Skills ({report.matchedSkills?.length || 0})
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {report.matchedSkills?.length ? (
                report.matchedSkills.map((s: string, idx: number) => (
                  <span key={idx} className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                    {s}
                  </span>
                ))
              ) : (
                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>No direct skill overlap found.</span>
              )}
            </div>
          </div>

          {/* Missing Skills */}
          <div style={{ background: 'var(--bg-tertiary)', borderRadius: '10px', padding: '1rem', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#f87171', marginBottom: '8px' }}>
              <AlertTriangle size={16} /> Skill Gaps & Deficits ({report.missingSkills?.length || 0})
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {report.missingSkills?.length ? (
                report.missingSkills.map((s: string, idx: number) => (
                  <span key={idx} className="badge badge-danger" style={{ fontSize: '0.75rem' }}>
                    {s}
                  </span>
                ))
              ) : (
                <span style={{ color: '#34d399', fontSize: '0.8rem' }}>All required job skills fulfilled!</span>
              )}
            </div>
          </div>
        </div>

        {/* Strengths & Growth Areas */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>
            Key Strengths Highlighted by AI:
          </h4>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {report.strengths?.map((str: string, i: number) => (
              <li key={i}>{str}</li>
            ))}
          </ul>
        </div>

        {/* Resume Extract Preview */}
        <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
            <FileText size={14} /> Resume Content Snippet
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxHeight: '100px', overflowY: 'auto', whiteSpace: 'pre-line' }}>
            {appData.resumeText}
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
          <button
            onClick={handleReEvaluate}
            disabled={reEvaluating}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', gap: '6px', alignItems: 'center' }}
          >
            <RefreshCw size={14} className={reEvaluating ? 'spin-animate' : ''} />
            {reEvaluating ? 'Running Gemini 3.8 Flash...' : 'Re-run AI Deep Match'}
          </button>

          <button onClick={onClose} className="btn btn-primary btn-sm">
            Close Evaluation
          </button>
        </div>

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
