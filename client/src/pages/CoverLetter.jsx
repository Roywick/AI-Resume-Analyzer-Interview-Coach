import { useState } from 'react';
import { jsPDF } from 'jspdf';
import { Copy, Check, Download, Sparkles } from 'lucide-react';
import SessionSubNav from '../components/layout/SessionSubNav.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import { SkeletonCard } from '../components/ui/SkeletonLoader.jsx';
import { useResume } from '../context/ResumeContext.jsx';
import { useResumeGuard } from '../hooks/useResumeGuard.js';
import { generateCoverLetter } from '../services/api.js';

export default function CoverLetter() {
  const hasResume = useResumeGuard();
  const { resumeText, jobDescription, targetRole, setTargetRole, coverLetter, setCoverLetter } = useResume();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await generateCoverLetter({ resumeText, jobDescription, targetRole });
      setCoverLetter(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!coverLetter?.body) return;
    navigator.clipboard.writeText(coverLetter.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownload = () => {
    if (!coverLetter?.body) return;
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const margin = 56;
    const width = doc.internal.pageSize.getWidth() - margin * 2;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(coverLetter.body, width);
    doc.text(lines, margin, margin);
    doc.save('ResumeIQ-AI-Cover-Letter.pdf');
  };

  if (!hasResume) return null;

  return (
    <section className="container-page py-10">
      <SessionSubNav />
      <span className="eyebrow">Tailored to the role</span>
      <h1 className="mt-2 mb-8 text-3xl font-bold tracking-tight">Cover letter generator</h1>

      <Card className="mb-8">
        <label htmlFor="role" className="block text-sm font-medium mb-2">Target role</label>
        <input
          id="role"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          placeholder="e.g. Frontend Engineer at a Series B startup"
          className="w-full rounded-xl border border-paper-line dark:border-ink-line bg-paper dark:bg-ink px-4 py-3 text-sm outline-none focus:border-scan"
        />
        <p className="mt-2 text-xs text-ink/50 dark:text-paper/50">
          {jobDescription ? 'Uses the job description from your session too.' : 'No job description in this session — add one on the Upload or Job Match page for a more targeted letter.'}
        </p>
        <Button onClick={handleGenerate} loading={loading} icon={Sparkles} className="mt-4">
          {coverLetter ? 'Regenerate' : 'Generate cover letter'}
        </Button>
      </Card>

      {loading && <SkeletonCard />}
      {error && <Card className="border-flag/40"><p className="text-sm text-flag-strong dark:text-flag">{error}</p></Card>}

      {!loading && coverLetter && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Preview</h3>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={handleCopy} icon={copied ? Check : Copy}>{copied ? 'Copied' : 'Copy'}</Button>
              <Button variant="secondary" onClick={handleDownload} icon={Download}>PDF</Button>
            </div>
          </div>
          <div className="rounded-xl bg-paper dark:bg-ink border border-paper-line dark:border-ink-line p-6 text-sm leading-relaxed whitespace-pre-wrap font-body">
            {coverLetter.body}
          </div>
        </Card>
      )}
    </section>
  );
}
