import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { chatMessageController } from '../controllers/chatController.js';

const router = Router();

// POST /api/chat/message { message, history?, resumeText?, jobDescription?, targetRole? }
router.post('/message', asyncHandler(chatMessageController));

export default router;
