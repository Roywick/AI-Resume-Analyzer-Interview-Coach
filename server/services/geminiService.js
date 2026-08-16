import { GoogleGenerativeAI } from '@google/generative-ai';

let client = null;

function getClient() {
  if (!process.env.GEMINI_API_KEY) {
    // 503 (not 500) so errorHandler surfaces this exact message to the UI
    // instead of masking it as a generic "internal server error" — this is
    // a setup problem, not a real server fault, and the person running the
    // app locally needs to see it to fix it.
    const err = new Error('AI service is not configured. Add GEMINI_API_KEY to server/.env and restart the backend.');
    err.status = 503;
    throw err;
  }
  if (!client) {
    client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return client;
}

/**
 * Sends a prompt to Gemini and parses the response as JSON.
 * The prompts in promptTemplates.js all instruct the model to return
 * JSON-only, but this strips markdown code fences defensively in case
 * the model wraps its output anyway.
 */
export async function generateJSON(prompt, { model = 'gemini-flash-latest', temperature = 0.6 } = {}) {
  const genAI = getClient();
  const generativeModel = genAI.getGenerativeModel({
    model,
    generationConfig: {
      temperature,
      responseMimeType: 'application/json',
    },
  });

  const result = await generativeModel.generateContent(prompt);
  const rawText = result.response.text();

  try {
    return JSON.parse(rawText);
  } catch (parseErr) {
    const cleaned = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    try {
      return JSON.parse(cleaned);
    } catch {
      const err = new Error('The AI returned a response that could not be parsed. Please try again.');
      err.status = 502;
      throw err;
    }
  }
}

/**
 * Multi-turn chat completion for the "Ask ResumeIQ" assistant widget.
 * `history` is an array of { role: 'user' | 'model', text: string } from the
 * current in-memory session (nothing is persisted server-side either).
 */
export async function generateChatReply({ systemPrompt, history = [], message }, { model = 'gemini-flash-latest', temperature = 0.7 } = {}) {
  const genAI = getClient();
  const generativeModel = genAI.getGenerativeModel({
    model,
    systemInstruction: systemPrompt,
    generationConfig: { temperature, maxOutputTokens: 500 },
  });

  const chat = generativeModel.startChat({
    history: history.map((turn) => ({
      role: turn.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: turn.text }],
    })),
  });

  const result = await chat.sendMessage(message);
  return result.response.text().trim();
}
