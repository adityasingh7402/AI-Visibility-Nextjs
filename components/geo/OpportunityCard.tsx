'use client';

import type { KeywordOpportunity } from '@/lib/geo-types';

interface OpportunityCardProps {
  opportunity: KeywordOpportunity;
  index?: number;
}

const PRIORITY_COLORS = {
  high: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', dot: 'bg-red-400' },
  medium: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400', dot: 'bg-yellow-400' },
  low: { bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-400', dot: 'bg-green-400' },
};

const EFFORT_LABELS: Record<string, string> = {
  easy: '⚡ Easy', medium: '⚙️ Medium', hard: '🔨 Hard', moderate: '⚙️ Medium'
};

export function OpportunityCard({ opportunity, index }: OpportunityCardProps) {
  const colors = PRIORITY_COLORS[opportunity.priority] ?? PRIORITY_COLORS.low;

  return (
    <div className={`rounded-2xl border ${colors.border} ${colors.bg} p-5 space-y-3`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {index !== undefined && (
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/10 text-xs font-black text-slate-300 flex items-center justify-center">
              {index + 1}
            </span>
          )}
          <div>
            <p className="font-bold text-white text-sm">"{opportunity.keyword}"</p>
            <p className="text-xs text-slate-400 mt-0.5">{opportunity.reason}</p>
          </div>
        </div>
        <span className={`flex-shrink-0 text-xs font-bold px-2 py-1 rounded-full capitalize ${colors.bg} ${colors.text} border ${colors.border}`}>
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${colors.dot} mr-1`} />
          {opportunity.priority}
        </span>
      </div>

      <div className="flex gap-4 text-xs text-slate-400 flex-wrap">
        <span>{EFFORT_LABELS[opportunity.effort_estimate] ?? opportunity.effort_estimate}</span>
        <span>📈 {opportunity.estimated_impact}</span>
        <span>#{opportunity.target_position} target</span>
      </div>

      {(opportunity.action_items ?? []).length > 0 && (
        <div className="space-y-1 pt-1 border-t border-white/5">
          {opportunity.action_items.map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
              <span className={`mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full ${colors.dot}`} />
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
