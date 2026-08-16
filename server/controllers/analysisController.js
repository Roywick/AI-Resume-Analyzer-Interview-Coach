import { generateJSON } from '../services/geminiService.js';
import { resumeAnalysisPrompt, jobMatchPrompt, improveResumePrompt } from '../utils/promptTemplates.js';

function requireResumeText(resumeText) {
  if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 30) {
    const err = new Error('resumeText is required and must be substantial resume content.');
    err.status = 400;
    throw err;
  }
}

export async function analyzeResumeController(req, res) {
  const { resumeText } = req.body;
  requireResumeText(resumeText);

  const data = await generateJSON(resumeAnalysisPrompt(resumeText));
  res.json(data);
}

export async function jobMatchController(req, res) {
  const { resumeText, jobDescription } = req.body;
  requireResumeText(resumeText);

  if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length < 20) {
    const err = new Error('jobDescription is required to calculate a match score.');
    err.status = 400;
    throw err;
  }

  const data = await generateJSON(jobMatchPrompt(resumeText, jobDescription));
  res.json(data);
}

export async function improveResumeController(req, res) {
  const { resumeText, jobDescription } = req.body;
  requireResumeText(resumeText);

  const data = await generateJSON(improveResumePrompt(resumeText, jobDescription || ''));
  res.json(data);
}
