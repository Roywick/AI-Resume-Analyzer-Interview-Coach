import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  { q: 'Is my resume stored anywhere?', a: 'No. Your file is parsed in memory for the current session only. Nothing is written to a database, and everything clears when you close or refresh the tab.' },
  { q: 'Do I need to create an account?', a: 'No signup, no login. Upload a resume and start getting feedback immediately.' },
  { q: 'What file types are supported?', a: 'PDF and DOCX, up to 8MB.' },
  { q: 'How is the ATS score calculated?', a: 'Gemini evaluates structure, keyword density against any job description you provide, formatting, and readability, then combines them into a single 0–100 score.' },
  { q: 'Can I use it without a job description?', a: 'Yes — general resume analysis, ATS scoring, and the interview coach all work without one. Adding a job description unlocks match scoring and a tailored cover letter.' },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="container-page py-20">
      <div className="max-w-xl mb-10">
        <span className="eyebrow">Questions</span>
        <h2 className="mt-3 text-3xl font-bold tracking-tight">Frequently asked.</h2>
      </div>
      <div className="max-w-2xl divide-y divide-paper-line dark:divide-ink-line surface !p-0">
        {FAQS.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={item.q}>
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-medium text-sm sm:text-base">{item.q}</span>
                <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-scan-strong dark:text-scan' : ''}`} />
              </button>
              {isOpen && (
                <p className="px-6 pb-5 text-sm text-ink/65 dark:text-paper/65 leading-relaxed">{item.a}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
