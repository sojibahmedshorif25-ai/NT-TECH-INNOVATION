'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  Database,
  Cpu,
  Shield,
  FileCheck2,
  Terminal,
  Sparkles,
  ArrowRight,
  Workflow,
  CheckCircle2,
} from 'lucide-react';

export default function SystemDocsPage() {
  const [activeTab, setActiveTab] = useState<'architecture' | 'database' | 'pipeline' | 'ai' | 'apis'>('architecture');

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Title */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '999px', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.3)', color: '#c7d2fe', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px' }}>
          <Workflow size={14} color="#818cf8" />
          <span>Technical Architecture & Assessment Documentation</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>System Architecture & Engineering Specification</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>
          Deep-dive technical review: Entity relationships, state machine rules, Gemini 3.8 Flash scoring formula, and API contracts.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '2rem', overflowX: 'auto' }}>
        {[
          { key: 'architecture', label: '1. Architecture & Flow', icon: Layers },
          { key: 'database', label: '2. Database Schema (ERD)', icon: Database },
          { key: 'pipeline', label: '3. State Machine Logic', icon: Workflow },
          { key: 'ai', label: '4. Gemini 3.8 Flash AI Model', icon: Cpu },
          { key: 'apis', label: '5. REST API Contracts', icon: Terminal },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`btn btn-sm ${active ? 'btn-primary' : 'btn-secondary'}`}
              style={{ display: 'flex', gap: 6, alignItems: 'center', whiteSpace: 'nowrap' }}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Architecture */}
      {activeTab === 'architecture' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card">
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem', color: '#fff' }}>
              High-Level Architectural Blueprint
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              SmartHire AI is engineered as a unified Next.js 16 full-stack architecture running on Turbopack. It unifies client components, server actions, RESTful route handlers, and external AI orchestrations into a single, cohesive, production-grade system.
            </p>

            <div style={{ background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              <div>
                <h4 style={{ color: '#818cf8', fontWeight: 700, marginBottom: '8px' }}>Frontend Layer</h4>
                <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li>• React 19 Client & Server Components</li>
                  <li>• Responsive Vanilla CSS Design System with tokens</li>
                  <li>• Toast Notification Provider & Skeleton States</li>
                  <li>• Interactive Kanban board with optimistic stage updates</li>
                </ul>
              </div>

              <div>
                <h4 style={{ color: '#34d399', fontWeight: 700, marginBottom: '8px' }}>Backend & Persistence</h4>
                <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li>• Next.js App Router REST API endpoints</li>
                  <li>• Cloud MongoDB Atlas database persistence</li>
                  <li>• Bcrypt password hashing & JWT session cookies</li>
                  <li>• Strict Zod input validation on all routes</li>
                </ul>
              </div>

              <div>
                <h4 style={{ color: '#f472b6', fontWeight: 700, marginBottom: '8px' }}>AI & Business Logic</h4>
                <ul style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li>• Google Gemini 3.8 Flash semantic evaluator</li>
                  <li>• 7-Stage recruitment state machine validator</li>
                  <li>• Composite candidate fit index algorithm</li>
                  <li>• Automatic NLP heuristic fallback engine</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Database Schema */}
      {activeTab === 'database' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card">
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem', color: '#fff' }}>
              MongoDB Atlas Entity Relationships & Data Integrity
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
              <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 700, color: '#818cf8', marginBottom: '8px', fontSize: '1rem' }}>User Collection</div>
                <pre style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', overflowX: 'auto', background: 'var(--bg-primary)', padding: '10px', borderRadius: '6px' }}>
{`{
  _id: ObjectId,
  name: String,
  email: String (unique, index),
  passwordHash: String,
  role: 'CANDIDATE' | 'RECRUITER' | 'ADMIN',
  title: String,
  skills: [String],
  createdAt: Date
}`}
                </pre>
              </div>

              <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 700, color: '#34d399', marginBottom: '8px', fontSize: '1rem' }}>Job Collection</div>
                <pre style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', overflowX: 'auto', background: 'var(--bg-primary)', padding: '10px', borderRadius: '6px' }}>
{`{
  _id: ObjectId,
  title: String,
  department: String,
  location: String,
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'REMOTE',
  salaryMin: Number,
  salaryMax: Number,
  skills: [String],
  status: 'OPEN' | 'PAUSED' | 'CLOSED',
  recruiterId: ObjectId (Ref: User)
}`}
                </pre>
              </div>

              <div style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 700, color: '#f59e0b', marginBottom: '8px', fontSize: '1rem' }}>Application Collection</div>
                <pre style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', overflowX: 'auto', background: 'var(--bg-primary)', padding: '10px', borderRadius: '6px' }}>
{`{
  _id: ObjectId,
  jobId: ObjectId (Ref: Job),
  candidateId: ObjectId (Ref: User),
  pipelineStage: PipelineStage (Indexed),
  stageHistory: [{
    fromStage: String,
    toStage: String,
    changedBy: ObjectId,
    changedAt: Date
  }],
  aiMatchReport: {
    score: Number (0-100),
    summary: String,
    matchedSkills: [String],
    missingSkills: [String],
    recommendation: String
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: State Machine */}
      {activeTab === 'pipeline' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card">
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem', color: '#fff' }}>
              Rigorous Recruitment Pipeline State Machine
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Hiring decisions must follow strict governance. Candidates cannot skip interview steps or jump straight from inbound application to offer. Every transition is audited with timestamp and recruiter attribution.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { stage: '1. APPLIED', transitions: ['UNDER_REVIEW', 'AI_SCREENED', 'REJECTED'], desc: 'Inbound submission received via candidate portal' },
                { stage: '2. UNDER_REVIEW', transitions: ['AI_SCREENED', 'SHORTLISTED', 'REJECTED'], desc: 'Initial recruiter assessment and background check' },
                { stage: '3. AI_SCREENED', transitions: ['SHORTLISTED', 'UNDER_REVIEW', 'REJECTED'], desc: 'Gemini 3.8 Flash deep resume evaluation completed' },
                { stage: '4. SHORTLISTED', transitions: ['INTERVIEW_SCHEDULED', 'UNDER_REVIEW', 'REJECTED'], desc: 'Qualified candidate selected for hiring committee' },
                { stage: '5. INTERVIEW_SCHEDULED', transitions: ['OFFERED', 'SHORTLISTED', 'REJECTED'], desc: 'Live technical rounds and architecture interview' },
                { stage: '6. OFFERED', transitions: ['REJECTED'], desc: 'Official compensation package extended' },
                { stage: 'REJECTED', transitions: ['UNDER_REVIEW'], desc: 'Archived (allows human dispute / reconsideration)' },
              ].map((item, idx) => (
                <div key={idx} style={{ background: 'var(--bg-tertiary)', padding: '12px 18px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', border: '1px solid var(--border-color)' }}>
                  <div>
                    <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.9rem' }}>{item.stage}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '12px' }}>{item.desc}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Permitted Next:</span>
                    {item.transitions.map((next) => (
                      <span key={next} className={`badge ${next === 'REJECTED' ? 'badge-danger' : 'badge-info'}`} style={{ fontSize: '0.7rem' }}>
                        {next}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: AI Model */}
      {activeTab === 'ai' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card">
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem', color: '#fff' }}>
              Google Gemini 3.8 Flash Model & Scoring Algorithm
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div>
                <h4 style={{ color: '#818cf8', fontWeight: 700, marginBottom: '8px' }}>Weighted Composite Fit Formula</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '12px' }}>
                  Our proprietary fit rating combines generative AI semantic comprehension with hard business constraints:
                </p>
                <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.85rem', fontFamily: 'monospace', color: '#34d399' }}>
                  CompositeScore = (AI_Score * 0.60) + (Experience_Fit * 0.25) + (Salary_Budget * 0.15)
                </div>
              </div>

              <div>
                <h4 style={{ color: '#f472b6', fontWeight: 700, marginBottom: '8px' }}>High-Availability Heuristic Fallback</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                  If Google API network boundaries are unreachable or API quota is throttled, the platform automatically switches to an in-memory natural language keyword and skill coverage matrix algorithm, guaranteeing <strong>100% uptime</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: APIs */}
      {activeTab === 'apis' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card">
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem', color: '#fff' }}>
              REST API Endpoints Specification
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { method: 'POST', path: '/api/auth/register', auth: 'Public', desc: 'Registers candidate or recruiter with bcrypt hash & JWT' },
                { method: 'POST', path: '/api/auth/login', auth: 'Public', desc: 'Authenticates credentials and issues HTTP-only session cookie' },
                { method: 'GET', path: '/api/auth/google', auth: 'Public', desc: 'Initiates Google OAuth 2.0 authorization redirect' },
                { method: 'GET', path: '/api/auth/callback/google', auth: 'Public', desc: 'Exchanges Google OAuth code and persists user profile' },
                { method: 'GET', path: '/api/jobs', auth: 'Public', desc: 'Multi-facet search and filtering across active positions' },
                { method: 'POST', path: '/api/jobs', auth: 'Recruiter / Admin', desc: 'Publishes new job vacancy with Zod schema verification' },
                { method: 'POST', path: '/api/applications', auth: 'Candidate', desc: 'Submits application & automatically triggers Gemini 3.8 Flash evaluation' },
                { method: 'PATCH', path: '/api/pipeline', auth: 'Recruiter', desc: 'Advances candidate stage through state machine with audit history' },
                { method: 'POST', path: '/api/ai/evaluate', auth: 'Recruiter', desc: 'Triggers on-demand re-evaluation of applicant resume with AI' },
                { method: 'GET', path: '/api/analytics', auth: 'Recruiter', desc: 'Calculates recruitment conversion rates & budget metrics' },
              ].map((api, i) => (
                <div key={i} style={{ background: 'var(--bg-tertiary)', padding: '10px 14px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: api.method === 'POST' ? '#059669' : api.method === 'PATCH' ? '#d97706' : '#2563eb', color: '#fff' }}>
                      {api.method}
                    </span>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#fff' }}>{api.path}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{api.desc}</span>
                    <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>{api.auth}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
