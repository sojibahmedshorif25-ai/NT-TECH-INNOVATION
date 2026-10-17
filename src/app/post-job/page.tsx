'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Briefcase, Plus, X, Sparkles, Send, Lock } from 'lucide-react';

export default function PostJobPage() {
  const router = useRouter();
  const { user, loginAsDemo } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering',
    location: 'Remote',
    type: 'FULL_TIME',
    experienceLevel: 'SENIOR',
    salaryMin: 110000,
    salaryMax: 145000,
    currency: 'USD',
    description: '',
    requirements: ['5+ years software engineering experience', 'Strong system design skills'],
    skills: ['TypeScript', 'Next.js', 'Node.js', 'MongoDB'],
  });

  const [newSkill, setNewSkill] = useState('');
  const [newReq, setNewReq] = useState('');
  const [loading, setLoading] = useState(false);

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter((s) => s !== skill) });
  };

  const addRequirement = () => {
    if (newReq.trim()) {
      setFormData({ ...formData, requirements: [...formData.requirements, newReq.trim()] });
      setNewReq('');
    }
  };

  const removeRequirement = (index: number) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter((_, i) => i !== index),
    });
  };

  const fillTemplate = () => {
    setFormData({
      title: 'Senior Cloud Solutions Engineer (Next.js & AWS)',
      department: 'Platform Engineering',
      location: 'Remote (Worldwide)',
      type: 'FULL_TIME',
      experienceLevel: 'SENIOR',
      salaryMin: 125000,
      salaryMax: 160000,
      currency: 'USD',
      description:
        'We are seeking an experienced Cloud Solutions Engineer to spearhead our serverless architecture, optimize database queries, and build AI evaluation microservices.',
      requirements: [
        '5+ years full-stack engineering with TypeScript and Node.js',
        'Expertise in MongoDB Atlas, schema design, and query optimization',
        'Demonstrated experience building and testing production REST APIs',
      ],
      skills: ['TypeScript', 'Next.js', 'Node.js', 'MongoDB', 'AWS', 'Docker'],
    });
    toast.info('Sample job template populated!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error('Please fill in all required job fields.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Job vacancy published successfully!');
        router.push('/');
      } else {
        toast.error(data.message || 'Failed to post job.');
      }
    } catch {
      toast.error('Network error while posting job.');
    } finally {
      setLoading(false);
    }
  };

  if (!user || (user.role !== 'RECRUITER' && user.role !== 'ADMIN')) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '2rem', textAlign: 'center' }} className="glass-card">
        <Lock size={48} color="#818cf8" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Recruiter Access Only</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Publishing new job openings is restricted to verified Recruiters.
        </p>
        <button onClick={() => loginAsDemo('RECRUITER')} className="btn btn-primary" style={{ margin: '0 auto' }}>
          Activate Demo Recruiter (Sarah Jenkins)
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Briefcase size={22} color="#818cf8" />
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Publish New Job Vacancy</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            New openings are immediately accessible to candidates and screened automatically via Gemini AI.
          </p>
        </div>

        <button
          type="button"
          onClick={fillTemplate}
          className="btn btn-secondary btn-sm"
          style={{ display: 'flex', gap: 6, alignItems: 'center' }}
        >
          <Sparkles size={14} color="#818cf8" /> Load Job Template
        </button>
      </div>

      <form onSubmit={handleSubmit} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
            Job Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Senior Full Stack Engineer (Next.js & TypeScript)"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Department *
            </label>
            <input
              type="text"
              required
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="Engineering, AI, Product"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Location *
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Remote, Dhaka, Hybrid"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Job Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
            >
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="REMOTE">Remote</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Experience Level
            </label>
            <select
              value={formData.experienceLevel}
              onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value as any })}
            >
              <option value="ENTRY">Entry Level</option>
              <option value="MID">Mid Level</option>
              <option value="SENIOR">Senior Level</option>
              <option value="LEAD">Lead / Architect</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Minimum Salary ($/yr) *
            </label>
            <input
              type="number"
              min="1000"
              step="5000"
              required
              value={formData.salaryMin}
              onChange={(e) => setFormData({ ...formData, salaryMin: Number(e.target.value) })}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
              Maximum Salary ($/yr) *
            </label>
            <input
              type="number"
              min="1000"
              step="5000"
              required
              value={formData.salaryMax}
              onChange={(e) => setFormData({ ...formData, salaryMax: Number(e.target.value) })}
            />
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
            Job Description *
          </label>
          <textarea
            rows={5}
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed description of the responsibilities and scope..."
          />
        </div>

        {/* Required Skills Tags */}
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
            Required Skills (Used by Gemini AI for Match Scoring) *
          </label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add skill (e.g. Next.js, Docker, Python)..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill();
                }
              }}
            />
            <button type="button" onClick={addSkill} className="btn btn-secondary">
              <Plus size={16} /> Add
            </button>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {formData.skills.map((skill) => (
              <span key={skill} className="badge badge-info" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {skill}
                <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeSkill(skill)} />
              </span>
            ))}
          </div>
        </div>

        {/* Requirements list */}
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
            Key Requirements (At least 1) *
          </label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input
              type="text"
              value={newReq}
              onChange={(e) => setNewReq(e.target.value)}
              placeholder="Add requirement..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addRequirement();
                }
              }}
            />
            <button type="button" onClick={addRequirement} className="btn btn-secondary">
              <Plus size={16} /> Add
            </button>
          </div>

          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {formData.requirements.map((req, idx) => (
              <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{req}</span>
                <X size={14} color="#f87171" style={{ cursor: 'pointer' }} onClick={() => removeRequirement(idx)} />
              </li>
            ))}
          </ul>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '1rem' }}>
          <button type="button" onClick={() => router.push('/')} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <Send size={16} /> {loading ? 'Publishing...' : 'Publish Vacancy'}
          </button>
        </div>
      </form>
    </div>
  );
}
