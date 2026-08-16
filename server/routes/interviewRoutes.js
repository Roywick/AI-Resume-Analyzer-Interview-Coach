import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { generateInterviewQuestionsController } from '../controllers/interviewController.js';

const router = Router();

// POST /api/interview/generate { resumeText, jobDescription?, targetRole? }
router.post('/generate', asyncHandler(generateInterviewQuestionsController));

export default router;
