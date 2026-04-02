'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useKeywordDiscovery, useAnalyses, useFullAnalysis } from '@/hooks/useGeo';
import { useSSEProgress } from '@/hooks/useSSEProgress';
import { AnalysisProgressBar } from '@/components/geo/AnalysisProgressBar';
import { ApiErrorToast } from '@/components/geo/ApiErrorToast';
import type { DiscoveryMode, LLMProvider } from '@/lib/geo-types';
import {
  BrainCircuit, Zap, Cpu, Lightbulb, Rocket, Clock, Bolt, CheckCircle2, AlertCircle, Info, Globe, Search, Server
} from 'lucide-react';
import { Button } from "@/components/ui/button";

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

const LLM_OPTIONS: { id: LLMProvider; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'chatgpt', label: 'ChatGPT', icon: <BrainCircuit className="text-emerald-500" size={20} />, desc: 'OpenAI GPT-4o' },
  { id: 'claude', label: 'Claude', icon: <Zap className="text-amber-500" size={20} />, desc: 'Anthropic Claude' },
  { id: 'gemini', label: 'Gemini', icon: <Cpu className="text-blue-500" size={20} />, desc: 'Google Gemini' },
  { id: 'perplexity', label: 'Perplexity', icon: <Lightbulb className="text-purple-500" />, desc: 'Perplexity AI' },
  { id: 'grok', label: 'Grok', icon: <Rocket className="text-sky-400" size={20} />, desc: 'xAI Grok' },
  { id: 'digitalocean', label: 'DigitalOcean AI', icon: <Bolt className="text-blue-400" size={20} />, desc: 'DO GenAI (Free for testing)' },
  { id: 'nvidia', label: 'NVIDIA NIM', icon: <Server className="text-green-500" size={20} />, desc: 'NVIDIA NIM (Backup)' },
];

const MODES: { id: DiscoveryMode; label: string; desc: string; eta: string; icon: React.ReactNode }[] = [
  { id: 'quick', label: 'Quick', desc: 'Fast scan, 5 prompts', eta: '~15s', icon: <Zap size={16} /> },
  { id: 'standard', label: 'Standard', desc: 'Balanced, 10 prompts', eta: '~45s', icon: <Cpu size={16} /> },
  { id: 'deep', label: 'Deep', desc: 'Comprehensive, 25+ prompts', eta: '~90s', icon: <BrainCircuit size={16} /> },
];

type AnalysisMode = 'discovery' | 'full';

function getRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'Just now';
  if (min < 60) return `${min}m ago`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function AnalysisPage() {
  const router = useRouter();
  const { discover, loading: discoveryLoading, error: discoveryError } = useKeywordDiscovery();
  const { submit, fetchResult, analysisId: fullAnalysisId, loading: fullLoading, error: fullError, data: fullResult } = useFullAnalysis();
  const { data: recentAnalyses, fetchAnalyses } = useAnalyses();
  const [apiError, setApiError] = useState<unknown>(null);

  // Analysis mode toggle
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('discovery');

  // SSE progress — only connected during active analysis
  const [sseId, setSseId] = useState<string | null>(null);
  const { progress, stageLabel } = useSSEProgress(sseId);

  const loading = analysisMode === 'discovery' ? discoveryLoading : fullLoading;
  const error = analysisMode === 'discovery' ? discoveryError : fullError;

  // Fetch latest analysis on mount
  useEffect(() => { fetchAnalyses(undefined, undefined, 1); }, [fetchAnalyses]);

  // When SSE reports completion, fetch the full result
  useEffect(() => {
    if (progress?.status === 'completed' && fullAnalysisId) {
      fetchResult(fullAnalysisId).catch(() => {});
    }
  }, [progress?.status, fullAnalysisId, fetchResult]);

  // When full analysis result arrives, navigate to result page
  useEffect(() => {
    if (fullResult && fullAnalysisId) {
      router.push(`/dashboard/reports/${fullAnalysisId}`);
    }
  }, [fullResult, fullAnalysisId, router]);

  const lastAnalysisLabel = useMemo(() => {
    if (!recentAnalyses || recentAnalyses.length === 0) return 'No runs yet';
    return `Last: ${getRelativeTime(recentAnalyses[0].created_at)}`;
  }, [recentAnalyses]);

  // Form state
  const [brandName, setBrandName] = useState('');
  const [category, setCategory] = useState('');
  const [competitors, setCompetitors] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [url, setUrl] = useState('');
  const [mode, setMode] = useState<DiscoveryMode>('standard');
  const [selectedLLMs, setSelectedLLMs] = useState<LLMProvider[]>(['chatgpt', 'gemini', 'perplexity']);
  const [selectedModels, setSelectedModels] = useState<Record<string, string>>(() => {
    const defaults: Record<string, string> = {};
    ['chatgpt', 'gemini', 'perplexity'].forEach(p => { defaults[p] = getDefaultModel(p); });
    return defaults;
  });

  const toggleLLM = (id: LLMProvider) => {
    setSelectedLLMs(prev => {
      if (prev.includes(id)) {
        // Remove provider + its model selection
        setSelectedModels(m => { const next = { ...m }; delete next[id]; return next; });
        return prev.filter(l => l !== id);
      } else {
        // Add provider + auto-select default model
        setSelectedModels(m => ({ ...m, [id]: getDefaultModel(id) }));
        return [...prev, id];
      }
    });
  };

  const setModelForProvider = (providerId: string, modelId: string) => {
    setSelectedModels(prev => ({ ...prev, [providerId]: modelId }));
  };

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    const competitorsList = competitors.split(',').map(c => c.trim()).filter(Boolean);

    if (analysisMode === 'discovery') {
      // Quick Discovery — keyword-only, redirects to /keywords
      const tempId = `kd-${brandName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
      setSseId(tempId);
      try {
        const result = await discover({
          brand_name: brandName,
          category,
          competitors: competitorsList,
          target_audience: targetAudience || undefined,
          region: 'global',
          mode,
          llm_providers: selectedLLMs,
          runs_per_prompt: 1,
        });
        if (result?.analysis_id) setSseId(result.analysis_id);
        router.push('/dashboard/keywords');
      } catch (err) {
        setApiError(err);
      }
    } else {
      // Full Analysis — async pipeline with SSE progress tracking
      try {
        // Build models override dict (only include non-default selections)
        const modelsOverride: Record<string, string> = {};
        for (const provider of selectedLLMs) {
          const model = selectedModels[provider];
          if (model && model !== getDefaultModel(provider)) {
            modelsOverride[provider] = model;
          }
        }

        const result = await submit({
          brand_name: brandName,
          brand_aliases: [],
          category,
          competitors: competitorsList,
          target_audience: targetAudience || undefined,
          region: 'global',
          mode,
          url: url || undefined,
          llm_providers: selectedLLMs,
          runs_per_prompt: 1,
          ...(Object.keys(modelsOverride).length > 0 ? { models: modelsOverride } : {}),
        });
        // Connect SSE to real job_id from Python engine
        setSseId(result.analysis_id);
      } catch (err) {
        setApiError(err);
      }
    }
  };

  const estimatedTime = analysisMode === 'full' ? '~3-5 min' : (MODES.find(m => m.id === mode)?.eta ?? '~45s');
  const canSubmit = brandName.trim() && category.trim() && selectedLLMs.length > 0
    && (analysisMode === 'discovery' || url.trim());

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic">GEO Engine</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold tracking-tight">Configure your AI visibility analysis parameters.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/5 border border-primary/10">
          <Clock size={16} className="text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">{lastAnalysisLabel}</span>
        </div>
      </div>

      {loading ? (
        <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/5 p-12 shadow-2xl shadow-slate-200 dark:shadow-none min-h-[500px] flex flex-col items-center justify-center space-y-12">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full animate-pulse"></div>
            <div className="relative w-24 h-24 rounded-[2.5rem] bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 shadow-2xl">
              <BrainCircuit size={48} className="animate-spin-slow" />
            </div>
          </div>

          <div className="w-full max-w-2xl space-y-4">
            <AnalysisProgressBar
              status={progress?.status ?? 'processing'}
              currentStage={progress ? stageLabel : (analysisMode === 'full' ? 'Deploying 6-agent pipeline…' : 'Waking up analysis agents…')}
              progressPercent={progress?.progress_percent ?? 5}
              stageProgressPercent={progress?.stage_progress_percent ?? 20}
              estimatedSecondsRemaining={progress?.estimated_seconds_remaining}
            />
            <p className="text-center text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] animate-pulse">
              {analysisMode === 'full'
                ? 'System: Crawling, researching, testing LLMs, analyzing images, optimizing...'
                : 'System: Processing deep-reach optimization vectors...'}
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleStart} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">

            {/* Analysis Mode Toggle */}
            <section className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/5 p-8 md:p-10 shadow-sm space-y-6 animate-in slide-in-from-left-4 duration-500">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-2xl bg-violet-500 text-white flex items-center justify-center font-black italic shadow-lg shadow-violet-500/20">00</div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Analysis Type</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button type="button" onClick={() => setAnalysisMode('discovery')}
                  className={`group p-6 rounded-[2rem] text-left border transition-all relative overflow-hidden ${
                    analysisMode === 'discovery'
                    ? 'bg-primary border-primary/30 shadow-xl shadow-primary/20'
                    : 'bg-slate-50 dark:bg-black/20 border-slate-100 dark:border-white/10 hover:border-primary/30'
                  }`}>
                  <div className={`mb-4 w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                    analysisMode === 'discovery' ? 'bg-white text-primary shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-400'
                  }`}>
                    <Search size={18} />
                  </div>
                  <h4 className={`text-lg font-black tracking-tight mb-1 ${analysisMode === 'discovery' ? 'text-white' : 'text-slate-900 dark:text-white'}`}>Quick Discovery</h4>
                  <p className={`text-[10px] font-bold leading-relaxed pr-4 ${analysisMode === 'discovery' ? 'text-white/60' : 'text-slate-500 dark:text-slate-400'}`}>
                    Test how AI models mention your brand. Keyword-focused, fast results (15-90s).
                  </p>
                  {analysisMode === 'discovery' && <div className="absolute top-4 right-4"><CheckCircle2 size={16} className="text-white" /></div>}
                </button>

                <button type="button" onClick={() => setAnalysisMode('full')}
                  className={`group p-6 rounded-[2rem] text-left border transition-all relative overflow-hidden ${
                    analysisMode === 'full'
                    ? 'bg-violet-500 border-violet-600 shadow-xl shadow-violet-500/20'
                    : 'bg-slate-50 dark:bg-black/20 border-slate-100 dark:border-white/10 hover:border-violet-500/30'
                  }`}>
                  <div className={`mb-4 w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                    analysisMode === 'full' ? 'bg-white text-violet-500 shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-400'
                  }`}>
                    <Globe size={18} />
                  </div>
                  <h4 className={`text-lg font-black tracking-tight mb-1 ${analysisMode === 'full' ? 'text-white' : 'text-slate-900 dark:text-white'}`}>Full GEO Analysis</h4>
                  <p className={`text-[10px] font-bold leading-relaxed pr-4 ${analysisMode === 'full' ? 'text-white/60' : 'text-slate-500 dark:text-slate-400'}`}>
                    Complete 6-agent pipeline: crawl, research, test LLMs, image audit, score, verify (3-5 min).
                  </p>
                  {analysisMode === 'full' && <div className="absolute top-4 right-4"><CheckCircle2 size={16} className="text-white" /></div>}
                </button>
              </div>
            </section>

            {/* Step 1: Identity */}
            <section className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/5 p-8 md:p-10 shadow-sm space-y-8 animate-in slide-in-from-left-4 duration-500">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-2xl bg-primary text-white flex items-center justify-center font-black italic shadow-lg shadow-primary/20">01</div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Brand Intelligence</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Brand Name *</label>
                  <input
                    value={brandName} onChange={e => setBrandName(e.target.value)}
                    placeholder="e.g. Notion" required
                     className="w-full h-14 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/10 rounded-2xl px-6 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Product Category *</label>
                  <input
                    value={category} onChange={e => setCategory(e.target.value)}
                    placeholder="e.g. AI Content Platform" required
                     className="w-full h-14 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/10 rounded-2xl px-6 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Top Competitors</label>
                  <input
                    value={competitors} onChange={e => setCompetitors(e.target.value)}
                    placeholder="e.g. Asana, Trello, Monday"
                     className="w-full h-14 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/10 rounded-2xl px-6 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Target Audience</label>
                  <input
                    value={targetAudience} onChange={e => setTargetAudience(e.target.value)}
                    placeholder="e.g. SMB Owners, CEOs"
                     className="w-full h-14 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/10 rounded-2xl px-6 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400" />
                </div>
              </div>

              {/* URL field — required for Full Analysis mode */}
              {analysisMode === 'full' && (
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Website URL * <span className="text-red-400">(Required for full crawl)</span></label>
                  <input
                    value={url} onChange={e => setUrl(e.target.value)}
                    placeholder="e.g. https://notion.so"
                    type="url"
                    required
                    className="w-full h-14 bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/10 rounded-2xl px-6 font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all placeholder:text-slate-400" />
                  {!url.trim() && (
                    <p className="text-[10px] font-bold text-amber-400 px-1">The 6-agent pipeline requires a URL to crawl and analyze.</p>
                  )}
                </div>
              )}
            </section>

            {/* Step 2: Protocol — only for Discovery mode */}
            {analysisMode === 'discovery' && (
              <section className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/5 p-8 md:p-10 shadow-sm space-y-8 animate-in slide-in-from-left-4 duration-500 delay-100">
                 <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black italic shadow-lg shadow-amber-500/20">02</div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">Discovery Protocol</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {MODES.map(m => (
                    <button type="button" key={m.id} onClick={() => setMode(m.id)}
                      className={`group p-6 rounded-[2rem] text-left border transition-all relative overflow-hidden ${
                        mode === m.id
                        ? 'bg-amber-500 border-amber-600 shadow-xl shadow-amber-500/20'
                        : 'bg-slate-50 dark:bg-black/20 border-slate-100 dark:border-white/10 hover:border-amber-500/30'
                      }`}>
                      <div className={`mb-4 w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                        mode === m.id ? 'bg-white text-amber-500 shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-400 group-hover:text-amber-500'
                      }`}>
                        {m.icon}
                      </div>
                      <p className={`font-black uppercase tracking-widest text-[10px] mb-1 ${mode === m.id ? 'text-white/80' : 'text-slate-400'}`}>Protocol</p>
                      <h4 className={`text-lg font-black tracking-tight mb-1 ${mode === m.id ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{m.label}</h4>
                      <p className={`text-[10px] font-bold leading-relaxed pr-4 ${mode === m.id ? 'text-white/60' : 'text-slate-500 dark:text-slate-400'}`}>{m.desc}</p>

                      {mode === m.id && (
                        <div className="absolute top-4 right-4">
                          <CheckCircle2 size={16} className="text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Step 3: LLM Synthesis */}
            <section className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/5 p-8 md:p-10 shadow-sm space-y-8 animate-in slide-in-from-left-4 duration-500 delay-200">
               <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black italic shadow-lg shadow-emerald-500/20">{analysisMode === 'discovery' ? '03' : '02'}</div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">LLM Synthesis</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {LLM_OPTIONS.map(llm => {
                  const selected = selectedLLMs.includes(llm.id);
                  const models = PROVIDER_MODELS[llm.id] || [];
                  const currentModel = selectedModels[llm.id] || getDefaultModel(llm.id);
                  return (
                    <div key={llm.id} className={`rounded-[2rem] border transition-all ${
                      selected
                      ? 'bg-emerald-500/5 border-emerald-500-20 shadow-lg shadow-emerald-500/5'
                      : 'bg-slate-50 dark:bg-black/20 border-slate-100 dark:border-white/10 hover:border-emerald-500/30'
                    }`}>
                      <button type="button" onClick={() => toggleLLM(llm.id)}
                        className="w-full flex items-center gap-5 p-5 group">
                        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${
                          selected ? 'bg-white dark:bg-slate-800 shadow-md scale-110' : 'bg-white/50 dark:bg-white/5 grayscale opacity-50'
                        }`}>
                          {llm.icon}
                        </div>
                        <div className="text-left">
                          <p className={`font-black uppercase tracking-widest text-[10px] mb-1 ${selected ? 'text-emerald-500' : 'text-slate-400'}`}>Model</p>
                          <h4 className={`text-base font-black tracking-tight ${selected ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>{llm.label}</h4>
                          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{llm.desc}</p>
                        </div>
                        <div className={`ml-auto w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                          selected ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 dark:border-white/10'
                        }`}>
                          {selected && <CheckCircle2 size={12} />}
                        </div>
                      </button>
                      {/* Model selector — shown when provider is selected */}
                      {selected && models.length > 1 && (
                        <div className="px-5 pb-4 pt-0">
                          <select
                            aria-label="Select AI model"
                            value={currentModel}
                            onChange={e => setModelForProvider(llm.id, e.target.value)}
                            className="w-full text-xs font-bold bg-white/10 dark:bg-black/30 border border-emerald-500/20 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 cursor-pointer"
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
            </section>

            {error && (
              <div className="rounded-[2rem] bg-red-500/5 border border-red-500/20 p-6 flex items-center gap-4 text-red-500 animate-bounce">
                <AlertCircle size={24} />
                <div>
                   <p className="font-black uppercase tracking-widest text-[10px]">Engine Failure</p>
                   <p className="text-sm font-bold">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sticky summary sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-10 space-y-6">
              <div className="bg-slate-900 dark:bg-white rounded-[2.5rem] p-8 md:p-10 text-white dark:text-slate-900 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full -mr-20 -mt-20 blur-3xl"></div>

                <h3 className="text-2xl font-black tracking-tighter uppercase italic mb-10 relative z-10">Verification</h3>

                <div className="space-y-8 relative z-10">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Analysis Type</p>
                    <p className="text-sm font-black uppercase tracking-widest italic">
                      {analysisMode === 'full' ? 'Full GEO Pipeline' : `${mode} Discovery`}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Resource Allocation</p>
                    <div className="flex flex-wrap gap-2">
                       {selectedLLMs.map(llm => {
                          const modelId = selectedModels[llm];
                          const modelLabel = PROVIDER_MODELS[llm]?.find(m => m.id === modelId)?.label;
                          return (
                            <div key={llm} className="px-3 py-1.5 rounded-xl bg-white/10 dark:bg-slate-100 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                               <div className="h-1 w-1 rounded-full bg-primary animate-pulse"></div>
                               {llm}{modelLabel && !modelLabel.includes('default') ? ` · ${modelLabel}` : ''}
                            </div>
                          );
                       })}
                    </div>
                  </div>

                  {analysisMode === 'full' && (
                    <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Pipeline Agents</p>
                      <div className="flex flex-wrap gap-1.5">
                        {['Crawler', 'Researcher', 'LLM Tester', 'Image AI', 'Optimizer', 'Verifier'].map(agent => (
                          <span key={agent} className="px-2 py-1 rounded-lg bg-violet-500/10 dark:bg-violet-50 text-[8px] font-black uppercase tracking-widest text-violet-400 dark:text-violet-600">
                            {agent}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 space-y-6 border-t border-white/10 dark:border-slate-100">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Time to Result</p>
                        <p className="text-2xl font-black text-primary italic">{estimatedTime}</p>
                      </div>
                      <Bolt className="text-primary animate-pulse" size={24} />
                    </div>

                    <Button type="submit" disabled={!canSubmit}
                      className={`w-full h-16 rounded-2xl disabled:opacity-20 disabled:grayscale text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl active:scale-95 transition-all ${
                        analysisMode === 'full'
                          ? 'bg-violet-500 hover:bg-violet-600 shadow-violet-500/30'
                          : 'bg-primary hover:bg-blue-600 shadow-primary/30'
                      }`}>
                      {analysisMode === 'full' ? 'Deploy Full Pipeline' : 'Deploy Engine'}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 dark:bg-primary/10 border border-primary/10 dark:border-primary/20 rounded-[2rem] p-6 flex gap-4">
                <Info size={18} className="text-primary flex-shrink-0" />
                <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 leading-relaxed uppercase tracking-wide">
                  {analysisMode === 'full'
                    ? 'Full pipeline crawls your website, researches competitors, tests all selected AI models, audits images, and generates a comprehensive GEO score with actionable recommendations.'
                    : 'Analysis utilizes neural ranking vectors to determine your brand\'s presence across major AI search indexes.'}
                </p>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Error toast for 413/422/429 per §8 */}
      <ApiErrorToast error={apiError} onDismiss={() => setApiError(null)} />
    </div>
  );
}
