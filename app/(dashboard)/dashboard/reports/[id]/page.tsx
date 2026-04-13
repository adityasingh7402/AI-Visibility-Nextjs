'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { geoApi } from '@/lib/geo-api';
import { ScoreGauge } from '@/components/geo/ScoreGauge';
import { ScoreCard } from '@/components/geo/ScoreCard';
import { ReportHero } from '@/components/geo/ReportHero';
import { DimensionRadar } from '@/components/geo/DimensionRadar';
import { ClusterBreakdown } from '@/components/geo/DimensionCards';
import { LLMBreakdownTable } from '@/components/geo/LLMBreakdownTable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Download } from 'lucide-react';
import { MarkdownReportViewer } from '@/components/dashboard/MarkdownReportViewer';
import { ReportDetailSkeleton } from '@/components/ui/report-skeleton';
import { ErrorState, ReportNotFoundState } from '@/components/ui/error-states';
import { ScoreBreakdownGrid } from '@/components/geo/ScoreBreakdownGrid';
import { ProviderModelMatrix } from '@/components/geo/ProviderModelMatrix';
import { CompetitorBattleCards } from '@/components/geo/CompetitorBattleCards';
import { EvidenceTranscripts } from '@/components/geo/EvidenceTranscripts';
import { ImprovementRoadmap } from '@/components/geo/ImprovementRoadmap';
import type { StructuredReport, ReportTab } from '@/lib/report-v2-types';
import { REPORT_TABS, getMaturityLevel } from '@/lib/report-v2-types';
import { scoresToSubScores, normalizeCompetitors } from '@/lib/report-adapters';
import { V19_DIMENSIONS } from '@/lib/report-types';

// --- Helpers for safe raw_payload access ---
function safeArray(obj: Record<string, unknown> | null | undefined, key: string): Record<string, unknown>[] {
  const val = obj?.[key];
  return Array.isArray(val) ? (val as Record<string, unknown>[]) : [];
}

function safeString(obj: Record<string, unknown> | null | undefined, key: string): string | undefined {
  const val = obj?.[key];
  return typeof val === 'string' ? val : undefined;
}

// --- Fallback raw report type (for keywords/content or when /full fails) ---
interface RawReport {
  _type: 'geo' | 'keywords' | 'content';
  id: string;
  report_type?: string;
  brand_name?: string;
  category?: string;
  created_at?: string;
  status?: string;
  overall_score?: number;
  grade?: string;
  scan_mode?: string;
  markdown_report?: string | null;
  response_payload?: Record<string, unknown>;
  request_payload?: Record<string, unknown>;
}

// ── GEO V2 Tab: Overview ──
function OverviewTab({ report }: { report: StructuredReport }) {
  const scores = report.scores ?? [];
  const subScores = scoresToSubScores(scores);
  const summary = report.executive_summary;

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      {summary && (
        <Card>
          <CardHeader>
            <CardTitle>Executive Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">{summary}</p>
          </CardContent>
        </Card>
      )}

      {/* Radar + Cluster Breakdown side-by-side */}
      {subScores && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Dimension Radar</CardTitle>
              <CardDescription>17-dimension V1.9 visibility profile</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <DimensionRadar scores={subScores} size={320} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cluster Breakdown</CardTitle>
              <CardDescription>Scores grouped by 7 weighted clusters</CardDescription>
            </CardHeader>
            <CardContent>
              <ClusterBreakdown scores={subScores} />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Score Breakdown Grid (V1.9 clusters) */}
      <div className="mt-8">
        <ScoreBreakdownGrid rawPayload={report.raw_payload} />
      </div>

      {/* Fallback: ScoreCard grid when no sub_scores available and no V1.9 clusters rendered */}
      {!subScores && scores.length > 0 && !report.raw_payload?.visibility_score_v19 && (
        <Card>
          <CardHeader>
            <CardTitle>Score Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {scores.map(s => {
                const dimMeta = V19_DIMENSIONS.find(d => d.key === s.dimension);
                return (
                  <ScoreCard
                    key={s.dimension}
                    label={dimMeta?.label ?? s.dimension.replace(/_/g, ' ')}
                    score={s.score}
                    size="sm"
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Provider Summary */}
      {report.providers && report.providers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>AI Provider Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {report.providers.map(p => {
                const maturity = getMaturityLevel((p.mention_rate ?? 0) * 100);
                return (
                  <div key={p.provider} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-semibold">{p.provider_display || p.provider}</p>
                      <p className="text-xs text-muted-foreground">{p.model_name || p.model_id || 'default'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold" style={{ color: maturity.color }}>
                        {Math.round((p.mention_rate ?? 0) * 100)}%
                      </p>
                      <p className="text-xs text-muted-foreground">Mention Rate</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ── GEO V2 Tab: Providers ──
function ProvidersTab({ report }: { report: StructuredReport }) {
  const providers = report.providers ?? [];

  if (providers.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          No provider results available for this report.
        </CardContent>
      </Card>
    );
  }

  // Build LLMVisibilityScore record for the breakdown table
  const visibilityByLLM: Record<string, { visibility_score: number; mention_rate: number; average_position?: number }> = {};
  for (const p of providers) {
    visibilityByLLM[p.provider] = {
      visibility_score: (p.mention_rate ?? 0) * 100,
      mention_rate: p.mention_rate ?? 0,
      average_position: p.average_position,
    };
  }

  return (
    <div className="space-y-6">
      {/* LLM Breakdown Table (visual comparison) */}
      <Card>
        <CardHeader>
          <CardTitle>Provider Comparison</CardTitle>
          <CardDescription>Side-by-side visibility metrics across tested AI providers</CardDescription>
        </CardHeader>
        <CardContent>
          <LLMBreakdownTable visibilityByLLM={visibilityByLLM} />
        </CardContent>
      </Card>

      {/* Provider Matrix */}
      <ProviderModelMatrix providers={providers} />

      {/* Detailed per-provider cards */}
      <h3 className="text-lg font-bold">Detailed Provider Results</h3>
      {providers.map(p => {
        const mentionPct = Math.round((p.mention_rate ?? 0) * 100);
        const maturity = getMaturityLevel(mentionPct);
        return (
          <Card key={p.provider}>
            <CardContent className="py-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold">{p.provider_display || p.provider}</h3>
                  <p className="text-sm text-muted-foreground">{p.model_name || p.model_id}</p>
                </div>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${maturity.badgeClass}`}>
                  {maturity.icon} {mentionPct}% — {maturity.label}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Mention Rate</p>
                  <p className="text-xl font-bold">{mentionPct}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Avg Position</p>
                  <p className="text-xl font-bold">{p.average_position?.toFixed(1) ?? '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Sentiment</p>
                  <p className="text-xl font-bold capitalize">{p.sentiment_label || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Queries</p>
                  <p className="text-xl font-bold">{p.mentioned_count ?? 0}/{p.total_queries ?? 0}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full transition-all duration-700"
                    style={{ width: `${mentionPct}%`, backgroundColor: maturity.color }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

// ── GEO V2 Tab: Competitors ──
function CompetitorsTab({ report }: { report: StructuredReport }) {
  const competitors = normalizeCompetitors(report.competitors);

  const battleCards = safeArray(report.raw_payload, 'battle_cards');

  if (competitors.length === 0 && battleCards.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          No competitor data available for this report.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* V1.9 Battle Cards */}
      <CompetitorBattleCards battleCards={battleCards} />
      {competitors.map(c => (
        <Card key={c.competitor_name}>
          <CardContent className="py-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{c.competitor_name}</h3>
              <div className="flex items-center gap-3 text-sm">
                {c.authority_score > 0 && (
                  <Badge variant="outline">Authority: {Math.round(c.authority_score)}</Badge>
                )}
                {c.llm_mention_rate > 0 && (
                  <Badge variant="outline">LLM Mentions: {Math.round(c.llm_mention_rate * 100)}%</Badge>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {c.strengths.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Strengths</h4>
                  <ul className="space-y-1">
                    {c.strengths.map((s, i) => (
                      <li key={i} className="text-sm flex items-start gap-1.5">
                        <span className="text-emerald-500 mt-0.5 flex-shrink-0">●</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {c.weaknesses.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Weaknesses</h4>
                  <ul className="space-y-1">
                    {c.weaknesses.map((w, i) => (
                      <li key={i} className="text-sm flex items-start gap-1.5">
                        <span className="text-red-500 mt-0.5 flex-shrink-0">●</span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {c.your_advantages.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Your Advantages</h4>
                  <ul className="space-y-1">
                    {c.your_advantages.map((a, i) => (
                      <li key={i} className="text-sm flex items-start gap-1.5">
                        <span className="text-blue-500 mt-0.5 flex-shrink-0">★</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ── GEO V2 Tab: Recommendations ──
function RecommendationsTab({ report }: { report: StructuredReport }) {
  const recs = report.recommendations ?? [];
  const roadmap = safeArray(report.raw_payload, 'improvement_roadmap');

  if (recs.length === 0 && roadmap.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          No recommendations available for this report.
        </CardContent>
      </Card>
    );
  }

  // Pre-render the V1.9 Roadmap which replaces or supplements raw recs
  if (roadmap.length > 0) {
    return <ImprovementRoadmap rawPayload={report.raw_payload} recommendations={recs} />;
  }

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const sorted = [...recs].sort(
    (a, b) => (priorityOrder[a.priority] ?? 1) - (priorityOrder[b.priority] ?? 1)
  );

  const PRIORITY_STYLE: Record<string, string> = {
    high: 'border-red-500/30 bg-red-500/5',
    medium: 'border-amber-500/30 bg-amber-500/5',
    low: 'border-blue-500/30 bg-blue-500/5',
  };
  const PRIORITY_BADGE: Record<string, string> = {
    high: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    low: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  };

  return (
    <div className="space-y-3">
      {sorted.map((rec, i) => (
        <div
          key={i}
          className={`rounded-lg border p-4 ${PRIORITY_STYLE[rec.priority] ?? 'border-border'}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold">{rec.title}</span>
                <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${PRIORITY_BADGE[rec.priority] ?? ''}`}>
                  {rec.priority}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{rec.description}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                {rec.category && <span>📂 {rec.category}</span>}
                {rec.impact_area && <span>🎯 {rec.impact_area}</span>}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── GEO V2 Tab: Evidence (placeholder — Wave 2 will add LLM transcripts) ──
function EvidenceTab({ report }: { report: StructuredReport }) {
  const whatAiSees = safeString(report.raw_payload, 'what_ai_sees');
  const citationSources = safeArray(report.raw_payload, 'citation_sources');

  if (whatAiSees || citationSources.length > 0) {
    return <EvidenceTranscripts rawPayload={report.raw_payload} />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evidence & Verification</CardTitle>
        <CardDescription>
          LLM response transcripts and reproducibility prompts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="py-8 text-center text-muted-foreground space-y-3">
          <p className="text-4xl">🔬</p>
          <p className="text-sm">
            Evidence view shows actual AI model responses and verification prompts.
          </p>
          <p className="text-xs">
            {report.tested_providers?.length
              ? `Tested on: ${report.tested_providers.join(', ')}`
              : 'No provider evidence available'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ── GEO V2 Tab: Full Report (markdown) ──
function FullReportTab({ report }: { report: StructuredReport }) {
  const markdown = report.markdown_report;

  if (!markdown) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <p className="text-4xl mb-3">📄</p>
          <p>No markdown report available for this analysis.</p>
          <p className="text-xs mt-1">The report may have been generated before markdown export was enabled.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${report.brand_name || 'report'}-visibility-report.md`;
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          <Download className="h-4 w-4 mr-2" /> Download .md
        </Button>
      </div>
      <MarkdownReportViewer
        markdown={markdown}
        brandName={report.brand_name}
        reportDate={report.created_at}
        reportId={report.id}
      />
    </div>
  );
}

// ── Legacy detail components (Keywords / Content reports) ──

function KeywordsDetails({ payload }: { payload: Record<string, unknown> }) {
  const keywords = (payload.keywords || payload.working_keywords || []) as Array<{ keyword: string; score?: number; status?: string }>;
  const opportunities = (payload.opportunities || []) as Array<{ keyword: string; potential?: number; description?: string }>;
  const gaps = (payload.content_gaps || payload.gaps || []) as Array<{ gap: string; description?: string }>;

  return (
    <div className="space-y-6">
      {keywords.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Keywords ({keywords.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {keywords.slice(0, 30).map((kw, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                  <span className="text-sm font-medium">{kw.keyword}</span>
                  <div className="flex items-center gap-2">
                    {kw.score != null && <span className="text-sm text-muted-foreground">{Math.round(kw.score)}%</span>}
                    {kw.status && <Badge variant="outline" className="text-xs">{kw.status}</Badge>}
                  </div>
                </div>
              ))}
              {keywords.length > 30 && <p className="text-xs text-muted-foreground pt-2">+{keywords.length - 30} more keywords</p>}
            </div>
          </CardContent>
        </Card>
      )}

      {opportunities.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Opportunities ({opportunities.length})</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {opportunities.map((opp, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{opp.keyword}</span>
                    {opp.potential != null && <Badge>{Math.round(opp.potential)}% potential</Badge>}
                  </div>
                  {opp.description && <p className="text-xs text-muted-foreground mt-1">{opp.description}</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {gaps.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Content Gaps ({gaps.length})</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {gaps.map((g, i) => (
                <li key={i} className="text-sm">
                  <span className="font-medium">{g.gap}</span>
                  {g.description && <span className="text-muted-foreground"> — {g.description}</span>}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ContentDetails({ payload }: { payload: Record<string, unknown> }) {
  const areas = (payload.improvement_areas || payload.issues || []) as Array<{ area: string; severity: string; suggestion: string }>;
  const recs = (payload.recommendations || []) as string[];
  const structureScore = payload.structure_score as number | undefined;
  const factualScore = payload.factual_density_score as number | undefined;
  const brandScore = payload.brand_visibility_score as number | undefined;
  const ragScore = payload.rag_citability_score as number | undefined;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        {structureScore != null && <ScoreCard label="Structure" score={structureScore} size="sm" />}
        {factualScore != null && <ScoreCard label="Fact Density" score={factualScore} size="sm" />}
        {brandScore != null && <ScoreCard label="Brand Focus" score={brandScore} size="sm" />}
        {ragScore != null && <ScoreCard label="Citability" score={ragScore} size="sm" />}
      </div>

      {areas.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Improvement Areas</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {areas.map((area, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Badge variant={area.severity === 'high' ? 'destructive' : area.severity === 'medium' ? 'default' : 'secondary'} className="text-xs mt-0.5">
                    {area.severity}
                  </Badge>
                  <div>
                    <p className="text-sm font-medium">{area.area.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{area.suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {recs.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Recommendations</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recs.map((rec, i) => (
                <li key={i} className="flex gap-2 items-start text-sm">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ── Main Page ──
export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const reportId = params.id as string;

  // URL-synced tab state
  const currentTab = (searchParams.get('tab') as ReportTab) || 'overview';
  const setTab = useCallback((tab: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.replaceState({}, '', url.toString());
  }, []);

  // State: structured report from /full endpoint
  const [structuredReport, setStructuredReport] = useState<StructuredReport | null>(null);
  // Fallback: raw report for non-GEO types or when /full fails
  const [rawReport, setRawReport] = useState<RawReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async (id: string) => {
    const attempt = async (remaining: number): Promise<void> => {
      try {
        // Try /full endpoint first (returns structured data for GEO reports)
        const fullData = await geoApi.getReportFull(id);
        setStructuredReport(fullData);
        setError(null);
        setLoading(false);
      } catch {
        // Fallback to basic /reports/:id
        try {
          const data = await geoApi.getReport(id);
          setRawReport(data as unknown as RawReport);
          setError(null);
          setLoading(false);
        } catch (err: unknown) {
          const axiosErr = err as { response?: { status?: number; data?: { error?: string } } };
          const status = axiosErr.response?.status;
          if (remaining > 0 && (status === 404 || status === 500)) {
            await new Promise(r => setTimeout(r, 3000));
            return attempt(remaining - 1);
          }
          const msg = status === 404
            ? 'Report not found'
            : axiosErr.response?.data?.error || 'Failed to load report';
          setError(msg);
          setLoading(false);
        }
      }
    };
    await attempt(8);
  }, []);

  useEffect(() => {
    if (!reportId) return;
    fetchReport(reportId);
  }, [reportId, fetchReport]);

  // ── Loading state ──
  if (loading) {
    return <ReportDetailSkeleton />;
  }

  // ── Error state ──
  if (error || (!structuredReport && !rawReport)) {
    if (error) {
      return (
        <ErrorState
          title="Failed to load report"
          message={error}
          onRetry={() => window.location.reload()}
          showBack
        />
      );
    }
    return <ReportNotFoundState />;
  }

  // ════════════════════════════════════════════════════
  // PATH A: Structured report from /full (GEO reports)
  // ════════════════════════════════════════════════════
  if (structuredReport && structuredReport.type === 'geo') {
    return (
      <div className="space-y-6">
        {/* Back button */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/reports')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">Back to Reports</span>
        </div>

        {/* Hero section */}
        <ReportHero report={structuredReport} />

        {/* 6-Tab Layout */}
        <Tabs value={currentTab} onValueChange={setTab}>
          <TabsList className="flex-wrap">
            {REPORT_TABS.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id} className="gap-1.5">
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="mt-4">
            <OverviewTab report={structuredReport} />
          </TabsContent>

          <TabsContent value="providers" className="mt-4">
            <ProvidersTab report={structuredReport} />
          </TabsContent>

          <TabsContent value="competitors" className="mt-4">
            <CompetitorsTab report={structuredReport} />
          </TabsContent>

          <TabsContent value="recommendations" className="mt-4">
            <RecommendationsTab report={structuredReport} />
          </TabsContent>

          <TabsContent value="evidence" className="mt-4">
            <EvidenceTab report={structuredReport} />
          </TabsContent>

          <TabsContent value="report" className="mt-4">
            <FullReportTab report={structuredReport} />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // ════════════════════════════════════════════════════
  // PATH B: Non-GEO structured report (keywords/content via /full)
  // ════════════════════════════════════════════════════
  if (structuredReport) {
    const payload = (structuredReport as unknown as { response_payload?: Record<string, unknown> }).response_payload ?? {};
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/reports')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold truncate">{structuredReport.brand_name || 'Untitled Report'}</h1>
              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                {structuredReport.type === 'keywords' ? '🔑 Keyword Discovery' : '📝 Content Validation'}
              </Badge>
            </div>
          </div>
        </div>
        {structuredReport.type === 'keywords'
          ? <KeywordsDetails payload={payload} />
          : <ContentDetails payload={payload} />
        }
      </div>
    );
  }

  // ════════════════════════════════════════════════════
  // PATH C: Raw fallback (when /full endpoint fails)
  // ════════════════════════════════════════════════════
  const report = rawReport!;
  const TYPE_META: Record<string, { label: string; color: string; emoji: string }> = {
    geo: { label: 'GEO Analysis', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300', emoji: '🌐' },
    keywords: { label: 'Keyword Discovery', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300', emoji: '🔑' },
    content: { label: 'Content Validation', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', emoji: '📝' },
  };
  const meta = TYPE_META[report._type] || TYPE_META.geo;
  const payload = report.response_payload ?? {};
  const markdownContent = report.markdown_report
    || (payload.markdown_report as string | undefined)
    || null;

  const score = report.overall_score ?? (() => {
    if (report._type === 'geo') {
      const vs = payload.visibility_score;
      if (typeof vs === 'object' && vs !== null && 'overall' in (vs as Record<string, unknown>)) {
        return (vs as Record<string, number>).overall;
      }
      return typeof vs === 'number' ? vs : null;
    }
    return null;
  })();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/reports')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold truncate">{report.brand_name || 'Untitled Report'}</h1>
            <Badge className={meta.color}>{meta.emoji} {meta.label}</Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {report.created_at ? new Date(report.created_at).toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric',
              }) : 'Unknown'}
            </span>
            {report.scan_mode && <Badge variant="secondary" className="text-xs">{report.scan_mode}</Badge>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardContent className="flex flex-col items-center py-8">
              {score != null ? (
                <ScoreGauge score={Math.round(score as number)} size={140} label="Overall Score" />
              ) : (
                <div className="text-center py-8">
                  <p className="text-3xl font-bold text-muted-foreground">—</p>
                  <p className="text-sm text-muted-foreground mt-1">No score</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Tabs defaultValue={markdownContent ? 'report' : 'details'}>
            <TabsList>
              {markdownContent && <TabsTrigger value="report">📄 Report</TabsTrigger>}
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="raw">Raw Data</TabsTrigger>
            </TabsList>

            {markdownContent && (
              <TabsContent value="report" className="mt-4">
                <MarkdownReportViewer
                  markdown={markdownContent}
                  brandName={report.brand_name}
                  reportDate={report.created_at}
                  reportId={report.id}
                />
              </TabsContent>
            )}

            <TabsContent value="details" className="mt-4">
              {report._type === 'keywords' && <KeywordsDetails payload={payload} />}
              {report._type === 'content' && <ContentDetails payload={payload} />}
              {report._type === 'geo' && (
                <Card>
                  <CardContent className="py-8 text-center text-muted-foreground">
                    <p>Report loaded in fallback mode. Structured data may be limited.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="raw" className="mt-4">
              <Card>
                <CardHeader><CardTitle>Raw Response</CardTitle></CardHeader>
                <CardContent>
                  <pre className="text-xs overflow-auto max-h-[600px] p-4 bg-muted rounded-lg">
                    {JSON.stringify(report, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
