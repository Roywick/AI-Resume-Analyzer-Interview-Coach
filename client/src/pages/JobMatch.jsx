import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import SessionSubNav from '../components/layout/SessionSubNav.jsx';
import Card from '../components/ui/Card.jsx';
import ScoreRing from '../components/ui/ScoreRing.jsx';
import Button from '../components/ui/Button.jsx';
import AnalysisSkeleton from '../components/ui/SkeletonLoader.jsx';
import { useResume } from '../context/ResumeContext.jsx';
import { useChatWidget } from '../context/ChatContext.jsx';
import { useResumeGuard } from '../hooks/useResumeGuard.js';
import { matchJobDescription } from '../services/api.js';

export default function JobMatch() {
  const hasResume = useResumeGuard();
  const navigate = useNavigate();
  const { resumeText, jobDescription, setJobDescription, jobMatch, setJobMatch } = useResume();
  const { askAI } = useChatWidget();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [draftJD, setDraftJD] = useState(jobDescription);

  useEffect(() => {
    if (!hasResume || jobMatch || !jobDescription) return;
    runMatch(jobDescription);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasResume]);

  async function runMatch(jd) {
    setLoading(true);
    setError('');
    try {
      const data = await matchJobDescription(resumeText, jd);
      setJobMatch(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleRunMatch = () => {
    if (!draftJD.trim()) {
      setError('Paste a job description to calculate a match score.');
      return;
    }
    setJobDescription(draftJD);
    setJobMatch(null);
    runMatch(draftJD);
  };

  if (!hasResume) return null;

  return (
    <section className="container-page py-10">
      <SessionSubNav />
      <span className="eyebrow">Step 3 of 4</span>
      <h1 className="mt-2 mb-8 text-3xl font-bold tracking-tight">Job description match</h1>

      <Card className="mb-8">
        <label htmlFor="jd" className="block text-sm font-medium mb-2">Job description</label>
        <textarea
          id="jd"
          value={draftJD}
          onChange={(e) => setDraftJD(e.target.value)}
          rows={6}
          placeholder="Paste the job posting here..."
          className="w-full rounded-xl border border-paper-line dark:border-ink-line bg-paper dark:bg-ink px-4 py-3 text-sm outline-none focus:border-scan resize-y"
        />
        {error && <p className="mt-2 text-sm text-flag-strong dark:text-flag">{error}</p>}
        <Button onClick={handleRunMatch} loading={loading} className="mt-4">
          Calculate match
        </Button>
      </Card>

      {loading && <AnalysisSkeleton />}

      {!loading && jobMatch && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="flex flex-col items-center justify-center text-center">
            <ScoreRing value={jobMatch.matchPercentage} label="Match" size={160} />
            <button
              onClick={() => askAI(`My resume scored a ${jobMatch.matchPercentage}% match against this job description. What should I prioritize fixing first to improve it?`)}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-scan-strong dark:text-scan hover:underline"
            >
              <Sparkles className="w-3.5 h-3.5" /> Ask AI how to close the gap
            </button>
          </Card>

          <div className="grid gap-4">
            <Card>
              <h3 className="font-semibold mb-3">Missing skills</h3>
              <div className="flex flex-wrap gap-2">
                {jobMatch.missingSkills?.map((s) => <span key={s} className="chip-flag">{s}</span>)}
              </div>
            </Card>
            <Card>
              <h3 className="font-semibold mb-3">Missing keywords</h3>
              <div className="flex flex-wrap gap-2">
                {jobMatch.missingKeywords?.map((k) => <span key={k} className="chip-flag">{k}</span>)}
              </div>
            </Card>
          </div>

          <Card>
            <h3 className="font-semibold mb-3">Suggested improvements</h3>
            <ul className="space-y-1.5 text-sm text-ink/75 dark:text-paper/75">
              {jobMatch.suggestedImprovements?.map((s, i) => <li key={i}>• {s}</li>)}
            </ul>
          </Card>

          <Card>
            <h3 className="font-semibold mb-3">Technologies to learn</h3>
            <div className="flex flex-wrap gap-2">
              {jobMatch.recommendedTechnologies?.map((t) => <span key={t} className="chip-pass">{t}</span>)}
            </div>
          </Card>
        </div>
      )}
    </section>
  );
}
