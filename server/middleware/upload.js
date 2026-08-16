import multer from 'multer';

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
]);

const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB

// Memory storage only — the file buffer is parsed and discarded, never
// written to disk, in line with the project's no-persistence requirement.
const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    return cb(new Error('Unsupported file type. Please upload a PDF or DOCX.'));
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE_BYTES },
});

export default upload;
