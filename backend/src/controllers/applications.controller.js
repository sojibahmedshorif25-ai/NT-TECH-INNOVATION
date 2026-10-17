import mongoose from 'mongoose';
import { Application } from '../models/Application.js';
import { Job } from '../models/Job.js';
import { ApplyJobSchema } from '../lib/validations.js';
import { evaluateResumeWithAI } from '../lib/gemini.js';

export async function submitApplication(req, res) {
  try {
    const parseResult = ApplyJobSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const {
      jobId,
      candidateName,
      candidateEmail,
      candidatePhone,
      portfolioUrl,
      yearsOfExperience,
      expectedSalary,
      resumeText,
    } = parseResult.data;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job vacancy not found.' });
    }

    if (job.status !== 'OPEN') {
      return res.status(400).json({ success: false, message: 'Job is no longer accepting applications.' });
    }

    const existing = await Application.findOne({
      jobId,
      candidateId: req.user.userId,
    });
    if (existing) {
      return res.status(409).json({ success: false, message: 'You have already applied for this job.' });
    }

    // Evaluate with Gemini 3.8 Flash
    const aiReport = await evaluateResumeWithAI({
      jobTitle: job.title,
      jobDescription: job.description,
      requiredSkills: job.skills,
      candidateName,
      candidateYearsOfExperience: yearsOfExperience,
      resumeText,
    });

    const initialStage = 'AI_SCREENED';
    const application = await Application.create({
      jobId: new mongoose.Types.ObjectId(jobId),
      candidateId: new mongoose.Types.ObjectId(req.user.userId),
      candidateName,
      candidateEmail,
      candidatePhone: candidatePhone || '',
      portfolioUrl: portfolioUrl || '',
      yearsOfExperience,
      expectedSalary,
      resumeText,
      pipelineStage: initialStage,
      aiMatchReport: aiReport,
      stageHistory: [
        {
          fromStage: 'INITIAL',
          toStage: initialStage,
          changedBy: new mongoose.Types.ObjectId(req.user.userId),
          note: `Application submitted. AI Screened candidate with ${aiReport.score}% fit index.`,
          changedAt: new Date(),
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: 'Application submitted and screened by Gemini 3.8 Flash AI.',
      application,
    });
  } catch (err) {
    console.error('Submit Application Error:', err);
    return res.status(500).json({ success: false, message: 'Server error submitting application.' });
  }
}

export async function getApplications(req, res) {
  try {
    const { jobId, stage } = req.query;
    const filter = {};

    if (req.user.role === 'CANDIDATE') {
      filter.candidateId = req.user.userId;
    } else {
      if (jobId) {
        filter.jobId = jobId;
      } else if (req.user.role === 'RECRUITER') {
        const myJobs = await Job.find({ recruiterId: req.user.userId }).select('_id');
        filter.jobId = { $in: myJobs.map((j) => j._id) };
      }
    }

    if (stage && stage !== 'ALL') {
      filter.pipelineStage = stage;
    }

    const applications = await Application.find(filter)
      .populate('jobId', 'title department location type salaryMin salaryMax currency experienceLevel')
      .populate('candidateId', 'name email title')
      .sort({ createdAt: -1 });

    return res.json({ success: true, count: applications.length, applications });
  } catch (err) {
    console.error('Get Applications Error:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving applications.' });
  }
}

export async function getApplicationById(req, res) {
  try {
    const application = await Application.findById(req.params.id)
      .populate('jobId')
      .populate('candidateId', 'name email title bio skills')
      .populate('stageHistory.changedBy', 'name email role');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    if (req.user.role === 'CANDIDATE' && application.candidateId._id.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Forbidden.' });
    }

    return res.json({ success: true, application });
  } catch (err) {
    console.error('Get Application By ID Error:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving application.' });
  }
}
