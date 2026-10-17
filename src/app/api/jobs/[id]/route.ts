import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Job } from '@/models/Job';
import { Application } from '@/models/Application';
import { getAuthUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const job = await Job.findById(id).populate('recruiterId', 'name email');
    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job vacancy not found.' },
        { status: 404 }
      );
    }

    const applicantCount = await Application.countDocuments({ jobId: id });

    return NextResponse.json({
      success: true,
      job,
      applicantCount,
    });
  } catch (error: any) {
    console.error('Fetch Single Job Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve job details.' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authUser = getAuthUser(req);
    if (!authUser || (authUser.role !== 'RECRUITER' && authUser.role !== 'ADMIN')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized.' },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const body = await req.json();

    const job = await Job.findById(id);
    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job vacancy not found.' },
        { status: 404 }
      );
    }

    // Ensure only creator or admin can update
    if (job.recruiterId.toString() !== authUser.userId && authUser.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Forbidden. You do not own this job listing.' },
        { status: 403 }
      );
    }

    const updatedJob = await Job.findByIdAndUpdate(id, { $set: body }, { new: true });

    return NextResponse.json({
      success: true,
      message: 'Job listing updated successfully.',
      job: updatedJob,
    });
  } catch (error: any) {
    console.error('Update Job Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update job listing.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authUser = getAuthUser(req);
    if (!authUser || (authUser.role !== 'RECRUITER' && authUser.role !== 'ADMIN')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized.' },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const job = await Job.findById(id);
    if (!job) {
      return NextResponse.json(
        { success: false, message: 'Job not found.' },
        { status: 404 }
      );
    }

    if (job.recruiterId.toString() !== authUser.userId && authUser.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Forbidden. Cannot delete another recruiter’s job.' },
        { status: 403 }
      );
    }

    await Job.findByIdAndDelete(id);
    await Application.deleteMany({ jobId: id });

    return NextResponse.json({
      success: true,
      message: 'Job vacancy and associated applications removed.',
    });
  } catch (error: any) {
    console.error('Delete Job Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete job listing.' },
      { status: 500 }
    );
  }
}
