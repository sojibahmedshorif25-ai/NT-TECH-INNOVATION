import { Application } from '../models/Application.js';
import { Job } from '../models/Job.js';
import { evaluateResumeWithAI } from '../lib/gemini.js';

export async function evaluateApplication(req, res) {
  try {
    const { applicationId } = req.body;
    if (!applicationId) {
      return res.status(400).json({ success: false, message: 'Application ID is required.' });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    const job = await Job.findById(application.jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

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

    return res.json({
      success: true,
      message: 'AI Evaluation completed successfully with Gemini 3.8 Flash.',
      aiMatchReport: aiReport,
      pipelineStage: application.pipelineStage,
    });
  } catch (err) {
    console.error('AI Evaluate Error:', err);
    return res.status(500).json({ success: false, message: 'Server error during AI evaluation.' });
  }
}
