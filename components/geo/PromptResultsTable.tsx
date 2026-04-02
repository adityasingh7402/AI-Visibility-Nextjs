'use client';

import { useState } from 'react';
import type { PromptResult } from '@/lib/geo-types';
import { LLM_PROVIDER_INFO } from '@/lib/geo-types';

interface PromptResultsTableProps {
  promptResults: PromptResult[];
}

const TYPE_COLORS: Record<string, string> = {
  category:    'bg-blue-500/10 text-blue-400 border-blue-500/20',
  comparison:  'bg-purple-500/10 text-purple-400 border-purple-500/20',
  alternative: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  direct:      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

export function PromptResultsTable({ promptResults }: PromptResultsTableProps) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  if (!promptResults || promptResults.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center space-y-2">
        <p className="text-3xl">📋</p>
        <p className="text-sm text-slate-400 font-medium">
          No individual prompt results available for this analysis.
        </p>
        <p className="text-xs text-slate-500">
          Prompt-level data is only available in Standard and Deep discovery modes.
        </p>
      </div>
    );
  }

  const displayed = showAll ? promptResults : promptResults.slice(0, 10);
  const mentionedCount = promptResults.filter(p => p.brand_mentioned).length;
  const mentionRate = (mentionedCount / promptResults.length * 100).toFixed(0);

  return (
    <div className="space-y-4">
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
          <p className="text-2xl font-black text-white">{promptResults.length}</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Prompts Tested</p>
        </div>
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
          <p className="text-2xl font-black text-emerald-400">{mentionedCount}</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Brand Mentioned</p>
        </div>
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-center">
          <p className="text-2xl font-black text-primary">{mentionRate}%</p>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Mention Rate</p>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-12 gap-3 px-5 py-3 bg-white/5 border-b border-white/10">
          <span className="col-span-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Prompt</span>
          <span className="col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type</span>
          <span className="col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Mentioned?</span>
          <span className="col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Mention Rate</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-white/5">
          {displayed.map((result, idx) => {
            const isExpanded = expanded === idx;
            const typeClass = TYPE_COLORS[result.prompt_type] ?? 'bg-slate-500/10 text-slate-400 border-slate-500/20';

            // Resolve per-LLM results: Python returns llm_results (LLMMention[]), legacy returns per_llm_results
            const rawLLM = result.llm_results || result.per_llm_results;
            const perLLMEntries: [string, { mentioned: boolean; position?: number; raw_response?: string }][] = rawLLM
              ? Object.entries(rawLLM).map(([provider, val]) => {
                  if (Array.isArray(val)) {
                    // LLMMention[] — aggregate: mentioned if any mention, take first position
                    const anyMentioned = val.some((m: { mentioned?: boolean }) => m.mentioned);
                    const pos = val.find((m: { position?: number }) => m.position)?.position;
                    const raw = val.find((m: { raw_response?: string }) => m.raw_response)?.raw_response;
                    return [provider, { mentioned: anyMentioned, position: pos, raw_response: raw }];
                  }
                  return [provider, val as { mentioned: boolean; position?: number; raw_response?: string }];
                })
              : [];

            return (
              <div key={idx}>
                <button
                  className="w-full grid grid-cols-12 gap-3 px-5 py-4 items-center hover:bg-white/[0.03] transition-colors text-left"
                  onClick={() => setExpanded(isExpanded ? null : idx)}
                >
                  {/* Prompt text */}
                  <div className="col-span-6 flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-lg bg-white/5 text-slate-500 text-[10px] font-black flex items-center justify-center mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-slate-200 font-medium leading-relaxed line-clamp-2 text-left">
                      {result.prompt}
                    </p>
                  </div>

                  {/* Type badge */}
                  <div className="col-span-2">
                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${typeClass}`}>
                      {result.prompt_type}
                    </span>
                  </div>

                  {/* Mentioned */}
                  <div className="col-span-2">
                    <span className={`text-xs font-black ${result.brand_mentioned ? 'text-emerald-400' : 'text-red-400'}`}>
                      {result.brand_mentioned ? '✓ Yes' : '✗ No'}
                    </span>
                  </div>

                  {/* Mention rate */}
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <span className="text-xs font-black text-slate-300">
                      {(result.mention_rate * 100).toFixed(0)}%
                    </span>
                    <span className={`text-slate-400 text-xs transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
                  </div>
                </button>

                {/* Expanded: per-LLM breakdown */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-white/5 bg-white/[0.02] space-y-4">
                    {result.signal_weight !== undefined && (
                      <p className="text-[10px] text-slate-400 font-bold">
                        Signal weight: <span className="text-white">{result.signal_weight.toFixed(2)}</span>
                        {' · '}Avg position: <span className="text-white">#{(result.avg_position ?? result.average_position)?.toFixed(1) ?? '—'}</span>
                      </p>
                    )}

                    {perLLMEntries.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {perLLMEntries.map(([provider, llmResult]) => {
                          const info = LLM_PROVIDER_INFO[provider] || { label: provider, icon: '🤖', color: '#6B7280' };
                          return (
                            <div
                              key={provider}
                              className={`rounded-xl p-3 border ${llmResult.mentioned ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'}`}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <span>{info.icon}</span>
                                <span className="text-xs font-black text-white">{info.label}</span>
                                <span className={`ml-auto text-[9px] font-black ${llmResult.mentioned ? 'text-emerald-400' : 'text-red-400'}`}>
                                  {llmResult.mentioned ? '✓' : '✗'}
                                </span>
                              </div>
                              {llmResult.position && (
                                <p className="text-[10px] text-slate-400">Position: #{llmResult.position}</p>
                              )}
                              {llmResult.raw_response && (
                                <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed italic">
                                  &ldquo;{llmResult.raw_response}&rdquo;
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">No per-LLM breakdown available for this prompt.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Show more */}
        {promptResults.length > 10 && (
          <div className="p-4 border-t border-white/10 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-xs font-black text-primary hover:text-blue-400 transition-colors uppercase tracking-widest"
            >
              {showAll ? '▲ Show fewer' : `▼ Show all ${promptResults.length} prompts`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
