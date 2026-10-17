import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Application } from '@/models/Application';
import { getAuthUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authUser = getAuthUser(req);
    if (!authUser) {
      return NextResponse.json(
        { success: false, message: 'Authentication required.' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const application = await Application.findById(id)
      .populate('jobId')
      .populate('candidateId', 'name email title bio skills')
      .populate('stageHistory.changedBy', 'name email role');

    if (!application) {
      return NextResponse.json(
        { success: false, message: 'Application not found.' },
        { status: 404 }
      );
    }

    // Role check: Only the applicant or recruiters/admins can view
    if (
      authUser.role === 'CANDIDATE' &&
      application.candidateId._id.toString() !== authUser.userId
    ) {
      return NextResponse.json(
        { success: false, message: 'Forbidden. You do not own this application.' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      application,
    });
  } catch (error: any) {
    console.error('Fetch Application By ID Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve application details.' },
      { status: 500 }
    );
  }
}
