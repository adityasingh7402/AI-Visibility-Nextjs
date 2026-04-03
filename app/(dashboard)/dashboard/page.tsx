'use client';

import { useEffect } from 'react';
import { useGeoAnalyses } from '@/hooks/useGeo';
import { TrendingUp, BarChart3, ArrowUpRight, Plus, ChevronRight, RefreshCw, AlertCircle, Search, FileText, Bolt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ScoreGauge } from '@/components/geo/ScoreGauge';
import { getGrade, getGradeColor } from '@/lib/report-types';

export default function DashboardPage() {
  const { data: analyses, loading, error, fetchAnalyses } = useGeoAnalyses();

  useEffect(() => {
    fetchAnalyses();
  }, [fetchAnalyses]);

  // Aggregate stats from GEO analyses
  const totalAnalyses = analyses.length;
  const avgScore = analyses.length > 0
    ? Math.round(analyses.reduce((sum, a) => sum + (a.overall_score ?? 0), 0) / analyses.length)
    : 0;

  // Best score
  const bestScore = analyses.length > 0
    ? Math.max(...analyses.map(a => a.overall_score ?? 0))
    : 0;

  // Latest score for trend
  const latestScore = analyses.length > 0 ? (analyses[0].overall_score ?? 0) : 0;

  const recentAnalyses = analyses.slice(0, 5);

  const stats = [
    {
      label: 'Total Analyses',
      value: loading ? '…' : totalAnalyses.toLocaleString(),
      sub: 'all time',
      icon: <BarChart3 className="h-5 w-5 text-primary" />,
    },
    {
      label: 'Latest Score',
      value: loading ? '…' : String(Math.round(latestScore)),
      sub: latestScore > 0 ? `Grade ${getGrade(latestScore)}` : '—',
      icon: <TrendingUp className="h-5 w-5 text-emerald-500" />,
    },
    {
      label: 'Average Score',
      value: loading ? '…' : String(avgScore),
      sub: avgScore > 0 ? `Grade ${getGrade(avgScore)}` : '—',
      icon: <BarChart3 className="h-5 w-5 text-blue-500" />,
    },
    {
      label: 'Best Score',
      value: loading ? '…' : String(Math.round(bestScore)),
      sub: bestScore > 0 ? `Grade ${getGrade(bestScore)}` : '—',
      icon: <ArrowUpRight className="h-5 w-5 text-amber-500" />,
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight mb-1">Dashboard</h1>
          <p className="text-muted-foreground text-sm font-medium">Your AI visibility performance at a glance.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => fetchAnalyses()} size="sm" className="rounded-lg font-semibold gap-2">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
          <Link href="/dashboard/analysis">
            <Button size="sm" className="rounded-lg font-semibold gap-2 shadow-sm">
              <Plus className="h-3.5 w-3.5" /> New Analysis
            </Button>
          </Link>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-3 flex items-center gap-3 text-destructive text-sm font-semibold">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error} — <button onClick={() => fetchAnalyses()} className="underline">retry</button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-muted">{stat.icon}</div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{stat.sub}</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-foreground tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <h3 className="text-lg font-bold text-foreground">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: 'Run GEO Analysis', desc: 'Full V1.9 visibility scan', href: '/dashboard/analysis', icon: Bolt, color: 'text-primary bg-primary/10' },
              { label: 'Keyword Discovery', desc: 'Find AI visibility gaps', href: '/dashboard/keywords', icon: Search, color: 'text-blue-500 bg-blue-500/10' },
              { label: 'Content Validator', desc: 'Check citability', href: '/dashboard/content', icon: FileText, color: 'text-emerald-500 bg-emerald-500/10' },
              { label: 'Visibility Trends', desc: 'View score over time', href: '/dashboard/progress', icon: TrendingUp, color: 'text-purple-500 bg-purple-500/10' },
            ].map(item => (
              <Link key={item.label} href={item.href}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors group">
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
        </div>

        {/* Recent Analyses */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">Recent Analyses</h3>
            <Link href="/dashboard/reports" className="text-sm font-semibold text-primary hover:underline">
              View all
            </Link>
          </div>

          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          )}

          {!loading && recentAnalyses.length === 0 && (
            <div className="text-center py-12 rounded-lg border border-dashed border-border">
              <p className="text-3xl mb-3">📊</p>
              <p className="font-bold text-foreground mb-1">No analyses yet</p>
              <p className="text-sm text-muted-foreground mb-4">Run your first GEO analysis to see results here.</p>
              <Link href="/dashboard/analysis">
                <Button size="sm" className="rounded-lg font-semibold">Start Analysis</Button>
              </Link>
            </div>
          )}

          {!loading && recentAnalyses.length > 0 && (
            <div className="space-y-2">
              {recentAnalyses.map((analysis) => {
                const score = analysis.overall_score ?? 0;
                const grade = getGrade(score);
                const color = getGradeColor(grade);
                return (
                  <Link
                    key={analysis.id}
                    href={`/dashboard/reports/${analysis.analysis_id || analysis.id}`}
                    className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-accent transition-colors group"
                  >
                    <ScoreGauge score={score} size={48} showGrade={false} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">
                        {analysis.brand_name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color }}>
                          Grade {grade}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {analysis.category}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          · {new Date(analysis.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xl font-black tabular-nums" style={{ color }}>
                        {Math.round(score)}
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
