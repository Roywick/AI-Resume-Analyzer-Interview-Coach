import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  analyzeResumeController,
  jobMatchController,
  improveResumeController,
} from '../controllers/analysisController.js';

const router = Router();

// POST /api/analysis/resume { resumeText }
router.post('/resume', asyncHandler(analyzeResumeController));

// POST /api/analysis/job-match { resumeText, jobDescription }
router.post('/job-match', asyncHandler(jobMatchController));

// POST /api/analysis/improve { resumeText, jobDescription? }
router.post('/improve', asyncHandler(improveResumeController));

export default router;
