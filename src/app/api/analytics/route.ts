import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Job } from '@/models/Job';
import { Application } from '@/models/Application';
import { getAuthUser } from '@/lib/auth';
import { computePipelineAnalytics } from '@/lib/pipeline';

export async function GET(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser || (authUser.role !== 'RECRUITER' && authUser.role !== 'ADMIN')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Recruiter privileges required.' },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get('jobId');

    const jobFilter: any = {};
    const appFilter: any = {};

    if (authUser.role === 'RECRUITER') {
      jobFilter.recruiterId = authUser.userId;
    }

    if (jobId) {
      appFilter.jobId = jobId;
    } else if (authUser.role === 'RECRUITER') {
      const myJobs = await Job.find(jobFilter).select('_id');
      appFilter.jobId = { $in: myJobs.map((j) => j._id) };
    }

    const [totalJobs, openJobs, applications] = await Promise.all([
      Job.countDocuments(jobFilter),
      Job.countDocuments({ ...jobFilter, status: 'OPEN' }),
      Application.find(appFilter).select('pipelineStage expectedSalary aiMatchReport'),
    ]);

    const analytics = computePipelineAnalytics(applications as any);

    return NextResponse.json({
      success: true,
      data: {
        totalJobs,
        openJobs,
        ...analytics,
      },
    });
  } catch (error: any) {
    console.error('Analytics API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve analytics metrics.' },
      { status: 500 }
    );
  }
}
