import { Router } from 'express';
import upload from '../middleware/upload.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { uploadResumeController } from '../controllers/resumeController.js';

const router = Router();

// POST /api/resume/upload — multipart/form-data, field name "resume"
router.post('/upload', upload.single('resume'), asyncHandler(uploadResumeController));

export default router;
