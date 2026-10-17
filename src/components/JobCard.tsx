'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, DollarSign, Clock, Sparkles, Send, CheckCircle2 } from 'lucide-react';

interface JobCardProps {
  job: any;
  onApply: (job: any) => void;
  hasApplied?: boolean;
}

export default function JobCard({ job, onApply, hasApplied }: JobCardProps) {
  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Top Badges */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <span className="badge badge-info">{job.type.replace('_', ' ')}</span>
          <span className="badge badge-neutral">{job.experienceLevel} Level</span>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {new Date(job.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Title & Department */}
      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>
        <Link href={`/jobs/${job._id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
          {job.title}
        </Link>
      </h3>
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
        {job.department}
      </div>

      {/* Meta Row (Location & Salary) */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <MapPin size={15} color="#818cf8" />
          <span>{job.location}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#34d399', fontWeight: 600 }}>
          <DollarSign size={15} />
          <span>
            ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()} /yr
          </span>
        </div>
      </div>

      {/* Description Snippet */}
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem', flex: 1 }}>
        {job.description.length > 140 ? `${job.description.substring(0, 140)}...` : job.description}
      </p>

      {/* Required Skills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1.25rem' }}>
        {job.skills.slice(0, 4).map((skill: string, index: number) => (
          <span
            key={index}
            style={{
              fontSize: '0.75rem',
              padding: '3px 8px',
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
            }}
          >
            {skill}
          </span>
        ))}
        {job.skills.length > 4 && (
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
            +{job.skills.length - 4} more
          </span>
        )}
      </div>

      {/* Action Footer */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#c7d2fe' }}>
          <Sparkles size={14} color="#818cf8" />
          <span>AI Resume Match Ready</span>
        </div>

        {hasApplied ? (
          <button className="btn btn-secondary btn-sm" disabled style={{ color: '#34d399', display: 'flex', gap: 6, alignItems: 'center' }}>
            <CheckCircle2 size={15} /> Applied
          </button>
        ) : (
          <button onClick={() => onApply(job)} className="btn btn-primary btn-sm">
            <Send size={14} /> Quick Apply
          </button>
        )}
      </div>
    </div>
  );
}
