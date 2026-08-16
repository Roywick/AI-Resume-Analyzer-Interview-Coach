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

// ---------------------------------------------------------------------------
// Quota / rate-limit handling
//
// Gemini's free tier returns HTTP 429 for two very different situations:
//   1. A short-lived per-minute limit (RPM/TPM) — worth a quick retry.
//   2. The daily per-model quota (RPD) — retrying will just fail again and
//      again until the quota resets (usually midnight Pacific), so we detect
//      this and fail fast with one clear message instead of hammering the
//      API and spamming the UI with repeated errors.
// ---------------------------------------------------------------------------

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 1000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isDailyQuotaError(err) {
  const text = err?.message || '';
  return /PerDay|RPD|daily/i.test(text);
}

function extractRetryDelayMs(err) {
  const match = err?.message?.match(/"retryDelay":"(\d+(?:\.\d+)?)s"/);
  if (match) return Math.ceil(parseFloat(match[1]) * 1000);
  return null;
}

function friendlyQuotaError(err) {
  if (isDailyQuotaError(err)) {
    const friendly = new Error(
      "We've hit today's free usage limit for the AI service. Please try again after the quota resets, or upgrade the Gemini API key's billing plan for higher limits."
    );
    friendly.status = 429;
    friendly.name = 'Quota exceeded';
    return friendly;
  }
  const friendly = new Error('The AI service is temporarily busy. Please try again in a moment.');
  friendly.status = 429;
  friendly.name = 'Rate limited';
  return friendly;
}

/**
 * Calls an async Gemini request function, retrying transient (per-minute)
 * rate-limit errors with exponential backoff. Daily-quota errors are not
 * retried — they're converted to a single friendly error immediately.
 */
async function withRetry(requestFn) {
  let lastErr;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await requestFn();
    } catch (err) {
      const status = err?.status || err?.response?.status;
      const wrapped = status ? Object.assign(err, { status }) : err;
      lastErr = wrapped;

      if (wrapped?.status !== 429) throw wrapped; // non-rate-limit error, don't retry

      if (isDailyQuotaError(wrapped)) break; // no point retrying a daily cap
      if (attempt === MAX_RETRIES) break;

      const delay = extractRetryDelayMs(wrapped) ?? BASE_DELAY_MS * 2 ** attempt;
      await sleep(delay);
    }
  }
  throw friendlyQuotaError(lastErr);
}

// ---------------------------------------------------------------------------
// Simple in-memory response cache
//
// Re-analyzing the exact same resume/job description text (e.g. the user
// double-clicks "Analyze", or refreshes the page) shouldn't cost another API
// call against a tight daily quota. Keyed by prompt+model+temperature, with
// a short TTL so results don't go stale forever.
// ---------------------------------------------------------------------------

const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes
const jsonCache = new Map();

function cacheKey(prompt, model, temperature) {
  return `${model}::${temperature}::${prompt}`;
}

function getCached(key) {
  const entry = jsonCache.get(key);
  if (!entry) return undefined;
  if (Date.now() - entry.time > CACHE_TTL_MS) {
    jsonCache.delete(key);
    return undefined;
  }
  return entry.value;
}

function setCached(key, value) {
  jsonCache.set(key, { value, time: Date.now() });
}

/**
 * Sends a prompt to Gemini and parses the response as JSON.
 * The prompts in promptTemplates.js all instruct the model to return
 * JSON-only, but this strips markdown code fences defensively in case
 * the model wraps its output anyway.
 */
export async function generateJSON(prompt, { model = 'gemini-flash-latest', temperature = 0.6 } = {}) {
  const key = cacheKey(prompt, model, temperature);
  const cached = getCached(key);
  if (cached !== undefined) return cached;

  const genAI = getClient();
  const generativeModel = genAI.getGenerativeModel({
    model,
    generationConfig: {
      temperature,
      responseMimeType: 'application/json',
    },
  });

  const rawText = await withRetry(async () => {
    const result = await generativeModel.generateContent(prompt);
    return result.response.text();
  });

  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch (parseErr) {
    const cleaned = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      const err = new Error('The AI returned a response that could not be parsed. Please try again.');
      err.status = 502;
      throw err;
    }
  }

  setCached(key, parsed);
  return parsed;
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

  const replyText = await withRetry(async () => {
    const result = await chat.sendMessage(message);
    return result.response.text().trim();
  });

  return replyText;
}