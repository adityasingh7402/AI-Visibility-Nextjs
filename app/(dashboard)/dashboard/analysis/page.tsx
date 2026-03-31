'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useKeywordDiscovery, useAnalyses } from '@/hooks/useGeo';
import { useSSEProgress } from '@/hooks/useSSEProgress';
import { AnalysisProgressBar } from '@/components/geo/AnalysisProgressBar';
import type { DiscoveryMode, LLMProvider } from '@/lib/geo-types';
import {
  BrainCircuit, Zap, Cpu, Lightbulb, Rocket, Clock, Bolt, CheckCircle2, AlertCircle, Info
} from 'lucide-react';
import { Button } from "@/components/ui/button";

const LLM_OPTIONS: { id: LLMProvider; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'chatgpt', label: 'ChatGPT', icon: <BrainCircuit className="text-emerald-500" size={20} />, desc: 'OpenAI GPT-4o' },
  { id: 'claude', label: 'Claude', icon: <Zap className="text-amber-500" size={20} />, desc: 'Anthropic Claude' },
  { id: 'gemini', label: 'Gemini', icon: <Cpu className="text-blue-500" size={20} />, desc: 'Google Gemini' },
  { id: 'perplexity', label: 'Perplexity', icon: <Lightbulb className="text-purple-500" />, desc: 'Perplexity AI' },
  { id: 'grok', label: 'Grok', icon: <Rocket className="text-sky-400" size={20} />, desc: 'xAI Grok' },
  { id: 'digitalocean', label: 'DigitalOcean AI', icon: <Bolt className="text-blue-400" size={20} />, desc: 'DigitalOcean GenAI' },
];

const MODES: { id: DiscoveryMode; label: string; desc: string; eta: string; icon: React.ReactNode }[] = [
  { id: 'quick', label: 'Quick', desc: 'Fast scan, 5 prompts', eta: '~15s', icon: <Zap size={16} /> },
  { id: 'standard', label: 'Standard', desc: 'Balanced, 10 prompts', eta: '~45s', icon: <Cpu size={16} /> },
  { id: 'deep', label: 'Deep', desc: 'Comprehensive, 25+ prompts', eta: '~90s', icon: <BrainCircuit size={16} /> },
];

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
  const { discover, loading, error } = useKeywordDiscovery();
  const { data: recentAnalyses, fetchAnalyses } = useAnalyses();
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const { progress, stageLabel } = useSSEProgress(loading ? analysisId : null);

  // Fetch latest analysis on mount for the "Last Analysis" badge
  useEffect(() => { fetchAnalyses(undefined, undefined, 1); }, [fetchAnalyses]);

  const lastAnalysisLabel = useMemo(() => {
    if (!recentAnalyses || recentAnalyses.length === 0) return 'No runs yet';
    return `Last: ${getRelativeTime(recentAnalyses[0].created_at)}`;
  }, [recentAnalyses]);

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
    router.push('/dashboard/keywords');
  };

  const estimatedTime = MODES.find(m => m.id === mode)?.eta ?? '~45s';
  const canSubmit = brandName.trim() && category.trim() && selectedLLMs.length > 0;

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
              currentStage={progress ? stageLabel : 'Waking up analysis agents…'}
              progressPercent={progress?.progress_percent ?? 5}
              stageProgressPercent={progress?.stage_progress_percent ?? 20}
              estimatedSecondsRemaining={progress?.estimated_seconds_remaining}
            />
            <p className="text-center text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] animate-pulse">
              System: Processing deep-reach optimization vectors...
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleStart} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">

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
            </section>

            {/* Step 2: Protocol */}
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

            {/* Step 3: Synthesis */}
            <section className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/5 p-8 md:p-10 shadow-sm space-y-8 animate-in slide-in-from-left-4 duration-500 delay-200">
               <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black italic shadow-lg shadow-emerald-500/20">03</div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">LLM Synthesis</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {LLM_OPTIONS.map(llm => {
                  const selected = selectedLLMs.includes(llm.id);
                  return (
                    <button type="button" key={llm.id} onClick={() => toggleLLM(llm.id)}
                      className={`flex items-center gap-5 p-5 rounded-[2rem] border transition-all group ${
                        selected 
                        ? 'bg-emerald-500/5 border-emerald-500-20 shadow-lg shadow-emerald-500/5' 
                        : 'bg-slate-50 dark:bg-black/20 border-slate-100 dark:border-white/10 hover:border-emerald-500/30'
                      }`}>
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
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Operation Mode</p>
                    <p className="text-sm font-black uppercase tracking-widest italic">{mode} Protocol</p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Resource Allocation</p>
                    <div className="flex flex-wrap gap-2">
                       {selectedLLMs.map(llm => (
                          <div key={llm} className="px-3 py-1.5 rounded-xl bg-white/10 dark:bg-slate-100 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                             <div className="h-1 w-1 rounded-full bg-primary animate-pulse"></div>
                             {llm}
                          </div>
                       ))}
                    </div>
                  </div>

                  <div className="pt-4 space-y-6 border-t border-white/10 dark:border-slate-100">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">Time to Result</p>
                        <p className="text-2xl font-black text-primary italic">{estimatedTime}</p>
                      </div>
                      <Bolt className="text-primary animate-pulse" size={24} />
                    </div>

                    <Button type="submit" disabled={!canSubmit}
                      className="w-full h-16 rounded-2xl bg-primary hover:bg-blue-600 disabled:opacity-20 disabled:grayscale text-white font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-primary/30 active:scale-95 transition-all">
                      Deploy Engine
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 dark:bg-primary/10 border border-primary/10 dark:border-primary/20 rounded-[2rem] p-6 flex gap-4">
                <Info size={18} className="text-primary flex-shrink-0" />
                <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 leading-relaxed uppercase tracking-wide">
                  Analysis utilizes neural ranking vectors to determine your brand's presence across major AI search indexes.
                </p>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
