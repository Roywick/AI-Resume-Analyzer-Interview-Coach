import { generateJSON } from '../services/geminiService.js';
import { interviewQuestionsPrompt } from '../utils/promptTemplates.js';

export async function generateInterviewQuestionsController(req, res) {
  const { resumeText, jobDescription, targetRole } = req.body;

  if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 30) {
    const err = new Error('resumeText is required and must be substantial resume content.');
    err.status = 400;
    throw err;
  }

  const data = await generateJSON(
    interviewQuestionsPrompt({ resumeText, jobDescription: jobDescription || '', targetRole: targetRole || '' }),
    { temperature: 0.7 }
  );
  res.json(data);
}
