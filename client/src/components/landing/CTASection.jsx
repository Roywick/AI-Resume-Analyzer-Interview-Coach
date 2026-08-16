import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="container-page pb-24">
      <div className="surface p-10 sm:p-14 text-center relative overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-scan-soft to-transparent pointer-events-none" />
        <div className="relative">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight max-w-xl mx-auto">
            Know exactly where your resume stands before you hit submit.
          </h2>
          <p className="mt-4 text-ink/65 dark:text-paper/65 max-w-md mx-auto">
            Free, instant, and nothing you upload is ever saved.
          </p>
          <Link to="/upload" className="btn-primary mt-8 text-base px-6 py-3.5 inline-flex">
            Analyze My Resume <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
