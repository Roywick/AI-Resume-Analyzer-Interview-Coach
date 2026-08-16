import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, AlertCircle } from 'lucide-react';
import FileDropzone from '../components/ui/FileDropzone.jsx';
import Button from '../components/ui/Button.jsx';
import { useResume } from '../context/ResumeContext.jsx';
import { uploadResume } from '../services/api.js';

export default function Upload() {
  const navigate = useNavigate();
  const {
    resumeFile, setResumeFile, setResumeText,
    jobDescription, setJobDescription,
    targetRole, setTargetRole,
    setStatus, setErrorMessage, errorMessage,
  } = useResume();

  const [fileError, setFileError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleFileSelected = (file, err) => {
    setFileError(err);
    if (file) setResumeFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      setFileError('Please upload a resume to continue.');
      return;
    }
    setSubmitting(true);
    setErrorMessage('');
    setStatus('uploading');
    try {
      const { resumeText } = await uploadResume(resumeFile);
      setResumeText(resumeText);
      setStatus('ready');
      navigate('/analysis');
    } catch (err) {
      setStatus('error');
      setErrorMessage(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="container-page py-16 max-w-2xl">
      <span className="eyebrow">Step 1 of 4</span>
      <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">Upload your resume</h1>
      <p className="mt-3 text-ink/65 dark:text-paper/65">
        We'll extract the text and analyze it. Add a job description below for a tailored match score — or skip it for a general review.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-8">
        <div>
          <label className="block text-sm font-medium mb-2">Resume file</label>
          <FileDropzone
            file={resumeFile}
            onFileSelected={handleFileSelected}
            onClear={() => setResumeFile(null)}
            error={fileError}
          />
        </div>

        <div>
          <label htmlFor="targetRole" className="block text-sm font-medium mb-2">
            Target role <span className="text-ink/40 dark:text-paper/40 font-normal">(optional)</span>
          </label>
          <input
            id="targetRole"
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Frontend Engineer"
            className="w-full rounded-xl border border-paper-line dark:border-ink-line bg-paper-panel dark:bg-ink-panel px-4 py-3 text-sm outline-none focus:border-scan"
          />
        </div>

        <div>
          <label htmlFor="jobDescription" className="block text-sm font-medium mb-2">
            Job description <span className="text-ink/40 dark:text-paper/40 font-normal">(optional, unlocks Job Match)</span>
          </label>
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={8}
            placeholder="Paste the job posting here..."
            className="w-full rounded-xl border border-paper-line dark:border-ink-line bg-paper-panel dark:bg-ink-panel px-4 py-3 text-sm outline-none focus:border-scan resize-y"
          />
          <p className="mt-1.5 text-xs text-ink/40 dark:text-paper/40 text-right">
            {jobDescription.trim() ? `${jobDescription.trim().split(/\s+/).length} words` : ''}
          </p>
        </div>

        {errorMessage && (
          <div className="flex items-start gap-2 text-sm text-flag-strong dark:text-flag bg-flag-soft border border-flag/30 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <Button type="submit" loading={submitting} className="w-full sm:w-auto">
          Analyze My Resume <ArrowRight className="w-4 h-4" />
        </Button>
      </form>
    </section>
  );
}
