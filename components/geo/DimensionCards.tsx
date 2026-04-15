'use client';

import {
  V19_DIMENSIONS,
  V19_CLUSTERS,
  type VisibilitySubScoresV19,
} from '@/lib/report-types';
import { getMaturityColor } from '@/lib/report-v2-types';

// ── DimensionCard: single dimension with score bar ──

interface DimensionCardProps {
  dimensionKey: keyof VisibilitySubScoresV19;
  score: number;
  compact?: boolean;
}

export function DimensionCard({ dimensionKey, score, compact }: DimensionCardProps) {
  const meta = V19_DIMENSIONS.find((d) => d.key === dimensionKey);
  if (!meta) return null;

  const clusterMeta = V19_CLUSTERS.find((c) => c.name === meta.cluster);
  const color = clusterMeta?.color || '#6B7280';
  const scoreColor = getMaturityColor(score);

  if (compact) {
    return (
      <div className="flex items-center justify-between gap-2 py-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
          <span className="text-xs font-medium text-foreground truncate">{meta.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(score, 100)}%`, backgroundColor: color }}
            />
          </div>
          <span className="text-xs font-bold tabular-nums w-7 text-right" style={{ color: scoreColor }}>
            {Math.round(score)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-sm font-semibold text-foreground">{meta.label}</span>
        </div>
        <span className="text-lg font-black tabular-nums" style={{ color: scoreColor }}>
          {Math.round(score)}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(score, 100)}%`, backgroundColor: color }}
        />
      </div>
      <p className="text-[11px] text-muted-foreground leading-snug">{meta.description}</p>
    </div>
  );
}

// ── ClusterBreakdown: grouped dimensions by cluster ──

interface ClusterBreakdownProps {
  scores: VisibilitySubScoresV19;
}

export function ClusterBreakdown({ scores }: ClusterBreakdownProps) {
  return (
    <div className="space-y-6">
      {V19_CLUSTERS.map((cluster) => {
        const dims = V19_DIMENSIONS.filter((d) => d.cluster === cluster.name);
        const clusterScore =
          dims.length > 0
            ? dims.reduce((sum, d) => sum + (scores[d.key] ?? 0), 0) / dims.length
            : 0;

        return (
          <div key={cluster.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: cluster.color }} />
                <span className="text-sm font-bold text-foreground">{cluster.name}</span>
                <span className="text-[10px] font-medium text-muted-foreground">
                  ({Math.round(cluster.weight * 100)}%)
                </span>
              </div>
              <span className="text-sm font-black tabular-nums" style={{ color: cluster.color }}>
                {Math.round(clusterScore)}
              </span>
            </div>
            <div className="pl-5 space-y-0.5">
              {dims.map((dim) => (
                <DimensionCard key={dim.key} dimensionKey={dim.key} score={scores[dim.key] ?? 0} compact />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
