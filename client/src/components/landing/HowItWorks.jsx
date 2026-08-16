const STEPS = [
  { n: '01', title: 'Upload', desc: 'Drop in your resume as a PDF or DOCX. We extract the text instantly — nothing is stored.' },
  { n: '02', title: 'Add context', desc: 'Optionally paste the job description you\u2019re targeting for a tailored match score.' },
  { n: '03', title: 'Get scored', desc: 'Gemini analyzes structure, keywords, and readability to produce your ATS score and gaps.' },
  { n: '04', title: 'Prep & apply', desc: 'Improve the resume, generate a cover letter, and rehearse with the AI interview coach.' },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="container-page py-20">
      <div className="max-w-xl mb-12">
        <span className="eyebrow">The flow</span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight">Four steps, one session, no signup.</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STEPS.map((s, i) => (
          <div key={s.n} className="relative pl-1">
            <span className="font-mono text-sm text-scan-strong dark:text-scan">{s.n}</span>
            <h3 className="font-semibold text-lg mt-2 mb-1.5">{s.title}</h3>
            <p className="text-sm text-ink/65 dark:text-paper/65 leading-relaxed">{s.desc}</p>
            {i < STEPS.length - 1 && (
              <div className="hidden lg:block absolute top-2.5 left-[calc(100%+0.75rem)] w-[calc(100%-1.5rem)] border-t border-dashed border-paper-line dark:border-ink-line" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
