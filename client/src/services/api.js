import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 60000, // Gemini calls can be slow — generous timeout
});

// Normalizes backend error shapes into a single readable message.
function unwrapError(err) {
  const msg =
    err.response?.data?.message ||
    err.response?.data?.error ||
    err.message ||
    'Something went wrong. Please try again.';
  return new Error(msg);
}

export async function uploadResume(file) {
  const formData = new FormData();
  formData.append('resume', file);
  try {
    const { data } = await api.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data; // { resumeText, fileName }
  } catch (err) {
    throw unwrapError(err);
  }
}

export async function analyzeResume(resumeText) {
  try {
    const { data } = await api.post('/analysis/resume', { resumeText });
    return data;
  } catch (err) {
    throw unwrapError(err);
  }
}

export async function matchJobDescription(resumeText, jobDescription) {
  try {
    const { data } = await api.post('/analysis/job-match', { resumeText, jobDescription });
    return data;
  } catch (err) {
    throw unwrapError(err);
  }
}

export async function improveResume(resumeText, jobDescription) {
  try {
    const { data } = await api.post('/analysis/improve', { resumeText, jobDescription });
    return data;
  } catch (err) {
    throw unwrapError(err);
  }
}

export async function generateInterviewQuestions({ resumeText, jobDescription, targetRole }) {
  try {
    const { data } = await api.post('/interview/generate', { resumeText, jobDescription, targetRole });
    return data;
  } catch (err) {
    throw unwrapError(err);
  }
}

export async function generateCoverLetter({ resumeText, jobDescription, targetRole }) {
  try {
    const { data } = await api.post('/cover-letter/generate', { resumeText, jobDescription, targetRole });
    return data;
  } catch (err) {
    throw unwrapError(err);
  }
}

export async function sendChatMessage({ message, history, resumeText, jobDescription, targetRole }) {
  try {
    const { data } = await api.post('/chat/message', { message, history, resumeText, jobDescription, targetRole });
    return data; // { reply }
  } catch (err) {
    throw unwrapError(err);
  }
}

export default api;
