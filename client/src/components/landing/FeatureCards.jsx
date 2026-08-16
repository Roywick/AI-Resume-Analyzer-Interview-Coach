import { ScanSearch, Target, Sparkles, MessagesSquare, FileEdit, Download } from 'lucide-react';
import Card from '../ui/Card.jsx';

const FEATURES = [
  { icon: ScanSearch, title: 'ATS Score', desc: 'See exactly how an applicant tracking system parses and scores your resume — before a human ever opens it.' },
  { icon: Target, title: 'Job Match', desc: 'Paste any job description to get a match percentage, missing keywords, and the skills worth adding.' },
  { icon: Sparkles, title: 'AI Improvement', desc: 'Get a rewritten summary, stronger action verbs, and specific formatting fixes — not generic tips.' },
  { icon: MessagesSquare, title: 'Interview Coach', desc: 'HR, technical, behavioral, and project questions tailored to your resume, each with a sample answer.' },
  { icon: FileEdit, title: 'Cover Letters', desc: 'Generate a role-specific cover letter from your resume and the job description in seconds.' },
  { icon: Download, title: 'One-Click Report', desc: 'Export the full analysis — scores, gaps, and questions — as a single PDF to keep for reference.' },
];

export default function FeatureCards() {
  return (
    <section className="container-page py-20">
      <div className="max-w-xl mb-12">
        <span className="eyebrow">What ResumeIQ AI reads</span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight">Everything a hiring pipeline checks, in one pass.</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <Card key={title} className="hover:border-scan/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-scan-soft flex items-center justify-center mb-4">
              <Icon className="w-5 h-5 text-scan-strong dark:text-scan" />
            </div>
            <h3 className="font-semibold text-lg mb-1.5">{title}</h3>
            <p className="text-sm text-ink/65 dark:text-paper/65 leading-relaxed">{desc}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
