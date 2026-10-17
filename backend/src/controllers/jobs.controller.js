import { Job } from '../models/Job.js';
import { Application } from '../models/Application.js';
import { CreateJobSchema } from '../lib/validations.js';

export async function getJobs(req, res) {
  try {
    const { q, type, level, department, status = 'OPEN' } = req.query;

    const filter = {};
    if (status !== 'ALL') filter.status = status;
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

    return res.json({ success: true, count: jobs.length, jobs });
  } catch (err) {
    console.error('Get Jobs Error:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving jobs.' });
  }
}

export async function createJob(req, res) {
  try {
    const parseResult = CreateJobSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        errors: parseResult.error.flatten().fieldErrors,
      });
    }

    const job = await Job.create({
      ...parseResult.data,
      recruiterId: req.user.userId,
      status: 'OPEN',
    });

    return res.status(201).json({
      success: true,
      message: 'Job vacancy published successfully.',
      job,
    });
  } catch (err) {
    console.error('Create Job Error:', err);
    return res.status(500).json({ success: false, message: 'Server error creating job.' });
  }
}

export async function getJobById(req, res) {
  try {
    const job = await Job.findById(req.params.id).populate('recruiterId', 'name email');
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    const applicantCount = await Application.countDocuments({ jobId: req.params.id });

    return res.json({ success: true, job, applicantCount });
  } catch (err) {
    console.error('Get Job By ID Error:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving job.' });
  }
}

export async function updateJob(req, res) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    if (job.recruiterId.toString() !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Forbidden.' });
    }

    const updated = await Job.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    return res.json({ success: true, message: 'Job updated.', job: updated });
  } catch (err) {
    console.error('Update Job Error:', err);
    return res.status(500).json({ success: false, message: 'Server error updating job.' });
  }
}

export async function deleteJob(req, res) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    if (job.recruiterId.toString() !== req.user.userId && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Forbidden.' });
    }

    await Job.findByIdAndDelete(req.params.id);
    await Application.deleteMany({ jobId: req.params.id });

    return res.json({ success: true, message: 'Job removed.' });
  } catch (err) {
    console.error('Delete Job Error:', err);
    return res.status(500).json({ success: false, message: 'Server error deleting job.' });
  }
}
