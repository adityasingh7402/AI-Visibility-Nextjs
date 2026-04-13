'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useKeywordDiscovery, useKeywordGeneration } from '@/hooks/useGeo';
import { ProviderSelector } from '@/components/geo/ProviderSelector';
import type { ProviderSelection } from '@/lib/types/providers';
import type { KeywordDiscoveryRequest, KeywordDiscoveryResponse, DiscoveryMode, LLMProvider } from '@/lib/geo-types';
import { resolveVisibilitySummary, getScoreGrade, LLM_PROVIDER_INFO } from '@/lib/geo-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  Search, ChevronDown, Zap, Timer, Microscope,
  Key, BarChart3, Sparkles, Save, TestTube, FileText,
  AlertCircle, Loader2, CheckCircle2, XCircle, Minus,
} from 'lucide-react';
import { toast } from 'sonner';

/* ------------------------------------------------------------------ */
/*  Scan Mode Definitions                                              */
/* ------------------------------------------------------------------ */

const SCAN_MODES: { id: DiscoveryMode; label: string; time: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'quick',    label: 'Quick',    time: '~30s', icon: <Zap className="h-5 w-5" />,        desc: 'Fast scan, fewer prompts' },
  { id: 'standard', label: 'Standard', time: '~60s', icon: <Timer className="h-5 w-5" />,      desc: 'Balanced depth & speed' },
  { id: 'deep',     label: 'Deep',     time: '~90s', icon: <Microscope className="h-5 w-5" />, desc: 'Maximum prompt coverage' },
];

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function ScanPage() {
  const router = useRouter();

  // ── Form state ──
  const [brandName, setBrandName] = useState('');
  const [category, setCategory] = useState('');
  const [url, setUrl] = useState('');
  const [scanMode, setScanMode] = useState<DiscoveryMode>('standard');
  const [selectedProviders, setSelectedProviders] = useState<ProviderSelection>({});
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [competitors, setCompetitors] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [region, setRegion] = useState('');

  // ── API state ──
  const { data, loading, error, discover, reset } = useKeywordDiscovery();
  const hasResults = !!data;
  const providerKeys = Object.keys(selectedProviders);
  const canSubmit = brandName.trim().length > 0
    && category.trim().length > 0
    && providerKeys.length > 0
    && !loading;

  // ── Submit handler ──
  const handleSubmit = useCallback(async () => {
    const splitCsv = (s: string) => s.split(',').map(v => v.trim()).filter(Boolean);

    const req: KeywordDiscoveryRequest = {
      brand_name: brandName.trim(),
      category: category.trim(),
      mode: scanMode,
      llm_providers: providerKeys as LLMProvider[],
      region: (region.trim() || 'global') as KeywordDiscoveryRequest['region'],
      runs_per_prompt: 1,
      ...(url.trim() && { url: url.trim() }),
      ...(competitors.trim() && { competitors: splitCsv(competitors) }),
      ...(targetAudience.trim() && { target_audience: targetAudience.trim() }),
    };

    try {
      await discover(req);
      toast.success('Keyword discovery complete!', { description: `${scanMode} scan finished` });
    } catch {
      toast.error('Keyword discovery failed', { description: 'Please check the form and try again.' });
    }
  }, [brandName, category, scanMode, providerKeys, url, competitors, targetAudience, region, discover]);

  const handleReset = useCallback(() => {
    reset();
    setBrandName('');
    setCategory('');
    setUrl('');
    setScanMode('standard');
    setSelectedProviders({});
    setAdvancedOpen(false);
    setCompetitors('');
    setTargetAudience('');
    setRegion('');
  }, [reset]);

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Visibility Scan</h1>
        <p className="mt-1 text-muted-foreground">
          How visible is your brand across AI platforms? Run a scan to find out.
        </p>
      </div>

      {/* Form Card */}
      <div className={cn(
        'rounded-xl border bg-card p-6 shadow-sm transition-all',
        hasResults && 'ring-1 ring-primary/20',
      )}>
        {/* Brand Name */}
        <div className="space-y-2">
          <Label htmlFor="brand" className="text-base font-semibold">Brand Name *</Label>
          <Input
            id="brand"
            placeholder="e.g. Stripe, Notion, your company…"
            value={brandName}
            onChange={e => setBrandName(e.target.value)}
            className="h-12 text-lg"
            autoFocus
          />
        </div>

        {/* Category */}
        <div className="mt-5 space-y-2">
          <Label htmlFor="category" className="text-base font-semibold">Category *</Label>
          <Input
            id="category"
            placeholder="e.g. payment processing, project management…"
            value={category}
            onChange={e => setCategory(e.target.value)}
          />
        </div>

        {/* Website URL */}
        <div className="mt-5 space-y-2">
          <Label htmlFor="url" className="text-base font-semibold">
            Website URL
            <span className="ml-2 text-xs font-normal text-muted-foreground">(optional, recommended)</span>
          </Label>
          <Input
            id="url"
            placeholder="https://example.com"
            value={url}
            onChange={e => setUrl(e.target.value)}
          />
        </div>

        {/* Advanced Options */}
        <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen} className="mt-6">
          <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ChevronDown className={cn('h-4 w-4 transition-transform', advancedOpen && 'rotate-180')} />
            Advanced Options
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="competitors">Competitors</Label>
              <Input
                id="competitors"
                placeholder="Comma-separated"
                value={competitors}
                onChange={e => setCompetitors(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="audience">Target Audience</Label>
              <Input
                id="audience"
                placeholder="e.g. SMBs, developers…"
                value={targetAudience}
                onChange={e => setTargetAudience(e.target.value)}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="region">Region</Label>
              <Input
                id="region"
                placeholder="e.g. north_america, europe, global…"
                value={region}
                onChange={e => setRegion(e.target.value)}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Scan Mode */}
        <div className="mt-6 space-y-3">
          <Label className="text-base font-semibold">Scan Mode</Label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {SCAN_MODES.map(sm => (
              <button
                key={sm.id}
                type="button"
                onClick={() => setScanMode(sm.id)}
                className={cn(
                  'flex flex-col items-center gap-1.5 rounded-lg border-2 p-4 transition-all',
                  scanMode === sm.id
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-muted hover:border-primary/40',
                )}
              >
                {sm.icon}
                <span className="font-medium">{sm.label}</span>
                <Badge variant="secondary" className="text-xs">{sm.time}</Badge>
                <span className="text-xs text-muted-foreground">{sm.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* AI Providers */}
        <div className="mt-6 space-y-3">
          <Label className="text-base font-semibold">AI Providers</Label>
          <ProviderSelector selected={selectedProviders} onChange={setSelectedProviders} />
        </div>

        {/* Submit Button */}
        <Button
          className="mt-6 w-full h-12 text-base"
          size="lg"
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Scanning…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Run AI Visibility Scan
            </span>
          )}
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
          <AlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-destructive">Scan failed</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && !hasResults && (
        <div className="rounded-xl border bg-card p-8 shadow-sm text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
          <div>
            <p className="text-lg font-medium">Scanning AI platforms…</p>
            <p className="text-sm text-muted-foreground mt-1">
              This may take up to {scanMode === 'quick' ? '30' : scanMode === 'standard' ? '60' : '90'} seconds.
              We&apos;re querying multiple AI providers to check your brand visibility.
            </p>
          </div>
        </div>
      )}

      {/* Results */}
      {hasResults && (
        <div className="space-y-6">
          {/* Visibility Score Summary */}
          <VisibilitySummaryCard data={data} />

          {/* Tabbed Results */}
          <ScanResultsTabs
            data={data}
            brandName={brandName}
            category={category}
            url={url}
            competitors={competitors}
            selectedProviders={selectedProviders}
          />

          {/* Actions */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Button variant="outline" disabled>
              <Save className="mr-2 h-4 w-4" />
              Save Report
            </Button>
            <Button variant="outline" onClick={() => router.push('/dashboard/keywords')}>
              <TestTube className="mr-2 h-4 w-4" />
              Test Specific Keywords
            </Button>
            <Button variant="outline" onClick={() => router.push('/dashboard/content')}>
              <FileText className="mr-2 h-4 w-4" />
              Check Content
            </Button>
          </div>

          {/* New Scan */}
          <div className="flex justify-center">
            <Button variant="ghost" onClick={handleReset}>
              Run a new scan
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Visibility Summary Card                                            */
/* ------------------------------------------------------------------ */

function VisibilitySummaryCard({ data }: { data: KeywordDiscoveryResponse }) {
  const vis = resolveVisibilitySummary(data);
  if (!vis) return null;

  const score = vis.overall_visibility_score ?? 0;
  const { grade, label, textClass } = getScoreGrade(score);

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        {/* Main Score */}
        <div className="flex items-center gap-4">
          <div className={cn('text-5xl font-bold', textClass)}>{Math.round(score)}</div>
          <div>
            <Badge variant="outline" className={cn('text-sm', textClass)}>
              Grade {grade} — {label}
            </Badge>
            <p className="text-sm text-muted-foreground mt-1">Overall AI Visibility Score</p>
          </div>
        </div>

        {/* Sub-scores */}
        <div className="flex gap-6 sm:ml-auto">
          <div className="text-center">
            <p className="text-2xl font-semibold">{Math.round(vis.base_model_visibility)}</p>
            <p className="text-xs text-muted-foreground">Base Model</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold">{Math.round(vis.rag_model_visibility)}</p>
            <p className="text-xs text-muted-foreground">RAG Enhanced</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-semibold">{(vis.mention_rate * 100).toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground">Mention Rate</p>
          </div>
        </div>
      </div>

      {/* Confidence */}
      {vis.confidence_lower != null && vis.confidence_upper != null && (
        <p className="text-xs text-muted-foreground mt-3">
          Confidence interval: {vis.confidence_lower.toFixed(1)} – {vis.confidence_upper.toFixed(1)}
          {vis.confidence_level && ` (${vis.confidence_level})`}
        </p>
      )}

      {/* Meta */}
      <div className="flex flex-wrap gap-4 mt-4 text-xs text-muted-foreground">
        <span>Keywords tested: {vis.total_prompts_tested}</span>
        <span>Mode: {data.mode ?? data.discovery_mode ?? '—'}</span>
        <span>Time: {data.processing_time_seconds?.toFixed(1)}s</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Results Tabs                                                       */
/* ------------------------------------------------------------------ */

interface ScanResultsTabsProps {
  data: KeywordDiscoveryResponse;
  brandName: string;
  category: string;
  url: string;
  competitors: string;
  selectedProviders: ProviderSelection;
}

function ScanResultsTabs({ data, brandName, category, url, competitors, selectedProviders }: ScanResultsTabsProps) {
  return (
    <Tabs defaultValue="keywords" className="rounded-xl border bg-card shadow-sm">
      <TabsList className="w-full justify-start overflow-x-auto border-b bg-transparent px-4 pt-2">
        <TabsTrigger value="keywords" className="gap-1.5">
          <Key className="h-4 w-4" />
          <span className="hidden sm:inline">Keywords</span>
        </TabsTrigger>
        <TabsTrigger value="providers" className="gap-1.5">
          <BarChart3 className="h-4 w-4" />
          <span className="hidden sm:inline">Per-Provider</span>
        </TabsTrigger>
        <TabsTrigger value="generate" className="gap-1.5">
          <Sparkles className="h-4 w-4" />
          <span className="hidden sm:inline">Generate Keywords</span>
        </TabsTrigger>
      </TabsList>

      {/* Tab 1 — Keywords */}
      <TabsContent value="keywords" className="p-4">
        <KeywordsTab data={data} />
      </TabsContent>

      {/* Tab 2 — Per-Provider */}
      <TabsContent value="providers" className="p-4">
        <ProvidersTab data={data} />
      </TabsContent>

      {/* Tab 3 — Generate Keywords */}
      <TabsContent value="generate" className="p-4">
        <GenerateTab
          brandName={brandName}
          category={category}
          url={url}
          competitors={competitors}
          selectedProviders={selectedProviders}
          discoveryData={data}
        />
      </TabsContent>
    </Tabs>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab 1 — Keywords                                                   */
/* ------------------------------------------------------------------ */

function KeywordsTab({ data }: { data: KeywordDiscoveryResponse }) {
  const sections: { title: string; keywords: string[]; status: 'visible' | 'gap' | 'opportunity' }[] = [
    { title: 'Winning Keywords', keywords: data.your_winning_keywords ?? [], status: 'visible' },
    { title: 'Working Keywords', keywords: data.working_keywords ?? [], status: 'visible' },
    { title: 'Gap Keywords', keywords: data.gap_keywords ?? [], status: 'gap' },
  ];

  const opportunities = data.opportunities ?? [];

  const statusConfig = {
    visible:     { label: 'Visible',     className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
    gap:         { label: 'Gap',         className: 'bg-red-500/10 text-red-600 border-red-500/20' },
    opportunity: { label: 'Opportunity', className: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
  };

  return (
    <div className="space-y-6">
      {sections.map(section => (
        section.keywords.length > 0 && (
          <div key={section.title}>
            <h3 className="text-sm font-semibold mb-2">{section.title}</h3>
            <div className="flex flex-wrap gap-2">
              {section.keywords.map(kw => (
                <span
                  key={kw}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-sm',
                    statusConfig[section.status].className,
                  )}
                >
                  {kw}
                  <Badge variant="outline" className="text-[10px] px-1 py-0 ml-1">
                    {statusConfig[section.status].label}
                  </Badge>
                </span>
              ))}
            </div>
          </div>
        )
      ))}

      {opportunities.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-2">Opportunities</h3>
          <div className="space-y-2">
            {opportunities.map((opp, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border p-3">
                <Badge
                  variant="outline"
                  className={cn(
                    'mt-0.5 shrink-0 text-xs',
                    opp.priority === 'high' ? 'border-red-500/40 text-red-600'
                    : opp.priority === 'medium' ? 'border-amber-500/40 text-amber-600'
                    : 'border-muted-foreground/40',
                  )}
                >
                  {opp.priority}
                </Badge>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{opp.keyword}</p>
                  {opp.reason && <p className="text-xs text-muted-foreground mt-0.5">{opp.reason}</p>}
                  {opp.estimated_impact && (
                    <p className="text-xs text-muted-foreground">Impact: {opp.estimated_impact}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {sections.every(s => s.keywords.length === 0) && opportunities.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-6">No keyword data available.</p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab 2 — Per-Provider                                               */
/* ------------------------------------------------------------------ */

function ProvidersTab({ data }: { data: KeywordDiscoveryResponse }) {
  const llmBreakdown = data.visibility_by_llm;
  const promptResults = data.prompt_results;

  return (
    <div className="space-y-6">
      {/* Per-provider visibility scores */}
      {llmBreakdown && Object.keys(llmBreakdown).length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3">Visibility by Provider</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(llmBreakdown).map(([provider, value]) => {
              const info = LLM_PROVIDER_INFO[provider];
              const score = typeof value === 'number' ? value : (value as { visibility_score?: number })?.visibility_score ?? 0;
              const mentionRate = typeof value !== 'number' ? (value as { mention_rate?: number })?.mention_rate : undefined;

              return (
                <div key={provider} className="flex items-center gap-3 rounded-lg border p-3">
                  <span className="text-xl">{info?.icon ?? '🔮'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{info?.label ?? provider}</p>
                    {mentionRate != null && (
                      <p className="text-xs text-muted-foreground">
                        Mention rate: {(mentionRate * 100).toFixed(0)}%
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className={cn('text-lg font-semibold', info?.textClass)}>{Math.round(score)}</p>
                    <p className="text-xs text-muted-foreground">score</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Prompt-level results with provider breakdown */}
      {promptResults && promptResults.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3">Prompt Results</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 pr-4 font-medium">Prompt</th>
                  <th className="pb-2 pr-4 font-medium text-center">Mentioned</th>
                  <th className="pb-2 pr-4 font-medium text-center">Rate</th>
                  <th className="pb-2 font-medium text-center">Position</th>
                </tr>
              </thead>
              <tbody>
                {promptResults.slice(0, 20).map((pr, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-2 pr-4 max-w-xs truncate">{pr.prompt}</td>
                    <td className="py-2 pr-4 text-center">
                      {pr.brand_mentioned
                        ? <CheckCircle2 className="h-4 w-4 text-emerald-500 inline" />
                        : <XCircle className="h-4 w-4 text-red-400 inline" />
                      }
                    </td>
                    <td className="py-2 pr-4 text-center">{(pr.mention_rate * 100).toFixed(0)}%</td>
                    <td className="py-2 text-center">
                      {(pr.avg_position ?? pr.average_position) != null
                        ? `#${pr.avg_position ?? pr.average_position}`
                        : <Minus className="h-4 w-4 text-muted-foreground inline" />
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!llmBreakdown && !promptResults && (
        <p className="text-sm text-muted-foreground text-center py-6">No per-provider data available.</p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab 3 — Generate AI Keywords                                       */
/* ------------------------------------------------------------------ */

interface GenerateTabProps {
  brandName: string;
  category: string;
  url: string;
  competitors: string;
  selectedProviders: ProviderSelection;
  discoveryData: KeywordDiscoveryResponse;
}

function GenerateTab({ brandName, category, url, competitors, selectedProviders, discoveryData }: GenerateTabProps) {
  const { data: genData, loading, error, generate, reset } = useKeywordGeneration();

  const handleGenerate = useCallback(async () => {
    const splitCsv = (s: string) => s.split(',').map(v => v.trim()).filter(Boolean);

    await generate({
      brand_name: brandName.trim(),
      category: category.trim(),
      ...(url.trim() && { url: url.trim() }),
      ...(competitors.trim() && { competitors: splitCsv(competitors) }),
      llm_providers: Object.keys(selectedProviders),
      discovery_results: discoveryData as unknown as Record<string, unknown>,
    });
  }, [brandName, category, url, competitors, selectedProviders, discoveryData, generate]);

  // Group generated keywords by page_type
  const groupedKeywords = genData
    ? groupByPageType(genData)
    : null;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold">Generate AI-Citable Keywords</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Generate optimized keywords and phrases designed to improve your brand&apos;s citability across AI platforms.
        </p>
      </div>

      {!genData && (
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Generate AI-Citable Keywords
            </span>
          )}
        </Button>
      )}

      {loading && (
        <div className="rounded-lg border p-6 text-center space-y-2">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">
            Generating optimized keywords for your brand…
          </p>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
          <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {groupedKeywords && (
        <div className="space-y-4">
          {Object.entries(groupedKeywords).map(([pageType, keywords]) => (
            <div key={pageType} className="rounded-lg border p-4">
              <h4 className="text-sm font-semibold capitalize mb-2">
                {formatPageType(pageType)}
              </h4>
              <div className="flex flex-wrap gap-2">
                {(keywords as string[]).map((kw, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {kw}
                  </Badge>
                ))}
              </div>
            </div>
          ))}

          <Button variant="ghost" size="sm" onClick={reset}>
            Generate again
          </Button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function groupByPageType(data: Record<string, unknown>): Record<string, string[]> {
  const grouped: Record<string, string[]> = {};

  // Handle various response shapes
  const keywords = (data.keywords ?? data.generated_keywords ?? data.results) as
    | Array<{ keyword?: string; page_type?: string; text?: string; category?: string }>
    | Record<string, string[]>
    | undefined;

  if (Array.isArray(keywords)) {
    for (const item of keywords) {
      const type = item.page_type ?? item.category ?? 'general';
      const text = item.keyword ?? item.text ?? String(item);
      if (!grouped[type]) grouped[type] = [];
      grouped[type].push(text);
    }
  } else if (keywords && typeof keywords === 'object') {
    for (const [type, kws] of Object.entries(keywords)) {
      if (Array.isArray(kws)) {
        grouped[type] = kws.map(k => typeof k === 'string' ? k : (k as { keyword?: string }).keyword ?? String(k));
      }
    }
  }

  // If nothing parsed, show raw keys as categories
  if (Object.keys(grouped).length === 0 && data) {
    for (const [key, val] of Object.entries(data)) {
      if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'string') {
        grouped[key] = val as string[];
      }
    }
  }

  return grouped;
}

function formatPageType(type: string): string {
  return type
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}
