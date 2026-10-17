import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Job } from '@/models/Job';
import { getAuthUser } from '@/lib/auth';
import { CreateJobSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    const q = searchParams.get('q');
    const type = searchParams.get('type');
    const level = searchParams.get('level');
    const department = searchParams.get('department');
    const status = searchParams.get('status') || 'OPEN';

    const filter: any = {};
    if (status !== 'ALL') {
      filter.status = status;
    }
    if (type) filter.type = type;
    if (level) filter.experienceLevel = level;
    if (department) filter.department = department;

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { department: { $regex: q, $options: 'i' } },
        { skills: { $in: [new RegExp(q, 'i')] } },
      ];
    }

    const jobs = await Job.find(filter)
      .populate('recruiterId', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error: any) {
    console.error('Fetch Jobs Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve jobs.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: 'Authentication required to post a job.' },
        { status: 401 }
      );
    }

    if (authUser.role !== 'RECRUITER' && authUser.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Only Recruiters or Admins can post job vacancies.' },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const body = await req.json();

    const parseResult = CreateJobSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, errors: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const job = await Job.create({
      ...parseResult.data,
      recruiterId: authUser.userId,
      status: 'OPEN',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Job vacancy published successfully.',
        job,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create Job Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create job vacancy.' },
      { status: 500 }
    );
  }
}
