import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['CANDIDATE', 'RECRUITER', 'ADMIN'], default: 'CANDIDATE' },
    title: { type: String, default: '' },
    bio: { type: String, default: '' },
    skills: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
