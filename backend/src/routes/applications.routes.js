import { Router } from 'express';
import {
  submitApplication,
  getApplications,
  getApplicationById,
} from '../controllers/applications.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/', requireAuth, submitApplication);
router.get('/', requireAuth, getApplications);
router.get('/:id', requireAuth, getApplicationById);

export default router;
