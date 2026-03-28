'use client';

import { useEffect, useState } from 'react';
import { useAnalyses } from '@/hooks/useGeo';
import type { Analysis } from '@/lib/geo-types';
import { BarChart3, FileText, Search, Filter, ArrowRight, Clock, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const TYPE_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  keyword_discovery: { label: 'Discovery', color: 'text-primary bg-primary/10 border-primary/20', icon: '🔍' },
  keyword_test: { label: 'Testing', color: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20', icon: '🧪' },
  content_validation: { label: 'Validation', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: '📝' },
  progress_tracking: { label: 'Tracking', color: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20', icon: '📈' },
};

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null || score === undefined) return <span className="text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-widest">No Data</span>;
  const color = score >= 80 ? 'text-emerald-600 dark:text-emerald-400' : score >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400';
  return (
    <div className="text-right">
      <p className={`font-black text-2xl tracking-tighter ${color}`}>
        {Math.round(score)}<span className="text-[10px] ml-0.5 opacity-50 uppercase tracking-widest">%</span>
      </p>
    </div>
  );
}

function AnalysisRow({ analysis }: { analysis: Analysis }) {
  const type = TYPE_LABELS[analysis.analysis_type] ?? { label: analysis.analysis_type, color: 'text-slate-500 bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10', icon: '📊' };
  const date = new Date(analysis.created_at);
  const relativeTime = (() => {
    const diff = Date.now() - date.getTime();
    const min = Math.floor(diff / 60000);
    if (min < 60) return `${min}m ago`;
    const hrs = Math.floor(min / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return date.toLocaleDateString();
  })();

  return (
    <Link href={`/dashboard/analysis?id=${analysis.id}`} className="block group">
      <div className="flex flex-col sm:flex-row sm:items-center gap-6 p-6 rounded-[2rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-white/[0.03] hover:border-primary/30 dark:hover:border-primary/20 transition-all shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-black/20 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
          {type.icon}
        </div>

        <div className="flex-grow min-w-0 space-y-1">
          <div className="flex items-center gap-3">
            <span className={`text-[10px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-lg border ${type.color}`}>
              {type.label}
            </span>
            <span className={`text-[10px] font-black uppercase tracking-widest ${analysis.status === 'completed' ? 'text-emerald-500' : analysis.status === 'failed' ? 'text-red-500' : 'text-amber-500'}`}>
              • {analysis.status}
            </span>
          </div>
          <h3 className="font-black text-lg text-slate-900 dark:text-white truncate tracking-tight">{analysis.brand_name}</h3>
          <p className="text-xs text-slate-500 font-medium truncate">{analysis.category}</p>
        </div>

        <div className="flex items-center gap-8 sm:gap-12 flex-shrink-0">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Visibility</p>
            <ScoreBadge score={analysis.visibility_score ?? analysis.overall_score} />
          </div>

          {analysis.mention_rate != null && (
            <div className="space-y-1 hidden md:block">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Mentions</p>
              <p className="font-black text-2xl text-slate-900 dark:text-white tracking-tighter text-right">
                {(analysis.mention_rate * 100).toFixed(0)}<span className="text-[10px] ml-0.5 opacity-50 uppercase tracking-widest">%</span>
              </p>
            </div>
          )}

          <div className="text-right flex-shrink-0 space-y-1">
            <div className="flex items-center justify-end gap-1.5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              <Clock className="h-3 w-3" />
              {relativeTime}
            </div>
            <div className="flex items-center justify-end gap-2">
              {analysis.processing_time_seconds && (
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600">{analysis.processing_time_seconds}s</p>
              )}
              <ArrowRight className="h-5 w-5 text-slate-300 dark:text-slate-700 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function ReportsPage() {
  const { data: analyses, loading, error, fetchAnalyses } = useAnalyses();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    fetchAnalyses();
  }, [fetchAnalyses]);

  const filtered = analyses.filter(a => {
    const matchesSearch = !searchTerm ||
      a.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || a.analysis_type === filterType;
    return matchesSearch && matchesType;
  });

  const totalAnalyses = analyses.length;
  const avgScore = analyses.length > 0
    ? (analyses.reduce((sum, a) => sum + (a.visibility_score ?? a.overall_score ?? 0), 0) / analyses.length).toFixed(1)
    : '—';

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">Analysis Reports</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium tracking-tight">Access and export your complete GEO analysis history.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => fetchAnalyses()} variant="outline" size="icon"
            className="rounded-2xl border-slate-200 dark:border-white/10 dark:text-white hover:bg-slate-50 dark:hover:bg-white/5 h-12 w-12 transition-all active:rotate-180 duration-500">
            <RefreshCw className="h-5 w-5" />
          </Button>
          <Link href="/dashboard/keywords" className="block">
            <Button className="rounded-2xl bg-primary hover:bg-blue-600 text-white font-black px-6 h-12 shadow-lg shadow-primary/20 flex items-center gap-2">
              <span className="text-lg">+</span> New Discovery
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Reports', value: totalAnalyses, icon: <BarChart3 className="h-6 w-6 text-primary" />, bg: 'bg-primary/5' },
          { label: 'Avg Visibility', value: analyses.length > 0 ? `${avgScore}%` : '—', icon: <TrendingUp className="h-6 w-6 text-emerald-500" />, bg: 'bg-emerald-500/5' },
          { label: 'Processing', value: analyses.filter(a => a.status !== 'completed' && a.status !== 'failed').length, icon: <Clock className="h-6 w-6 text-purple-500" />, bg: 'bg-purple-500/5' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-[2rem] p-6 flex items-center gap-5 shadow-sm group hover:border-primary/20 transition-all">
            <div className={`h-14 w-14 rounded-2xl ${stat.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-1">{stat.value}</p>
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-slate-100/50 dark:bg-black/20 p-2 rounded-[2rem] border border-slate-200 dark:border-white/5">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-600" />
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search brand or category…"
            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="relative w-full sm:w-64">
          <Filter className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-600 pointer-events-none" />
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="w-full pl-12 pr-10 py-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/5 text-sm font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
          >
            <option value="">All Types</option>
            {Object.entries(TYPE_LABELS).map(([value, { label }]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
            <ArrowRight className="h-4 w-4 text-slate-400 rotate-90" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-28 rounded-[2rem] bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-[2.5rem] bg-red-500/5 border border-red-500/10 dark:bg-red-500/10 dark:border-red-500/20 p-10 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <div>
              <p className="font-black text-xl text-red-600 dark:text-red-400 uppercase tracking-tighter">Sync Error</p>
              <p className="text-sm text-red-600/70 dark:text-red-400/60 font-medium mt-1 max-w-sm mx-auto">{error}</p>
              <Button onClick={() => fetchAnalyses()} variant="outline" className="mt-6 rounded-xl border-red-500/20 text-red-500 hover:bg-red-500/10 font-black uppercase tracking-widest text-[10px] h-10">
                Retry Connection
              </Button>
            </div>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-white/10 p-20 text-center bg-slate-50/50 dark:bg-transparent">
            <div className="w-20 h-20 rounded-[2.5rem] bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🔍</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">No reports matched</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto leading-relaxed mb-8">
              {searchTerm || filterType ? "Try adjusting your filters to find the specific report you're looking for." : "You haven't run any analyses yet. Start your first GEO discovery to generate your initial report."}
            </p>
            {!(searchTerm || filterType) && (
              <Link href="/dashboard/keywords">
                <Button className="rounded-2xl bg-primary hover:bg-blue-600 text-white font-black px-8 h-14 shadow-xl shadow-primary/20 flex items-center gap-3 mx-auto">
                  Run Initial Discovery <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-6 mb-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Showing {filtered.length} Reports</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Latest First</p>
            </div>
            <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
              {filtered.map(analysis => (
                <AnalysisRow key={analysis.id} analysis={analysis} />
              ))}
            </div>
            <div className="pt-8 pb-4 text-center">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em]">End of Archive</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
