'use client';

import { useState } from 'react';
import { useContentValidation } from '@/hooks/useGeo';
import { ScoreCard } from '@/components/geo/ScoreCard';
import { Button } from '@/components/ui/button';

export default function ContentPage() {
  const { data, loading, error, validate, testLive, reset } = useContentValidation();

  const [brandName, setBrandName] = useState('');
  const [content, setContent] = useState('');
  const [targetQueries, setTargetQueries] = useState('');
  const [contentType, setContentType] = useState('blog_post');
  const [competitors, setCompetitors] = useState('');
  const [mode, setMode] = useState<'structural' | 'live'>('structural');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const queries = targetQueries.split(',').map(q => q.trim()).filter(Boolean);
    const comps = competitors.split(',').map(c => c.trim()).filter(Boolean);

    if (mode === 'live') {
      await testLive({ content, brand_name: brandName, target_queries: queries, providers: ['chatgpt', 'gemini'], competitors: comps });
    } else {
      await validate({ content, brand_name: brandName, target_queries: queries, content_type: contentType as any, competitors: comps });
    }
  };

  const isReadyToPublish = data && data.rag_citability_score >= 75;

  return (
    <div className="space-y-10">
      {/* Page header */}
      <div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Content Validator</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium tracking-tight max-w-2xl">
          Check if your content will be cited by AI models before you publish. 
          Optimize for RAG (Retrieval-Augmented Generation) visibility.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Input panel */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-8 h-full">
          <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/50 p-8 md:p-10 shadow-sm space-y-8">
            {/* Mode toggle */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Validation Mode</label>
              <div className="flex gap-3 bg-slate-50 dark:bg-black/40 p-1.5 rounded-2xl border border-slate-100 dark:border-white/5">
                <button type="button" onClick={() => setMode('structural')}
                  className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${
                    mode === 'structural' 
                      ? 'bg-white dark:bg-slate-800 text-primary shadow-sm border border-slate-200 dark:border-white/10' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}>
                  ⚙️ Structural
                </button>
                <button type="button" onClick={() => setMode('live')}
                  className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${
                    mode === 'live' 
                      ? 'bg-white dark:bg-slate-800 text-primary shadow-sm border border-slate-200 dark:border-white/10' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}>
                  🤖 Live Test
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Brand Name *</label>
                <input value={brandName} onChange={e => setBrandName(e.target.value)} required placeholder="e.g. Notion"
                  className="w-full rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/10 px-5 py-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Content Type</label>
                <select value={contentType} onChange={e => setContentType(e.target.value)}
                  className="w-full rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/10 px-5 py-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium appearance-none">
                  <option value="blog_post">Blog Post</option>
                  <option value="faq_page">FAQ Page</option>
                  <option value="comparison_page">Comparison Page</option>
                  <option value="landing_page">Landing Page</option>
                  <option value="listicle">Listicle</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Target Queries (comma-separated)</label>
              <input value={targetQueries} onChange={e => setTargetQueries(e.target.value)}
                placeholder="best project management tool, Notion alternative"
                className="w-full rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/10 px-5 py-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end px-1">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Full Content *</label>
                <span className="text-[10px] font-bold text-slate-400">{content.length.toLocaleString()} characters</span>
              </div>
              <textarea value={content} onChange={e => setContent(e.target.value)} required rows={12}
                placeholder="Paste your draft blog post, FAQ page, or landing page content here..."
                className="w-full rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/10 px-5 py-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono resize-none leading-relaxed" />
            </div>

            {error && <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-600 dark:text-red-400 font-semibold">{error}</div>}

            <div className="flex flex-col sm:flex-row gap-4">
              <Button type="submit" disabled={loading || !content || !brandName}
                className="flex-1 py-7 rounded-2xl bg-primary hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-base shadow-xl shadow-primary/25 transition-all active:scale-[0.99]">
                {loading ? 'Validating...' : mode === 'live' ? 'Run Live AI Test' : 'Validate Content'}
              </Button>
              {data && (
                <Button type="button" onClick={reset} variant="outline"
                  className="sm:px-8 py-7 rounded-2xl border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                  Reset
                </Button>
              )}
            </div>
          </div>
        </form>

        {/* Right: Results panel */}
        <div className="lg:col-span-5 flex flex-col h-full">
          {!data && !loading && (
            <div className="flex-1 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center min-h-[500px] bg-slate-50/50 dark:bg-transparent transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.02]">
              <div className="text-center space-y-4 p-8 max-w-xs">
                <div className="w-16 h-16 rounded-[2rem] bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl">📝</span>
                </div>
                <p className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tighter">Ready for Analysis</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Paste your content on the left to analyze its potential for AI visibility and citability.</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex-1 rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/50 p-12 flex flex-col items-center justify-center gap-8 shadow-sm">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl animate-pulse">🤖</span>
                </div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Analyzing Content</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{mode === 'live' ? 'Connecting to live LLM engines...' : 'Evaluating structure and semantics...'}</p>
              </div>
            </div>
          )}

          {data && !loading && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
              {/* Verdict banner */}
              <div className={`rounded-[2.5rem] border-2 p-8 shadow-sm text-center ${
                isReadyToPublish 
                  ? 'bg-emerald-500/5 border-emerald-500/20 dark:bg-emerald-500/10' 
                  : 'bg-amber-500/5 border-amber-500/20 dark:bg-amber-500/10'
              }`}>
                <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl ${
                  isReadyToPublish ? 'bg-emerald-500/20 text-emerald-600' : 'bg-amber-500/20 text-amber-600'
                }`}>
                  {isReadyToPublish ? '⚡' : '⚠️'}
                </div>
                <h3 className={`font-black text-xl uppercase tracking-tighter mb-2 ${isReadyToPublish ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                  {isReadyToPublish ? 'High Citability' : 'Low Visibility Potential'}
                </h3>
                <p className={`text-sm font-medium ${isReadyToPublish ? 'text-emerald-600/80 dark:text-emerald-500/60' : 'text-amber-600/80 dark:text-amber-500/60'}`}>
                  RAG Citability Score: <span className="font-black">{Math.round(data.rag_citability_score)}%</span>
                </p>
              </div>

              {/* Score cards */}
              <div className="grid grid-cols-2 gap-4">
                <ScoreCard label="Structure" score={data.structure_score} size="sm" />
                <ScoreCard label="Fact Density" score={data.factual_density_score} size="sm" />
                <ScoreCard label="Brand Focus" score={data.brand_visibility_score} size="sm" />
                <ScoreCard label="Readability" score={data.rag_citability_score} size="sm" />
              </div>

              {/* Improvements */}
              {data.improvement_areas?.length > 0 && (
                <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/50 p-8 space-y-6 shadow-sm">
                  <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Action Items</h3>
                  <div className="space-y-3">
                    {data.improvement_areas.map((area, i) => (
                      <div key={i} className={`rounded-2xl p-4 transition-all hover:scale-[1.02] border ${
                        area.severity === 'high' ? 'bg-red-500/5 border-red-500/10 dark:bg-red-500/10 dark:border-red-500/20' :
                        area.severity === 'medium' ? 'bg-amber-500/5 border-amber-500/10 dark:bg-amber-500/10 dark:border-amber-500/20' :
                        'bg-slate-50 border-slate-100 dark:bg-white/5 dark:border-white/10'
                      }`}>
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-wider">{area.area.replace(/_/g, ' ')}</p>
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                            area.severity === 'high' ? 'bg-red-500 text-white' : 
                            area.severity === 'medium' ? 'bg-amber-500 text-white' : 
                            'bg-slate-500 text-white'
                          }`}>{area.severity}</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{area.suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {data.recommendations?.length > 0 && (
                <div className="rounded-[2.5rem] border border-primary/20 bg-primary/5 p-8 space-y-4 shadow-sm">
                  <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em] px-1">Expert Strategy</h3>
                  <div className="space-y-3">
                    {data.recommendations.map((rec, i) => (
                      <div key={i} className="flex gap-4 items-start group">
                        <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black text-[10px] group-hover:scale-110 transition-transform">✓</span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed group-hover:text-primary transition-colors">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
