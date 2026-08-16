import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SessionSubNav from '../components/layout/SessionSubNav.jsx';
import Card from '../components/ui/Card.jsx';
import { SkeletonCard } from '../components/ui/SkeletonLoader.jsx';
import { useResume } from '../context/ResumeContext.jsx';
import { useResumeGuard } from '../hooks/useResumeGuard.js';
import { generateInterviewQuestions } from '../services/api.js';

const TABS = [
  { key: 'hr', label: 'HR' },
  { key: 'technical', label: 'Technical' },
  { key: 'behavioral', label: 'Behavioral' },
  { key: 'projectBased', label: 'Project-based' },
];

const DIFFICULTY_TONE = {
  easy: 'chip-pass',
  medium: 'chip-flag',
  hard: 'chip-flag',
};

function QuestionItem({ q }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="surface p-4">
      <button className="w-full flex items-start justify-between gap-4 text-left" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <div>
          <p className="font-medium text-sm sm:text-base">{q.question}</p>
          {q.difficulty && <span className={`mt-2 inline-block ${DIFFICULTY_TONE[q.difficulty?.toLowerCase()] || 'chip-pass'}`}>{q.difficulty}</span>}
        </div>
        <ChevronDown className={`w-4 h-4 shrink-0 mt-1 transition-transform ${open ? 'rotate-180 text-scan-strong dark:text-scan' : ''}`} />
      </button>
      {open && (
        <div className="mt-4 pt-4 border-t border-paper-line dark:border-ink-line space-y-3 text-sm">
          {q.sampleAnswer && (
            <div>
              <p className="font-mono text-xs text-scan-strong dark:text-scan mb-1">SAMPLE ANSWER</p>
              <p className="text-ink/75 dark:text-paper/75 leading-relaxed">{q.sampleAnswer}</p>
            </div>
          )}
          {q.tips && (
            <div>
              <p className="font-mono text-xs text-ok mb-1">TIPS</p>
              <p className="text-ink/75 dark:text-paper/75 leading-relaxed">{q.tips}</p>
            </div>
          )}
          {q.commonMistakes && (
            <div>
              <p className="font-mono text-xs text-flag-strong dark:text-flag mb-1">COMMON MISTAKES</p>
              <p className="text-ink/75 dark:text-paper/75 leading-relaxed">{q.commonMistakes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function InterviewCoach() {
  const hasResume = useResumeGuard();
  const { resumeText, jobDescription, targetRole, interviewQuestions, setInterviewQuestions } = useResume();
  const [activeTab, setActiveTab] = useState('hr');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!hasResume || interviewQuestions) return;
    let cancelled = false;
    setLoading(true);
    setError('');
    generateInterviewQuestions({ resumeText, jobDescription, targetRole })
      .then((data) => !cancelled && setInterviewQuestions(data))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [hasResume, resumeText, jobDescription, targetRole, interviewQuestions, setInterviewQuestions]);

  if (!hasResume) return null;

  return (
    <section className="container-page py-10">
      <SessionSubNav />
      <span className="eyebrow">Rehearse before the real thing</span>
      <h1 className="mt-2 mb-8 text-3xl font-bold tracking-tight">AI interview coach</h1>

      {loading && <div className="grid gap-4">{[1, 2, 3].map((i) => <SkeletonCard key={i} />)}</div>}
      {error && <Card className="border-flag/40"><p className="text-sm text-flag-strong dark:text-flag">{error}</p></Card>}

      {!loading && interviewQuestions && (
        <>
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === t.key ? 'bg-ink text-paper dark:bg-scan dark:text-ink' : 'surface text-ink/60 dark:text-paper/60'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {(interviewQuestions[activeTab] || []).map((q, i) => (
              <QuestionItem key={i} q={q} />
            ))}
            {!interviewQuestions[activeTab]?.length && (
              <p className="text-sm text-ink/50 dark:text-paper/50">No questions returned for this category.</p>
            )}
          </div>
        </>
      )}
    </section>
  );
}
