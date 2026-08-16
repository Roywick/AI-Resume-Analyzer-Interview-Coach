export function SkeletonLine({ width = 'w-full', className = '' }) {
  return <div className={`h-3 rounded-full bg-paper-line dark:bg-ink-line animate-pulseSoft ${width} ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="surface p-6 space-y-3">
      <SkeletonLine width="w-1/3" />
      <SkeletonLine width="w-full" />
      <SkeletonLine width="w-5/6" />
      <SkeletonLine width="w-2/3" />
    </div>
  );
}

export function SkeletonRing() {
  return (
    <div className="w-[140px] h-[140px] rounded-full border-[10px] border-paper-line dark:border-ink-line animate-pulseSoft" />
  );
}

export default function AnalysisSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="surface p-6 flex flex-col items-center gap-4">
        <SkeletonRing />
        <SkeletonLine width="w-1/2" />
      </div>
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}
