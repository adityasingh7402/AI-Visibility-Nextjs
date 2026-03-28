'use client';

import { useState } from 'react';
import { useKeywordDiscovery } from '@/hooks/useGeo';
import { useSSEProgress } from '@/hooks/useSSEProgress';
import { ScoreCard } from '@/components/geo/ScoreCard';
import { KeywordList } from '@/components/geo/KeywordList';
import { CompetitorCard } from '@/components/geo/CompetitorCard';
import { OpportunityCard } from '@/components/geo/OpportunityCard';
import { AnalysisProgressBar } from '@/components/geo/AnalysisProgressBar';
import { Button } from '@/components/ui/button';
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
    <div className="space-y-10">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Keyword Discovery</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">Identify the keywords AI models use to mention your brand and competitors.</p>
        </div>
      </div>

      {/* Form */}
      {!data && (
        <form onSubmit={handleSubmit} className="rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/50 p-8 md:p-10 shadow-sm space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Brand Name *</label>
              <input
                value={brandName}
                onChange={e => setBrandName(e.target.value)}
                placeholder="e.g. Notion"
                required
                className="w-full rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/10 px-5 py-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Category *</label>
              <input
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="e.g. project management software"
                required
                className="w-full rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/10 px-5 py-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Competitors (comma-separated)</label>
              <input
                value={competitors}
                onChange={e => setCompetitors(e.target.value)}
                placeholder="e.g. Asana, Trello, Monday.com"
                className="w-full rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/10 px-5 py-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Target Audience</label>
              <input
                value={targetAudience}
                onChange={e => setTargetAudience(e.target.value)}
                placeholder="e.g. startup teams, freelancers"
                className="w-full rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/10 px-5 py-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
              />
            </div>
          </div>

          {/* Mode */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Discovery Mode</label>
            <div className="flex gap-3 flex-wrap">
              {(['quick', 'standard', 'deep'] as DiscoveryMode[]).map(m => (
                <button type="button" key={m} onClick={() => setMode(m)}
                  className={`flex-1 min-w-[140px] py-4 rounded-2xl text-xs font-black capitalize transition-all border ${
                    mode === m 
                      ? 'bg-primary/10 border-primary text-primary shadow-sm' 
                      : 'bg-slate-50 dark:bg-black/20 border-slate-100 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-slate-200 dark:hover:border-white/20'
                  }`}>
                  {m === 'quick' ? '⚡ Quick' : m === 'standard' ? '⚙️ Standard' : '🔬 Deep'}
                </button>
              ))}
            </div>
          </div>

          {/* LLM providers */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">AI Models to Test *</label>
            <div className="flex gap-3 flex-wrap">
              {LLM_OPTIONS.map(opt => (
                <button type="button" key={opt.id} onClick={() => toggleLLM(opt.id)}
                  className={`px-6 py-3 rounded-2xl text-xs font-black transition-all border ${
                    selectedLLMs.includes(opt.id) 
                      ? 'bg-primary/10 border-primary text-primary shadow-sm' 
                      : 'bg-slate-50 dark:bg-black/20 border-slate-100 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-slate-200 dark:hover:border-white/20'
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-600 dark:text-red-400 font-semibold">{error}</div>
          )}

          <Button type="submit" disabled={loading || !brandName || !category || selectedLLMs.length === 0}
            className="w-full py-7 rounded-2xl bg-primary hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-base shadow-xl shadow-primary/25 transition-all active:scale-[0.99]">
            {loading ? 'Discovering keywords...' : 'Discover Brand Keywords'}
          </Button>
        </form>
      )}

      {/* Loading state */}
      {loading && (
        <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/5 p-12 shadow-sm">
          <AnalysisProgressBar
            status={progress?.status ?? 'processing'}
            currentStage={progress ? stageLabel : 'Connecting to analysis agents…'}
            progressPercent={progress?.progress_percent ?? 10}
            stageProgressPercent={progress?.stage_progress_percent ?? 30}
            estimatedSecondsRemaining={progress?.estimated_seconds_remaining}
          />
        </div>
      )}

      {/* Results */}
      {data && !loading && (
        <div className="space-y-8 animate-in fade-in duration-700">
          {/* Reset header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900/50 p-6 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-sm">
            <div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">Results for</p>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">"{data.brand_name}"</h2>
            </div>
            <Button onClick={reset} variant="outline" className="rounded-xl font-bold border-slate-200 dark:border-white/10 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 h-11 px-6">
              ← New Discovery
            </Button>
          </div>

          {/* Score cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
              description="Potential gains"
            />
            <ScoreCard
              label="Avg Position"
              score={Math.max(0, 100 - data.visibility_summary.average_position * 10)}
              description={`#${data.visibility_summary.average_position.toFixed(1)} match`}
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-2 bg-slate-100 dark:bg-black/40 p-1.5 rounded-2xl w-fit border border-slate-200/50 dark:border-white/5">
            {(['opportunities', 'keywords', 'competitors'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab 
                    ? 'bg-white dark:bg-slate-800 text-primary shadow-sm border border-slate-200 dark:border-white/10' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}>
                {tab === 'opportunities' ? `🎯 Opportunities (${data.opportunities.length})` :
                 tab === 'keywords' ? `🔑 Keywords (${data.working_keywords.length + data.gap_keywords.length})` :
                 `🏆 Competitors (${data.competitor_patterns.length})`}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            {activeTab === 'opportunities' && (
              <div className="space-y-4">
                {data.opportunities.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/5 p-16 text-center">
                    <p className="text-slate-400 font-bold">No opportunities found for this brand yet.</p>
                  </div>
                ) : (
                  data.opportunities.map((opp, i) => <OpportunityCard key={i} opportunity={opp} index={i} />)
                )}
              </div>
            )}

            {activeTab === 'keywords' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div className="space-y-4">
                {data.competitor_patterns.map((comp) => (
                  <CompetitorCard key={comp.competitor_name} competitor={comp} />
                ))}
              </div>
            )}
          </div>

          {/* Next steps */}
          {data.next_steps?.length > 0 && (
            <div className="rounded-[2.5rem] border border-primary/20 bg-primary/5 p-8 md:p-10 space-y-6">
              <h3 className="text-lg font-black text-primary uppercase tracking-widest">Recommended Strategy</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.next_steps.map((step, i) => (
                  <div key={i} className="flex gap-4 bg-white/50 dark:bg-black/20 p-5 rounded-3xl border border-primary/10">
                    <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm">{i + 1}</span>
                    <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
