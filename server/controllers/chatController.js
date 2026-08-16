import { generateChatReply } from '../services/geminiService.js';
import { chatSystemPrompt } from '../utils/promptTemplates.js';

const MAX_MESSAGE_LEN = 1200;
const MAX_HISTORY_TURNS = 12; // trims oldest turns to keep prompts small/cheap

export async function chatMessageController(req, res) {
  const { message, history, resumeText, jobDescription, targetRole } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    const err = new Error('message is required.');
    err.status = 400;
    throw err;
  }
  if (message.length > MAX_MESSAGE_LEN) {
    const err = new Error(`Message is too long (max ${MAX_MESSAGE_LEN} characters).`);
    err.status = 400;
    throw err;
  }

  const safeHistory = Array.isArray(history)
    ? history
        .filter((t) => t && typeof t.text === 'string' && (t.role === 'user' || t.role === 'assistant'))
        .slice(-MAX_HISTORY_TURNS)
    : [];

  const systemPrompt = chatSystemPrompt({
    resumeText: typeof resumeText === 'string' ? resumeText : '',
    jobDescription: typeof jobDescription === 'string' ? jobDescription : '',
    targetRole: typeof targetRole === 'string' ? targetRole : '',
  });

  const reply = await generateChatReply({ systemPrompt, history: safeHistory, message: message.trim() });
  res.json({ reply });
}
