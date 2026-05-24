import express from 'express';
import { googleAuth, logout, getMe } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/google', googleAuth);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, getMe);

export default router;
