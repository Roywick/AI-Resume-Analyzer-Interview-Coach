import { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, Download, Sparkles, RefreshCw, ChevronDown, FileText } from 'lucide-react';
import SessionSubNav from '../components/layout/SessionSubNav.jsx';
import Card from '../components/ui/Card.jsx';
import ScoreRing from '../components/ui/ScoreRing.jsx';
import Button from '../components/ui/Button.jsx';
import AnalysisSkeleton from '../components/ui/SkeletonLoader.jsx';
import { useResume } from '../context/ResumeContext.jsx';
import { useChatWidget } from '../context/ChatContext.jsx';
import { useResumeGuard } from '../hooks/useResumeGuard.js';
import { analyzeResume } from '../services/api.js';
import { exportSessionReport } from '../utils/pdfExport.js';

export default function Analysis() {
  const hasResume = useResumeGuard();
  const {
    resumeText, resumeFile, analysis, setAnalysis,
    jobMatch, improvement, interviewQuestions, coverLetter,
  } = useResume();
  const { askAI } = useChatWidget();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRaw, setShowRaw] = useState(false);
  const [retryTick, setRetryTick] = useState(0);

  useEffect(() => {
    if (!hasResume || analysis) return;
    let cancelled = false;
    setLoading(true);
    setError('');
    analyzeResume(resumeText)
      .then((data) => !cancelled && setAnalysis(data))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [hasResume, resumeText, analysis, setAnalysis, retryTick]);

  if (!hasResume) return null;

  return (
    <section className="container-page py-10">
      <SessionSubNav />

      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <span className="eyebrow">Step 2 of 4</span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Resume analysis</h1>
        </div>
        <Button
          variant="secondary"
          icon={Download}
          onClick={() => exportSessionReport({ analysis, jobMatch, improvement, interviewQuestions, coverLetter, fileName: resumeFile?.name })}
          disabled={!analysis}
        >
          Download report
        </Button>
      </div>

      {loading && <AnalysisSkeleton />}

      {error && (
        <Card className="border-flag/40">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <p className="text-sm text-flag-strong dark:text-flag">{error}</p>
            <Button variant="secondary" icon={RefreshCw} onClick={() => setRetryTick((t) => t + 1)}>
              Retry
            </Button>
          </div>
        </Card>
      )}

      {resumeText && (
        <Card className="mb-6">
          <button
            onClick={() => setShowRaw((s) => !s)}
            className="w-full flex items-center justify-between text-sm font-medium"
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-ink/50 dark:text-paper/50" />
              View extracted resume text
            </span>
            <ChevronDown className={`w-4 h-4 text-ink/50 dark:text-paper/50 transition-transform ${showRaw ? 'rotate-180' : ''}`} />
          </button>
          {showRaw && (
            <pre className="mt-4 max-h-64 overflow-y-auto whitespace-pre-wrap text-xs font-mono text-ink/70 dark:text-paper/70 bg-paper dark:bg-ink rounded-xl border border-paper-line dark:border-ink-line p-4">
              {resumeText}
            </pre>
          )}
        </Card>
      )}

      {!loading && analysis && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="flex flex-col items-center justify-center text-center">
            <ScoreRing value={analysis.atsScore} label="ATS Score" size={160} />
            <p className="mt-4 text-sm text-ink/60 dark:text-paper/60">{analysis.summary}</p>
            <button
              onClick={() => askAI(`My ATS score is ${analysis.atsScore}/100. Can you explain what's likely holding it back and how to raise it?`)}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-scan-strong dark:text-scan hover:underline"
            >
              <Sparkles className="w-3.5 h-3.5" /> Ask AI about my score
            </button>
          </Card>

          <div className="grid gap-4">
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-ok" />
                <h3 className="font-semibold">Strengths</h3>
              </div>
              <ul className="space-y-1.5 text-sm text-ink/75 dark:text-paper/75">
                {analysis.strengths?.map((s, i) => <li key={i}>• {s}</li>)}
              </ul>
            </Card>
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-flag" />
                <h3 className="font-semibold">Weaknesses</h3>
              </div>
              <ul className="space-y-1.5 text-sm text-ink/75 dark:text-paper/75">
                {analysis.weaknesses?.map((s, i) => <li key={i}>• {s}</li>)}
              </ul>
            </Card>
          </div>

          <Card>
            <h3 className="font-semibold mb-3">Readability & formatting</h3>
            <div className="flex items-center gap-4 mb-3">
              <span className="chip-pass font-mono">Readability {analysis.readabilityScore}/100</span>
            </div>
            <p className="text-sm text-ink/70 dark:text-paper/70">{analysis.formattingFeedback}</p>
          </Card>

          <Card>
            <h3 className="font-semibold mb-3">Detected skills</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.detectedSkills?.map((skill) => (
                <span key={skill} className="chip-pass">{skill}</span>
              ))}
            </div>
          </Card>
        </div>
      )}
    </section>
  );
}
