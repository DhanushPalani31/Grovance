export function SkeletonLine({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-slate-200 ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <SkeletonLine className="mb-3 h-9 w-9 rounded-lg" />
      <SkeletonLine className="mb-2 h-3 w-20" />
      <SkeletonLine className="h-6 w-16" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-3 last:border-0">
      <SkeletonLine className="h-4 w-2/3" />
      <SkeletonLine className="h-3 w-12" />
    </div>
  );
}
