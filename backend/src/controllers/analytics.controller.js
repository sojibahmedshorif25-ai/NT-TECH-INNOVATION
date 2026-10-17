import { Job } from '../models/Job.js';
import { Application } from '../models/Application.js';
import { computePipelineAnalytics } from '../lib/pipeline.js';

export async function getAnalytics(req, res) {
  try {
    const { jobId } = req.query;
    const jobFilter = {};
    const appFilter = {};

    if (req.user.role === 'RECRUITER') {
      jobFilter.recruiterId = req.user.userId;
    }

    if (jobId) {
      appFilter.jobId = jobId;
    } else if (req.user.role === 'RECRUITER') {
      const myJobs = await Job.find(jobFilter).select('_id');
      appFilter.jobId = { $in: myJobs.map((j) => j._id) };
    }

    const [totalJobs, openJobs, applications] = await Promise.all([
      Job.countDocuments(jobFilter),
      Job.countDocuments({ ...jobFilter, status: 'OPEN' }),
      Application.find(appFilter).select('pipelineStage expectedSalary aiMatchReport'),
    ]);

    const analytics = computePipelineAnalytics(applications);

    return res.json({
      success: true,
      data: {
        totalJobs,
        openJobs,
        ...analytics,
      },
    });
  } catch (err) {
    console.error('Get Analytics Error:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving analytics.' });
  }
}
