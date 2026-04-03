'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useGeoAnalyses } from '@/hooks/useGeo';
import { ScoreGauge } from '@/components/geo/ScoreGauge';
import { getGrade, getGradeColor } from '@/lib/report-types';
import type { StoredGeoAnalysis } from '@/lib/report-types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  TrendingUp, BarChart3, Search, FileText,
  Plus, RefreshCw, ArrowRight, AlertCircle, ChevronRight,
} from 'lucide-react';

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

// ── Stat card ────────────────────────────────────────────────────────────────
const STAT_META = [
  { key: 'total', label: 'Total Analyses', icon: BarChart3, iconClass: 'text-primary' },
  { key: 'latest', label: 'Latest Score', icon: TrendingUp, iconClass: 'text-emerald-500' },
  { key: 'average', label: 'Average Score', icon: BarChart3, iconClass: 'text-blue-500' },
  { key: 'best', label: 'Best Score', icon: ArrowRight, iconClass: 'text-amber-500' },
] as const;

// ── Quick actions ────────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { label: 'Run GEO Analysis', desc: 'Full visibility scan', href: '/dashboard/analysis', icon: BarChart3, color: 'text-primary bg-primary/10' },
  { label: 'Discover Keywords', desc: 'Find AI visibility gaps', href: '/dashboard/keywords', icon: Search, color: 'text-blue-500 bg-blue-500/10' },
  { label: 'Validate Content', desc: 'Check citability score', href: '/dashboard/content', icon: FileText, color: 'text-emerald-500 bg-emerald-500/10' },
];

// ── Analysis row ─────────────────────────────────────────────────────────────
function AnalysisRow({ analysis }: { analysis: StoredGeoAnalysis }) {
  const score = analysis.overall_score ?? 0;
  const grade = getGrade(score);
  const color = getGradeColor(grade);

  return (
    <Link
      href={`/dashboard/reports/${analysis.analysis_id || analysis.id}`}
      className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-accent transition-colors group"
    >
      <ScoreGauge score={score} size={48} showGrade={false} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
          {analysis.brand_name}
        </p>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {analysis.category}
        </p>
      </div>
      <Badge variant="outline" className="shrink-0 font-bold" style={{ color, borderColor: color }}>
        {grade}
      </Badge>
      <span className="text-xs text-muted-foreground shrink-0 w-16 text-right">
        {relTime(analysis.created_at)}
      </span>
      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
    </Link>
  );
}

// ── Skeleton row ─────────────────────────────────────────────────────────────
function SkeletonRow() {
  return <div className="h-16 rounded-lg bg-muted animate-pulse" />;
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { data: analyses, loading, error, fetchAnalyses } = useGeoAnalyses();

  useEffect(() => { fetchAnalyses(); }, [fetchAnalyses]);

  const stats = useMemo(() => {
    if (!analyses.length) return null;
    const scores = analyses.filter(a => a.overall_score).map(a => a.overall_score!);
    return {
      total: analyses.length,
      latest: scores[0] ?? null,
      average: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null,
      best: scores.length ? Math.max(...scores) : null,
    };
  }, [analyses]);

  const recentAnalyses = analyses.slice(0, 5);

  function statValue(key: (typeof STAT_META)[number]['key']) {
    if (loading) return '…';
    if (!stats) return '—';
    const v = stats[key];
    return v !== null ? String(Math.round(v)) : '—';
  }

  function statSub(key: (typeof STAT_META)[number]['key']) {
    if (key === 'total') return 'all time';
    if (!stats) return '';
    const v = stats[key];
    return v !== null ? `Grade ${getGrade(v)}` : '';
  }

  return (
    <div className="space-y-10">
      {/* ── Welcome header ───────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight mb-1">Dashboard</h1>
          <p className="text-muted-foreground text-sm font-medium">
            Your AI visibility performance at a glance.
          </p>
        </div>
        <Link href="/dashboard/analysis">
          <Button size="sm" className="rounded-lg font-semibold gap-2 shadow-sm">
            <Plus className="h-3.5 w-3.5" /> New Analysis
          </Button>
        </Link>
      </div>

      {/* ── Error state ──────────────────────────────────────────────── */}
      {error && (
        <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 flex items-center gap-3 text-destructive text-sm font-semibold">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={() => fetchAnalyses()} className="underline whitespace-nowrap">
            Retry
          </button>
        </div>
      )}

      {/* ── Stats row ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_META.map(({ key, label, icon: Icon, iconClass }) => (
          <div key={key} className="bg-card rounded-xl border border-border p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-muted">
                <Icon className={`h-5 w-5 ${iconClass}`} />
              </div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                {statSub(key)}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                {label}
              </p>
              <p className="text-3xl font-black text-foreground tracking-tight tabular-nums">
                {statValue(key)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Two-column body ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent analyses (8/12) */}
        <div className="lg:col-span-8 bg-card rounded-xl border border-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">Recent Analyses</h3>
            {recentAnalyses.length > 0 && (
              <Link href="/dashboard/reports" className="text-sm font-semibold text-primary hover:underline">
                View all
              </Link>
            )}
          </div>

          {loading && (
            <div className="space-y-3">
              {Array.from({ length: 3 }, (_, i) => <SkeletonRow key={i} />)}
            </div>
          )}

          {!loading && recentAnalyses.length === 0 && (
            <div className="text-center py-12 rounded-lg border border-dashed border-border">
              <p className="text-3xl mb-3">📊</p>
              <p className="font-bold text-foreground mb-1">No analyses yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Run your first GEO analysis to see results here.
              </p>
              <Link href="/dashboard/analysis">
                <Button size="sm" className="rounded-lg font-semibold">Start Analysis</Button>
              </Link>
            </div>
          )}

          {!loading && recentAnalyses.length > 0 && (
            <div className="space-y-2">
              {recentAnalyses.map(a => <AnalysisRow key={a.id} analysis={a} />)}
            </div>
          )}
        </div>

        {/* Quick actions (4/12) */}
        <div className="lg:col-span-4 bg-card rounded-xl border border-border p-6 space-y-4 h-fit">
          <h3 className="text-lg font-bold text-foreground">Quick Actions</h3>
          <div className="space-y-2">
            {QUICK_ACTIONS.map(item => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors group"
              >
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                  <item.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{item.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
              </Link>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full rounded-lg font-semibold gap-2 mt-2"
            onClick={() => fetchAnalyses()}
          >
            <RefreshCw className="h-3.5 w-3.5" /> Refresh Data
          </Button>
        </div>
      </div>
    </div>
  );
}
