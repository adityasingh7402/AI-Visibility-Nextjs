'use client';

import { useState } from 'react';
import { useContentValidation } from '@/hooks/useGeo';
import type { ContentType, ContentLiveTestResponse } from '@/lib/geo-types';
import { ScoreCard } from '@/components/geo/ScoreCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Settings, Bot, AlertTriangle, AlertCircle,
  CheckCircle, Loader2, RotateCcw, Zap, ShieldAlert,
} from 'lucide-react';

const MAX_CONTENT = 50_000;
const WARN_CONTENT = 100;

const CONTENT_TYPES: { value: ContentType; label: string }[] = [
  { value: 'blog_post', label: 'Blog Post' },
  { value: 'faq_page', label: 'FAQ Page' },
  { value: 'comparison_page', label: 'Comparison Page' },
  { value: 'landing_page', label: 'Landing Page' },
  { value: 'listicle', label: 'Listicle' },
];

const SEVERITY_VARIANT: Record<string, 'destructive' | 'default' | 'secondary'> = {
  high: 'destructive',
  medium: 'default',
  low: 'secondary',
};

function getVerdictColor(score: number) {
  if (score >= 75) return 'emerald';
  if (score >= 50) return 'amber';
  return 'red';
}

function getVerdictLabel(score: number) {
  if (score >= 75) return 'High Citability';
  if (score >= 50) return 'Moderate Potential';
  return 'Low Visibility';
}

export default function ContentPage() {
  const { data, loading, error, validate, testLive, reset } = useContentValidation();

  const [brandName, setBrandName] = useState('');
  const [content, setContent] = useState('');
  const [targetQueries, setTargetQueries] = useState('');
  const [contentType, setContentType] = useState<ContentType>('blog_post');
  const [competitors, setCompetitors] = useState('');
  const [mode, setMode] = useState<'structural' | 'live'>('structural');

  const contentTooShort = content.length > 0 && content.length < WARN_CONTENT;
  const contentTooLong = content.length > MAX_CONTENT;
  const canSubmit = !loading && !!content && !!brandName && !contentTooLong;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const queries = targetQueries.split(',').map(q => q.trim()).filter(Boolean);
    const comps = competitors.split(',').map(c => c.trim()).filter(Boolean);

    if (mode === 'live') {
      await testLive({ content, brand_name: brandName, target_queries: queries, providers: ['chatgpt', 'gemini'], competitors: comps });
    } else {
      await validate({ content, brand_name: brandName, target_queries: queries, content_type: contentType, competitors: comps });
    }
  };

  const score = data?.rag_citability_score ?? 0;
  const color = data ? getVerdictColor(score) : null;
  const liveResults = data && 'live_test_results' in data ? (data as unknown as ContentLiveTestResponse) : null;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Content Validator</h1>
        <p className="text-muted-foreground mt-1 max-w-2xl">
          Check if your content will be cited by AI models before you publish.
          Optimize for RAG visibility and citability.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Form panel */}
        <form onSubmit={handleSubmit} className="lg:col-span-7">
          <Card>
            <CardHeader>
              <CardTitle>Validation Settings</CardTitle>
              <CardDescription>
                {mode === 'structural'
                  ? 'Fast structural analysis — no LLM calls'
                  : 'Live testing against real LLMs (ChatGPT, Gemini)'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mode toggle */}
              <div className="space-y-2">
                <Label>Validation Mode</Label>
                <Tabs
                  value={mode}
                  onValueChange={(v) => { if (v) setMode(v as 'structural' | 'live'); }}
                >
                  <TabsList className="w-full">
                    <TabsTrigger value="structural" className="flex-1 gap-1.5">
                      <Settings className="h-3.5 w-3.5" /> Structural Analysis
                    </TabsTrigger>
                    <TabsTrigger value="live" className="flex-1 gap-1.5">
                      <Bot className="h-3.5 w-3.5" /> Live Testing
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand-name">Brand Name *</Label>
                  <Input
                    id="brand-name"
                    value={brandName}
                    onChange={e => setBrandName(e.target.value)}
                    required
                    placeholder="e.g. Notion"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Content Type</Label>
                  <Select
                    value={contentType}
                    onValueChange={(v) => { if (v != null) setContentType(v as ContentType); }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select content type" />
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="competitors">Competitors</Label>
                  <Input
                    id="competitors"
                    value={competitors}
                    onChange={e => setCompetitors(e.target.value)}
                    placeholder="e.g. Asana, Trello, Monday.com"
                  />
                </div>
              </div>

              {/* Content textarea */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="content-input">Full Content *</Label>
                  <span className={`text-xs ${
                    contentTooLong ? 'text-destructive' : contentTooShort ? 'text-amber-500' : 'text-muted-foreground'
                  }`}>
                    {content.length.toLocaleString()} / {MAX_CONTENT.toLocaleString()}
                  </span>
                </div>
                <Textarea
                  id="content-input"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  required
                  rows={12}
                  placeholder="Paste your draft blog post, FAQ page, or landing page content here..."
                  className="font-mono resize-none"
                />
                {contentTooShort && (
                  <p className="text-xs text-amber-500 flex items-center gap-1.5">
                    <AlertTriangle className="h-3 w-3" /> Content is very short — results may be unreliable
                  </p>
                )}
                {contentTooLong && (
                  <p className="text-xs text-destructive flex items-center gap-1.5">
                    <AlertCircle className="h-3 w-3" /> Content exceeds {MAX_CONTENT.toLocaleString()} character limit
                  </p>
                )}
              </div>

              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive font-medium flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 shrink-0" /> {error}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <Button type="submit" disabled={!canSubmit} className="flex-1">
                  {loading ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Validating…</>
                  ) : mode === 'live' ? (
                    <><Bot className="h-4 w-4 mr-2" /> Run Live AI Test</>
                  ) : (
                    <><Zap className="h-4 w-4 mr-2" /> Validate Content</>
                  )}
                </Button>
                {data && (
                  <Button type="button" onClick={reset} variant="outline">
                    <RotateCcw className="h-4 w-4 mr-2" /> Reset
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>

        {/* Right: Results panel */}
        <div className="lg:col-span-5 space-y-6">
          {/* Empty state */}
          {!data && !loading && (
            <Card className="min-h-[500px] flex items-center justify-center border-dashed">
              <div className="text-center space-y-3 p-6 max-w-xs">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                  <Settings className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-semibold">Ready for Analysis</p>
                <p className="text-sm text-muted-foreground">
                  Paste your content and hit validate to check AI citability.
                </p>
              </div>
            </Card>
          )}

          {/* Loading state */}
          {loading && (
            <Card className="min-h-[500px] flex flex-col items-center justify-center gap-6">
              <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  {mode === 'live'
                    ? <Bot className="h-5 w-5 text-primary animate-pulse" />
                    : <Settings className="h-5 w-5 text-primary animate-pulse" />}
                </div>
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm font-semibold">Analyzing Content</p>
                <p className="text-sm text-muted-foreground">
                  {mode === 'live' ? 'Testing against live LLM providers…' : 'Evaluating structure and semantics…'}
                </p>
              </div>
            </Card>
          )}

          {/* Results */}
          {data && !loading && (
            <div className="space-y-6">
              {/* Verdict banner */}
              <Card className={
                color === 'emerald' ? 'border-emerald-500/30 bg-emerald-500/5' :
                color === 'amber' ? 'border-amber-500/30 bg-amber-500/5' :
                'border-red-500/30 bg-red-500/5'
              }>
                <CardContent className="pt-6 text-center">
                  <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg ${
                    color === 'emerald' ? 'bg-emerald-500/20' : color === 'amber' ? 'bg-amber-500/20' : 'bg-red-500/20'
                  }`}>
                    {color === 'emerald' ? <CheckCircle className="h-6 w-6 text-emerald-600" /> :
                     color === 'amber' ? <AlertTriangle className="h-6 w-6 text-amber-600" /> :
                     <AlertCircle className="h-6 w-6 text-red-600" />}
                  </div>
                  <h3 className={`text-lg font-bold mb-1 ${
                    color === 'emerald' ? 'text-emerald-700 dark:text-emerald-400' :
                    color === 'amber' ? 'text-amber-700 dark:text-amber-400' :
                    'text-red-700 dark:text-red-400'
                  }`}>
                    {getVerdictLabel(score)}
                  </h3>
                  <p className={`text-sm ${
                    color === 'emerald' ? 'text-emerald-600/80 dark:text-emerald-500/70' :
                    color === 'amber' ? 'text-amber-600/80 dark:text-amber-500/70' :
                    'text-red-600/80 dark:text-red-500/70'
                  }`}>
                    RAG Citability: <span className="font-bold">{Math.round(score)}%</span>
                  </p>
                </CardContent>
              </Card>

              {/* Score cards */}
              <div className="grid grid-cols-2 gap-4">
                <ScoreCard label="Citability" score={data.rag_citability_score} size="sm" />
                <ScoreCard label="Structure" score={data.structure_score} size="sm" />
                <ScoreCard label="Fact Density" score={data.factual_density_score} size="sm" />
                <ScoreCard label="Brand Focus" score={data.brand_visibility_score} size="sm" />
              </div>

              {/* Live test results */}
              {liveResults?.live_test_results && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="text-sm text-primary flex items-center gap-2">
                      <Bot className="h-4 w-4" /> Live Test Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Queries', value: liveResults.live_test_results.total_queries },
                        { label: 'LLM Calls', value: liveResults.live_test_results.total_llm_calls },
                        { label: 'Mentions', value: liveResults.live_test_results.mentions_detected },
                        { label: 'Mention Rate', value: `${Math.round(liveResults.live_test_results.mention_rate * 100)}%` },
                      ].map(item => (
                        <div key={item.label} className="rounded-lg border p-3 text-center">
                          <p className="text-lg font-bold">{item.value}</p>
                          <p className="text-xs text-muted-foreground">{item.label}</p>
                        </div>
                      ))}
                    </div>
                    {liveResults.verdict && (
                      <div className="flex justify-center">
                        <Badge variant={
                          liveResults.verdict === 'strong' ? 'default' :
                          liveResults.verdict === 'promising' ? 'secondary' :
                          'destructive'
                        }>
                          {liveResults.verdict.replace('_', ' ')}
                        </Badge>
                      </div>
                    )}
                    {liveResults.verdict_reasoning && (
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {liveResults.verdict_reasoning}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Improvement areas / issues */}
              {data.improvement_areas?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Issues</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {data.improvement_areas.map((area, i) => (
                      <div key={i} className="flex items-start justify-between gap-3 rounded-lg border p-3">
                        <div className="space-y-1 min-w-0">
                          <p className="text-sm font-medium capitalize">{area.area.replace(/_/g, ' ')}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">{area.suggestion}</p>
                        </div>
                        <Badge variant={SEVERITY_VARIANT[area.severity] ?? 'secondary'} className="shrink-0">
                          {area.severity}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Recommendations */}
              {data.recommendations?.length > 0 && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="text-sm text-primary">Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {data.recommendations.map((rec, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground leading-relaxed">{rec}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Warnings */}
              {data.warnings && data.warnings.length > 0 && (
                <Card className="border-amber-500/20 bg-amber-500/5">
                  <CardHeader>
                    <CardTitle className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" /> Warnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5">
                      {data.warnings.map((w, i) => (
                        <li key={i} className="text-sm text-amber-700 dark:text-amber-300">{w}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Engine errors */}
              {data.errors && data.errors.length > 0 && (
                <Card className="border-destructive/20 bg-destructive/5">
                  <CardHeader>
                    <CardTitle className="text-sm text-destructive flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" /> Engine Errors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5">
                      {data.errors.map((err, i) => (
                        <li key={i} className="text-sm text-destructive">{err}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}