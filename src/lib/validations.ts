import { z } from 'zod';

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').max(60),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(['CANDIDATE', 'RECRUITER', 'ADMIN']).default('CANDIDATE'),
  title: z.string().optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()).optional().default([]),
});

export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const CreateJobSchema = z.object({
  title: z.string().min(3, 'Job title must be at least 3 characters'),
  department: z.string().min(2, 'Department is required'),
  location: z.string().min(2, 'Location is required'),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'REMOTE']).default('FULL_TIME'),
  experienceLevel: z.enum(['ENTRY', 'MID', 'SENIOR', 'LEAD']).default('MID'),
  salaryMin: z.number().positive('Minimum salary must be greater than 0'),
  salaryMax: z.number().positive('Maximum salary must be greater than 0'),
  currency: z.string().default('USD'),
  description: z.string().min(20, 'Description must be at least 20 characters long'),
  requirements: z.array(z.string()).min(1, 'At least one requirement is required'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
});

export const ApplyJobSchema = z.object({
  jobId: z.string().min(10, 'Valid Job ID is required'),
  candidateName: z.string().min(2, 'Name is required'),
  candidateEmail: z.string().email('Valid email is required'),
  candidatePhone: z.string().optional().default(''),
  portfolioUrl: z.string().url('Portfolio must be a valid URL').optional().or(z.literal('')),
  yearsOfExperience: z.number().min(0, 'Years of experience cannot be negative'),
  expectedSalary: z.number().positive('Expected salary must be greater than 0'),
  resumeText: z.string().min(50, 'Please paste at least 50 characters of your resume/experience'),
});

export const UpdatePipelineSchema = z.object({
  applicationId: z.string().min(10, 'Valid application ID is required'),
  targetStage: z.enum([
    'APPLIED',
    'UNDER_REVIEW',
    'AI_SCREENED',
    'SHORTLISTED',
    'INTERVIEW_SCHEDULED',
    'OFFERED',
    'REJECTED',
  ]),
  note: z.string().max(500, 'Note cannot exceed 500 characters').optional(),
});
