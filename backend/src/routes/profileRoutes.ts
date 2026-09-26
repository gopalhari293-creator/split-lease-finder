import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticateToken, getProfile);
router.put('/', authenticateToken, updateProfile);
router.get('/:id', getProfile);

export default router;
