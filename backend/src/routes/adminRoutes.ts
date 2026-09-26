import { Router } from 'express';
import { getStats, getUsers, deleteUser } from '../controllers/adminController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken, requireRole('ADMIN'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);

export default router;
