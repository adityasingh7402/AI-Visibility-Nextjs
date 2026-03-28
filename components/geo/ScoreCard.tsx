'use client';

import { getScoreGrade } from '@/lib/geo-types';

interface ScoreCardProps {
  label: string;
  score: number;
  description?: string;
  benchmark?: number;
  trend?: 'up' | 'down' | 'stable';
  size?: 'sm' | 'md' | 'lg';
}

export function ScoreCard({ label, score, description, benchmark, trend, size = 'md' }: ScoreCardProps) {
  const { grade, color, label: gradeLabel } = getScoreGrade(score);
  const textSize = size === 'lg' ? 'text-5xl' : size === 'sm' ? 'text-2xl' : 'text-4xl';

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 flex flex-col gap-3">
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</p>

      <div className="flex items-end gap-3">
        <p className={`${textSize} font-black`} style={{ color }}>{Math.round(score)}</p>
        <div className="mb-1">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${color}20`, color }}>
            {grade} — {gradeLabel}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.min(score, 100)}%`, backgroundColor: color }}
        />
      </div>

      {benchmark !== undefined && (
        <p className="text-xs text-slate-500">
          vs benchmark: {Math.round(benchmark)} ({score - benchmark > 0 ? '+' : ''}{Math.round(score - benchmark)})
        </p>
      )}

      {trend && (
        <p className="text-xs font-medium" style={{ color }}>
          {trend === 'up' && '📈 Improving'}
          {trend === 'down' && '📉 Declining'}
          {trend === 'stable' && '→ Stable'}
        </p>
      )}

      {description && <p className="text-xs text-slate-400">{description}</p>}
    </div>
  );
}
