import { Router } from 'express';
import {
  register,
  login,
  getMe,
  logout,
  googleRedirect,
  googleCallback,
} from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', requireAuth, getMe);
router.delete('/me', logout);
router.get('/google', googleRedirect);
router.get('/callback/google', googleCallback);

export default router;
