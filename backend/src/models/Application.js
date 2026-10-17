import mongoose, { Schema } from 'mongoose';

const StageHistorySchema = new Schema(
  {
    fromStage: { type: String, required: true },
    toStage: { type: String, required: true },
    changedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    note: { type: String, default: '' },
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const AIMatchReportSchema = new Schema(
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

const ApplicationSchema = new Schema(
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

ApplicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

export const Application =
  mongoose.models.Application || mongoose.model('Application', ApplicationSchema);
