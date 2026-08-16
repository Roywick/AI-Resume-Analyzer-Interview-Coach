import { Link } from 'react-router-dom';
import { ScanLine, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <section className="container-page py-32 text-center max-w-lg mx-auto">
      <ScanLine className="w-10 h-10 mx-auto mb-5 text-scan-strong dark:text-scan" />
      <p className="font-mono text-sm text-ink/50 dark:text-paper/50 mb-2">404 / NO MATCH FOUND</p>
      <h1 className="text-3xl font-bold tracking-tight mb-3">This page didn't make the cut.</h1>
      <p className="text-ink/65 dark:text-paper/65 mb-8">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link to="/" className="btn-primary inline-flex">
        <ArrowLeft className="w-4 h-4" /> Back to home
      </Link>
    </section>
  );
}
