import { Router } from 'express';
import {
  getSavedApartments,
  saveApartment,
  removeSavedApartment,
} from '../controllers/savedApartmentsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getSavedApartments);
router.post('/:apartmentId', saveApartment);
router.delete('/:apartmentId', removeSavedApartment);

export default router;
