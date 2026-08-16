import { extractResumeText } from '../services/parserService.js';

export async function uploadResumeController(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded', message: 'Please attach a PDF or DOCX resume.' });
  }

  const resumeText = await extractResumeText(req.file.buffer, req.file.mimetype);

  res.json({
    resumeText,
    fileName: req.file.originalname,
  });
}
