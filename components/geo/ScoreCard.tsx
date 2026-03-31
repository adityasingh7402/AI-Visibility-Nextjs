'use client';

import type { ConfidenceLevel } from '@/lib/geo-types';
import { getScoreGrade } from '@/lib/geo-types';

interface ScoreCardProps {
  label: string;
  score: number;
  description?: string;
  benchmark?: number;
  trend?: 'up' | 'down' | 'stable';
  size?: 'sm' | 'md' | 'lg';
  // Confidence interval fields (per BACKEND_HANDOFF_v2.0 §10)
  confidenceLower?: number;
  confidenceUpper?: number;
  confidenceLevel?: ConfidenceLevel;
}

const CONFIDENCE_COLORS: Record<ConfidenceLevel, string> = {
  HIGH:   'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  MEDIUM: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  LOW:    'bg-red-500/10 text-red-400 border-red-500/20',
};

export function ScoreCard({
  label, score, description, benchmark, trend, size = 'md',
  confidenceLower, confidenceUpper, confidenceLevel,
}: ScoreCardProps) {
  const { grade, color, label: gradeLabel } = getScoreGrade(score);
  const textSize = size === 'lg' ? 'text-5xl' : size === 'sm' ? 'text-2xl' : 'text-4xl';
  const hasInterval = confidenceLower !== undefined && confidenceUpper !== undefined;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</p>
        {/* Confidence level badge */}
        {confidenceLevel && (
          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${CONFIDENCE_COLORS[confidenceLevel]}`}>
            {confidenceLevel === 'LOW' ? '⚠️ ' : ''}{confidenceLevel} conf.
          </span>
        )}
      </div>

      <div className="flex items-end gap-3">
        <p className={`${textSize} font-black`} style={{ color }}>{Math.round(score)}</p>
        <div className="mb-1 flex flex-col gap-1">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${color}20`, color }}>
            {grade} — {gradeLabel}
          </span>
          {/* Confidence interval */}
          {hasInterval && (
            <span className="text-[10px] font-bold text-slate-500">
              {Math.round(confidenceLower!)}–{Math.round(confidenceUpper!)}% range
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.min(score, 100)}%`, backgroundColor: color }}
        />
        {/* Confidence interval shading */}
        {hasInterval && (
          <div
            className="absolute top-0 h-full opacity-30 rounded-full"
            style={{
              left: `${Math.min(confidenceLower!, 100)}%`,
              width: `${Math.max(0, Math.min(confidenceUpper!, 100) - Math.min(confidenceLower!, 100))}%`,
              backgroundColor: color,
            }}
          />
        )}
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

      {/* LOW confidence warning */}
      {confidenceLevel === 'LOW' && (
        <p className="text-[10px] text-red-400 font-semibold bg-red-500/5 border border-red-500/10 rounded-lg px-2 py-1">
          ⚠️ Low confidence — more data needed for accurate scores
        </p>
      )}

      {description && <p className="text-xs text-slate-400">{description}</p>}
    </div>
  );
}
