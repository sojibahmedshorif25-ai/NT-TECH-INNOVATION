'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import ApplicationModal from '@/components/ApplicationModal';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Share2,
  Send,
  Building,
} from 'lucide-react';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const toast = useToast();

  const [job, setJob] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  const jobId = params?.id as string;

  useEffect(() => {
    async function fetchJob() {
      if (!jobId) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/jobs/${jobId}`);
        const data = await res.json();
        if (res.ok && data.success) {
          setJob(data.job);
        } else {
          toast.error(data.message || 'Job vacancy not found.');
        }
      } catch {
        toast.error('Network error loading job details.');
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [jobId]);

  useEffect(() => {
    async function checkMyApplication() {
      if (!user || user.role !== 'CANDIDATE' || !jobId) return;
      try {
        const res = await fetch('/api/applications');
        const data = await res.json();
        if (res.ok && data.success) {
          const applied = data.applications.some(
            (a: any) => (a.jobId?._id || a.jobId) === jobId
          );
          setHasApplied(applied);
        }
      } catch {
        // Ignore
      }
    }
    checkMyApplication();
  }, [user, jobId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Job link copied to clipboard!');
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '900px', margin: '3rem auto', padding: '0 1.5rem' }}>
        <div className="glass-card" style={{ height: '400px' }}>
          <div className="skeleton" style={{ width: '40%', height: '32px', marginBottom: '16px' }} />
          <div className="skeleton" style={{ width: '60%', height: '24px', marginBottom: '24px' }} />
          <div className="skeleton" style={{ width: '100%', height: '180px' }} />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '2rem', textAlign: 'center' }} className="glass-card">
        <Briefcase size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>Job Vacancy Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          This opening may have been closed or removed.
        </p>
        <Link href="/" className="btn btn-primary">
          Browse All Openings
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Back button */}
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          color: 'var(--text-secondary)',
          fontSize: '0.85rem',
          marginBottom: '1.5rem',
          fontWeight: 500,
        }}
      >
        <ArrowLeft size={16} /> Back to all jobs
      </Link>

      <div className="glass-card" style={{ marginBottom: '2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-info">{job.type.replace('_', ' ')}</span>
              <span className="badge badge-neutral">{job.experienceLevel} Level</span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
              {job.title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              <Building size={16} color="#818cf8" />
              <span>{job.department}</span>
              <span>•</span>
              <MapPin size={16} color="#818cf8" />
              <span>{job.location}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleCopyLink} className="btn btn-secondary btn-sm" title="Share link">
              <Share2 size={16} /> Share
            </button>
            {hasApplied ? (
              <button className="btn btn-secondary" disabled style={{ color: '#34d399', display: 'flex', gap: 6, alignItems: 'center' }}>
                <CheckCircle2 size={16} /> Already Applied
              </button>
            ) : (
              <button onClick={() => setApplyModalOpen(true)} className="btn btn-primary" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <Send size={16} /> Apply with AI Screen
              </button>
            )}
          </div>
        </div>

        {/* Salary & Meta Highlights */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: '10px', marginBottom: '2rem', border: '1px solid var(--border-color)' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Allocated Compensation</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#34d399' }}>
              ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Seniority Expectation</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>
              {job.experienceLevel} Level
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Evaluation Engine</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#c7d2fe', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Sparkles size={14} color="#818cf8" /> Gemini 3.8 Flash
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem', color: '#fff' }}>
            Role Overview & Responsibilities
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
            {job.description}
          </p>
        </div>

        {/* Required Skills */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem', color: '#fff' }}>
            Target Core Skills (Verified by AI Screen)
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {job.skills.map((skill: string, idx: number) => (
              <span key={idx} className="badge badge-info" style={{ fontSize: '0.8rem', padding: '4px 10px' }}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Key Requirements */}
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem', color: '#fff' }}>
            Requirements & Technical Prerequisites
          </h3>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px', lineHeight: 1.5 }}>
            {job.requirements.map((req: string, idx: number) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Apply Modal */}
      {applyModalOpen && (
        <ApplicationModal
          job={job}
          onClose={() => setApplyModalOpen(false)}
          onSuccess={() => {
            setHasApplied(true);
            toast.success('Your application was submitted and evaluated successfully!');
          }}
        />
      )}
    </div>
  );
}
