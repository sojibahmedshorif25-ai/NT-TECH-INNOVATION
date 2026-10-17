import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Application } from '@/models/Application';
import { Job } from '@/models/Job';
import { getAuthUser } from '@/lib/auth';
import { evaluateResumeWithAI } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser || (authUser.role !== 'RECRUITER' && authUser.role !== 'ADMIN')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Recruiter privileges required.' },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const { applicationId } = await req.json();

    if (!applicationId) {
      return NextResponse.json(
        { success: false, message: 'Application ID is required.' },
        { status: 400 }
      );
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return NextResponse.json(
        { success: false, message: 'Application not found.' },
        { status: 404 }
      );
    }

    const job = await Job.findById(application.jobId);
    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Associated job vacancy not found.' },
        { status: 404 }
      );
    }

    // Run AI Evaluation with Gemini 3.8 Flash
    const aiReport = await evaluateResumeWithAI({
      jobTitle: job.title,
      jobDescription: job.description,
      requiredSkills: job.skills,
      candidateName: application.candidateName,
      candidateYearsOfExperience: application.yearsOfExperience,
      resumeText: application.resumeText,
    });

    application.aiMatchReport = aiReport;
    if (application.pipelineStage === 'APPLIED') {
      application.pipelineStage = 'AI_SCREENED';
    }

    await application.save();

    return NextResponse.json({
      success: true,
      message: 'AI Evaluation completed successfully with Gemini 3.8 Flash.',
      aiMatchReport: aiReport,
      pipelineStage: application.pipelineStage,
    });
  } catch (error: any) {
    console.error('AI Re-evaluation API Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to re-evaluate application with AI.' },
      { status: 500 }
    );
  }
}
