import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/db';
import { Application } from '@/models/Application';
import { Job } from '@/models/Job';
import { getAuthUser } from '@/lib/auth';
import { ApplyJobSchema } from '@/lib/validations';
import { evaluateResumeWithAI } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: 'Please log in to submit your job application.' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const body = await req.json();

    const parseResult = ApplyJobSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, errors: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
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
      return NextResponse.json(
        { success: false, message: 'The requested job vacancy does not exist.' },
        { status: 404 }
      );
    }

    if (job.status !== 'OPEN') {
      return NextResponse.json(
        { success: false, message: 'This job vacancy is no longer accepting applications.' },
        { status: 400 }
      );
    }

    // Check duplicate application
    const existing = await Application.findOne({
      jobId,
      candidateId: authUser.userId,
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'You have already submitted an application for this position.' },
        { status: 409 }
      );
    }

    // Trigger AI Resume Match Evaluation (Gemini 3.8 Flash / Heuristic)
    const aiReport = await evaluateResumeWithAI({
      jobTitle: job.title,
      jobDescription: job.description,
      requiredSkills: job.skills,
      candidateName,
      candidateYearsOfExperience: yearsOfExperience,
      resumeText,
    });

    // Create application with audit history
    const initialStage = 'AI_SCREENED';
    const application = await Application.create({
      jobId: new mongoose.Types.ObjectId(jobId),
      candidateId: new mongoose.Types.ObjectId(authUser.userId),
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
          changedBy: new mongoose.Types.ObjectId(authUser.userId),
          note: `Application submitted. AI Screened candidate with ${aiReport.score}% fit index.`,
          changedAt: new Date(),
        },
      ],
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Your application was submitted and evaluated successfully by SmartHire AI!',
        application,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Job Application Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to submit application.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: 'Authentication required.' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');
    const stage = searchParams.get('stage');

    const filter: any = {};

    if (authUser.role === 'CANDIDATE') {
      // Candidates can only view their own applications
      filter.candidateId = authUser.userId;
    } else {
      // Recruiters/Admins view applications for specific job or all their jobs
      if (jobId) {
        filter.jobId = jobId;
      } else if (authUser.role === 'RECRUITER') {
        const recruiterJobs = await Job.find({ recruiterId: authUser.userId }).select('_id');
        filter.jobId = { $in: recruiterJobs.map((j) => j._id) };
      }
    }

    if (stage && stage !== 'ALL') {
      filter.pipelineStage = stage;
    }

    const applications = await Application.find(filter)
      .populate('jobId', 'title department location type salaryMin salaryMax currency experienceLevel')
      .populate('candidateId', 'name email title')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error: any) {
    console.error('Fetch Applications Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve applications.' },
      { status: 500 }
    );
  }
}
