import mongoose, { Schema } from 'mongoose';

const JobSchema = new Schema(
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

export const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);
