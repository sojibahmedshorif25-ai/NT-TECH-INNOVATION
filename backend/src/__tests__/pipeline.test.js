import { describe, it, expect } from 'vitest';
import {
  canTransitionStage,
  calculateCandidateFitIndex,
  computePipelineAnalytics,
} from '../lib/pipeline.js';
import { runHeuristicEvaluation } from '../lib/gemini.js';
import { RegisterSchema, ApplyJobSchema } from '../lib/validations.js';

describe('Recruitment Pipeline Business Logic & State Machine', () => {
  it('allows valid forward stage transitions', () => {
    expect(canTransitionStage('APPLIED', 'UNDER_REVIEW')).toBe(true);
    expect(canTransitionStage('APPLIED', 'AI_SCREENED')).toBe(true);
    expect(canTransitionStage('UNDER_REVIEW', 'SHORTLISTED')).toBe(true);
    expect(canTransitionStage('SHORTLISTED', 'INTERVIEW_SCHEDULED')).toBe(true);
    expect(canTransitionStage('INTERVIEW_SCHEDULED', 'OFFERED')).toBe(true);
  });

  it('blocks illegal stage jumps (e.g. from APPLIED directly to OFFERED)', () => {
    expect(canTransitionStage('APPLIED', 'OFFERED')).toBe(false);
    expect(canTransitionStage('APPLIED', 'INTERVIEW_SCHEDULED')).toBe(false);
    expect(canTransitionStage('UNDER_REVIEW', 'OFFERED')).toBe(false);
  });

  it('allows rejection from any active stage', () => {
    expect(canTransitionStage('APPLIED', 'REJECTED')).toBe(true);
    expect(canTransitionStage('UNDER_REVIEW', 'REJECTED')).toBe(true);
    expect(canTransitionStage('SHORTLISTED', 'REJECTED')).toBe(true);
    expect(canTransitionStage('INTERVIEW_SCHEDULED', 'REJECTED')).toBe(true);
  });

  it('permits reconsideration from REJECTED back to UNDER_REVIEW', () => {
    expect(canTransitionStage('REJECTED', 'UNDER_REVIEW')).toBe(true);
  });
});

describe('Candidate Fit Index & Composite Scoring Algorithm', () => {
  it('calculates a Top Tier composite score for well-aligned candidates', () => {
    const result = calculateCandidateFitIndex({
      aiScore: 92,
      candidateYears: 6,
      minYearsRequired: 5,
      expectedSalary: 130000,
      salaryMax: 150000,
    });

    expect(result.compositeScore).toBeGreaterThanOrEqual(85);
    expect(result.rating).toBe('Top Tier');
    expect(result.budgetVariancePct).toBeLessThanOrEqual(0);
  });

  it('penalizes candidates with experience deficits and over-budget expectations', () => {
    const result = calculateCandidateFitIndex({
      aiScore: 40,
      candidateYears: 1,
      minYearsRequired: 5,
      expectedSalary: 180000,
      salaryMax: 140000,
    });

    expect(result.compositeScore).toBeLessThan(60);
    expect(result.budgetVariancePct).toBeGreaterThan(0);
    expect(['Potential Fit', 'High Risk']).toContain(result.rating);
  });
});

describe('Pipeline Analytics Aggregation', () => {
  it('accurately computes conversion rates and stage counts', () => {
    const mockApps = [
      { pipelineStage: 'APPLIED', expectedSalary: 100000, aiMatchReport: { score: 80 } },
      { pipelineStage: 'SHORTLISTED', expectedSalary: 120000, aiMatchReport: { score: 90 } },
      { pipelineStage: 'INTERVIEW_SCHEDULED', expectedSalary: 110000, aiMatchReport: { score: 85 } },
      { pipelineStage: 'OFFERED', expectedSalary: 130000, aiMatchReport: { score: 95 } },
    ];

    const analytics = computePipelineAnalytics(mockApps);

    expect(analytics.totalApplicants).toBe(4);
    expect(analytics.stageCounts.APPLIED).toBe(1);
    expect(analytics.stageCounts.OFFERED).toBe(1);
    expect(analytics.averageAiScore).toBe(88);
    expect(analytics.interviewConversionRate).toBe(50);
  });
});

describe('Heuristic AI Matching Engine Fallback', () => {
  it('identifies matched and missing skills correctly', () => {
    const evaluation = runHeuristicEvaluation({
      jobTitle: 'Senior React Developer',
      jobDescription: 'Looking for a React and Next.js expert with Docker knowledge',
      requiredSkills: ['React', 'Next.js', 'TypeScript', 'Docker', 'Kubernetes'],
      candidateName: 'Jane Doe',
      candidateYearsOfExperience: 4,
      resumeText: 'Experienced developer proficient in React, Next.js, and TypeScript. 4 years of frontend engineering.',
    });

    expect(evaluation.matchedSkills).toContain('React');
    expect(evaluation.matchedSkills).toContain('Next.js');
    expect(evaluation.matchedSkills).toContain('TypeScript');
    expect(evaluation.missingSkills).toContain('Kubernetes');
    expect(evaluation.score).toBeGreaterThan(50);
  });
});

describe('Zod Input Validation Security', () => {
  it('rejects invalid email formats on registration', () => {
    const invalid = RegisterSchema.safeParse({
      name: 'Test User',
      email: 'not-an-email',
      password: 'secretPassword123',
    });
    expect(invalid.success).toBe(false);
  });

  it('rejects short passwords below 6 characters', () => {
    const invalid = RegisterSchema.safeParse({
      name: 'Valid Name',
      email: 'valid@example.com',
      password: '123',
    });
    expect(invalid.success).toBe(false);
  });

  it('enforces required fields on job applications', () => {
    const invalid = ApplyJobSchema.safeParse({
      jobId: '12345',
      candidateName: '',
      candidateEmail: 'invalid-email',
      yearsOfExperience: -1,
      expectedSalary: -500,
      resumeText: 'too short',
    });
    expect(invalid.success).toBe(false);
  });
});
