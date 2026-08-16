import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import resumeRoutes from './routes/resumeRoutes.js';
import analysisRoutes from './routes/analysisRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import coverLetterRoutes from './routes/coverLetterRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json({ limit: '2mb' }));

// AI endpoints hit an external API and cost money per call — rate limit
// generously but firmly to prevent accidental abuse of a public demo.
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests', message: 'Please slow down and try again in a few minutes.' },
});
app.use('/api/analysis', aiLimiter);
app.use('/api/interview', aiLimiter);
app.use('/api/cover-letter', aiLimiter);

// The chat widget is conversational (many small messages), so it gets its
// own, slightly more generous limiter instead of sharing the report limiter.
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests', message: 'You\u2019ve sent a lot of messages — please wait a few minutes.' },
});
app.use('/api/chat', chatLimiter);

app.get('/api/health', (req, res) => res.json({
  status: 'ok',
  service: 'ResumeIQ AI API',
  aiConfigured: Boolean(process.env.GEMINI_API_KEY),
}));

app.use('/api/resume', resumeRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/cover-letter', coverLetterRoutes);
app.use('/api/chat', chatRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`ResumeIQ AI API listening on port ${PORT}`);
});
