import { NavLink } from 'react-router-dom';

const STEPS = [
  { to: '/analysis', label: 'Analysis' },
  { to: '/ats-report', label: 'ATS Report' },
  { to: '/job-match', label: 'Job Match' },
  { to: '/improve', label: 'Improve' },
  { to: '/interview-coach', label: 'Interview Coach' },
  { to: '/cover-letter', label: 'Cover Letter' },
];

export default function SessionSubNav() {
  return (
    <div className="sticky top-16 z-30 -mx-5 sm:mx-0 mb-8 overflow-x-auto border-b border-paper-line dark:border-ink-line bg-paper/95 dark:bg-ink/95 backdrop-blur">
      <div className="container-page flex gap-1 py-2 min-w-max">
        {STEPS.map((s) => (
          <NavLink
            key={s.to}
            to={s.to}
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-ink text-paper dark:bg-scan dark:text-ink'
                  : 'text-ink/60 dark:text-paper/60 hover:bg-paper-line dark:hover:bg-ink-line'
              }`
            }
          >
            {s.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
