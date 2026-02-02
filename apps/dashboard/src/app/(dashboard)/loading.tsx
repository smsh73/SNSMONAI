export default function DashboardLoading() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-950 -m-4 p-6">
      {/* Status bar skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-7 w-32 bg-slate-800 rounded-full animate-pulse" />
          <div className="h-4 w-24 bg-slate-800 rounded animate-pulse" />
        </div>
        <div className="h-4 w-40 bg-slate-800 rounded animate-pulse" />
      </div>

      {/* Main grid skeleton */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left column */}
        <div className="col-span-4 space-y-6">
          <div className="h-44 bg-slate-900/80 rounded-2xl border border-slate-800 animate-pulse" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-28 bg-slate-900/80 rounded-xl border border-slate-800 animate-pulse" />
            <div className="h-28 bg-slate-900/80 rounded-xl border border-slate-800 animate-pulse" />
            <div className="h-28 bg-slate-900/80 rounded-xl border border-slate-800 animate-pulse" />
            <div className="h-28 bg-slate-900/80 rounded-xl border border-slate-800 animate-pulse" />
          </div>
          <div className="h-40 bg-slate-900/80 rounded-xl border border-slate-800 animate-pulse" />
        </div>

        {/* Center column */}
        <div className="col-span-5 space-y-6">
          <div className="h-64 bg-slate-900/80 rounded-xl border border-slate-800 animate-pulse" />
          <div className="h-48 bg-slate-900/80 rounded-xl border border-slate-800 animate-pulse" />
        </div>

        {/* Right column */}
        <div className="col-span-3 space-y-6">
          <div className="h-52 bg-slate-900/80 rounded-xl border border-slate-800 animate-pulse" />
          <div className="h-40 bg-slate-900/80 rounded-xl border border-slate-800 animate-pulse" />
          <div className="h-36 bg-slate-900/80 rounded-xl border border-slate-800 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
