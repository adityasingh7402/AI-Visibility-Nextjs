'use client';

import type { ContentGapAnalysis } from '@/lib/geo-types';

interface ContentGapCardProps {
  gapAnalysis: ContentGapAnalysis;
}

const BUCKETS = [
  {
    key: 'covered' as keyof ContentGapAnalysis,
    label: 'Well Covered',
    icon: '✅',
    description: 'Strong, citable content exists',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    headerText: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/20',
    badgeText: 'text-emerald-300',
    dotColor: 'bg-emerald-400',
  },
  {
    key: 'thin' as keyof ContentGapAnalysis,
    label: 'Thin Coverage',
    icon: '⚠️',
    description: 'Content exists but needs improvement',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    headerText: 'text-amber-400',
    badgeBg: 'bg-amber-500/20',
    badgeText: 'text-amber-300',
    dotColor: 'bg-amber-400',
  },
  {
    key: 'missing' as keyof ContentGapAnalysis,
    label: 'Missing Content',
    icon: '❌',
    description: 'No content — high priority to create',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    headerText: 'text-red-400',
    badgeBg: 'bg-red-500/20',
    badgeText: 'text-red-300',
    dotColor: 'bg-red-400',
  },
];

export function ContentGapCard({ gapAnalysis }: ContentGapCardProps) {
  const total =
    (gapAnalysis.covered?.length ?? 0) +
    (gapAnalysis.thin?.length ?? 0) +
    (gapAnalysis.missing?.length ?? 0);

  const coveredPct = total > 0 ? Math.round((gapAnalysis.covered?.length ?? 0) / total * 100) : 0;
  const missingPct = total > 0 ? Math.round((gapAnalysis.missing?.length ?? 0) / total * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Summary bar */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest">Coverage Overview</h4>
          <p className="text-xs text-slate-400 font-medium">{total} keywords analysed</p>
        </div>

        {/* Stacked bar */}
        <div className="h-3 rounded-full overflow-hidden flex gap-0.5 bg-white/5">
          {coveredPct > 0 && (
            <div className="h-full bg-emerald-500 transition-all duration-700" style={{ width: `${coveredPct}%` }} />
          )}
          {total > 0 && (
            <div
              className="h-full bg-amber-500 transition-all duration-700"
              style={{ width: `${Math.round((gapAnalysis.thin?.length ?? 0) / total * 100)}%` }}
            />
          )}
          {missingPct > 0 && (
            <div className="h-full bg-red-500 transition-all duration-700" style={{ width: `${missingPct}%` }} />
          )}
        </div>

        <div className="flex gap-4 flex-wrap">
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            {coveredPct}% covered
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            {Math.round((gapAnalysis.thin?.length ?? 0) / Math.max(total, 1) * 100)}% thin
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
            {missingPct}% missing
          </span>
        </div>
      </div>

      {/* Three buckets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {BUCKETS.map(bucket => {
          const keywords: string[] = gapAnalysis[bucket.key] ?? [];
          return (
            <div
              key={bucket.key}
              className={`rounded-2xl border ${bucket.border} ${bucket.bg} p-5 space-y-4`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{bucket.icon}</span>
                  <h4 className={`text-xs font-black uppercase tracking-widest ${bucket.headerText}`}>
                    {bucket.label}
                  </h4>
                </div>
                <span className={`text-xs font-black px-2 py-0.5 rounded-full ${bucket.badgeBg} ${bucket.badgeText}`}>
                  {keywords.length}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">{bucket.description}</p>

              {keywords.length === 0 ? (
                <p className="text-xs text-slate-600 italic">None</p>
              ) : (
                <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto scrollbar-thin">
                  {keywords.map(kw => (
                    <span
                      key={kw}
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg ${bucket.badgeBg} ${bucket.badgeText} flex items-center gap-1`}
                    >
                      <span className={`w-1 h-1 rounded-full ${bucket.dotColor} flex-shrink-0`} />
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
