'use client';

import { useState } from 'react';
import { useContentValidation } from '@/hooks/useGeo';
import { ScoreCard } from '@/components/geo/ScoreCard';

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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">Content Validator</h1>
        <p className="text-slate-400 mt-1">Check if your content will be cited by AI models before you publish.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input panel */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
            {/* Mode toggle */}
            <div className="flex gap-2 bg-white/5 p-1 rounded-xl">
              <button type="button" onClick={() => setMode('structural')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'structural' ? 'bg-white/10 text-white' : 'text-slate-400'}`}>
                ⚙️ Structural (5-15s)
              </button>
              <button type="button" onClick={() => setMode('live')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${mode === 'live' ? 'bg-white/10 text-white' : 'text-slate-400'}`}>
                🤖 Live Test (30-90s)
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Brand Name *</label>
              <input value={brandName} onChange={e => setBrandName(e.target.value)} required placeholder="e.g. Notion"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Target Queries (comma-separated)</label>
              <input value={targetQueries} onChange={e => setTargetQueries(e.target.value)}
                placeholder="best project management tool, Notion alternative"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Content *</label>
              <textarea value={content} onChange={e => setContent(e.target.value)} required rows={10}
                placeholder="Paste your draft blog post, FAQ page, or landing page content here..."
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all font-mono resize-none" />
              <p className="text-xs text-slate-600">{content.length.toLocaleString()} characters</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Content Type</label>
                <select value={contentType} onChange={e => setContentType(e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all">
                  <option value="blog_post">Blog Post</option>
                  <option value="faq_page">FAQ Page</option>
                  <option value="comparison_page">Comparison Page</option>
                  <option value="landing_page">Landing Page</option>
                  <option value="listicle">Listicle</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Competitors</label>
                <input value={competitors} onChange={e => setCompetitors(e.target.value)} placeholder="Asana, Trello"
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all" />
              </div>
            </div>

            {error && <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-400">{error}</div>}

            <div className="flex gap-3">
              <button type="submit" disabled={loading || !content || !brandName}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm transition-all">
                {loading ? 'Validating...' : mode === 'live' ? '🤖 Test Live' : '⚙️ Validate Content'}
              </button>
              {data && (
                <button type="button" onClick={reset}
                  className="px-4 py-3 rounded-xl border border-white/10 hover:border-white/20 text-slate-400 hover:text-white text-sm transition-all">
                  Reset
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Right: Results panel */}
        <div className="space-y-4">
          {!data && !loading && (
            <div className="h-full rounded-2xl border border-dashed border-white/10 flex items-center justify-center min-h-64">
              <div className="text-center space-y-2 p-8">
                <p className="text-4xl">📝</p>
                <p className="text-sm font-bold text-white">Paste your content</p>
                <p className="text-xs text-slate-500">Results will appear here after validation</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
              <p className="text-sm text-slate-400">{mode === 'live' ? 'Running live LLM tests...' : 'Analyzing content structure...'}</p>
            </div>
          )}

          {data && !loading && (
            <div className="space-y-4">
              {/* Verdict banner */}
              <div className={`rounded-2xl border p-4 ${
                isReadyToPublish ? 'bg-green-500/10 border-green-500/20' : 'bg-yellow-500/10 border-yellow-500/20'
              }`}>
                <p className={`font-bold text-sm ${isReadyToPublish ? 'text-green-300' : 'text-yellow-300'}`}>
                  {isReadyToPublish ? '✓ Ready to publish' : '⚠️ Needs improvement'}
                </p>
                <p className={`text-xs mt-1 ${isReadyToPublish ? 'text-green-400' : 'text-yellow-400'}`}>
                  RAG Citability Score: {Math.round(data.rag_citability_score)}/100
                </p>
              </div>

              {/* Score cards */}
              <div className="grid grid-cols-2 gap-3">
                <ScoreCard label="RAG Citability" score={data.rag_citability_score} size="sm" />
                <ScoreCard label="Structure" score={data.structure_score} size="sm" />
                <ScoreCard label="Factual Density" score={data.factual_density_score} size="sm" />
                <ScoreCard label="Brand Visibility" score={data.brand_visibility_score} size="sm" />
              </div>

              {/* Improvements */}
              {data.improvement_areas?.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest">Improvements Needed</h3>
                  {data.improvement_areas.map((area, i) => (
                    <div key={i} className={`rounded-xl p-3 space-y-1 ${
                      area.severity === 'high' ? 'bg-red-500/10 border border-red-500/20' :
                      area.severity === 'medium' ? 'bg-yellow-500/10 border border-yellow-500/20' :
                      'bg-white/5 border border-white/10'
                    }`}>
                      <p className="text-xs font-bold text-white capitalize">{area.area.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-slate-400">{area.suggestion}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Recommendations */}
              {data.recommendations?.length > 0 && (
                <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 space-y-2">
                  <h3 className="text-xs font-bold text-blue-300 uppercase tracking-widest">Recommendations</h3>
                  {data.recommendations.map((rec, i) => (
                    <div key={i} className="flex gap-2 text-xs text-slate-300">
                      <span className="text-blue-400 flex-shrink-0">→</span>
                      {rec}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
