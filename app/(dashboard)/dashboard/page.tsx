'use client';

import { useEffect } from 'react';
import { useAnalyses } from '@/hooks/useGeo';
import { TrendingUp, BarChart3, MessageSquare, ArrowUpRight, Plus, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : score >= 40 ? 'bg-blue-500' : 'bg-red-500';
  return (
    <div className="h-1.5 w-24 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
      <div className={`h-full ${color}`} style={{ width: `${score}%` }} />
    </div>
  );
}

export default function DashboardPage() {
  const { data: analyses, loading, error, fetchAnalyses } = useAnalyses();

  useEffect(() => {
    fetchAnalyses();
  }, [fetchAnalyses]);

  // Aggregate stats from real data
  const totalAnalyses = analyses.length;
  const totalMentionRate = analyses.length > 0
    ? (analyses.reduce((sum, a) => sum + (a.mention_rate ?? 0), 0) / analyses.length * 100).toFixed(0)
    : '0';

  // Helper: safely extract visibility summary from JSONB payload
  type VisSummary = { base_model_visibility?: number; rag_model_visibility?: number; actionable_gap?: number };
  const getVisSummary = (a: typeof analyses[0]): VisSummary => {
    const p = a.response_payload as { your_visibility_summary?: VisSummary; visibility_summary?: VisSummary } | null;
    return p?.your_visibility_summary ?? p?.visibility_summary ?? {};
  };

  const avgBaseModel = analyses.length > 0
    ? Math.round(analyses.reduce((sum, a) => sum + (getVisSummary(a).base_model_visibility ?? 0), 0) / analyses.length)
    : 0;
  const avgRag = analyses.length > 0
    ? Math.round(analyses.reduce((sum, a) => sum + (getVisSummary(a).rag_model_visibility ?? 0), 0) / analyses.length)
    : 0;
  const avgGap = analyses.length > 0
    ? Math.round(analyses.reduce((sum, a) => sum + (getVisSummary(a).actionable_gap ?? 0), 0) / analyses.length)
    : 0;

  const recentAnalyses = analyses.slice(0, 5);

  const stats = [
    {
      label: 'Total Analyses',
      value: loading ? '…' : totalAnalyses.toLocaleString(),
      change: '+New',
      icon: <BarChart3 className="text-primary" />,
    },
    {
      label: 'RAG Visibility',
      value: loading ? '…' : `${avgRag}%`,
      change: '§10.1 RAG',
      icon: <TrendingUp className="text-emerald-500" />,
    },
    {
      label: 'Base Model',
      value: loading ? '…' : `${avgBaseModel}%`,
      change: 'baseline',
      icon: <BarChart3 className="text-blue-500" />,
    },
    {
      label: 'Avg Mention Rate',
      value: loading ? '…' : `${totalMentionRate}%`,
      change: 'across LLMs',
      icon: <MessageSquare className="text-purple-500" />,
    },
    {
      label: 'Opportunity Gap',
      value: loading ? '…' : `${avgGap}pt`,
      change: 'actionable',
      icon: <ArrowUpRight className="text-amber-500" />,
    },
  ];

  return (
    <div className="space-y-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Your AI visibility performance at a glance.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => fetchAnalyses()}
            className="bg-white dark:bg-slate-900 rounded-xl font-bold h-11 border-slate-200 dark:border-white/10 dark:text-white gap-2 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
          <Link href="/dashboard/analysis">
            <Button className="bg-primary hover:bg-blue-600 text-white font-black rounded-xl h-11 px-8 shadow-xl shadow-primary/25 transition-all active:scale-95">
              <Plus className="h-4 w-4 mr-2 stroke-[3px]" />
              New Analysis
            </Button>
          </Link>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-semibold">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error} — <button onClick={() => fetchAnalyses()} className="underline decoration-2">retry</button>
        </div>
      )}

      {/* Stats Grid — §10.1 visibility breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <span className="flex items-center text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  {stat.change}
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-2">{stat.label}</p>
              <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick actions */}
        <div className="bg-white dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-8">Quick Actions</h3>
          <div className="space-y-4">
            {[
              { label: 'Keyword Discovery', desc: 'Find AI visibility gaps', href: '/dashboard/keywords', icon: '🔍', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
              { label: 'Content Validator', desc: 'Check RAG citability', href: '/dashboard/content', icon: '📝', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
              { label: 'Visibility Progress', desc: 'View trend over time', href: '/dashboard/progress', icon: '📈', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
              { label: 'Run Quick Analysis', desc: 'Full keyword discovery', href: '/dashboard/analysis', icon: '🚀', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
            ].map(item => (
              <Link key={item.label} href={item.href}
                className="flex items-center gap-4 p-5 rounded-[1.5rem] border border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-all group active:scale-[0.98]">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 ${item.color} group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white text-sm mb-0.5">{item.label}</p>
                  <p className="text-[11px] text-slate-500 font-medium truncate uppercase tracking-widest">{item.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Recent Analyses</h3>
            <Link href="/dashboard/reports">
              <Button variant="link" className="text-primary font-black p-0 h-auto hover:no-underline hover:text-blue-600">View all reports</Button>
            </Link>
          </div>

          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 rounded-3xl bg-slate-50 dark:bg-white/5 animate-pulse" />
              ))}
            </div>
          )}

          {!loading && recentAnalyses.length === 0 && (
            <div className="text-center py-16 px-8 bg-slate-50/50 dark:bg-black/20 rounded-[2rem] border border-dashed border-slate-200 dark:border-white/10">
              <div className="text-5xl mb-6">📊</div>
              <p className="font-black text-slate-900 dark:text-white text-lg mb-2">No analyses yet</p>
              <p className="text-sm text-slate-500 font-medium mb-8 max-w-xs mx-auto">Run your first keyword discovery to see visibility performance data here.</p>
              <Link href="/dashboard/keywords">
                <Button className="bg-primary hover:bg-blue-600 text-white font-black rounded-2xl h-12 px-8 shadow-lg shadow-primary/20">
                  Start Discovery
                </Button>
              </Link>
            </div>
          )}

          {!loading && recentAnalyses.length > 0 && (
            <div className="space-y-4">
              {recentAnalyses.map((analysis) => {
                const score = analysis.visibility_score ?? analysis.overall_score ?? 0;
                const typeColors: Record<string, string> = {
                  keyword_discovery: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
                  content_validation: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
                  progress_tracking: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
                  keyword_test: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
                };
                return (
                  <div key={analysis.id}
                    className="p-6 rounded-3xl border border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-all group cursor-pointer relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded-md border ${typeColors[analysis.analysis_type] ?? 'bg-slate-100 text-slate-500'}`}>
                          {analysis.analysis_type.replace(/_/g, ' ')}
                        </span>
                        <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded-md ${analysis.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                          {analysis.status}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(analysis.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="min-w-0">
                        <h4 className="text-lg font-black text-slate-900 dark:text-white mb-1 group-hover:text-primary transition-colors truncate">
                          {analysis.brand_name}
                        </h4>
                        <p className="text-xs text-slate-500 font-semibold truncate tracking-wide">{analysis.category}</p>
                      </div>
                      <div className="flex items-center gap-6 shrink-0 bg-white dark:bg-black/40 p-3 rounded-2xl border border-slate-100 dark:border-white/5">
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Visibility</p>
                          <div className="flex items-center gap-3">
                            <ScoreBar score={score} />
                            <span className="text-base font-black text-slate-900 dark:text-white">{score.toFixed(0)}%</span>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-primary transition-all group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && recentAnalyses.length > 0 && (
            <Link href="/dashboard/reports">
              <Button className="w-full mt-8 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 font-black py-7 rounded-3xl text-sm transition-all active:scale-[0.99]">
                View All Analysis Reports
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
