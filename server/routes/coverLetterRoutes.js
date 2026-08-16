import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { generateCoverLetterController } from '../controllers/coverLetterController.js';

const router = Router();

// POST /api/cover-letter/generate { resumeText, jobDescription?, targetRole? }
router.post('/generate', asyncHandler(generateCoverLetterController));

export default router;
