import { Router } from 'express';
import { getMatches, getCombinedMatches, updateMatchStatus } from '../controllers/matchesController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getMatches);
router.get('/combined', getCombinedMatches);
router.post('/status', updateMatchStatus);

export default router;
