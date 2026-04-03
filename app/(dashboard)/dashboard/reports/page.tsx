'use client';

import { useEffect, useState, useMemo } from 'react';
import { useGeoAnalyses } from '@/hooks/useGeo';
import type { StoredGeoAnalysis } from '@/lib/report-types';
import { getGrade, getGradeColor } from '@/lib/report-types';
import { ScoreGauge } from '@/components/geo/ScoreGauge';
import { BarChart3, Search, Filter, ArrowRight, Clock, TrendingUp, AlertCircle, RefreshCw, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function relTime(dateStr: string): string {
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

function AnalysisRow({ analysis }: { analysis: StoredGeoAnalysis }) {
  const score = analysis.overall_score ?? 0;
  const grade = getGrade(score);
  const color = getGradeColor(grade);

  return (
    <Link
      href={`/dashboard/reports/${analysis.analysis_id || analysis.id}`}
      className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-accent transition-colors group"
    >
      <ScoreGauge score={score} size={52} showGrade={false} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
          {analysis.brand_name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color }}>
            Grade {grade}
          </span>
          <span className="text-[10px] text-muted-foreground">{analysis.category}</span>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${
            analysis.status === 'completed' ? 'text-emerald-500' : analysis.status === 'failed' ? 'text-destructive' : 'text-amber-500'
          }`}>
            · {analysis.status}
          </span>
        </div>
      </div>
      <div className="text-right shrink-0 space-y-0.5">
        <p className="text-xl font-black tabular-nums" style={{ color }}>{Math.round(score)}</p>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground justify-end">
          <Clock className="h-3 w-3" />
          {relTime(analysis.created_at)}
        </div>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
    </Link>
  );
}

export default function ReportsPage() {
  const { data: analyses, loading, error, fetchAnalyses } = useGeoAnalyses();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchAnalyses();
  }, [fetchAnalyses]);

  const filtered = useMemo(() => analyses.filter(a => {
    const matchesSearch = !searchTerm ||
      a.brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !filterStatus || a.status === filterStatus;
    return matchesSearch && matchesStatus;
  }), [analyses, searchTerm, filterStatus]);

  const avgScore = analyses.length > 0
    ? Math.round(analyses.reduce((sum, a) => sum + (a.overall_score ?? 0), 0) / analyses.length)
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight mb-1">Reports</h1>
          <p className="text-sm text-muted-foreground">Your GEO analysis history.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => fetchAnalyses()} variant="outline" size="sm" className="rounded-lg gap-2 font-semibold">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
          <Link href="/dashboard/analysis">
            <Button size="sm" className="rounded-lg gap-2 font-semibold shadow-sm">
              <Plus className="h-3.5 w-3.5" /> New Analysis
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total', value: analyses.length, icon: <BarChart3 className="h-4 w-4 text-primary" /> },
          { label: 'Avg Score', value: avgScore || '—', icon: <TrendingUp className="h-4 w-4 text-emerald-500" /> },
          { label: 'Processing', value: analyses.filter(a => a.status !== 'completed' && a.status !== 'failed').length, icon: <Clock className="h-4 w-4 text-amber-500" /> },
        ].map(s => (
          <div key={s.label} className="bg-card rounded-xl border border-border p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">{s.icon}</div>
            <div>
              <p className="text-xl font-black text-foreground">{s.value}</p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search brand or category..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-card border border-border text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="relative w-full sm:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <select
            aria-label="Filter by status"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-card border border-border text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="processing">Processing</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-6 text-center space-y-3">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
          <p className="text-sm font-semibold text-destructive">{error}</p>
          <Button onClick={() => fetchAnalyses()} variant="outline" size="sm" className="rounded-lg">Retry</Button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-16 rounded-xl border border-dashed border-border">
          <p className="text-3xl mb-3">📊</p>
          <p className="font-bold text-foreground mb-1">
            {searchTerm || filterStatus ? 'No reports matched' : 'No reports yet'}
          </p>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
            {searchTerm || filterStatus
              ? 'Try adjusting your filters.'
              : 'Run your first GEO analysis to generate a report.'}
          </p>
          {!(searchTerm || filterStatus) && (
            <Link href="/dashboard/analysis">
              <Button size="sm" className="rounded-lg font-semibold">Run Analysis</Button>
            </Link>
          )}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-1">
            Showing {filtered.length} report{filtered.length !== 1 ? 's' : ''} · Latest first
          </p>
          {filtered.map(analysis => (
            <AnalysisRow key={analysis.id} analysis={analysis} />
          ))}
        </div>
      )}
    </div>
  );
}