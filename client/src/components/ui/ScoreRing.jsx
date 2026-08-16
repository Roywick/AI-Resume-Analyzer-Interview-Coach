export default function ScoreRing({ value = 0, label = '', size = 140, stroke = 10 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;

  const tone =
    clamped >= 75 ? 'text-ok' : clamped >= 50 ? 'text-scan' : 'text-flag';

  return (
    <div className="flex flex-col items-center gap-2" role="img" aria-label={`${label}: ${clamped} out of 100`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          className="fill-none stroke-paper-line dark:stroke-ink-line"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`fill-none ${tone} transition-all duration-700 ease-out`}
          stroke="currentColor"
        />
      </svg>
      <div className="-mt-[92px] flex flex-col items-center">
        <span className={`font-mono text-2xl font-bold ${tone}`}>{Math.round(clamped)}</span>
        <span className="font-mono text-[10px] text-ink/50 dark:text-paper/50">/100</span>
      </div>
      {label && <span className="mt-8 text-sm text-ink/70 dark:text-paper/70">{label}</span>}
    </div>
  );
}
