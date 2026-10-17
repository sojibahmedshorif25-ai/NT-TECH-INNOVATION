import React from 'react';
import { Sparkles, Terminal, Database, Cpu, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        backgroundColor: '#0a0d14',
        padding: '3rem 1.5rem 2rem',
        marginTop: '5rem',
      }}
    >
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1.5rem',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 700,
                fontSize: '1.15rem',
                color: '#fff',
              }}
            >
              <Sparkles size={18} color="#818cf8" />
              <span>SmartHire AI</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '6px', maxWidth: '420px' }}>
              Full-Stack Autonomous Recruitment Platform with Google Gemini 3.8 Flash, strict multi-stage pipeline state machine, and MongoDB Atlas persistence.
            </p>
          </div>

          {/* Tech Stack Badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <span className="badge badge-neutral" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <Terminal size={13} color="#818cf8" /> Next.js 15 & React 19
            </span>
            <span className="badge badge-neutral" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <Database size={13} color="#34d399" /> MongoDB Atlas
            </span>
            <span className="badge badge-neutral" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <Cpu size={13} color="#f472b6" /> Gemini 3.8 Flash
            </span>
            <span className="badge badge-neutral" style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <CheckCircle2 size={13} color="#60a5fa" /> 11 Unit Tests Passing
            </span>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div>Full Stack Developer Practical Assessment — NT Tech Innovation</div>
          <div>Built with clean architecture, RBAC, Zod validation, and automated test coverage.</div>
        </div>
      </div>
    </footer>
  );
}
