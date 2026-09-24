interface LoadingSkeletonProps {
  type?: 'hospital-card' | 'dashboard-card' | 'text';
  count?: number;
}

export default function LoadingSkeleton({ type = 'hospital-card', count = 1 }: LoadingSkeletonProps) {
  if (type === 'hospital-card') {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden" aria-busy="true" aria-label="Loading hospital information">
        <div className="px-5 pt-4 pb-3 border-b border-slate-50">
          <div className="flex justify-between">
            <div className="flex-1">
              <div className="skeleton h-3 w-20 mb-2" />
              <div className="skeleton h-5 w-48 mb-1.5" />
              <div className="skeleton h-3 w-36" />
            </div>
            <div className="skeleton h-10 w-12 rounded-lg" />
          </div>
        </div>
        <div className="px-5 py-3 flex gap-2 border-b border-slate-50">
          <div className="skeleton h-6 w-24 rounded-full" />
          <div className="skeleton h-6 w-20 rounded-full" />
          <div className="skeleton h-6 w-16 rounded-full" />
        </div>
        <div className="px-5 py-3 space-y-2 border-b border-slate-50">
          <div className="skeleton h-3 w-28" />
          <div className="skeleton h-3 w-44" />
          <div className="skeleton h-3 w-36" />
          <div className="skeleton h-3 w-40" />
        </div>
        <div className="px-5 py-3 flex gap-2">
          <div className="skeleton h-8 flex-1 rounded-lg" />
          <div className="skeleton h-8 w-24 rounded-lg" />
          <div className="skeleton h-8 w-16 rounded-lg" />
        </div>
      </div>
    );
  }

  if (type === 'dashboard-card') {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-5" aria-busy="true">
        <div className="skeleton h-4 w-24 mb-3" />
        <div className="skeleton h-8 w-16 mb-1" />
        <div className="skeleton h-3 w-32" />
      </div>
    );
  }

  return (
    <div className="space-y-2" aria-busy="true">
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-3/4" />
      <div className="skeleton h-4 w-5/6" />
    </div>
  );
}
