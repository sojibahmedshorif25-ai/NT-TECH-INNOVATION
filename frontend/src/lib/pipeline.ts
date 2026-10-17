export type PipelineStage =
  | 'APPLIED'
  | 'UNDER_REVIEW'
  | 'AI_SCREENED'
  | 'SHORTLISTED'
  | 'INTERVIEW_SCHEDULED'
  | 'OFFERED'
  | 'REJECTED';

/**
 * Strict state machine governing the recruitment pipeline workflow.
 * Ensures illegal stage skips are blocked and audit trails remain consistent.
 */
export const ALLOWED_TRANSITIONS: Record<PipelineStage, PipelineStage[]> = {
  APPLIED: ['UNDER_REVIEW', 'AI_SCREENED', 'REJECTED'],
  UNDER_REVIEW: ['AI_SCREENED', 'SHORTLISTED', 'REJECTED'],
  AI_SCREENED: ['SHORTLISTED', 'UNDER_REVIEW', 'REJECTED'],
  SHORTLISTED: ['INTERVIEW_SCHEDULED', 'UNDER_REVIEW', 'REJECTED'],
  INTERVIEW_SCHEDULED: ['OFFERED', 'SHORTLISTED', 'REJECTED'],
  OFFERED: ['REJECTED'],
  REJECTED: ['UNDER_REVIEW'], // Allows reopening upon human dispute or re-evaluation
};

/**
 * Validates whether moving an application from currentStage to targetStage is allowed.
 */
export function canTransitionStage(
  currentStage: PipelineStage,
  targetStage: PipelineStage
): boolean {
  if (currentStage === targetStage) return true;
  const allowed = ALLOWED_TRANSITIONS[currentStage] || [];
  return allowed.includes(targetStage);
}

/**
 * Algorithmic candidate composite fit index calculation.
 * Combines:
 * 1. AI Semantic Match Score (Weight: 60%)
 * 2. Experience level match (Weight: 25%)
 * 3. Salary expectation within budget (Weight: 15%)
 */
export function calculateCandidateFitIndex(params: {
  aiScore: number; // 0 - 100
  candidateYears: number;
  minYearsRequired: number;
  expectedSalary: number;
  salaryMax: number;
}): { compositeScore: number; rating: string; budgetVariancePct: number } {
  const { aiScore, candidateYears, minYearsRequired, expectedSalary, salaryMax } = params;

  // 1. AI Score (0-100)
  const normalizedAi = Math.max(0, Math.min(100, aiScore));

  // 2. Experience Score (0-100)
  let expScore = 100;
  if (candidateYears < minYearsRequired) {
    const gap = minYearsRequired - candidateYears;
    expScore = Math.max(20, 100 - gap * 25);
  } else if (candidateYears > minYearsRequired + 4) {
    expScore = 95; // slightly overqualified
  }

  // 3. Salary Budget Score (0-100)
  let salaryScore = 100;
  const budgetVariancePct = ((expectedSalary - salaryMax) / salaryMax) * 100;
  if (budgetVariancePct > 0) {
    // Expected salary is above budget
    salaryScore = Math.max(10, 100 - budgetVariancePct * 3);
  }

  // Composite calculation
  const composite = Math.round(normalizedAi * 0.6 + expScore * 0.25 + salaryScore * 0.15);

  let rating = 'Standard';
  if (composite >= 85) rating = 'Top Tier';
  else if (composite >= 70) rating = 'Strong Match';
  else if (composite >= 50) rating = 'Potential Fit';
  else rating = 'High Risk';

  return {
    compositeScore: composite,
    rating,
    budgetVariancePct: Math.round(budgetVariancePct * 10) / 10,
  };
}

export interface PipelineAnalytics {
  totalApplicants: number;
  stageCounts: Record<PipelineStage, number>;
  averageAiScore: number;
  averageExpectedSalary: number;
  interviewConversionRate: number; // Applied to Interview conversion %
  offerConversionRate: number; // Interview to Offer conversion %
}

/**
 * Computes recruitment pipeline metrics for recruiter intelligence.
 */
export function computePipelineAnalytics(
  applications: Array<{
    pipelineStage: PipelineStage;
    expectedSalary?: number;
    aiMatchReport?: { score?: number } | null;
  }>
): PipelineAnalytics {
  const total = applications.length;
  const stageCounts: Record<PipelineStage, number> = {
    APPLIED: 0,
    UNDER_REVIEW: 0,
    AI_SCREENED: 0,
    SHORTLISTED: 0,
    INTERVIEW_SCHEDULED: 0,
    OFFERED: 0,
    REJECTED: 0,
  };

  let totalScore = 0;
  let scoredCount = 0;
  let totalSalary = 0;

  for (const app of applications) {
    if (stageCounts[app.pipelineStage] !== undefined) {
      stageCounts[app.pipelineStage]++;
    }
    if (app.aiMatchReport?.score !== undefined && app.aiMatchReport.score > 0) {
      totalScore += app.aiMatchReport.score;
      scoredCount++;
    }
    if (app.expectedSalary) {
      totalSalary += app.expectedSalary;
    }
  }

  const interviewCount = stageCounts['INTERVIEW_SCHEDULED'] + stageCounts['OFFERED'];
  const interviewConversionRate = total > 0 ? Math.round((interviewCount / total) * 100) : 0;
  const offerConversionRate =
    interviewCount > 0 ? Math.round((stageCounts['OFFERED'] / interviewCount) * 100) : 0;

  return {
    totalApplicants: total,
    stageCounts,
    averageAiScore: scoredCount > 0 ? Math.round(totalScore / scoredCount) : 0,
    averageExpectedSalary: total > 0 ? Math.round(totalSalary / total) : 0,
    interviewConversionRate,
    offerConversionRate,
  };
}
