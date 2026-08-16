import { Link } from 'react-router-dom';
import { ScanLine, Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-paper-line dark:border-ink-line mt-24">
      <div className="container-page py-12 grid gap-10 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display font-semibold text-lg mb-3">
            <ScanLine className="w-5 h-5 text-scan-strong dark:text-scan" />
            ResumeIQ AI
          </div>
          <p className="text-sm text-ink/60 dark:text-paper/60">
            Instant, AI-powered resume analysis, job matching, and interview coaching. Nothing you upload is ever saved.
          </p>
        </div>

        <div>
          <p className="font-medium mb-3 text-sm">Product</p>
          <ul className="space-y-2 text-sm text-ink/60 dark:text-paper/60">
            <li><Link to="/upload" className="hover:text-scan-strong dark:hover:text-scan">Resume Analysis</Link></li>
            <li><Link to="/job-match" className="hover:text-scan-strong dark:hover:text-scan">Job Match</Link></li>
            <li><Link to="/interview-coach" className="hover:text-scan-strong dark:hover:text-scan">Interview Coach</Link></li>
            <li><Link to="/cover-letter" className="hover:text-scan-strong dark:hover:text-scan">Cover Letter</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-medium mb-3 text-sm">Company</p>
          <ul className="space-y-2 text-sm text-ink/60 dark:text-paper/60">
            <li><Link to="/about" className="hover:text-scan-strong dark:hover:text-scan">About</Link></li>
            <li><Link to="/contact" className="hover:text-scan-strong dark:hover:text-scan">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-medium mb-3 text-sm">Connect</p>
          <div className="flex gap-3">
            <a href="#" aria-label="GitHub" className="p-2 rounded-lg surface hover:border-scan"><Github className="w-4 h-4" /></a>
            <a href="#" aria-label="LinkedIn" className="p-2 rounded-lg surface hover:border-scan"><Linkedin className="w-4 h-4" /></a>
            <a href="#" aria-label="Email" className="p-2 rounded-lg surface hover:border-scan"><Mail className="w-4 h-4" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-paper-line dark:border-ink-line py-6 text-center text-xs text-ink/50 dark:text-paper/50">
        © {new Date().getFullYear()} ResumeIQ AI. A portfolio project — no data is stored.
      </div>
    </footer>
  );
}
