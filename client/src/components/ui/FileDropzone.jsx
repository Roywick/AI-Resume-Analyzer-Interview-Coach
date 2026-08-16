import { useCallback, useRef, useState } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_SIZE_MB = 8;

export default function FileDropzone({ file, onFileSelected, onClear, error }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const validateAndSet = useCallback(
    (candidate) => {
      if (!candidate) return;
      if (!ACCEPTED_TYPES.includes(candidate.type)) {
        onFileSelected(null, 'Please upload a PDF or DOCX file.');
        return;
      }
      if (candidate.size > MAX_SIZE_MB * 1024 * 1024) {
        onFileSelected(null, `File is too large. Max size is ${MAX_SIZE_MB}MB.`);
        return;
      }
      onFileSelected(candidate, null);
    },
    [onFileSelected]
  );

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    validateAndSet(e.dataTransfer.files?.[0]);
  };

  return (
    <div>
      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
          aria-label="Upload resume file, PDF or DOCX"
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-colors
            ${isDragging ? 'border-scan bg-scan-soft' : 'border-paper-line dark:border-ink-line hover:border-scan/60'}`}
        >
          <UploadCloud className="w-9 h-9 mx-auto mb-3 text-scan-strong dark:text-scan" />
          <p className="font-medium">Drag & drop your resume here</p>
          <p className="text-sm text-ink/60 dark:text-paper/60 mt-1">or click to browse — PDF or DOCX, up to {MAX_SIZE_MB}MB</p>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            onChange={(e) => validateAndSet(e.target.files?.[0])}
          />
        </div>
      ) : (
        <div className="surface p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <FileText className="w-6 h-6 text-scan-strong dark:text-scan shrink-0" />
            <div className="min-w-0">
              <p className="font-medium truncate">{file.name}</p>
              <p className="text-xs text-ink/50 dark:text-paper/50">{(file.size / 1024).toFixed(0)} KB</p>
            </div>
          </div>
          <button
            onClick={onClear}
            aria-label="Remove uploaded file"
            className="p-2 rounded-lg hover:bg-paper-line dark:hover:bg-ink-line transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-flag-strong dark:text-flag">{error}</p>}
    </div>
  );
}
