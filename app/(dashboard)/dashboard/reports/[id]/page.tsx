'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { geoApi } from '@/lib/geo-api';
import { ScoreGauge } from '@/components/geo/ScoreGauge';
import { ScoreCard } from '@/components/geo/ScoreCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Calendar, Globe, Key, FileText } from 'lucide-react';

// --- Types for the raw report from GET /reports/:id ---
interface RawReport {
  _type: 'geo' | 'keywords' | 'content';
  id: string;
  brand_name?: string;
  url?: string;
  created_at?: string;
  status?: string;
  // GEO fields
  response_payload?: Record<string, unknown>;
  overall_score?: number;
  // Keywords fields
  visibility_score?: number;
  overall_visibility_score?: number;
  category?: string;
  mode?: string;
  response_data?: Record<string, unknown>;
  // Content fields
  rag_citability_score?: number;
  structure_score?: number;
  factual_density_score?: number;
  brand_visibility_score?: number;
  improvement_areas?: Array<{ area: string; severity: string; suggestion: string }>;
  recommendations?: string[];
  verdict?: string;
}

const TYPE_META: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  geo: { label: 'GEO Analysis', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300', icon: <Globe className="h-4 w-4" /> },
  keywords: { label: 'Keyword Discovery', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300', icon: <Key className="h-4 w-4" /> },
  content: { label: 'Content Validation', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', icon: <FileText className="h-4 w-4" /> },
};

function getMainScore(report: RawReport): number | null {
  if (report._type === 'geo') {
    const payload = report.response_payload || {};
    const vs = payload.visibility_score;
    if (typeof vs === 'object' && vs !== null && 'overall' in (vs as Record<string, unknown>)) {
      return (vs as Record<string, number>).overall;
    }
    return (payload.visibility_score as number) ?? report.overall_score ?? null;
  }
  if (report._type === 'keywords') {
    return report.overall_visibility_score ?? report.visibility_score ?? null;
  }
  if (report._type === 'content') {
    return report.rag_citability_score ?? null;
  }
  return null;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return 'Unknown';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

// --- GEO Report Details ---
function GeoDetails({ report }: { report: RawReport }) {
  const payload = (report.response_payload || {}) as Record<string, unknown>;
  const vs = payload.visibility_score as Record<string, unknown> | undefined;
  const subScores = (vs?.sub_scores || {}) as Record<string, number>;
  const recs = (payload.recommendations || []) as Array<{ title?: string; description?: string; priority?: string } | string>;
  const dims = (payload.dimension_scores || payload.dimensions || {}) as Record<string, number>;

  const clusters: Record<string, string[]> = {
    'AI Visibility': ['llm_mention', 'llm_consistency', 'llm_position'],
    'Authority': ['authority', 'web_presence', 'citation_strength'],
    'Content': ['content_fit', 'citability', 'page_quality', 'freshness'],
    'Technical': ['technical_seo', 'ai_readiness'],
    'Competitive': ['competitor_gap', 'pattern_match'],
  };

  return (
    <div className="space-y-6">
      {/* Dimension Scores */}
      {Object.keys(subScores).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Score Breakdown</CardTitle>
            <CardDescription>Individual dimension scores from the analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(clusters).map(([cluster, keys]) => {
                const activeKeys = keys.filter(k => subScores[k] != null);
                if (activeKeys.length === 0) return null;
                return (
                  <div key={cluster}>
                    <h4 className="text-sm font-semibold mb-3">{cluster}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {activeKeys.map(k => (
                        <ScoreCard key={k} label={k.replace(/_/g, ' ')} score={subScores[k]} size="sm" />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fallback: flat dimension scores */}
      {Object.keys(subScores).length === 0 && Object.keys(dims).length > 0 && (
        <Card>
          <CardHeader><CardTitle>Dimension Scores</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(dims).map(([k, v]) => (
                <ScoreCard key={k} label={k.replace(/_/g, ' ')} score={v} size="sm" />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {recs.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Recommendations</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recs.map((rec, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-semibold">{i + 1}</span>
                  <div>
                    {typeof rec === 'string' ? (
                      <p className="text-sm">{rec}</p>
                    ) : (
                      <>
                        <p className="text-sm font-medium">{rec.title || rec.description}</p>
                        {rec.title && rec.description && <p className="text-xs text-muted-foreground mt-0.5">{rec.description}</p>}
                        {rec.priority && <Badge variant="outline" className="mt-1 text-xs">{rec.priority}</Badge>}
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// --- Keywords Report Details ---
function KeywordsDetails({ report }: { report: RawReport }) {
  const data = (report.response_data || {}) as Record<string, unknown>;
  const keywords = (data.keywords || data.working_keywords || []) as Array<{ keyword: string; score?: number; status?: string }>;
  const opportunities = (data.opportunities || []) as Array<{ keyword: string; potential?: number; description?: string }>;
  const gaps = (data.content_gaps || data.gaps || []) as Array<{ gap: string; description?: string }>;

  return (
    <div className="space-y-6">
      {keywords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Keywords ({keywords.length})</CardTitle>
          </CardHeader>
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

// --- Content Report Details ---
function ContentDetails({ report }: { report: RawReport }) {
  const areas = report.improvement_areas || [];
  const recs = report.recommendations || [];

  return (
    <div className="space-y-6">
      {/* Score Cards */}
      <div className="grid grid-cols-2 gap-3">
        {report.structure_score != null && <ScoreCard label="Structure" score={report.structure_score} size="sm" />}
        {report.factual_density_score != null && <ScoreCard label="Fact Density" score={report.factual_density_score} size="sm" />}
        {report.brand_visibility_score != null && <ScoreCard label="Brand Focus" score={report.brand_visibility_score} size="sm" />}
        {report.rag_citability_score != null && <ScoreCard label="Citability" score={report.rag_citability_score} size="sm" />}
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

// --- Main Page ---
export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.id as string;

  const [report, setReport] = useState<RawReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reportId) return;
    setLoading(true);
    setError(null);

    geoApi.getReport(reportId)
      .then(data => setReport(data as unknown as RawReport))
      .catch(err => {
        const msg = err.response?.status === 404
          ? 'Report not found'
          : err.response?.data?.error || 'Failed to load report';
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [reportId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 lg:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <p className="text-lg font-semibold text-destructive">{error || 'Report not found'}</p>
        <Button variant="outline" onClick={() => router.push('/dashboard/reports')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Reports
        </Button>
      </div>
    );
  }

  const meta = TYPE_META[report._type] || TYPE_META.geo;
  const score = getMainScore(report);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/reports')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold truncate">{report.brand_name || 'Untitled Report'}</h1>
            <Badge className={meta.color}>{meta.icon}<span className="ml-1">{meta.label}</span></Badge>
            {report.status && report.status !== 'completed' && (
              <Badge variant="outline">{report.status}</Badge>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatDate(report.created_at)}</span>
            {report.url && <span className="truncate max-w-xs">{report.url}</span>}
            {report.category && <Badge variant="secondary" className="text-xs">{report.category}</Badge>}
            {report.mode && <Badge variant="secondary" className="text-xs">{report.mode}</Badge>}
          </div>
        </div>
      </div>

      {/* Score + Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Score sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardContent className="flex flex-col items-center py-8">
              {score != null ? (
                <ScoreGauge score={Math.round(score)} size={140} label="Overall Score" />
              ) : (
                <div className="text-center py-8">
                  <p className="text-3xl font-bold text-muted-foreground">—</p>
                  <p className="text-sm text-muted-foreground mt-1">No score</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="raw">Raw Data</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-4">
              {report._type === 'geo' && <GeoDetails report={report} />}
              {report._type === 'keywords' && <KeywordsDetails report={report} />}
              {report._type === 'content' && <ContentDetails report={report} />}
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
