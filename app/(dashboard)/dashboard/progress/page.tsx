'use client';

import { useState, useEffect } from 'react';
import { useVisibilityTrend, useAnalyses } from '@/hooks/useGeo';
import { Button } from '@/components/ui/button';
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

  return (
    <div className="space-y-10">
      {/* Page header */}
      <div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Visibility Progress</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">Track how your AI visibility and brand presence changes over time.</p>
      </div>

      {/* Brand selector form */}
      <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/50 p-8 md:p-10 shadow-sm">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1 w-full space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Brand Name</label>
            <input value={brandName} onChange={e => setBrandName(e.target.value)} placeholder="e.g. Notion" required
              className="w-full rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/10 px-5 py-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" />
          </div>
          <div className="flex-1 w-full space-y-2">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Category</label>
            <input value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. project management software" required
              className="w-full rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/10 px-5 py-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium" />
          </div>
          <Button type="submit" disabled={trendLoading}
            className="w-full md:w-auto px-10 py-7 rounded-2xl bg-primary hover:bg-blue-600 disabled:opacity-40 text-white font-black text-base shadow-xl shadow-primary/25 transition-all active:scale-[0.99]">
            {trendLoading ? 'Loading...' : 'View Analysis Trend'}
          </Button>
        </form>
      </div>

      {/* Error */}
      {trendError && (
        <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-5 text-sm text-red-600 dark:text-red-400 font-semibold animate-in fade-in slide-in-from-top-4">
          {trendError}
        </div>
      )}

      {/* Trend results */}
      {trendData && !trendLoading && (
        <div className="space-y-8 animate-in fade-in duration-700">
          {/* Latest snapshot metrics */}
          {latest && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <ScoreCard
                label="Current Visibility"
                score={latest.overall_visibility ?? 0}
                trend={trendData.trend.trend_direction === 'improving' ? 'up' : trendData.trend.trend_direction === 'declining' ? 'down' : 'stable'}
              />
              <ScoreCard label="RAG Growth" score={latest.rag_model_visibility ?? 0} />
              <ScoreCard label="Base Presence" score={latest.base_model_visibility ?? 0} />
              <ScoreCard
                label="Total Change"
                score={Math.abs(trendData.trend.overall_change)}
                description={`${trendData.trend.overall_change >= 0 ? '+' : ''}${trendData.trend.overall_change.toFixed(1)}% total`}
              />
            </div>
          )}

          {/* Chart */}
          <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/50 p-8 md:p-10 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Visibility History</h2>
                <p className="text-xs text-slate-500 font-medium">Daily AI-model reach data points</p>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                {trendData.source === 'local' ? 'Local Index' : 'Cloud Compute'}
              </div>
            </div>
            <div className="h-[400px] w-full bg-slate-50/50 dark:bg-black/20 rounded-[2rem] p-4 border border-slate-100 dark:border-white/5">
              <TrendChart trend={trendData.trend} />
            </div>
          </div>

          {/* Keyword changes */}
          {trendData.trend.keyword_changes && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {trendData.trend.keyword_changes.keywords_gained.length > 0 && (
                <div className="rounded-[2.5rem] border border-emerald-500/20 bg-emerald-500/5 p-8 space-y-4">
                  <h3 className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em]">Keywords Gained</h3>
                  <div className="flex flex-wrap gap-2">
                    {trendData.trend.keyword_changes.keywords_gained.map(kw => (
                      <span key={kw} className="text-[11px] font-black bg-white dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-xl shadow-sm border border-emerald-500/10">✓ {kw}</span>
                    ))}
                  </div>
                </div>
              )}
              {trendData.trend.keyword_changes.new_gaps.length > 0 && (
                <div className="rounded-[2.5rem] border border-amber-500/20 bg-amber-500/5 p-8 space-y-4">
                  <h3 className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-[0.2em]">New Visibility Gaps</h3>
                  <div className="flex flex-wrap gap-2">
                    {trendData.trend.keyword_changes.new_gaps.map(kw => (
                      <span key={kw} className="text-[11px] font-black bg-white dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-xl shadow-sm border border-amber-500/10">🎯 {kw}</span>
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
        <div className="rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-white/10 p-16 text-center bg-slate-50/50 dark:bg-transparent">
          <div className="w-20 h-20 rounded-[2.5rem] bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">📊</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">No historical data for "{brandName}"</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
            Run a Keyword Discovery analysis first — historical tracking begins after your initial brand mapping.
          </p>
        </div>
      )}

      {/* Recent analyses history */}
      {analyses.length > 0 && (
        <div className="rounded-[2.5rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/50 p-8 md:p-10 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Full History</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analyses.slice(0, 10).map(a => (
              <div key={a.id} className="group flex items-center justify-between p-5 rounded-3xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/5 hover:border-primary/30 transition-all cursor-pointer">
                <div className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm font-black text-primary group-hover:bg-primary group-hover:text-white transition-colors uppercase tracking-widest text-[10px]">
                    {a.brand_name.substring(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{a.brand_name}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{a.analysis_type.replace(/_/g, ' ')} · {new Date(a.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  {a.visibility_score != null && (
                    <p className="text-sm font-black text-primary">{Math.round(a.visibility_score)}%</p>
                  )}
                  <span className={`text-[10px] font-black uppercase tracking-widest ${a.status === 'completed' ? 'text-emerald-500' : 'text-amber-500'}`}>
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
