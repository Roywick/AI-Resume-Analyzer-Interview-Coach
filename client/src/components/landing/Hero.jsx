import { Link } from 'react-router-dom';
import { ArrowRight, ScanLine } from 'lucide-react';

const MOCK_LINES = [
  { text: 'Senior Frontend Engineer — 5 yrs React, TypeScript', match: true },
  { text: 'Led migration to micro-frontends, cut build time 40%', match: true },
  { text: 'Familiar with cloud infrastructure', match: false },
  { text: 'Built design system used across 12 product teams', match: true },
  { text: 'Some exposure to Kubernetes', match: false },
  { text: 'Mentored 4 junior engineers, ran weekly code reviews', match: true },
];

export default function Hero() {
  return (
    <section className="container-page pt-16 pb-20 md:pt-24 md:pb-28 grid md:grid-cols-2 gap-12 items-center">
      <div className="animate-fadeUp">
        <span className="eyebrow">AI resume analysis · ATS scoring · interview coaching</span>
        <h1 className="mt-4 text-4xl sm:text-5xl font-bold leading-[1.08] tracking-tight">
          See your resume the way a recruiter — and the bot before them — actually see it.
        </h1>
        <p className="mt-5 text-lg text-ink/70 dark:text-paper/70 max-w-lg">
          Upload your resume, paste a job description, and get an instant ATS score, a
          gap analysis, and an AI interview coach. No account. Nothing saved.
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link to="/upload" className="btn-primary text-base px-6 py-3.5">
            Analyze My Resume <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="#how-it-works" className="btn-secondary text-base px-6 py-3.5">
            See how it works
          </a>
        </div>
        <p className="mt-6 text-xs font-mono text-ink/40 dark:text-paper/40">
          NO SIGNUP · NO DATABASE · SESSION-ONLY
        </p>
      </div>

      <div className="relative animate-fadeUp" style={{ animationDelay: '120ms' }}>
        <div className="relative surface p-6 overflow-hidden shadow-glow">
          <div className="flex items-center justify-between mb-5">
            <span className="text-xs font-mono text-ink/40 dark:text-paper/40">resume_final_v3.pdf</span>
            <span className="chip-pass"><ScanLine className="w-3 h-3" /> scanning</span>
          </div>

          <div className="space-y-3 relative">
            {MOCK_LINES.map((line, i) => (
              <div
                key={i}
                className={`text-sm rounded-md px-2 py-1.5 transition-colors ${
                  line.match ? 'bg-scan-soft text-scan-strong dark:text-scan' : 'bg-flag-soft text-flag-strong dark:text-flag'
                }`}
              >
                {line.text}
              </div>
            ))}

            {/* Signature element: sweeping scan line */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-scan/25 to-transparent animate-scanline"
            />
          </div>

          <div className="mt-5 pt-5 border-t border-paper-line dark:border-ink-line flex items-center justify-between">
            <span className="text-xs text-ink/50 dark:text-paper/50">4 of 6 lines match target role</span>
            <span className="font-mono text-sm font-bold text-scan-strong dark:text-scan">78/100</span>
          </div>
        </div>
      </div>
    </section>
  );
}
