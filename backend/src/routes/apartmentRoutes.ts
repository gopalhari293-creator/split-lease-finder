import { Router } from 'express';
import {
  getApartments,
  getApartmentById,
  createApartment,
  updateApartment,
  deleteApartment,
} from '../controllers/apartmentsController.js';
import { authenticateToken, optionalAuthenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(optionalAuthenticateToken);

router.get('/', getApartments);
router.get('/:id', getApartmentById);
router.post('/', authenticateToken, requireRole('ADMIN'), createApartment);
router.put('/:id', authenticateToken, requireRole('ADMIN'), updateApartment);
router.delete('/:id', authenticateToken, requireRole('ADMIN'), deleteApartment);

export default router;
