import mongoose from 'mongoose';
import { Application } from '../models/Application.js';
import { UpdatePipelineSchema } from '../lib/validations.js';
import { canTransitionStage } from '../lib/pipeline.js';

export async function updatePipelineStage(req, res) {
  try {
    const parseResult = UpdatePipelineSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const { applicationId, targetStage, note } = parseResult.data;

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application record not found.' });
    }

    const currentStage = application.pipelineStage;

    if (!canTransitionStage(currentStage, targetStage)) {
      return res.status(400).json({
        success: false,
        message: `Illegal transition: Cannot move candidate from stage "${currentStage}" directly to "${targetStage}".`,
      });
    }

    const historyEntry = {
      fromStage: currentStage,
      toStage: targetStage,
      changedBy: new mongoose.Types.ObjectId(req.user.userId),
      note: note || `Stage updated from ${currentStage} to ${targetStage} by recruiter.`,
      changedAt: new Date(),
    };

    application.pipelineStage = targetStage;
    application.stageHistory.push(historyEntry);
    await application.save();

    return res.json({
      success: true,
      message: `Candidate successfully moved to "${targetStage}".`,
      application,
    });
  } catch (err) {
    console.error('Update Pipeline Error:', err);
    return res.status(500).json({ success: false, message: 'Server error updating pipeline stage.' });
  }
}
