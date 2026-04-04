'use client';

import { useState } from 'react';
import { useContentValidation, useContentEnhancement } from '@/hooks/useGeo';
import { ProviderSelector } from '@/components/geo/ProviderSelector';
import type { ProviderSelection } from '@/lib/types/providers';
import type { ContentType, ContentLiveTestResponse, LLMProvider } from '@/lib/geo-types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  Loader2, Zap, Bot, Sparkles, CheckCircle, AlertTriangle,
  AlertCircle, Copy, ArrowRight, ShieldAlert,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const CONTENT_TYPES: { value: ContentType; label: string }[] = [
  { value: 'blog_post', label: 'Blog Post' },
  { value: 'landing_page', label: 'Landing Page' },
  { value: 'faq_page', label: 'FAQ Page' },
  { value: 'comparison_page', label: 'Comparison' },
  { value: 'listicle', label: 'Listicle' },
];

const SEVERITY_VARIANT: Record<string, 'destructive' | 'default' | 'secondary'> = {
  high: 'destructive',
  medium: 'default',
  low: 'secondary',
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function scoreBarColor(score: number) {
  if (score >= 75) return 'bg-emerald-500';
  if (score >= 50) return 'bg-amber-500';
  return 'bg-red-500';
}

function scoreTextColor(score: number) {
  if (score >= 75) return 'text-emerald-600 dark:text-emerald-400';
  if (score >= 50) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}

function verdictLabel(score: number) {
  if (score >= 75) return 'High Citability';
  if (score >= 50) return 'Moderate Potential';
  return 'Low Visibility';
}

function verdictColorClass(score: number) {
  if (score >= 75) return 'emerald';
  if (score >= 50) return 'amber';
  return 'red';
}

const parseList = (s: string) => s.split(',').map(v => v.trim()).filter(Boolean);

/* ------------------------------------------------------------------ */
/*  Small presentational components                                    */
/* ------------------------------------------------------------------ */

function ScoreBanner({ score }: { score: number }) {
  const c = verdictColorClass(score);
  const Icon = score >= 75 ? CheckCircle : score >= 50 ? AlertTriangle : AlertCircle;
  return (
    <Card className={cn(
      c === 'emerald' && 'border-emerald-500/30 bg-emerald-500/5',
      c === 'amber' && 'border-amber-500/30 bg-amber-500/5',
      c === 'red' && 'border-red-500/30 bg-red-500/5',
    )}>
      <CardContent className="pt-6 flex items-center gap-4">
        <div className={cn(
          'flex h-12 w-12 shrink-0 items-center justify-center rounded-lg',
          c === 'emerald' && 'bg-emerald-500/20',
          c === 'amber' && 'bg-amber-500/20',
          c === 'red' && 'bg-red-500/20',
        )}>
          <Icon className={cn(
            'h-6 w-6',
            c === 'emerald' && 'text-emerald-600',
            c === 'amber' && 'text-amber-600',
            c === 'red' && 'text-red-600',
          )} />
        </div>
        <div>
          <p className={cn(
            'text-lg font-bold',
            c === 'emerald' && 'text-emerald-700 dark:text-emerald-400',
            c === 'amber' && 'text-amber-700 dark:text-amber-400',
            c === 'red' && 'text-red-700 dark:text-red-400',
          )}>{verdictLabel(score)}</p>
          <p className="text-sm text-muted-foreground">
            RAG Citability Score: <span className="font-bold">{Math.round(score)}%</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function SubScoreCard({ label, score }: { label: string; score: number }) {
  return (
    <Card>
      <CardContent className="pt-4 pb-3 text-center">
        <p className={cn('text-2xl font-bold', scoreTextColor(score))}>{Math.round(score)}</p>
        <p className="text-xs text-muted-foreground mt-1">{label}</p>
      </CardContent>
    </Card>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive flex items-center gap-2">
      <ShieldAlert className="h-4 w-4 shrink-0" /> {message}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ContentLabPage() {
  // ---- shared form state ----
  const [brandName, setBrandName] = useState('');
  const [content, setContent] = useState('');
  const [targetQueries, setTargetQueries] = useState('');
  const [competitors, setCompetitors] = useState('');
  const [contentType, setContentType] = useState<ContentType>('blog_post');

  // ---- provider selection (live test) ----
  const [selectedProviders, setSelectedProviders] = useState<ProviderSelection>({});

  // ---- copy feedback ----
  const [copied, setCopied] = useState(false);

  // ---- hooks (separate instances → independent loading/data/error) ----
  const structural = useContentValidation();
  const live = useContentValidation();
  const enhancement = useContentEnhancement();

  const canSubmit = !!brandName.trim() && !!content.trim();

  // ---- handlers ----
  const handleStructural = async () => {
    if (!canSubmit) return;
    try {
      await structural.validate({
        content,
        brand_name: brandName,
        target_queries: parseList(targetQueries),
        competitors: parseList(competitors),
        content_type: contentType,
      });
    } catch { /* error surfaced via hook state */ }
  };

  const handleLiveTest = async () => {
    if (!canSubmit) return;
    const providers = Object.keys(selectedProviders) as LLMProvider[];
    if (providers.length === 0) return;
    try {
      await live.testLive({
        content,
        brand_name: brandName,
        target_queries: parseList(targetQueries),
        providers,
        competitors: parseList(competitors),
      });
    } catch { /* error surfaced via hook state */ }
  };

  const handleEnhance = async () => {
    if (!canSubmit) return;
    try {
      await enhancement.enhance({
        content,
        brand_name: brandName,
        target_queries: parseList(targetQueries),
        competitors: parseList(competitors),
        content_type: contentType,
      });
    } catch { /* error surfaced via hook state */ }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ---- derived data ----
  const liveData =
    live.data && 'live_test_results' in live.data
      ? (live.data as unknown as ContentLiveTestResponse)
      : null;

  const enhData = enhancement.data;
  const enhancedContent = enhData?.enhanced_content as string | undefined;
  const enhancedScore = enhData?.enhanced_score as number | undefined;
  const originalScore = enhData?.original_score as number | undefined;
  const changes = (enhData?.changes ?? enhData?.improvements) as
    | Array<{ type?: string; description?: string }>
    | string[]
    | undefined;

  // ---- render ----
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content Lab</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl">
          Validate, test, and enhance your content for AI citability.
        </p>
      </div>

      {/* ---- Shared form ---- */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand-name">Brand Name *</Label>
              <Input
                id="brand-name"
                value={brandName}
                onChange={e => setBrandName(e.target.value)}
                placeholder="e.g. Notion"
              />
            </div>
            <div className="space-y-2">
              <Label>Content Type</Label>
              <Select value={contentType} onValueChange={v => v && setContentType(v as ContentType)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTENT_TYPES.map(ct => (
                    <SelectItem key={ct.value} value={ct.value}>{ct.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target-queries">Target Queries</Label>
              <Input
                id="target-queries"
                value={targetQueries}
                onChange={e => setTargetQueries(e.target.value)}
                placeholder="best project management tool, Notion alternative"
              />
              <p className="text-xs text-muted-foreground">Comma-separated</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="competitors">Competitors</Label>
              <Input
                id="competitors"
                value={competitors}
                onChange={e => setCompetitors(e.target.value)}
                placeholder="Asana, Trello, Monday.com"
              />
              <p className="text-xs text-muted-foreground">Optional, comma-separated</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="content-input">Content *</Label>
              <span className={cn(
                'text-xs',
                content.length > 0 && content.length < 500
                  ? 'text-amber-500'
                  : 'text-muted-foreground',
              )}>
                {content.length.toLocaleString()} chars
                {content.length > 0 && content.length < 500 && ' — min 500 recommended'}
              </span>
            </div>
            <Textarea
              id="content-input"
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={10}
              placeholder="Paste your blog post, FAQ page, or landing page content here…"
              className="font-mono resize-y"
            />
          </div>
        </CardContent>
      </Card>

      {/* ---- Tabs ---- */}
      <Tabs defaultValue="structural">
        <TabsList className="w-full">
          <TabsTrigger value="structural" className="flex-1 gap-1.5">
            <Zap className="h-3.5 w-3.5" /> Structural Check
          </TabsTrigger>
          <TabsTrigger value="live" className="flex-1 gap-1.5">
            <Bot className="h-3.5 w-3.5" /> Live AI Test
          </TabsTrigger>
          <TabsTrigger value="enhance" className="flex-1 gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> Enhance ✨
          </TabsTrigger>
        </TabsList>

        {/* ============ Tab 1 — Structural Check ============ */}
        <TabsContent value="structural" className="mt-4 space-y-4">
          <div className="flex items-center gap-3">
            <Button onClick={handleStructural} disabled={!canSubmit || structural.loading}>
              {structural.loading
                ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Checking…</>
                : <><Zap className="h-4 w-4 mr-2" /> Run Structural Check</>}
            </Button>
            {structural.data && (
              <Button variant="outline" size="sm" onClick={structural.reset}>Reset</Button>
            )}
          </div>

          {structural.error && <ErrorBanner message={structural.error} />}

          {structural.data && (
            <div className="space-y-4">
              <ScoreBanner score={structural.data.rag_citability_score} />

              <div className="grid grid-cols-3 gap-3">
                <SubScoreCard label="Structure" score={structural.data.structure_score} />
                <SubScoreCard label="Factual Density" score={structural.data.factual_density_score} />
                <SubScoreCard label="Brand Authority" score={structural.data.brand_visibility_score} />
              </div>

              {/* Issues */}
              {structural.data.improvement_areas?.length > 0 && (
                <Card>
                  <CardHeader><CardTitle className="text-sm">Issues</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {structural.data.improvement_areas.map((issue, i) => (
                      <div key={i} className="flex items-start justify-between gap-3 rounded-lg border p-3">
                        <div className="space-y-1 min-w-0">
                          <p className="text-sm font-medium capitalize">{issue.area.replace(/_/g, ' ')}</p>
                          <p className="text-xs text-muted-foreground">{issue.suggestion}</p>
                        </div>
                        <Badge variant={SEVERITY_VARIANT[issue.severity] ?? 'secondary'} className="shrink-0">
                          {issue.severity.toUpperCase()}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Query alignment */}
              {structural.data.query_alignments?.length > 0 && (
                <Card>
                  <CardHeader><CardTitle className="text-sm">Query Alignment</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {structural.data.query_alignments.map((qa, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                        <span className="text-sm truncate mr-4">{qa.query}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={cn('h-full rounded-full', scoreBarColor(qa.alignment_score))}
                              style={{ width: `${qa.alignment_score}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium w-8 text-right">{Math.round(qa.alignment_score)}%</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Recommendations */}
              {structural.data.recommendations?.length > 0 && (
                <Card>
                  <CardHeader><CardTitle className="text-sm">Recommendations</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {structural.data.recommendations.map((rec, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground">{rec}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        {/* ============ Tab 2 — Live AI Test ============ */}
        <TabsContent value="live" className="mt-4 space-y-4">
          <ProviderSelector selected={selectedProviders} onChange={setSelectedProviders} compact />

          <div className="flex items-center gap-3">
            <Button
              onClick={handleLiveTest}
              disabled={!canSubmit || live.loading || Object.keys(selectedProviders).length === 0}
            >
              {live.loading
                ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Testing…</>
                : <><Bot className="h-4 w-4 mr-2" /> Test Against Real AI</>}
            </Button>
            {live.data && (
              <Button variant="outline" size="sm" onClick={live.reset}>Reset</Button>
            )}
          </div>

          {live.error && <ErrorBanner message={live.error} />}

          {liveData && (
            <div className="space-y-4">
              <ScoreBanner score={liveData.rag_citability_score} />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {([
                  { label: 'Queries Tested', value: liveData.live_test_results.total_queries },
                  { label: 'LLM Calls', value: liveData.live_test_results.total_llm_calls },
                  { label: 'Mentions Found', value: liveData.live_test_results.mentions_detected },
                  { label: 'Mention Rate', value: `${Math.round(liveData.live_test_results.mention_rate * 100)}%` },
                ] as const).map(item => (
                  <Card key={item.label}>
                    <CardContent className="pt-4 pb-3 text-center">
                      <p className="text-xl font-bold">{item.value}</p>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {liveData.verdict && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Verdict:</span>
                  <Badge variant={
                    liveData.verdict === 'strong' ? 'default'
                    : liveData.verdict === 'promising' ? 'secondary'
                    : 'destructive'
                  }>
                    {liveData.verdict.replace('_', ' ')}
                  </Badge>
                </div>
              )}

              {liveData.verdict_reasoning && (
                <p className="text-sm text-muted-foreground leading-relaxed">{liveData.verdict_reasoning}</p>
              )}

              {liveData.next_steps?.length > 0 && (
                <Card>
                  <CardHeader><CardTitle className="text-sm">Next Steps</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {liveData.next_steps.map((step, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground">{step}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        {/* ============ Tab 3 — Enhance ✨ ============ */}
        <TabsContent value="enhance" className="mt-4 space-y-4">
          <div className="flex items-center gap-3">
            <Button onClick={handleEnhance} disabled={!canSubmit || enhancement.loading}>
              {enhancement.loading
                ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Enhancing…</>
                : <><Sparkles className="h-4 w-4 mr-2" /> Enhance for AI Citability</>}
            </Button>
            {enhData && (
              <Button variant="outline" size="sm" onClick={enhancement.reset}>Reset</Button>
            )}
          </div>

          {enhancement.error && <ErrorBanner message={enhancement.error} />}

          {enhData && (
            <div className="space-y-4">
              {/* Before → After score comparison */}
              {(originalScore != null || enhancedScore != null) && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-center gap-6">
                      {originalScore != null && (
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground mb-1">Original</p>
                          <p className={cn('text-3xl font-bold', scoreTextColor(originalScore))}>
                            {Math.round(originalScore)}
                          </p>
                        </div>
                      )}
                      <ArrowRight className="h-6 w-6 text-muted-foreground" />
                      {enhancedScore != null && (
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground mb-1">Enhanced</p>
                          <p className={cn('text-3xl font-bold', scoreTextColor(enhancedScore))}>
                            {Math.round(enhancedScore)}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Changes made */}
              {changes && changes.length > 0 && (
                <Card>
                  <CardHeader><CardTitle className="text-sm">Changes Made</CardTitle></CardHeader>
                  <CardContent className="space-y-2">
                    {changes.map((change, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground">
                          {typeof change === 'string'
                            ? change
                            : (change as { description?: string }).description ?? JSON.stringify(change)}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Enhanced content with copy */}
              {enhancedContent && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">Enhanced Content</CardTitle>
                      <Button variant="outline" size="sm" onClick={() => handleCopy(enhancedContent)}>
                        <Copy className="h-3.5 w-3.5 mr-1.5" />
                        {copied ? 'Copied!' : 'Copy Enhanced Content'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-sm whitespace-pre-wrap bg-muted rounded-lg p-4 max-h-[400px] overflow-y-auto">
                      {enhancedContent}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}