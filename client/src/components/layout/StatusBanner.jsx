import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, X, ServerCrash } from 'lucide-react';
import api from '../../services/api.js';

const RECHECK_MS = 45000;

export default function StatusBanner() {
  const [state, setState] = useState('checking'); // checking | ok | unreachable | no-ai-key
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const { data } = await api.get('/health');
        if (cancelled) return;
        if (data?.aiConfigured === false) {
          setState('no-ai-key');
        } else {
          setState('ok');
          setDismissed(false); // re-arm so a future outage shows again
        }
      } catch {
        if (!cancelled) setState('unreachable');
      }
    }

    check();
    const interval = setInterval(check, RECHECK_MS);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  if (state === 'checking' || state === 'ok' || dismissed) return null;

  const copy = state === 'unreachable'
    ? {
        Icon: ServerCrash,
        title: "Can't reach the backend server.",
        detail: 'Make sure the server is running (cd server && npm run dev) on the port your client expects.',
      }
    : {
        Icon: AlertTriangle,
        title: 'AI features are disabled — GEMINI_API_KEY is missing.',
        detail: 'Add your key to server/.env (copy from .env.example) and restart the backend to enable analysis, chat, and other AI features.',
      };

  const { Icon, title, detail } = copy;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="overflow-hidden bg-flag-soft border-b border-flag/30"
      >
        <div className="container-page py-2.5 flex items-start gap-3 text-sm">
          <Icon className="w-4 h-4 mt-0.5 shrink-0 text-flag-strong dark:text-flag" />
          <div className="flex-1 min-w-0">
            <span className="font-medium text-flag-strong dark:text-flag">{title}</span>{' '}
            <span className="text-ink/70 dark:text-paper/70">{detail}</span>
          </div>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
            className="shrink-0 p-1 rounded hover:bg-flag/20 text-flag-strong dark:text-flag"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
