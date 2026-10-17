import mongoose, { Schema, Document, Model } from 'mongoose';

export type PipelineStage =
  | 'APPLIED'
  | 'UNDER_REVIEW'
  | 'AI_SCREENED'
  | 'SHORTLISTED'
  | 'INTERVIEW_SCHEDULED'
  | 'OFFERED'
  | 'REJECTED';

export interface IStageHistory {
  fromStage: PipelineStage | 'INITIAL';
  toStage: PipelineStage;
  changedBy: mongoose.Types.ObjectId;
  note?: string;
  changedAt: Date;
}

export interface IAIMatchReport {
  score: number; // 0 to 100
  summary: string;
  matchedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  weaknesses: string[];
  recommendation: 'HIGHLY_RECOMMENDED' | 'POTENTIAL_FIT' | 'NEEDS_UPSKILLING' | 'NOT_A_FIT';
  evaluatedAt: Date;
}

export interface IApplication extends Document {
  jobId: mongoose.Types.ObjectId;
  candidateId: mongoose.Types.ObjectId;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  portfolioUrl?: string;
  yearsOfExperience: number;
  expectedSalary: number;
  resumeText: string;
  pipelineStage: PipelineStage;
  stageHistory: IStageHistory[];
  aiMatchReport?: IAIMatchReport;
  recruiterNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const StageHistorySchema = new Schema<IStageHistory>(
  {
    fromStage: { type: String, required: true },
    toStage: { type: String, required: true },
    changedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    note: { type: String, default: '' },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const AIMatchReportSchema = new Schema<IAIMatchReport>(
  {
    score: { type: Number, required: true, min: 0, max: 100 },
    summary: { type: String, required: true },
    matchedSkills: { type: [String], default: [] },
    missingSkills: { type: [String], default: [] },
    strengths: { type: [String], default: [] },
    weaknesses: { type: [String], default: [] },
    recommendation: {
      type: String,
      enum: ['HIGHLY_RECOMMENDED', 'POTENTIAL_FIT', 'NEEDS_UPSKILLING', 'NOT_A_FIT'],
      required: true,
    },
    evaluatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ApplicationSchema = new Schema<IApplication>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    candidateId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    candidateName: { type: String, required: true, trim: true },
    candidateEmail: { type: String, required: true, trim: true, lowercase: true },
    candidatePhone: { type: String, default: '' },
    portfolioUrl: { type: String, default: '' },
    yearsOfExperience: { type: Number, required: true, min: 0 },
    expectedSalary: { type: Number, required: true, min: 0 },
    resumeText: { type: String, required: true },
    pipelineStage: {
      type: String,
      enum: [
        'APPLIED',
        'UNDER_REVIEW',
        'AI_SCREENED',
        'SHORTLISTED',
        'INTERVIEW_SCHEDULED',
        'OFFERED',
        'REJECTED',
      ],
      default: 'APPLIED',
      index: true,
    },
    stageHistory: { type: [StageHistorySchema], default: [] },
    aiMatchReport: { type: AIMatchReportSchema, default: null },
    recruiterNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

// Prevent duplicate applications by the same candidate for the same job
ApplicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

export const Application: Model<IApplication> =
  mongoose.models.Application || mongoose.model<IApplication>('Application', ApplicationSchema);
