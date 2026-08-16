import multer from 'multer';

// Wraps async route handlers so rejected promises reach the error handler
// without needing a try/catch in every controller.
export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

export function notFoundHandler(req, res) {
  res.status(404).json({ error: 'Not found', message: `No route for ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error(`[error] ${req.method} ${req.originalUrl} —`, err.message);

  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE' ? 'File is too large. Max size is 8MB.' : err.message;
    return res.status(400).json({ error: 'Upload error', message });
  }

  if (err.message?.includes('Unsupported file type')) {
    return res.status(400).json({ error: 'Invalid file', message: err.message });
  }

  const status = err.status || 500;
  res.status(status).json({
    error: status === 500 ? 'Internal server error' : err.name || 'Error',
    message: status === 500 ? 'Something went wrong while processing your request.' : err.message,
  });
}
