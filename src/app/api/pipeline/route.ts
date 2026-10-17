import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/db';
import { Application } from '@/models/Application';
import { getAuthUser } from '@/lib/auth';
import { UpdatePipelineSchema } from '@/lib/validations';
import { canTransitionStage } from '@/lib/pipeline';

export async function PATCH(req: NextRequest) {
  try {
    const authUser = getAuthUser(req);
    if (!authUser || (authUser.role !== 'RECRUITER' && authUser.role !== 'ADMIN')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Only recruiters can advance candidate stages.' },
        { status: 403 }
      );
    }

    await connectToDatabase();
    const body = await req.json();

    const parseResult = UpdatePipelineSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, errors: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { applicationId, targetStage, note } = parseResult.data;

    const application = await Application.findById(applicationId);
    if (!application) {
      return NextResponse.json(
        { success: false, message: 'Application record not found.' },
        { status: 404 }
      );
    }

    const currentStage = application.pipelineStage;

    // Enforce business workflow rules
    if (!canTransitionStage(currentStage, targetStage)) {
      return NextResponse.json(
        {
          success: false,
          message: `Illegal transition: Cannot move candidate from stage "${currentStage}" directly to "${targetStage}".`,
        },
        { status: 400 }
      );
    }

    const historyEntry = {
      fromStage: currentStage,
      toStage: targetStage,
      changedBy: new mongoose.Types.ObjectId(authUser.userId),
      note: note || `Stage updated from ${currentStage} to ${targetStage} by recruiter.`,
      changedAt: new Date(),
    };

    application.pipelineStage = targetStage;
    application.stageHistory.push(historyEntry as any);
    await application.save();

    return NextResponse.json({
      success: true,
      message: `Candidate successfully moved to "${targetStage}".`,
      application,
    });
  } catch (error: any) {
    console.error('Pipeline Transition Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update pipeline stage.' },
      { status: 500 }
    );
  }
}
