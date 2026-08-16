import { generateJSON } from '../services/geminiService.js';
import { coverLetterPrompt } from '../utils/promptTemplates.js';

export async function generateCoverLetterController(req, res) {
  const { resumeText, jobDescription, targetRole } = req.body;

  if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 30) {
    const err = new Error('resumeText is required and must be substantial resume content.');
    err.status = 400;
    throw err;
  }

  const data = await generateJSON(
    coverLetterPrompt({ resumeText, jobDescription: jobDescription || '', targetRole: targetRole || '' }),
    { temperature: 0.65 }
  );
  res.json(data);
}
