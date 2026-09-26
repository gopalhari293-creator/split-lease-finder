import { Router } from 'express';
import {
  getConversations,
  createConversation,
  getMessages,
  sendMessage,
} from '../controllers/messagingController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getConversations);
router.post('/', createConversation);
router.get('/:id/messages', getMessages);
router.post('/:id/messages', sendMessage);

export default router;
