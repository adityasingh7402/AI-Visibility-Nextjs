'use client';

import { useState } from 'react';
import { getScoreGrade } from '@/lib/geo-types';
import type { CompetitorPattern } from '@/lib/geo-types';

interface CompetitorCardProps {
  competitor: CompetitorPattern;
}

export function CompetitorCard({ competitor }: CompetitorCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { color } = getScoreGrade(competitor.visibility_score);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
      {/* Header */}
      <button
        className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black"
            style={{ backgroundColor: `${color}20`, color }}
          >
            {competitor.competitor_name.charAt(0)}
          </div>
          <div className="text-left">
            <p className="font-bold text-white">{competitor.competitor_name}</p>
            <p className="text-xs text-slate-400">
              {(competitor.mention_rate * 100).toFixed(0)}% mention rate · #{competitor.average_position.toFixed(1)} avg position
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-2xl font-black" style={{ color }}>{Math.round(competitor.visibility_score)}</p>
            <p className="text-xs text-slate-500">visibility</p>
          </div>
          <span className="text-slate-400 text-sm">{expanded ? '▲' : '▼'}</span>
        </div>
      </button>

      {/* LLMs */}
      {competitor.featured_in_llms?.length > 0 && (
        <div className="px-5 pb-3 flex gap-2">
          {competitor.featured_in_llms.map(llm => (
            <span key={llm} className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-medium">
              {llm}
            </span>
          ))}
        </div>
      )}

      {/* Expanded: why they rank */}
      {expanded && (
        <div className="border-t border-white/10 p-5 space-y-4">
          <h4 className="text-sm font-bold text-white">Why they're visible</h4>
          <div className="space-y-2">
            {competitor.visibility_factors.map((factor, idx) => (
              <div key={idx} className="rounded-xl bg-white/5 p-3 space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    factor.impact_level === 'critical' ? 'bg-red-500/20 text-red-400' :
                    factor.impact_level === 'high' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {factor.factor_type.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-400">{factor.impact_level} impact</span>
                </div>
                <p className="text-xs text-slate-300">{factor.description}</p>
                {factor.action_to_replicate && (
                  <p className="text-xs text-blue-400 font-medium">→ {factor.action_to_replicate}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
