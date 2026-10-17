import { Router } from 'express';
import { evaluateApplication } from '../controllers/ai.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/evaluate', requireAuth, requireRole(['RECRUITER', 'ADMIN']), evaluateApplication);

export default router;
