import mongoose, { Schema, Document, Model } from 'mongoose';

export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'REMOTE';
export type ExperienceLevel = 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD';
export type JobStatus = 'OPEN' | 'PAUSED' | 'CLOSED';

export interface IJob extends Document {
  title: string;
  department: string;
  location: string;
  type: JobType;
  experienceLevel: ExperienceLevel;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  description: string;
  requirements: string[];
  skills: string[];
  status: JobStatus;
  recruiterId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true, trim: true, index: true },
    department: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'REMOTE'],
      default: 'FULL_TIME',
    },
    experienceLevel: {
      type: String,
      enum: ['ENTRY', 'MID', 'SENIOR', 'LEAD'],
      default: 'MID',
    },
    salaryMin: { type: Number, required: true, min: 0 },
    salaryMax: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'USD' },
    description: { type: String, required: true },
    requirements: { type: [String], default: [] },
    skills: { type: [String], default: [] },
    status: {
      type: String,
      enum: ['OPEN', 'PAUSED', 'CLOSED'],
      default: 'OPEN',
      index: true,
    },
    recruiterId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: true }
);

export const Job: Model<IJob> = mongoose.models.Job || mongoose.model<IJob>('Job', JobSchema);
