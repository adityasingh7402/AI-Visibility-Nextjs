'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useGeoAnalyses } from '@/hooks/useGeo';
import { useBrands } from '@/hooks/useBrands';
import { ScoreGauge } from '@/components/geo/ScoreGauge';
import { TrendChart } from '@/components/geo/TrendChart';
import { getMaturityLevel, getPublicReportLabel, getPublicReportVariant, type ReportVariant } from '@/lib/report-v2-types';
import type { StoredGeoAnalysis } from '@/lib/report-types';
import type { Brand } from '@/lib/brands-api';
import type { VisibilityTrend } from '@/lib/geo-types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WelcomeState } from '@/components/ui/error-states';
import {
  TrendingUp, BarChart3, Search, FileText,
  Plus, RefreshCw, ArrowRight, AlertCircle, ChevronRight, Building2,
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
  { label: 'AEO Scan', desc: 'Run the focused 5-node AI visibility workflow', href: '/dashboard/analysis?analysis_type=aeo_scan', icon: Search, color: 'text-emerald-600 bg-emerald-500/10' },
  { label: 'GEO Audit', desc: 'Launch the full 17-dimension GEO workflow', href: '/dashboard/analysis?analysis_type=full', icon: BarChart3, color: 'text-blue-500 bg-blue-500/10' },
  { label: 'Content Lab', desc: 'Validate & enhance content', href: '/dashboard/content', icon: FileText, color: 'text-emerald-500 bg-emerald-500/10' },
];

const ANALYSIS_VARIANT_BADGES: Record<ReportVariant, string> = {
  geo: 'text-blue-600 bg-blue-500/10 border-blue-500/20',
  aeo: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20',
  combined: 'text-cyan-700 bg-cyan-500/10 border-cyan-500/20',
  keywords: 'text-violet-600 bg-violet-500/10 border-violet-500/20',
  content: 'text-amber-600 bg-amber-500/10 border-amber-500/20',
};

function resolveAnalysisVariant(analysis: StoredGeoAnalysis): ReportVariant {
  if (analysis.variant) return analysis.variant;
  if (analysis.report_type === 'aeo_scan') return 'aeo';
  if (analysis.report_type === 'combined_analysis') return 'combined';
  return 'geo';
}

// ── Analysis row ─────────────────────────────────────────────────────────────
function AnalysisRow({ analysis }: { analysis: StoredGeoAnalysis }) {
  const score = analysis.overall_score ?? 0;
  const maturity = getMaturityLevel(score);
  const color = maturity.color;
  const variant = getPublicReportVariant(resolveAnalysisVariant(analysis));

  return (
    <Link
      href={`/dashboard/reports/${analysis.analysis_id || analysis.id}`}
      className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-accent transition-colors group"
    >
      <ScoreGauge score={score} size={48} showMaturity={false} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
          {analysis.brand_name}
        </p>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="truncate">{analysis.category}</span>
          <Badge variant="outline" className={`hidden sm:inline-flex text-[10px] font-bold ${ANALYSIS_VARIANT_BADGES[variant]}`}>
            {getPublicReportLabel(variant)}
          </Badge>
        </div>
      </div>
      <Badge variant="outline" className="shrink-0 font-bold" style={{ color, borderColor: color }}>
        {maturity.label}
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

// ── Brand card ───────────────────────────────────────────────────────────────
function BrandCard({ brand, latestScore }: { brand: Brand; latestScore: number | null }) {
  const score = latestScore ?? 0;
  const maturity = getMaturityLevel(score);

  return (
    <Link
      href={`/dashboard/reports?brand=${encodeURIComponent(brand.brand_name)}`}
      className="rounded-xl border border-border bg-card p-4 hover:bg-accent/50 transition-colors group"
    >
      <div className="flex items-start gap-3">
        <ScoreGauge score={score} size={52} showMaturity={false} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
            {brand.brand_name}
          </p>
          <p className="text-xs text-muted-foreground truncate">{brand.category || 'Uncategorized'}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-bold" style={{ color: maturity.color, borderColor: maturity.color }}>
              {maturity.icon} {maturity.label}
            </Badge>
            {brand.region && (
              <span className="text-[10px] text-muted-foreground">{brand.region}</span>
            )}
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0 mt-1" />
      </div>
    </Link>
  );
}

// ── Trend section (shows when analyses have trend data) ─────────────────────
function TrendSection({ analyses }: { analyses: StoredGeoAnalysis[] }) {
  // Build a minimal VisibilityTrend from analyses for the overview chart
  const trend = useMemo<VisibilityTrend | null>(() => {
    const scored = analyses
      .filter(a => a.overall_score != null && a.created_at)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    if (scored.length < 2) return null;

    const data_points = scored.map(a => ({
      timestamp: a.created_at,
      overall_visibility: a.overall_score ?? 0,
      base_model_visibility: 0,
      rag_model_visibility: 0,
    }));

    const first = data_points[0].overall_visibility;
    const last = data_points[data_points.length - 1].overall_visibility;
    const change = last - first;

    return {
      brand_name: 'All Brands',
      category: '',
      data_points,
      total_snapshots: data_points.length,
      overall_change: change,
      trend_direction: change > 2 ? 'improving' : change < -2 ? 'declining' : 'stable',
    };
  }, [analyses]);

  if (!trend) return null;

  return (
    <div className="glass-card rounded-2xl p-6 space-y-4 hover:-translate-y-1 transition-transform duration-300">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Visibility Trend
        </h3>
        <Badge variant="outline" className="text-xs">
          {trend.total_snapshots} data points
        </Badge>
      </div>
      <TrendChart trend={trend} />
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { data: analyses, loading, error, fetchAnalyses } = useGeoAnalyses();
  const { brands, loading: brandsLoading, fetchBrands } = useBrands();

  useEffect(() => { fetchAnalyses(); fetchBrands(); }, [fetchAnalyses, fetchBrands]);

  const comparableAnalyses = useMemo(() => {
    const nonAeoAnalyses = analyses.filter(analysis => resolveAnalysisVariant(analysis) !== 'aeo');
    return nonAeoAnalyses.length > 0 ? nonAeoAnalyses : analyses;
  }, [analyses]);

  const stats = useMemo(() => {
    if (!comparableAnalyses.length) return null;
    const scores = comparableAnalyses.filter(a => a.overall_score).map(a => a.overall_score!);
    return {
      total: comparableAnalyses.length,
      latest: scores[0] ?? null,
      average: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null,
      best: scores.length ? Math.max(...scores) : null,
    };
  }, [comparableAnalyses]);

  // Build latest score per brand (from analyses)
  const brandScoreMap = useMemo(() => {
    const map: Record<string, number | null> = {};
    for (const brand of brands) {
      const match = comparableAnalyses.find(a =>
        a.brand_name?.toLowerCase() === brand.brand_name.toLowerCase()
      );
      map[brand.id] = match?.overall_score ?? null;
    }
    return map;
  }, [brands, comparableAnalyses]);

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
    return v !== null ? `${getMaturityLevel(v).label}` : '';
  }

  // First-time user: show welcome state
  if (!loading && !brandsLoading && analyses.length === 0 && brands.length === 0) {
    return <WelcomeState />;
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
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {STAT_META.map(({ key, label, icon: Icon, iconClass }) => (
          <div key={key} className="glass-card rounded-2xl p-6 space-y-4 hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Icon className={`h-[22px] w-[22px] ${iconClass}`} />
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

      {/* ── Brand Tracking Cards ─────────────────────────────────────── */}
      {!brandsLoading && brands.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Tracked Brands
            </h3>
            <Link href="/dashboard/brands" className="text-sm font-semibold text-primary hover:underline">
              Manage
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {brands.slice(0, 6).map(brand => (
              <BrandCard
                key={brand.id}
                brand={brand}
                latestScore={brandScoreMap[brand.id]}
              />
            ))}
          </div>
        </div>
      )}

      {!brandsLoading && brands.length === 0 && !loading && analyses.length > 0 && (
        <div className="glass-card rounded-2xl p-6 flex flex-col items-center justify-center gap-4 text-center">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <div className="max-w-md">
            <p className="font-bold text-foreground text-lg mb-1">Track your brands</p>
            <p className="text-sm text-muted-foreground mb-4">
              Add brands to monitor their AI visibility over time with trend tracking and compare performance.
            </p>
            <Link href="/dashboard/brands">
              <Button size="sm" className="rounded-lg font-semibold gap-1.5">
                <Plus className="h-4 w-4" /> Add Brand
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* ── Visibility Trend ──────────────────────────────────────────── */}
      <TrendSection analyses={comparableAnalyses} />

      {/* ── Two-column body ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent analyses (8/12) */}
        <div className="lg:col-span-8 glass-card rounded-2xl p-6 space-y-4">
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
            <div className="text-center py-16 rounded-xl border border-dashed border-border/50 bg-muted/20">
              <p className="text-4xl mb-4">📊</p>
              <p className="font-bold text-foreground mb-2 text-lg">No analyses yet</p>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                Run your first AEO or GEO analysis to evaluate your brand&apos;s standing across AI assistants.
              </p>
              <Link href="/dashboard/analysis">
                <Button className="rounded-lg font-semibold shadow-sm hover:-translate-y-0.5 transition-transform">
                  Start Analysis
                </Button>
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
        <div className="lg:col-span-4 glass-card rounded-2xl p-6 space-y-4 h-fit">
          <h3 className="text-lg font-bold text-foreground">Quick Actions</h3>
          <div className="space-y-2">
            {QUICK_ACTIONS.map(item => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 p-3 rounded-xl border border-transparent bg-muted/50 hover:bg-card hover:border-border/60 hover:shadow-sm transition-all duration-300 group"
              >
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-foreground">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground truncate font-medium mt-0.5">{item.desc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 translate-x-0 group-hover:translate-x-1 duration-300" />
              </Link>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full rounded-xl font-semibold gap-2 mt-4 py-5 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
            onClick={() => { fetchAnalyses(); fetchBrands(); }}
          >
            <RefreshCw className="h-4 w-4" /> Refresh Data
          </Button>
        </div>
      </div>
    </div>
  );
}
