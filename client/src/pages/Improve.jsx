import { useEffect, useState } from 'react';
import { Copy, Check } from 'lucide-react';
import SessionSubNav from '../components/layout/SessionSubNav.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import { SkeletonCard } from '../components/ui/SkeletonLoader.jsx';
import { useResume } from '../context/ResumeContext.jsx';
import { useResumeGuard } from '../hooks/useResumeGuard.js';
import { improveResume } from '../services/api.js';

export default function Improve() {
  const hasResume = useResumeGuard();
  const { resumeText, jobDescription, improvement, setImprovement } = useResume();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!hasResume || improvement) return;
    let cancelled = false;
    setLoading(true);
    setError('');
    improveResume(resumeText, jobDescription)
      .then((data) => !cancelled && setImprovement(data))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [hasResume, resumeText, jobDescription, improvement, setImprovement]);

  const handleCopy = () => {
    if (!improvement?.rewrittenSummary) return;
    navigator.clipboard.writeText(improvement.rewrittenSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  if (!hasResume) return null;

  return (
    <section className="container-page py-10">
      <SessionSubNav />
      <span className="eyebrow">Step 4 of 4</span>
      <h1 className="mt-2 mb-8 text-3xl font-bold tracking-tight">AI resume improvement</h1>

      {loading && (
        <div className="grid gap-6 md:grid-cols-2">
          <SkeletonCard /><SkeletonCard />
        </div>
      )}

      {error && <Card className="border-flag/40"><p className="text-sm text-flag-strong dark:text-flag">{error}</p></Card>}

      {!loading && improvement && (
        <div className="grid gap-6">
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Rewritten summary</h3>
              <Button variant="secondary" onClick={handleCopy} icon={copied ? Check : Copy}>
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <p className="text-sm leading-relaxed text-ink/80 dark:text-paper/80 whitespace-pre-wrap">{improvement.rewrittenSummary}</p>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <h3 className="font-semibold mb-3">Stronger action verbs</h3>
              <div className="flex flex-wrap gap-2">
                {improvement.actionVerbSuggestions?.map((v) => <span key={v} className="chip-pass">{v}</span>)}
              </div>
            </Card>
            <Card>
              <h3 className="font-semibold mb-3">Formatting fixes</h3>
              <ul className="space-y-1.5 text-sm text-ink/75 dark:text-paper/75">
                {improvement.formattingFixes?.map((f, i) => <li key={i}>• {f}</li>)}
              </ul>
            </Card>
          </div>

          {improvement.beforeAfter?.length > 0 && (
            <Card>
              <h3 className="font-semibold mb-4">Before / after</h3>
              <div className="space-y-4">
                {improvement.beforeAfter.map((pair, i) => (
                  <div key={i} className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg bg-flag-soft border border-flag/20 px-3 py-2.5">
                      <p className="text-xs font-mono text-flag-strong dark:text-flag mb-1">BEFORE</p>
                      {pair.before}
                    </div>
                    <div className="rounded-lg bg-scan-soft border border-scan/20 px-3 py-2.5">
                      <p className="text-xs font-mono text-scan-strong dark:text-scan mb-1">AFTER</p>
                      {pair.after}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </section>
  );
}
