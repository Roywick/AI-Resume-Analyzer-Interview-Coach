import Card from '../ui/Card.jsx';

const QUOTES = [
  { name: 'Priya S.', role: 'New grad, CSE', quote: 'The ATS score caught three formatting issues I never would have guessed were hurting me.' },
  { name: 'Daniel O.', role: 'Backend engineer', quote: 'Pasted a JD and immediately saw which keywords I was missing. Rewrote my summary in ten minutes.' },
  { name: 'Meera K.', role: 'Product designer', quote: 'The interview coach questions were specific to my actual projects, not generic filler.' },
];

export default function Testimonials() {
  return (
    <section className="container-page py-20">
      <div className="max-w-xl mb-12">
        <span className="eyebrow">Early feedback</span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight">What people noticed first.</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {QUOTES.map((t) => (
          <Card key={t.name}>
            <p className="text-sm leading-relaxed text-ink/80 dark:text-paper/80">&ldquo;{t.quote}&rdquo;</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-scan-soft flex items-center justify-center font-mono text-xs font-bold text-scan-strong dark:text-scan">
                {t.name.split(' ').map((p) => p[0]).join('')}
              </div>
              <div>
                <p className="text-sm font-medium">{t.name}</p>
                <p className="text-xs text-ink/50 dark:text-paper/50">{t.role}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
