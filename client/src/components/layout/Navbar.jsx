import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Moon, Sun, ScanLine, Menu, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-paper/80 dark:bg-ink/80 border-b border-paper-line dark:border-ink-line">
      <nav className="container-page flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 font-display font-semibold text-lg">
          <ScanLine className="w-5 h-5 text-scan-strong dark:text-scan" />
          ResumeIQ <span className="text-scan-strong dark:text-scan">AI</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? 'text-scan-strong dark:text-scan' : 'text-ink/70 dark:text-paper/70 hover:text-ink dark:hover:text-paper'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="p-2 rounded-lg hover:bg-paper-line dark:hover:bg-ink-line transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Link to="/upload" className="btn-primary hidden sm:inline-flex">
            Analyze My Resume
          </Link>
          <button
            className="md:hidden p-2 rounded-lg hover:bg-paper-line dark:hover:bg-ink-line"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden border-t border-paper-line dark:border-ink-line px-5 py-4 flex flex-col gap-3">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-sm font-medium">
              {l.label}
            </NavLink>
          ))}
          <Link to="/upload" onClick={() => setOpen(false)} className="btn-primary justify-center mt-1">
            Analyze My Resume
          </Link>
        </div>
      )}
    </header>
  );
}
