'use client';

import { useEffect } from 'react';
import { useAnalyses } from '@/hooks/useGeo';
import { TrendingUp, BarChart3, MessageSquare, ArrowUpRight, Plus, MoreHorizontal, ChevronRight, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TrendChart } from '@/components/geo/TrendChart';
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
  const avgScore = analyses.length > 0
    ? Math.round(analyses.reduce((sum, a) => sum + (a.visibility_score ?? a.overall_score ?? 0), 0) / analyses.length)
    : 0;
  const totalMentionRate = analyses.length > 0
    ? (analyses.reduce((sum, a) => sum + (a.mention_rate ?? 0), 0) / analyses.length * 100).toFixed(0)
    : '0';

  const recentAnalyses = analyses.slice(0, 5);

  const stats = [
    {
      label: 'Total Analyses',
      value: loading ? '…' : totalAnalyses.toLocaleString(),
      change: '+New',
      icon: <BarChart3 className="text-primary" />,
    },
    {
      label: 'Avg Visibility Score',
      value: loading ? '…' : `${avgScore}%`,
      change: 'GEO score',
      icon: <TrendingUp className="text-emerald-500" />,
    },
    {
      label: 'Avg Mention Rate',
      value: loading ? '…' : `${totalMentionRate}%`,
      change: 'across LLMs',
      icon: <MessageSquare className="text-blue-500" />,
    },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">GEO Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Your AI visibility performance overview.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => fetchAnalyses()}
            className="bg-white dark:bg-slate-900 rounded-xl font-bold h-11 border-slate-200 dark:border-white/5 dark:text-white gap-2">
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
          <Link href="/dashboard/analysis">
            <Button className="bg-primary hover:bg-blue-600 text-white font-bold rounded-xl h-11 px-6 shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4 mr-2" />
              New Analysis
            </Button>
          </Link>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 flex items-center gap-3 text-red-400 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error} — <button onClick={() => fetchAnalyses()} className="underline">retry</button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="bg-slate-50 dark:bg-black/20 p-3 rounded-2xl">
                {stat.icon}
              </div>
              <span className="flex items-center text-xs font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
                <ArrowUpRight className="h-3 w-3 mr-0.5" />
                {stat.change}
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-4xl font-black text-slate-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick actions */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Quick Actions</h3>
          <div className="space-y-3">
            {[
              { label: 'Keyword Discovery', desc: 'Find AI visibility gaps', href: '/dashboard/keywords', icon: '🔍', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
              { label: 'Content Validator', desc: 'Check RAG citability', href: '/dashboard/content', icon: '📝', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
              { label: 'Visibility Progress', desc: 'View trend over time', href: '/dashboard/progress', icon: '📈', color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
              { label: 'Run Quick Analysis', desc: 'Full keyword discovery', href: '/dashboard/analysis', icon: '🚀', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
            ].map(item => (
              <Link key={item.label} href={item.href}
                className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${item.color}`}>
                  {item.icon}
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{item.label}</p>
                  <p className="text-xs text-slate-500 truncate">{item.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-white/5 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Analyses</h3>
            <Link href="/dashboard/reports">
              <Button variant="link" className="text-primary font-bold p-0 h-auto">View all</Button>
            </Link>
          </div>

          {loading && (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 rounded-2xl bg-slate-50 dark:bg-white/5 animate-pulse" />
              ))}
            </div>
          )}

          {!loading && recentAnalyses.length === 0 && (
            <div className="text-center py-10">
              <p className="text-4xl mb-3">📊</p>
              <p className="font-bold text-slate-900 dark:text-white mb-1">No analyses yet</p>
              <p className="text-sm text-slate-500 mb-4">Run your first keyword discovery to see data here.</p>
              <Link href="/dashboard/keywords">
                <Button className="bg-primary text-white font-bold rounded-xl">Start Discovery</Button>
              </Link>
            </div>
          )}

          {!loading && recentAnalyses.length > 0 && (
            <div className="space-y-3">
              {recentAnalyses.map((analysis) => {
                const score = analysis.visibility_score ?? analysis.overall_score ?? 0;
                const typeColors: Record<string, string> = {
                  keyword_discovery: 'bg-blue-500/10 text-blue-500',
                  content_validation: 'bg-emerald-500/10 text-emerald-500',
                  progress_tracking: 'bg-purple-500/10 text-purple-500',
                  keyword_test: 'bg-amber-500/10 text-amber-500',
                };
                return (
                  <div key={analysis.id}
                    className="p-4 rounded-2xl border border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md ${typeColors[analysis.analysis_type] ?? 'bg-slate-100 text-slate-500'}`}>
                        {analysis.analysis_type.replace(/_/g, ' ')}
                      </span>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md ${analysis.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'}`}>
                        {analysis.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                      {analysis.brand_name} — {analysis.category}
                    </h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ScoreBar score={score} />
                        <span className="text-xs font-bold text-slate-700 dark:text-white">{score.toFixed(0)}%</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-primary transition-all group-hover:translate-x-1" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && recentAnalyses.length > 0 && (
            <Link href="/dashboard/reports">
              <Button className="w-full mt-6 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 font-bold py-6 rounded-2xl">
                View All Reports
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
