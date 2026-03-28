'use client';

import { useState } from 'react';
import { useKeywordDiscovery } from '@/hooks/useGeo';
import { useSSEProgress } from '@/hooks/useSSEProgress';
import { ScoreCard } from '@/components/geo/ScoreCard';
import { KeywordList } from '@/components/geo/KeywordList';
import { CompetitorCard } from '@/components/geo/CompetitorCard';
import { OpportunityCard } from '@/components/geo/OpportunityCard';
import { AnalysisProgressBar } from '@/components/geo/AnalysisProgressBar';
import type { DiscoveryMode, LLMProvider } from '@/lib/geo-types';

const LLM_OPTIONS: { id: LLMProvider; label: string }[] = [
  { id: 'chatgpt', label: 'ChatGPT' },
  { id: 'gemini', label: 'Gemini' },
  { id: 'perplexity', label: 'Perplexity' },
  { id: 'claude', label: 'Claude' },
];

export default function KeywordsPage() {
  const { data, loading, error, discover, reset } = useKeywordDiscovery();
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const { progress, stageLabel } = useSSEProgress(loading ? analysisId : null);

  const [brandName, setBrandName] = useState('');
  const [category, setCategory] = useState('');
  const [competitors, setCompetitors] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [mode, setMode] = useState<DiscoveryMode>('standard');
  const [selectedLLMs, setSelectedLLMs] = useState<LLMProvider[]>(['chatgpt', 'gemini', 'perplexity']);
  const [activeTab, setActiveTab] = useState<'opportunities' | 'competitors' | 'keywords'>('opportunities');

  const toggleLLM = (llm: LLMProvider) => {
    setSelectedLLMs(prev =>
      prev.includes(llm) ? prev.filter(l => l !== llm) : [...prev, llm]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName || !category || selectedLLMs.length === 0) return;
    // Generate a temporary ID so SSE can connect before Python returns analysis_id
    const tempId = `kd-${brandName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    setAnalysisId(tempId);
    const result = await discover({
      brand_name: brandName,
      category,
      competitors: competitors.split(',').map(c => c.trim()).filter(Boolean),
      target_audience: targetAudience || undefined,
      region: 'global',
      mode,
      llm_providers: selectedLLMs,
      runs_per_prompt: 1,
    });
    // Update to real analysis_id once returned
    if (result?.analysis_id) setAnalysisId(result.analysis_id);
  };

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-black text-white">Keyword Discovery</h1>
        <p className="text-slate-400 mt-1">Find which keywords AI models use to mention your brand — and your competitors.</p>
      </div>

      {/* Form */}
      {!data && (
        <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Brand Name *</label>
              <input
                value={brandName}
                onChange={e => setBrandName(e.target.value)}
                placeholder="e.g. Notion"
                required
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Category *</label>
              <input
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="e.g. project management software"
                required
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Competitors (comma-separated)</label>
              <input
                value={competitors}
                onChange={e => setCompetitors(e.target.value)}
                placeholder="e.g. Asana, Trello, Monday.com"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Target Audience</label>
              <input
                value={targetAudience}
                onChange={e => setTargetAudience(e.target.value)}
                placeholder="e.g. startup teams, freelancers"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
              />
            </div>
          </div>

          {/* Mode */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Discovery Mode</label>
            <div className="flex gap-3">
              {(['quick', 'standard', 'deep'] as DiscoveryMode[]).map(m => (
                <button type="button" key={m} onClick={() => setMode(m)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold capitalize transition-all border ${
                    mode === m ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                  }`}>
                  {m === 'quick' ? '⚡ Quick (15s)' : m === 'standard' ? '⚙️ Standard (45s)' : '🔬 Deep (90s)'}
                </button>
              ))}
            </div>
          </div>

          {/* LLM providers */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">AI Models to Test *</label>
            <div className="flex gap-3 flex-wrap">
              {LLM_OPTIONS.map(opt => (
                <button type="button" key={opt.id} onClick={() => toggleLLM(opt.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                    selectedLLMs.includes(opt.id) ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">{error}</div>
          )}

          <button type="submit" disabled={loading || !brandName || !category || selectedLLMs.length === 0}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm transition-all">
            {loading ? 'Discovering keywords...' : '🔍 Discover Keywords'}
          </button>
        </form>
      )}

      {/* Loading state — real SSE progress if available, else animated placeholder */}
      {loading && (
        <AnalysisProgressBar
          status={progress?.status ?? 'processing'}
          currentStage={progress ? stageLabel : 'Connecting to analysis agents…'}
          progressPercent={progress?.progress_percent ?? 10}
          stageProgressPercent={progress?.stage_progress_percent ?? 30}
          estimatedSecondsRemaining={progress?.estimated_seconds_remaining}
        />
      )}

      {/* Results */}
      {data && !loading && (
        <div className="space-y-6">
          {/* Reset button */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white">Results for "{data.brand_name}"</h2>
            <button onClick={reset} className="text-xs text-slate-400 hover:text-white border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-lg transition-all">
              ← New Discovery
            </button>
          </div>

          {/* Score cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ScoreCard
              label="RAG Visibility"
              score={data.visibility_summary.rag_model_visibility}
              description={`${(data.visibility_summary.mention_rate * 100).toFixed(0)}% mention rate`}
            />
            <ScoreCard
              label="Base Model"
              score={data.visibility_summary.base_model_visibility}
            />
            <ScoreCard
              label="Opportunity Gap"
              score={data.visibility_summary.actionable_gap}
              description="Potential gains available"
            />
            <ScoreCard
              label="Avg Position"
              score={Math.max(0, 100 - data.visibility_summary.average_position * 10)}
              description={`#${data.visibility_summary.average_position.toFixed(1)} in AI responses`}
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-white/5 p-1 rounded-xl w-fit">
            {(['opportunities', 'keywords', 'competitors'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                  activeTab === tab ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
                }`}>
                {tab === 'opportunities' ? `🎯 Opportunities (${data.opportunities.length})` :
                 tab === 'keywords' ? `🔑 Keywords (${data.working_keywords.length + data.gap_keywords.length})` :
                 `🏆 Competitors (${data.competitor_patterns.length})`}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'opportunities' && (
            <div className="space-y-3">
              {data.opportunities.length === 0 ? (
                <p className="text-slate-400 text-sm">No opportunities found for this brand yet.</p>
              ) : (
                data.opportunities.map((opp, i) => <OpportunityCard key={i} opportunity={opp} index={i} />)
              )}
            </div>
          )}

          {activeTab === 'keywords' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <KeywordList keywords={data.working_keywords} type="working" />
              <KeywordList keywords={data.gap_keywords} type="gap" />
              {data.your_winning_keywords?.length > 0 && (
                <div className="md:col-span-2">
                  <KeywordList keywords={data.your_winning_keywords} type="winning" />
                </div>
              )}
            </div>
          )}

          {activeTab === 'competitors' && (
            <div className="space-y-3">
              {data.competitor_patterns.map((comp) => (
                <CompetitorCard key={comp.competitor_name} competitor={comp} />
              ))}
            </div>
          )}

          {/* Next steps */}
          {data.next_steps?.length > 0 && (
            <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 space-y-3">
              <h3 className="text-sm font-bold text-blue-300">Recommended Next Steps</h3>
              <ol className="space-y-2">
                {data.next_steps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-xs text-slate-300">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px]">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
