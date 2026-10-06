/** Route auth: /login, /logout. */
import { Router } from 'express';
import { login, logout, showLoginForm } from '../controllers/authController';
import { redirectIfAuth, requireAuth } from '../middleware/auth';
import { limiters } from '../middleware/rateLimit';
import { ah } from '../lib/asyncHandler';

const router = Router();

router.get('/login', redirectIfAuth, ah(showLoginForm));
router.post('/login', redirectIfAuth, limiters.loginLimiter, ah(login));
router.post('/logout', requireAuth, logout);

export default router;
