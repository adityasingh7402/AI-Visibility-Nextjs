'use client';

import { useState } from 'react';
import { useKeywordDiscovery } from '@/hooks/useGeo';
import { useSSEProgress } from '@/hooks/useSSEProgress';
import { geoApi } from '@/lib/geo-api';
import { ScoreCard } from '@/components/geo/ScoreCard';
import { KeywordList } from '@/components/geo/KeywordList';
import { CompetitorCard } from '@/components/geo/CompetitorCard';
import { OpportunityCard } from '@/components/geo/OpportunityCard';
import { AnalysisProgressBar } from '@/components/geo/AnalysisProgressBar';
import { ApiErrorToast } from '@/components/geo/ApiErrorToast';
import { LLMBreakdownTable } from '@/components/geo/LLMBreakdownTable';
import { ContentGapCard } from '@/components/geo/ContentGapCard';
import { PromptResultsTable } from '@/components/geo/PromptResultsTable';
import { Button } from '@/components/ui/button';
import type { DiscoveryMode, LLMProvider, KeywordValidateResponse } from '@/lib/geo-types';
import { resolveVisibilitySummary } from '@/lib/geo-types';

// All 7 LLM providers per BACKEND_HANDOFF_v2.0 §9
const LLM_OPTIONS: { id: LLMProvider; label: string; icon: string }[] = [
  { id: 'chatgpt',      label: 'ChatGPT',         icon: '🤖' },
  { id: 'gemini',       label: 'Gemini',           icon: '✨' },
  { id: 'perplexity',   label: 'Perplexity',       icon: '🔍' },
  { id: 'claude',       label: 'Claude',           icon: '🧠' },
  { id: 'grok',         label: 'Grok',             icon: '⚡' },
  { id: 'digitalocean', label: 'DigitalOcean AI',  icon: '🌊' },
  { id: 'nvidia',       label: 'NVIDIA NIM',       icon: '🟢' },
];

// Provider → model registry (mirrors providers_registry.yaml)
const PROVIDER_MODELS: Record<string, { id: string; label: string; default?: boolean }[]> = {
  digitalocean: [
    { id: 'llama3.3-70b-instruct', label: 'Llama 3.3 70B (default)', default: true },
    { id: 'nvidia-nemotron-3-super-120b', label: 'Nemotron 3 Super 120B' },
    { id: 'alibaba-qwen3-32b', label: 'Qwen3 32B' },
    { id: 'kimi-k2.5', label: 'Kimi K2.5' },
    { id: 'glm-5', label: 'GLM-5' },
    { id: 'minimax-m2.5', label: 'MiniMax M2.5' },
    { id: 'mistral-nemo-instruct-2407', label: 'Mistral Nemo' },
    { id: 'openai-gpt-oss-20b', label: 'GPT-OSS 20B' },
  ],
  chatgpt: [
    { id: 'gpt-5.4-mini', label: 'GPT-5.4 Mini (default)', default: true },
    { id: 'gpt-5.4-nano', label: 'GPT-5.4 Nano' },
    { id: 'gpt-5.4', label: 'GPT-5.4' },
    { id: 'gpt-4o', label: 'GPT-4o' },
  ],
  gemini: [
    { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash (default)', default: true },
    { id: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash Lite' },
    { id: 'gemini-3-flash-preview', label: 'Gemini 3 Flash Preview' },
    { id: 'gemini-3.1-flash-lite-preview', label: 'Gemini 3.1 Flash Lite' },
  ],
  perplexity: [
    { id: 'sonar-pro', label: 'Sonar Pro (default)', default: true },
    { id: 'sonar', label: 'Sonar' },
    { id: 'sonar-reasoning-pro', label: 'Sonar Reasoning Pro' },
  ],
  claude: [
    { id: 'claude-sonnet-4-6', label: 'Sonnet 4.6 (default)', default: true },
    { id: 'claude-haiku-4-5', label: 'Haiku 4.5' },
  ],
  grok: [
    { id: 'grok-4-1-fast', label: 'Grok 4.1 Fast (default)', default: true },
    { id: 'grok-4', label: 'Grok 4' },
    { id: 'grok-4.20', label: 'Grok 4.20' },
  ],
  nvidia: [
    { id: 'meta/llama-3.3-70b-instruct', label: 'Llama 3.3 70B (default)', default: true },
    { id: 'mistralai/mixtral-8x22b-instruct-v0.1', label: 'Mixtral 8x22B' },
    { id: 'nvidia/llama-3.3-nemotron-super-49b-v1', label: 'Nemotron Super 49B' },
    { id: 'meta/llama-3.1-70b-instruct', label: 'Llama 3.1 70B' },
  ],
};

function getDefaultModel(providerId: string): string {
  const models = PROVIDER_MODELS[providerId];
  return models?.find(m => m.default)?.id ?? models?.[0]?.id ?? '';
}

type ResultTab = 'opportunities' | 'keywords' | 'competitors' | 'llm_breakdown' | 'content_gaps' | 'prompt_results';

export default function KeywordsPage() {
  const { data, loading, error, discover, reset } = useKeywordDiscovery();
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const { progress, stageLabel } = useSSEProgress(loading ? analysisId : null);

  // API error toast state per §8
  const [apiError, setApiError] = useState<unknown>(null);

  const [brandName, setBrandName] = useState('');
  const [category, setCategory] = useState('');
  const [competitors, setCompetitors] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [mode, setMode] = useState<DiscoveryMode>('standard');
  const [selectedLLMs, setSelectedLLMs] = useState<LLMProvider[]>(['chatgpt', 'gemini', 'perplexity']);
  const [selectedModels, setSelectedModels] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    ['chatgpt', 'gemini', 'perplexity'].forEach(p => { defaults[p] = getDefaultModel(p); });
    return defaults;
  });
  const [activeTab, setActiveTab] = useState<ResultTab>('opportunities');

  // Quick-validate state
  const [qvPrompt, setQvPrompt] = useState('');
  const [qvBrand, setQvBrand] = useState('');
  const [qvLoading, setQvLoading] = useState(false);
  const [qvResult, setQvResult] = useState<KeywordValidateResponse | null>(null);
  const [qvError, setQvError] = useState<string | null>(null);

  const handleQuickValidate = async () => {
    if (!qvPrompt || !qvBrand) return;
    setQvLoading(true);
    setQvError(null);
    try {
      const result = await geoApi.validateKeyword({
        prompt: qvPrompt,
        brand_name: qvBrand,
        llm_providers: selectedLLMs.length > 0 ? selectedLLMs.slice(0, 3) : ['chatgpt', 'gemini', 'perplexity'],
      });
      setQvResult(result);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { error?: string } }; message?: string };
      setQvError(err.response?.data?.error || err.message || 'Quick validate failed');
    } finally {
      setQvLoading(false);
    }
  };

  const toggleLLM = (llm: LLMProvider) => {
    setSelectedLLMs(prev => {
      if (prev.includes(llm)) {
        setSelectedModels(m => { const next = { ...m }; delete next[llm]; return next; });
        return prev.filter(l => l !== llm);
      } else {
        setSelectedModels(m => ({ ...m, [llm]: getDefaultModel(llm) }));
        return [...prev, llm];
      }
    });
  };

  const setModelForProvider = (providerId: string, modelId: string) => {
    setSelectedModels(prev => ({ ...prev, [providerId]: modelId }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null); // clear previous errors
    const tempId = `kd-${brandName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    setAnalysisId(tempId);
    try {
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
      if (result?.analysis_id) setAnalysisId(result.analysis_id);
    } catch (err) {
      setApiError(err);
    }
  };

  // Resolve visibility summary (handles both 'your_visibility_summary' and 'visibility_summary')
  const visSummary = data ? resolveVisibilitySummary(data) : null;

  // Build tabs dynamically based on what data is available
  const RESULT_TABS: { id: ResultTab; label: string; count?: number; available: boolean }[] = [
    {
      id: 'opportunities',
      label: `🎯 Opportunities`,
      count: data?.opportunities.length,
      available: true,
    },
    {
      id: 'keywords',
      label: `🔑 Keywords`,
      count: data ? (data.working_keywords.length + data.gap_keywords.length) : 0,
      available: true,
    },
    {
      id: 'competitors',
      label: `🏆 Competitors`,
      count: data?.competitor_patterns.length,
      available: true,
    },
    {
      id: 'llm_breakdown',
      label: `📊 LLM Breakdown`,
      available: !!data?.visibility_by_llm && Object.keys(data.visibility_by_llm).length > 0,
    },
    {
      id: 'content_gaps',
      label: `📝 Content Gaps`,
      available: !!data?.content_gap_analysis,
    },
    {
      id: 'prompt_results',
      label: `📋 Prompt Results`,
      count: data?.prompt_results?.length,
      available: !!(data?.prompt_results && data.prompt_results.length > 0),
    },
  ];

  return (
    <div className="space-y-10">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">Keyword Discovery</h1>
          <p className="text-muted-foreground font-medium tracking-tight">Identify the keywords AI models use to mention your brand and competitors.</p>
        </div>
      </div>

      {/* Form */}
      {!data && (
        <form onSubmit={handleSubmit} className="rounded-[2.5rem] border border-border bg-card p-8 md:p-10 shadow-sm space-y-8">
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
                  {m === 'quick' ? '⚡ Quick (~15s)' : m === 'standard' ? '⚙️ Standard (~45s)' : '🔬 Deep (~90s)'}
                </button>
              ))}
            </div>
          </div>

          {/* LLM providers — all 6 per handoff spec */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">AI Models to Test *</label>
            <div className="flex gap-3 flex-wrap">
              {LLM_OPTIONS.map(opt => {
                const isSelected = selectedLLMs.includes(opt.id);
                const models = PROVIDER_MODELS[opt.id] || [];
                const currentModel = selectedModels[opt.id] || getDefaultModel(opt.id);
                return (
                  <div key={opt.id} className={`rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-primary/10 border-primary shadow-sm'
                      : 'bg-slate-50 dark:bg-black/20 border-slate-100 dark:border-white/10 hover:border-slate-200 dark:hover:border-white/20'
                  }`}>
                    <button type="button" onClick={() => toggleLLM(opt.id)}
                      className={`flex items-center gap-2 px-5 py-3 text-xs font-black ${
                        isSelected ? 'text-primary' : 'text-slate-500 dark:text-slate-400'
                      }`}>
                      <span>{opt.icon}</span>
                      {opt.label}
                    </button>
                    {isSelected && models.length > 1 && (
                      <div className="px-3 pb-2">
                        <select
                          aria-label="Select AI model"
                          value={currentModel}
                          onChange={e => setModelForProvider(opt.id, e.target.value)}
                          className="w-full text-[10px] font-bold bg-white/10 dark:bg-black/30 border border-primary/20 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                        >
                          {models.map(m => (
                            <option key={m.id} value={m.id}>{m.label}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {selectedLLMs.length === 0 && (
              <p className="text-xs text-red-400 font-bold px-1">⚠️ Select at least one AI model</p>
            )}
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
        <div className="bg-card rounded-[2.5rem] border border-border p-12 shadow-sm">
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
      {data && !loading && visSummary && (
        <div className="space-y-8 animate-in fade-in duration-700">
          {/* Reset header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900/50 p-6 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-sm">
            <div>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">Results for</p>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">&ldquo;{data.brand_name}&rdquo;</h2>
              <p className="text-xs text-slate-400 mt-1">
                {visSummary.total_prompts_tested} prompts · {data.analysis_id}
              </p>
            </div>
            <Button onClick={reset} variant="outline" className="rounded-xl font-bold border-slate-200 dark:border-white/10 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 h-11 px-6">
              ← New Discovery
            </Button>
          </div>

          {/* Engine errors — critical */}
          {data.errors && data.errors.length > 0 && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5 space-y-2">
              <p className="text-xs font-black text-red-400 uppercase tracking-widest">⚠️ Engine Errors</p>
              {data.errors.map((err, i) => (
                <p key={i} className="text-sm text-red-300 font-medium">{err}</p>
              ))}
            </div>
          )}

          {/* Engine warnings */}
          {data.warnings && data.warnings.length > 0 && (
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-2">
              <p className="text-xs font-black text-amber-400 uppercase tracking-widest">⚡ Warnings</p>
              {data.warnings.map((w, i) => (
                <p key={i} className="text-sm text-amber-300 font-medium">{w}</p>
              ))}
            </div>
          )}

          {/* Score cards — with confidence intervals */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <ScoreCard
              label="RAG Visibility"
              score={visSummary.rag_model_visibility}
              description={`${(visSummary.mention_rate * 100).toFixed(0)}% mention rate`}
              confidenceLower={visSummary.confidence_lower}
              confidenceUpper={visSummary.confidence_upper}
              confidenceLevel={visSummary.confidence_level}
            />
            <ScoreCard
              label="Base Model"
              score={visSummary.base_model_visibility}
            />
            <ScoreCard
              label="Opportunity Gap"
              score={visSummary.actionable_gap}
              description="Potential gains"
            />
            <ScoreCard
              label="Avg Position"
              score={Math.max(0, 100 - (visSummary.avg_position ?? visSummary.average_position ?? 0) * 10)}
              description={`#${(visSummary.avg_position ?? visSummary.average_position ?? 0).toFixed(1)} avg match`}
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-2 flex-wrap bg-slate-100 dark:bg-black/40 p-1.5 rounded-2xl border border-slate-200/50 dark:border-white/5">
            {RESULT_TABS.filter(t => t.available).map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-slate-800 text-primary shadow-sm border border-slate-200 dark:border-white/10'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}>
                {tab.label}{tab.count !== undefined ? ` (${tab.count})` : ''}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="animate-in slide-in-from-bottom-4 duration-500">

            {/* Opportunities */}
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

            {/* Keywords */}
            {activeTab === 'keywords' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <KeywordList keywords={data.working_keywords} type="working" />
                <KeywordList keywords={data.gap_keywords} type="gap" />
                {(data.your_winning_keywords?.length ?? 0) > 0 && (
                  <div className="md:col-span-2">
                    <KeywordList keywords={data.your_winning_keywords} type="winning" />
                  </div>
                )}
              </div>
            )}

            {/* Competitors */}
            {activeTab === 'competitors' && (
              <div className="space-y-4">
                {data.competitor_patterns.length === 0 ? (
                  <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/5 p-16 text-center">
                    <p className="text-slate-400 font-bold">No competitor patterns found.</p>
                  </div>
                ) : (
                  data.competitor_patterns.map((comp, i) => <CompetitorCard key={comp.competitor || comp.competitor_name || i} competitor={comp} />)
                )}
              </div>
            )}

            {/* LLM Breakdown */}
            {activeTab === 'llm_breakdown' && data.visibility_by_llm && (
              <LLMBreakdownTable
                visibilityByLLM={data.visibility_by_llm}
                confidenceByLLM={data.confidence_by_llm}
              />
            )}

            {/* Content Gaps */}
            {activeTab === 'content_gaps' && data.content_gap_analysis && (
              <ContentGapCard gapAnalysis={data.content_gap_analysis} />
            )}

            {/* Prompt Results */}
            {activeTab === 'prompt_results' && (
              <PromptResultsTable promptResults={data.prompt_results ?? []} />
            )}
          </div>

          {/* Next steps */}
          {((data.recommended_next_steps || data.next_steps)?.length ?? 0) > 0 && (
            <div className="rounded-[2.5rem] border border-primary/20 bg-primary/5 p-8 md:p-10 space-y-6">
              <h3 className="text-lg font-black text-primary uppercase tracking-widest">Recommended Strategy</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(data.recommended_next_steps || data.next_steps || []).map((step, i) => (
                  <div key={i} className="flex gap-4 bg-white/50 dark:bg-black/20 p-5 rounded-3xl border border-primary/10">
                    <span className="shrink-0 w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm">{i + 1}</span>
                    <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ──── Quick Prompt Validate ──── */}
      <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/50 p-8 md:p-10 shadow-sm space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-lg">⚡</div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Quick Prompt Check</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Test a single prompt to see if your brand gets mentioned by AI models.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-3 space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Brand Name</label>
            <input
              value={qvBrand}
              onChange={e => setQvBrand(e.target.value)}
              placeholder="e.g. Notion"
              className="w-full rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/10 px-5 py-3.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium"
            />
          </div>
          <div className="md:col-span-6 space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Test Prompt</label>
            <input
              value={qvPrompt}
              onChange={e => setQvPrompt(e.target.value)}
              placeholder="e.g. What is the best project management tool for startups?"
              className="w-full rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/10 px-5 py-3.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium"
            />
          </div>
          <div className="md:col-span-3">
            <Button
              onClick={handleQuickValidate}
              disabled={qvLoading || !qvPrompt || !qvBrand}
              className="w-full py-[14px] rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-sm shadow-lg shadow-purple-600/20 transition-all active:scale-[0.98]"
            >
              {qvLoading ? 'Checking…' : 'Check Now'}
            </Button>
          </div>
        </div>

        {qvError && (
          <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-600 dark:text-red-400 font-semibold">{qvError}</div>
        )}

        {qvResult && (
          <div className="rounded-[2rem] border border-purple-500/20 bg-purple-500/5 p-6 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black text-purple-500 uppercase tracking-[0.2em] mb-1">Result</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 italic">&ldquo;{qvResult.prompt}&rdquo;</p>
              </div>
              <div className="text-right">
                <p className={`text-3xl font-black tracking-tighter ${qvResult.results.brand_mentioned ? 'text-emerald-500' : 'text-red-500'}`}>
                  {qvResult.results.brand_mentioned ? '✓ Mentioned' : '✗ Not found'}
                </p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {(qvResult.results.mention_rate * 100).toFixed(0)}% mention rate · Pos #{qvResult.results.average_position.toFixed(1)}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {qvResult.results.providers_mentioning.map(p => (
                <span key={p} className="text-[10px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-xl border border-emerald-500/20 uppercase tracking-widest">✓ {p}</span>
              ))}
              {qvResult.results.providers_not_mentioning.map(p => (
                <span key={p} className="text-[10px] font-black bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-xl border border-red-500/20 uppercase tracking-widest">✗ {p}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Error toast for 413/422/429 per §8 */}
      <ApiErrorToast error={apiError} onDismiss={() => setApiError(null)} />
    </div>
  );
}
