'use client';

import { useState, useEffect } from 'react';
import { useVisibilityTrend, useAnalyses } from '@/hooks/useGeo';
import { TrendChart } from '@/components/geo/TrendChart';
import { ScoreCard } from '@/components/geo/ScoreCard';

export default function ProgressPage() {
  const { data: trendData, loading: trendLoading, error: trendError, fetchTrend } = useVisibilityTrend();
  const { data: analyses, loading: analysesLoading, fetchAnalyses } = useAnalyses();

  const [brandName, setBrandName] = useState('');
  const [category, setCategory] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Auto-load analyses history on mount
  useEffect(() => { fetchAnalyses(); }, [fetchAnalyses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName || !category) return;
    setSubmitted(true);
    await fetchTrend({ brand_name: brandName, category, limit: 30 });
  };

  const latest = trendData?.trend?.data_points?.at(-1);
  const first = trendData?.trend?.data_points?.[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">Visibility Progress</h1>
        <p className="text-slate-400 mt-1">Track how your AI visibility changes over time.</p>
      </div>

      {/* Brand selector form */}
      <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex gap-3 flex-wrap items-end">
          <div className="flex-1 min-w-40 space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Brand Name</label>
            <input value={brandName} onChange={e => setBrandName(e.target.value)} placeholder="e.g. Notion" required
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all" />
          </div>
          <div className="flex-1 min-w-40 space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Category</label>
            <input value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. project management software" required
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all" />
          </div>
          <button type="submit" disabled={trendLoading}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-sm transition-all">
            {trendLoading ? 'Loading...' : 'View Trend'}
          </button>
        </div>
      </form>

      {/* Error */}
      {trendError && <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">{trendError}</div>}

      {/* Trend results */}
      {trendData && !trendLoading && (
        <div className="space-y-6">
          {/* Latest snapshot metrics */}
          {latest && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ScoreCard
                label="Current Visibility"
                score={latest.overall_visibility ?? 0}
                trend={trendData.trend.trend_direction === 'improving' ? 'up' : trendData.trend.trend_direction === 'declining' ? 'down' : 'stable'}
              />
              <ScoreCard label="RAG Model" score={latest.rag_model_visibility ?? 0} />
              <ScoreCard label="Base Model" score={latest.base_model_visibility ?? 0} />
              <ScoreCard
                label="Change Since Start"
                score={Math.abs(trendData.trend.overall_change)}
                description={`${trendData.trend.overall_change >= 0 ? '+' : ''}${trendData.trend.overall_change.toFixed(1)}% overall`}
              />
            </div>
          )}

          {/* Chart */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Visibility Over Time</h2>
              <span className="text-xs text-slate-500">{trendData.source === 'local' ? '📊 From your analyses' : '🐍 From Python service'}</span>
            </div>
            <TrendChart trend={trendData.trend} />
          </div>

          {/* Keyword changes */}
          {trendData.trend.keyword_changes && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trendData.trend.keyword_changes.keywords_gained.length > 0 && (
                <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-4 space-y-2">
                  <h3 className="text-xs font-bold text-green-400 uppercase tracking-widest">Keywords Gained</h3>
                  <div className="flex flex-wrap gap-2">
                    {trendData.trend.keyword_changes.keywords_gained.map(kw => (
                      <span key={kw} className="text-xs bg-green-500/10 text-green-300 px-2 py-1 rounded-full">✓ {kw}</span>
                    ))}
                  </div>
                </div>
              )}
              {trendData.trend.keyword_changes.new_gaps.length > 0 && (
                <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-4 space-y-2">
                  <h3 className="text-xs font-bold text-orange-400 uppercase tracking-widest">New Gaps</h3>
                  <div className="flex flex-wrap gap-2">
                    {trendData.trend.keyword_changes.new_gaps.map(kw => (
                      <span key={kw} className="text-xs bg-orange-500/10 text-orange-300 px-2 py-1 rounded-full">🎯 {kw}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Empty for new brand */}
      {submitted && !trendData && !trendLoading && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center space-y-3">
          <p className="text-4xl">📊</p>
          <p className="text-white font-bold">No data yet for "{brandName}"</p>
          <p className="text-slate-400 text-sm">Run a Keyword Discovery first — it will populate your trend data automatically.</p>
        </div>
      )}

      {/* Recent analyses history */}
      {analyses.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest">Recent Analyses</h2>
          <div className="space-y-2">
            {analyses.slice(0, 10).map(a => (
              <div key={a.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-sm font-bold text-white">{a.brand_name}</p>
                  <p className="text-xs text-slate-500 capitalize">{a.analysis_type.replace(/_/g, ' ')} · {new Date(a.created_at).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  {a.visibility_score != null && (
                    <p className="text-sm font-bold text-blue-400">{Math.round(a.visibility_score)}%</p>
                  )}
                  <span className={`text-xs ${a.status === 'completed' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {a.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
