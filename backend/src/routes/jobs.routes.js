import { Router } from 'express';
import {
  getJobs,
  createJob,
  getJobById,
  updateJob,
  deleteJob,
} from '../controllers/jobs.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', getJobs);
router.post('/', requireAuth, requireRole(['RECRUITER', 'ADMIN']), createJob);
router.get('/:id', getJobById);
router.put('/:id', requireAuth, requireRole(['RECRUITER', 'ADMIN']), updateJob);
router.delete('/:id', requireAuth, requireRole(['RECRUITER', 'ADMIN']), deleteJob);

export default router;
