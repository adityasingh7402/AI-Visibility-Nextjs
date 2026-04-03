'use client';

import { useState } from 'react';
import { useContentValidation } from '@/hooks/useGeo';
import type { ContentType, ContentLiveTestResponse } from '@/lib/geo-types';
import { ScoreCard } from '@/components/geo/ScoreCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  FileText, Settings, Bot, AlertTriangle, AlertCircle,
  Info, CheckCircle, Loader2, RotateCcw, Zap, ShieldAlert,
} from 'lucide-react';

const MAX_CONTENT = 50_000;
const WARN_CONTENT = 100;

function getVerdictColor(score: number) {
  if (score >= 75) return 'emerald';
  if (score >= 50) return 'amber';
  return 'red';
}

function getVerdictLabel(score: number) {
  if (score >= 75) return 'High Citability';
  if (score >= 50) return 'Moderate Potential';
  return 'Low Visibility';
}

function getSeverityStyles(severity: string) {
  if (severity === 'high') return 'bg-red-500/5 border-red-500/10 dark:bg-red-500/10 dark:border-red-500/20';
  if (severity === 'medium') return 'bg-amber-500/5 border-amber-500/10 dark:bg-amber-500/10 dark:border-amber-500/20';
  return 'bg-slate-50 border-slate-100 dark:bg-white/5 dark:border-white/10';
}

function getSeverityBadge(severity: string) {
  if (severity === 'high') return { icon: AlertCircle, cls: 'bg-red-500 text-white' };
  if (severity === 'medium') return { icon: AlertTriangle, cls: 'bg-amber-500 text-white' };
  return { icon: Info, cls: 'bg-slate-500 text-white' };
}

export default function ContentPage() {
  const { data, loading, error, validate, testLive, reset } = useContentValidation();

  const [brandName, setBrandName] = useState('');
  const [content, setContent] = useState('');
  const [targetQueries, setTargetQueries] = useState('');
  const [contentType, setContentType] = useState<ContentType>('blog_post');
  const [competitors, setCompetitors] = useState('');
  const [mode, setMode] = useState<'structural' | 'live'>('structural');

  const contentTooShort = content.length > 0 && content.length < WARN_CONTENT;
  const contentTooLong = content.length > MAX_CONTENT;
  const canSubmit = !loading && !!content && !!brandName && !contentTooLong;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const queries = targetQueries.split(',').map(q => q.trim()).filter(Boolean);
    const comps = competitors.split(',').map(c => c.trim()).filter(Boolean);

    if (mode === 'live') {
      await testLive({ content, brand_name: brandName, target_queries: queries, providers: ['chatgpt', 'gemini'], competitors: comps });
    } else {
      await validate({ content, brand_name: brandName, target_queries: queries, content_type: contentType, competitors: comps });
    }
  };

  const score = data?.rag_citability_score ?? 0;
  const color = data ? getVerdictColor(score) : null;
  const liveResults = data && 'live_test_results' in data ? (data as unknown as ContentLiveTestResponse) : null;

  const modeBtn = (target: 'structural' | 'live', icon: React.ReactNode, label: string) => (
    <button type="button" onClick={() => setMode(target)}
      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black transition-all ${
        mode === target
          ? 'bg-white dark:bg-slate-800 text-primary shadow-sm border border-slate-200 dark:border-white/10'
          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
      }`}>
      {icon} {label}
    </button>
  );

  const inputCls = 'rounded-2xl bg-slate-50 dark:bg-black/20 border-slate-100 dark:border-white/10 px-5 py-4 h-auto text-sm font-medium';
  const labelCls = 'text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1';

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black text-foreground tracking-tight mb-2">Content Validator</h1>
        <p className="text-muted-foreground font-medium tracking-tight max-w-2xl">
          Check if your content will be cited by AI models before you publish.
          Optimize for RAG visibility and citability.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Form panel */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-8">
          <div className="rounded-[2.5rem] border border-border bg-card p-8 md:p-10 shadow-sm space-y-8">
            {/* Mode toggle */}
            <div className="space-y-4">
              <Label className={labelCls}>Validation Mode</Label>
              <div className="flex gap-3 bg-slate-50 dark:bg-black/40 p-1.5 rounded-2xl border border-slate-100 dark:border-white/5">
                {modeBtn('structural', <Settings className="w-3.5 h-3.5" />, 'Structural Analysis')}
                {modeBtn('live', <Bot className="w-3.5 h-3.5" />, 'Live Test')}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className={labelCls}>Brand Name *</Label>
                <Input value={brandName} onChange={e => setBrandName(e.target.value)} required
                  placeholder="e.g. Notion" className={inputCls} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content-type" className={labelCls}>Content Type</Label>
                <select id="content-type" value={contentType} onChange={e => setContentType(e.target.value as ContentType)}
                  className="w-full rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/10 px-5 py-4 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none">
                  <option value="blog_post">Blog Post</option>
                  <option value="faq_page">FAQ Page</option>
                  <option value="comparison_page">Comparison Page</option>
                  <option value="landing_page">Landing Page</option>
                  <option value="listicle">Listicle</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className={labelCls}>Target Queries</Label>
                <Input value={targetQueries} onChange={e => setTargetQueries(e.target.value)}
                  placeholder="best project management tool, Notion alternative" className={inputCls} />
              </div>
              <div className="space-y-2">
                <Label className={labelCls}>Competitors (optional)</Label>
                <Input value={competitors} onChange={e => setCompetitors(e.target.value)}
                  placeholder="e.g. Asana, Trello, Monday.com" className={inputCls} />
              </div>
            </div>

            {/* Content textarea */}
            <div className="space-y-2">
              <div className="flex justify-between items-end px-1">
                <Label className={labelCls}>Content *</Label>
                <span className={`text-[10px] font-bold ${
                  contentTooLong ? 'text-red-500' : contentTooShort ? 'text-amber-500' : 'text-slate-400'
                }`}>
                  {content.length.toLocaleString()} / {MAX_CONTENT.toLocaleString()}
                </span>
              </div>
              <Textarea value={content} onChange={e => setContent(e.target.value)} required rows={12}
                placeholder="Paste your draft blog post, FAQ page, or landing page content here..."
                className="rounded-2xl bg-slate-50 dark:bg-black/20 border-slate-100 dark:border-white/10 px-5 py-4 text-sm font-mono resize-none leading-relaxed" />
              {contentTooShort && (
                <p className="text-xs text-amber-500 font-medium px-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3" /> Content is very short — results may be unreliable
                </p>
              )}
              {contentTooLong && (
                <p className="text-xs text-red-500 font-medium px-1 flex items-center gap-1.5">
                  <AlertCircle className="w-3 h-3" /> Content exceeds {MAX_CONTENT.toLocaleString()} character limit
                </p>
              )}
            </div>

            {error && (
              <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-600 dark:text-red-400 font-semibold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" /> {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <Button type="submit" disabled={!canSubmit}
                className="flex-1 py-7 rounded-2xl bg-primary hover:bg-blue-600 disabled:opacity-40 text-white font-black text-base shadow-xl shadow-primary/25 transition-all active:scale-[0.99]">
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Validating...</>
                ) : mode === 'live' ? (
                  <><Bot className="w-4 h-4 mr-2" /> Run Live AI Test</>
                ) : (
                  <><Zap className="w-4 h-4 mr-2" /> Validate Content</>
                )}
              </Button>
              {data && (
                <Button type="button" onClick={reset} variant="outline"
                  className="sm:px-8 py-7 rounded-2xl border-slate-200 dark:border-white/10 font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                  <RotateCcw className="w-4 h-4 mr-2" /> Reset
                </Button>
              )}
            </div>
          </div>
        </form>

        {/* Right: Results panel */}
        <div className="lg:col-span-4 flex flex-col">
          {!data && !loading && (
            <div className="flex-1 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center min-h-[500px] bg-slate-50/50 dark:bg-transparent">
              <div className="text-center space-y-4 p-8 max-w-xs">
                <div className="w-16 h-16 rounded-[2rem] bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto">
                  <FileText className="w-7 h-7 text-slate-400" />
                </div>
                <p className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tighter">Ready for Analysis</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  Paste your content and hit validate to check AI citability.
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex-1 rounded-[2.5rem] border border-border bg-card p-12 flex flex-col items-center justify-center gap-8 shadow-sm">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  {mode === 'live'
                    ? <Bot className="w-6 h-6 text-primary animate-pulse" />
                    : <Settings className="w-6 h-6 text-primary animate-pulse" />}
                </div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Analyzing Content</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {mode === 'live' ? 'Testing against live LLM providers...' : 'Evaluating structure and semantics...'}
                </p>
              </div>
            </div>
          )}

          {data && !loading && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
              {/* Verdict banner */}
              <div className={`rounded-[2.5rem] border-2 p-8 shadow-sm text-center ${
                color === 'emerald' ? 'bg-emerald-500/5 border-emerald-500/20' :
                color === 'amber' ? 'bg-amber-500/5 border-amber-500/20' :
                'bg-red-500/5 border-red-500/20'
              }`}>
                <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                  color === 'emerald' ? 'bg-emerald-500/20' : color === 'amber' ? 'bg-amber-500/20' : 'bg-red-500/20'
                }`}>
                  {color === 'emerald' ? <CheckCircle className="w-7 h-7 text-emerald-600" /> :
                   color === 'amber' ? <AlertTriangle className="w-7 h-7 text-amber-600" /> :
                   <AlertCircle className="w-7 h-7 text-red-600" />}
                </div>
                <h3 className={`font-black text-xl uppercase tracking-tighter mb-2 ${
                  color === 'emerald' ? 'text-emerald-700 dark:text-emerald-400' :
                  color === 'amber' ? 'text-amber-700 dark:text-amber-400' :
                  'text-red-700 dark:text-red-400'
                }`}>
                  {getVerdictLabel(score)}
                </h3>
                <p className={`text-sm font-medium ${
                  color === 'emerald' ? 'text-emerald-600/80' : color === 'amber' ? 'text-amber-600/80' : 'text-red-600/80'
                }`}>
                  RAG Citability: <span className="font-black">{Math.round(score)}%</span>
                </p>
              </div>

              {/* Score cards */}
              <div className="grid grid-cols-2 gap-4">
                <ScoreCard label="Citability" score={data.rag_citability_score} size="sm" />
                <ScoreCard label="Structure" score={data.structure_score} size="sm" />
                <ScoreCard label="Fact Density" score={data.factual_density_score} size="sm" />
                <ScoreCard label="Brand Focus" score={data.brand_visibility_score} size="sm" />
              </div>

              {/* Live test results */}
              {liveResults?.live_test_results && (
                <div className="rounded-[2.5rem] border border-primary/20 bg-primary/5 p-6 space-y-4 shadow-sm">
                  <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                    <Bot className="w-3.5 h-3.5" /> Live Test Results
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Queries', value: liveResults.live_test_results.total_queries },
                      { label: 'LLM Calls', value: liveResults.live_test_results.total_llm_calls },
                      { label: 'Mentions', value: liveResults.live_test_results.mentions_detected },
                      { label: 'Mention Rate', value: `${Math.round(liveResults.live_test_results.mention_rate * 100)}%` },
                    ].map(item => (
                      <div key={item.label} className="rounded-xl bg-white/60 dark:bg-white/5 p-3 text-center">
                        <p className="text-lg font-black text-slate-900 dark:text-white">{item.value}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                      </div>
                    ))}
                  </div>
                  {liveResults.verdict && (
                    <div className="flex justify-center">
                      <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                        liveResults.verdict === 'strong' ? 'bg-emerald-500 text-white' :
                        liveResults.verdict === 'promising' ? 'bg-amber-500 text-white' :
                        'bg-red-500 text-white'
                      }`}>{liveResults.verdict.replace('_', ' ')}</span>
                    </div>
                  )}
                  {liveResults.verdict_reasoning && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed px-1">
                      {liveResults.verdict_reasoning}
                    </p>
                  )}
                </div>
              )}

              {/* Improvement areas */}
              {data.improvement_areas?.length > 0 && (
                <div className="rounded-[2.5rem] border border-border bg-card p-6 space-y-4 shadow-sm">
                  <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Issues</h3>
                  <div className="space-y-3">
                    {data.improvement_areas.map((area, i) => {
                      const badge = getSeverityBadge(area.severity);
                      const SevIcon = badge.icon;
                      return (
                        <div key={i} className={`rounded-2xl p-4 border ${getSeverityStyles(area.severity)}`}>
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-wider">
                              {area.area.replace(/_/g, ' ')}
                            </p>
                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 ${badge.cls}`}>
                              <SevIcon className="w-2.5 h-2.5" /> {area.severity}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{area.suggestion}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {data.recommendations?.length > 0 && (
                <div className="rounded-[2.5rem] border border-primary/20 bg-primary/5 p-6 space-y-4 shadow-sm">
                  <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] px-1">Recommendations</h3>
                  <div className="space-y-3">
                    {data.recommendations.map((rec, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {data.warnings && data.warnings.length > 0 && (
                <div className="rounded-[2.5rem] border border-amber-500/20 bg-amber-500/5 p-6 space-y-3">
                  <h3 className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5" /> Warnings
                  </h3>
                  <ul className="space-y-1.5">
                    {data.warnings.map((w, i) => (
                      <li key={i} className="text-xs text-amber-700 dark:text-amber-300 font-medium">{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Errors */}
              {data.errors && data.errors.length > 0 && (
                <div className="rounded-[2.5rem] border border-red-500/20 bg-red-500/5 p-6 space-y-3">
                  <h3 className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5" /> Engine Errors
                  </h3>
                  <ul className="space-y-1.5">
                    {data.errors.map((err, i) => (
                      <li key={i} className="text-xs text-red-700 dark:text-red-300 font-medium">{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}