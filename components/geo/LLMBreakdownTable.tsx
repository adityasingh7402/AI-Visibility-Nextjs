'use client';

import type { LLMVisibilityScore } from '@/lib/geo-types';
import { LLM_PROVIDER_INFO } from '@/lib/geo-types';

interface LLMBreakdownTableProps {
  visibilityByLLM: Record<string, LLMVisibilityScore>;
  confidenceByLLM?: Record<string, number>;
}

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-3 flex-1">
      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.min(value, 100)}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-black w-10 text-right" style={{ color }}>
        {Math.round(value)}%
      </span>
    </div>
  );
}

export function LLMBreakdownTable({ visibilityByLLM, confidenceByLLM }: LLMBreakdownTableProps) {
  const entries = Object.entries(visibilityByLLM).sort(
    ([, a], [, b]) => b.visibility_score - a.visibility_score
  );

  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-sm text-slate-400 font-medium">No per-LLM breakdown available for this analysis.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/10 bg-white/5">
        <span className="col-span-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Provider</span>
        <span className="col-span-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Visibility Score</span>
        <span className="col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mention Rate</span>
        <span className="col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Position</span>
        <span className="col-span-1 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Conf.</span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/5">
        {entries.map(([provider, scores], idx) => {
          const info = LLM_PROVIDER_INFO[provider] || { label: provider, icon: '🤖', color: '#6B7280' };
          const confidence = confidenceByLLM?.[provider];

          return (
            <div
              key={provider}
              className="grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-white/[0.03] transition-colors group"
            >
              {/* Provider */}
              <div className="col-span-3 flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                  style={{ backgroundColor: `${info.color}20`, border: `1px solid ${info.color}30` }}
                >
                  {info.icon}
                </div>
                <div>
                  <p className="text-xs font-black text-white">{info.label}</p>
                  {idx === 0 && (
                    <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">TOP</span>
                  )}
                </div>
              </div>

              {/* Visibility score bar */}
              <div className="col-span-4">
                <ScoreBar value={scores.visibility_score} color={info.color} />
              </div>

              {/* Mention rate */}
              <div className="col-span-2">
                <p className="text-xs font-bold text-slate-300">
                  {(scores.mention_rate * 100).toFixed(0)}%
                </p>
              </div>

              {/* Avg position */}
              <div className="col-span-2">
                <p className="text-xs font-bold text-slate-300">
                  {scores.average_position !== undefined ? `#${scores.average_position.toFixed(1)}` : '—'}
                </p>
              </div>

              {/* Confidence */}
              <div className="col-span-1 text-right">
                {confidence !== undefined ? (
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                    confidence >= 0.8 ? 'bg-emerald-500/10 text-emerald-400' :
                    confidence >= 0.5 ? 'bg-amber-500/10 text-amber-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>
                    {Math.round(confidence * 100)}%
                  </span>
                ) : (
                  <span className="text-slate-600 text-xs">—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
