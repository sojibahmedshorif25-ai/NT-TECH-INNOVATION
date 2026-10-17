import { Router } from 'express';
import { updatePipelineStage } from '../controllers/pipeline.controller.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';

const router = Router();

router.patch('/', requireAuth, requireRole(['RECRUITER', 'ADMIN']), updatePipelineStage);

export default router;
