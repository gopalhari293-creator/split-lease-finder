import { Router } from 'express';
import { getRoommates, getRoommateById, getRecommendations } from '../controllers/roommatesController.js';
import { authenticateToken, optionalAuthenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(optionalAuthenticateToken);

router.get('/', getRoommates);
router.get('/recommendations', authenticateToken, getRecommendations);
router.get('/:id', getRoommateById);

export default router;
