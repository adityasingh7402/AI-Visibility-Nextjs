'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useKeywordDiscovery } from '@/hooks/useGeo';
import { useSSEProgress } from '@/hooks/useSSEProgress';
import { AnalysisProgressBar } from '@/components/geo/AnalysisProgressBar';
import type { DiscoveryMode, LLMProvider } from '@/lib/geo-types';
import {
  BrainCircuit, Zap, Cpu, Lightbulb, Rocket, Clock, Bolt,
} from 'lucide-react';

const LLM_OPTIONS: { id: LLMProvider; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'chatgpt', label: 'ChatGPT', icon: <BrainCircuit className="text-emerald-400" size={20} />, desc: 'OpenAI GPT-4o' },
  { id: 'claude', label: 'Claude', icon: <Zap className="text-amber-400" size={20} />, desc: 'Anthropic Claude' },
  { id: 'gemini', label: 'Gemini', icon: <Cpu className="text-blue-400" size={20} />, desc: 'Google Gemini' },
  { id: 'perplexity', label: 'Perplexity', icon: <Lightbulb className="text-purple-400" />, desc: 'Perplexity AI' },
];

const MODES: { id: DiscoveryMode; label: string; desc: string; eta: string }[] = [
  { id: 'quick', label: '⚡ Quick', desc: 'Fast scan, 5 prompts', eta: '~15s' },
  { id: 'standard', label: '⚙️ Standard', desc: 'Balanced results, 10 prompts', eta: '~45s' },
  { id: 'deep', label: '🔬 Deep', desc: 'Comprehensive, 25+ prompts', eta: '~90s' },
];

export default function AnalysisPage() {
  const router = useRouter();
  const { discover, loading, error } = useKeywordDiscovery();
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const { progress, stageLabel } = useSSEProgress(loading ? analysisId : null);

  // Form state
  const [brandName, setBrandName] = useState('');
  const [category, setCategory] = useState('');
  const [competitors, setCompetitors] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [mode, setMode] = useState<DiscoveryMode>('standard');
  const [selectedLLMs, setSelectedLLMs] = useState<LLMProvider[]>(['chatgpt', 'gemini', 'perplexity']);

  const toggleLLM = (id: LLMProvider) => {
    setSelectedLLMs(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);
  };

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName || !category || selectedLLMs.length === 0) return;

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

    if (result?.analysis_id) setAnalysisId(result.analysis_id);

    // After completion, redirect to keywords page
    router.push('/dashboard/keywords');
  };

  const estimatedTime = MODES.find(m => m.id === mode)?.eta ?? '~45s';
  const canSubmit = brandName.trim() && category.trim() && selectedLLMs.length > 0;

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight mb-1">Run Keyword Analysis</h1>
        <p className="text-slate-400">Discover how AI models see your brand and competitors across target keywords.</p>
      </div>

      {/* If loading, show SSE progress full-screen */}
      {loading && (
        <div className="space-y-4 py-6">
          <AnalysisProgressBar
            status={progress?.status ?? 'processing'}
            currentStage={progress ? stageLabel : 'Connecting to analysis agents…'}
            progressPercent={progress?.progress_percent ?? 5}
            stageProgressPercent={progress?.stage_progress_percent ?? 20}
            estimatedSecondsRemaining={progress?.estimated_seconds_remaining}
          />
          <p className="text-center text-xs text-slate-500">
            You'll be redirected to results when analysis completes.
          </p>
        </div>
      )}

      {!loading && (
        <form onSubmit={handleStart} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">

            {/* Brand & Category */}
            <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                <span className="h-7 w-7 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 text-sm">1</span>
                Brand Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Brand Name *</label>
                  <input
                    value={brandName} onChange={e => setBrandName(e.target.value)}
                    placeholder="e.g. Notion" required
                    className="w-full rounded-xl bg-black/20 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Category *</label>
                  <input
                    value={category} onChange={e => setCategory(e.target.value)}
                    placeholder="e.g. project management software" required
                    className="w-full rounded-xl bg-black/20 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Competitors</label>
                  <input
                    value={competitors} onChange={e => setCompetitors(e.target.value)}
                    placeholder="e.g. Asana, Trello, Monday.com"
                    className="w-full rounded-xl bg-black/20 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Target Audience</label>
                  <input
                    value={targetAudience} onChange={e => setTargetAudience(e.target.value)}
                    placeholder="e.g. startup teams, freelancers"
                    className="w-full rounded-xl bg-black/20 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
              </div>
            </section>

            {/* Discovery Mode */}
            <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                <span className="h-7 w-7 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 text-sm">2</span>
                Discovery Mode
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {MODES.map(m => (
                  <button type="button" key={m.id} onClick={() => setMode(m.id)}
                    className={`p-4 rounded-xl text-left border transition-all ${mode === m.id ? 'bg-blue-500/20 border-blue-500/40' : 'bg-black/20 border-white/10 hover:border-white/20'}`}>
                    <p className={`font-bold text-sm mb-1 ${mode === m.id ? 'text-white' : 'text-slate-400'}`}>{m.label}</p>
                    <p className="text-[10px] text-slate-500">{m.desc}</p>
                    <p className={`text-[10px] font-bold mt-1 ${mode === m.id ? 'text-blue-400' : 'text-slate-600'}`}>{m.eta}</p>
                  </button>
                ))}
              </div>
            </section>

            {/* AI Models */}
            <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                <span className="h-7 w-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm">3</span>
                AI Models to Test *
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {LLM_OPTIONS.map(llm => {
                  const selected = selectedLLMs.includes(llm.id);
                  return (
                    <button type="button" key={llm.id} onClick={() => toggleLLM(llm.id)}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${selected ? 'bg-blue-500/15 border-blue-500/40' : 'bg-black/20 border-white/10 hover:border-white/20'}`}>
                      <div className="h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                        {llm.icon}
                      </div>
                      <div className="text-left">
                        <p className={`font-bold text-sm ${selected ? 'text-white' : 'text-slate-400'}`}>{llm.label}</p>
                        <p className="text-[10px] text-slate-600">{llm.desc}</p>
                      </div>
                      {selected && <span className="ml-auto text-blue-400 text-xs font-bold">✓</span>}
                    </button>
                  );
                })}
              </div>
            </section>

            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">{error}</div>
            )}
          </div>

          {/* Sticky sidebar summary */}
          <div>
            <div className="sticky top-8 space-y-4">
              <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                <h3 className="text-xl font-black text-white mb-6">Summary</h3>
                <div className="space-y-4 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Brand</span>
                    <span className="font-bold text-white truncate max-w-32">{brandName || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mode</span>
                    <span className="font-bold text-white capitalize">{mode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">AI Models</span>
                    <span className="font-bold text-white">{selectedLLMs.length} selected</span>
                  </div>
                  <div className="h-px bg-white/5" />
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estimated time</span>
                    <span className="font-black text-blue-400">{estimatedTime}</span>
                  </div>
                </div>

                <button type="submit" disabled={!canSubmit}
                  className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black flex items-center justify-center gap-2 transition-all">
                  <Rocket className="h-4 w-4" />
                  Start Analysis
                </button>

                <div className="mt-4 flex items-center gap-2 text-emerald-400">
                  <Clock size={14} />
                  <span className="text-xs font-bold uppercase tracking-widest">{estimatedTime} ETA</span>
                </div>
              </div>

              <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4">
                <p className="text-xs text-blue-400/80 font-medium leading-relaxed">
                  💡 Results will show which AI models mention your brand, which competitor keywords are gaps, and what content actions to take.
                </p>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
