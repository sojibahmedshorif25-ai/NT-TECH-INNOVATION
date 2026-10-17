import { Router } from 'express';
import { getAnalytics } from '../controllers/analytics.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', requireAuth, requireRole(['RECRUITER', 'ADMIN']), getAnalytics);

export default router;
