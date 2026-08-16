import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

/**
 * Extracts plain text from an uploaded resume buffer.
 * @param {Buffer} buffer - raw file bytes (from multer memory storage)
 * @param {string} mimetype
 * @returns {Promise<string>}
 */
export async function extractResumeText(buffer, mimetype) {
  if (mimetype === 'application/pdf') {
    const result = await pdfParse(buffer);
    return cleanText(result.text);
  }

  if (mimetype === DOCX_MIME) {
    const result = await mammoth.extractRawText({ buffer });
    return cleanText(result.value);
  }

  const err = new Error('Unsupported file type. Please upload a PDF or DOCX.');
  err.status = 400;
  throw err;
}

function cleanText(text) {
  const cleaned = text
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  if (!cleaned || cleaned.length < 30) {
    const err = new Error('Could not extract readable text from this file. Try a different export of your resume.');
    err.status = 422;
    throw err;
  }

  return cleaned;
}
