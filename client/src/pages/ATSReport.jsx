import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import SessionSubNav from '../components/layout/SessionSubNav.jsx';
import Card from '../components/ui/Card.jsx';
import { useResume } from '../context/ResumeContext.jsx';
import { useChatWidget } from '../context/ChatContext.jsx';
import { useResumeGuard } from '../hooks/useResumeGuard.js';

export default function ATSReport() {
  const hasResume = useResumeGuard();
  const { analysis } = useResume();
  const { askAI } = useChatWidget();

  if (!hasResume) return null;

  if (!analysis) {
    return (
      <section className="container-page py-10">
        <SessionSubNav />
        <Card><p className="text-sm text-ink/60 dark:text-paper/60">Run the resume analysis first from the Analysis tab.</p></Card>
      </section>
    );
  }

  const chartData = [
    { name: 'Formatting', score: analysis.subScores?.formatting ?? analysis.atsScore },
    { name: 'Keywords', score: analysis.subScores?.keywords ?? analysis.atsScore },
    { name: 'Readability', score: analysis.readabilityScore ?? analysis.atsScore },
    { name: 'Structure', score: analysis.subScores?.structure ?? analysis.atsScore },
  ];

  return (
    <section className="container-page py-10">
      <SessionSubNav />
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <span className="eyebrow">Deep dive</span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">ATS report</h1>
        </div>
        <button
          onClick={() => askAI('Walk me through my ATS score breakdown and tell me which sub-score to focus on first.')}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-scan-strong dark:text-scan hover:underline"
        >
          <Sparkles className="w-4 h-4" /> Ask AI about this report
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="font-semibold mb-4">Score breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid horizontal={false} stroke="currentColor" strokeOpacity={0.1} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ background: '#161B26', border: '1px solid #232A3B', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: '#ECEEF2' }}
                />
                <Bar dataKey="score" fill="#22D3EE" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold mb-4">Keyword pass / fail</h3>
          <div className="space-y-2">
            {analysis.detectedSkills?.map((kw) => (
              <div key={kw} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-ok shrink-0" />
                <span>{kw}</span>
              </div>
            ))}
            {analysis.missingKeywords?.map((kw) => (
              <div key={kw} className="flex items-center gap-2 text-sm text-flag-strong dark:text-flag">
                <XCircle className="w-4 h-4 shrink-0" />
                <span>{kw}</span>
              </div>
            ))}
            {!analysis.missingKeywords?.length && !analysis.detectedSkills?.length && (
              <p className="text-sm text-ink/50 dark:text-paper/50">No keyword data returned.</p>
            )}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h3 className="font-semibold mb-3">Action verb suggestions</h3>
          <div className="flex flex-wrap gap-2">
            {analysis.actionVerbSuggestions?.length
              ? analysis.actionVerbSuggestions.map((v) => <span key={v} className="chip-pass">{v}</span>)
              : <p className="text-sm text-ink/50 dark:text-paper/50">No suggestions returned.</p>}
          </div>
        </Card>
      </div>
    </section>
  );
}
