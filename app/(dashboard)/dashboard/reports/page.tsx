'use client';

import { useEffect, useState } from 'react';
import { useAnalyses } from '@/hooks/useGeo';
import type { Analysis } from '@/lib/geo-types';
import { BarChart3, FileText, Search, Filter, ArrowRight, Clock, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

const TYPE_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  keyword_discovery: { label: 'Keyword Discovery', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', icon: '🔍' },
  keyword_test: { label: 'Keyword Test', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20', icon: '🧪' },
  content_validation: { label: 'Content Validator', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: '📝' },
  progress_tracking: { label: 'Progress Tracking', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', icon: '📈' },
};

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null || score === undefined) return <span className="text-slate-500 text-xs">—</span>;
  const grade = score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D';
  const color = score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-amber-400' : 'text-red-400';
  return (
    <span className={`font-black text-lg ${color}`}>
      {score.toFixed(0)}<span className="text-xs ml-0.5 opacity-60">/100</span>
    </span>
  );
}

function AnalysisRow({ analysis }: { analysis: Analysis }) {
  const type = TYPE_LABELS[analysis.analysis_type] ?? { label: analysis.analysis_type, color: 'text-slate-400 bg-white/5 border-white/10', icon: '📊' };
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
    <div className="flex items-center gap-4 p-5 rounded-2xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 transition-all group cursor-pointer">
      <div className="text-2xl w-10 flex-shrink-0 text-center">{type.icon}</div>

      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${type.color}`}>
            {type.label}
          </span>
          {analysis.status === 'completed' && (
            <span className="text-[10px] text-emerald-400 font-bold">✓ Done</span>
          )}
          {analysis.status === 'failed' && (
            <span className="text-[10px] text-red-400 font-bold">✗ Failed</span>
          )}
        </div>
        <p className="font-bold text-white truncate">{analysis.brand_name}</p>
        <p className="text-xs text-slate-500">{analysis.category}</p>
      </div>

      <div className="text-center flex-shrink-0">
        <ScoreBadge score={analysis.visibility_score ?? analysis.overall_score} />
        <p className="text-[10px] text-slate-500 mt-0.5">visibility</p>
      </div>

      {analysis.mention_rate != null && (
        <div className="text-center flex-shrink-0">
          <span className="font-black text-lg text-white">{(analysis.mention_rate * 100).toFixed(0)}%</span>
          <p className="text-[10px] text-slate-500 mt-0.5">mention rate</p>
        </div>
      )}

      <div className="text-right flex-shrink-0">
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Clock className="h-3 w-3" />
          {relativeTime}
        </div>
        {analysis.processing_time_seconds && (
          <p className="text-[10px] text-slate-600 mt-0.5">{analysis.processing_time_seconds}s runtime</p>
        )}
      </div>

      <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all flex-shrink-0" />
    </div>
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Analysis Reports</h1>
          <p className="text-slate-400 mt-1">All your past GEO analyses in one place.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/keywords"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all">
            + New Discovery
          </Link>
          <button onClick={() => fetchAnalyses()}
            className="p-2.5 rounded-xl border border-white/10 hover:border-white/20 text-slate-400 hover:text-white transition-all">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Analyses', value: totalAnalyses, icon: <BarChart3 className="h-5 w-5 text-blue-400" /> },
          { label: 'Avg Visibility Score', value: avgScore, icon: <TrendingUp className="h-5 w-5 text-emerald-400" /> },
          { label: 'Completed', value: analyses.filter(a => a.status === 'completed').length, icon: <FileText className="h-5 w-5 text-purple-400" /> },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/5 border border-white/5 rounded-2xl p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-black text-white">{stat.value}</p>
              <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by brand or category…"
            className="pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all w-72"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all appearance-none cursor-pointer"
          >
            <option value="">All types</option>
            {Object.entries(TYPE_LABELS).map(([value, { label }]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 rounded-2xl bg-white/5 border border-white/5 animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-6 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-red-400">Failed to load reports</p>
            <p className="text-sm text-red-400/70 mt-1">{error}</p>
            <button onClick={() => fetchAnalyses()} className="mt-3 text-xs text-red-400 underline">Try again</button>
          </div>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="rounded-2xl border border-white/5 bg-white/5 p-16 text-center">
          <p className="text-4xl mb-4">🔍</p>
          <p className="font-bold text-white text-lg mb-2">No analyses yet</p>
          <p className="text-slate-500 text-sm mb-6">Run your first keyword discovery to see results here.</p>
          <Link href="/dashboard/keywords"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-all">
            Start Keyword Discovery <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map(analysis => (
            <AnalysisRow key={analysis.id} analysis={analysis} />
          ))}
          <p className="text-center text-xs text-slate-600 pt-4">
            Showing {filtered.length} of {totalAnalyses} analyses
          </p>
        </div>
      )}
    </div>
  );
}
