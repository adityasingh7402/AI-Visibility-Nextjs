'use client';

import { useState, useCallback } from 'react';
import { useKeywordDiscovery } from '@/hooks/useGeo';
import { useSSEProgress } from '@/hooks/useSSEProgress';
import { ScoreCard } from '@/components/geo/ScoreCard';
import { KeywordList } from '@/components/geo/KeywordList';
import { CompetitorCard } from '@/components/geo/CompetitorCard';
import { OpportunityCard } from '@/components/geo/OpportunityCard';
import { AnalysisProgressBar } from '@/components/geo/AnalysisProgressBar';
import { ApiErrorToast } from '@/components/geo/ApiErrorToast';
import { LLMBreakdownTable } from '@/components/geo/LLMBreakdownTable';
import { ContentGapCard } from '@/components/geo/ContentGapCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import type { DiscoveryMode, LLMProvider, KeywordDiscoveryRequest } from '@/lib/geo-types';
import { resolveVisibilitySummary } from '@/lib/geo-types';
import {
  Search, ChevronDown, RotateCcw, Zap, Timer, Microscope,
  TrendingUp, Key, Users, BarChart3, FileWarning, Lightbulb,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const PROVIDERS: { id: LLMProvider; name: string; icon: string; models: string[] }[] = [
  { id: 'chatgpt',      name: 'ChatGPT',        icon: '🤖', models: ['gpt-4o-mini', 'gpt-4o'] },
  { id: 'gemini',       name: 'Gemini',          icon: '✨', models: ['gemini-2.5-flash'] },
  { id: 'perplexity',   name: 'Perplexity',      icon: '🔍', models: ['sonar-pro'] },
  { id: 'claude',       name: 'Claude',          icon: '🧠', models: ['claude-sonnet-4-20250514'] },
  { id: 'grok',         name: 'Grok',            icon: '⚡', models: ['grok-3-fast'] },
  { id: 'digitalocean', name: 'DigitalOcean',    icon: '🌊', models: ['llama-3.3-70b'] },
];

const DISCOVERY_MODES: { id: DiscoveryMode; label: string; time: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'quick',    label: 'Quick',    time: '~30s', icon: <Zap className="h-5 w-5" />,        desc: 'Fast scan, fewer prompts' },
  { id: 'standard', label: 'Standard', time: '~60s', icon: <Timer className="h-5 w-5" />,      desc: 'Balanced depth & speed' },
  { id: 'deep',     label: 'Deep',     time: '~90s', icon: <Microscope className="h-5 w-5" />, desc: 'Maximum prompt coverage' },
];

const DEFAULT_PROVIDERS: LLMProvider[] = ['chatgpt', 'gemini', 'perplexity'];

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function KeywordDiscoveryPage() {
  // ── Form state ──
  const [brandName, setBrandName] = useState('');
  const [category, setCategory] = useState('');
  const [mode, setMode] = useState<DiscoveryMode>('standard');
  const [selectedProviders, setSelectedProviders] = useState<LLMProvider[]>(DEFAULT_PROVIDERS);
  const [optionalOpen, setOptionalOpen] = useState(false);
  const [competitors, setCompetitors] = useState('');
  const [aliases, setAliases] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [region, setRegion] = useState('');

  // ── API / progress state ──
  const { data, loading, error, discover, reset } = useKeywordDiscovery();
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const { progress, stageLabel } = useSSEProgress(analysisId);

  // ── Derived ──
  const vis = data ? resolveVisibilitySummary(data) : null;
  const hasResults = !!data;
  const canSubmit = brandName.trim().length > 0 && category.trim().length > 0 && selectedProviders.length > 0 && !loading;

  // ── Handlers ──
  const toggleProvider = useCallback((id: LLMProvider) => {
    setSelectedProviders(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id],
    );
  }, []);

  const handleSubmit = useCallback(async () => {
    const splitCsv = (s: string) => s.split(',').map(v => v.trim()).filter(Boolean);

    const req: KeywordDiscoveryRequest = {
      brand_name: brandName.trim(),
      category: category.trim(),
      mode,
      llm_providers: selectedProviders,
      region: 'global',
      runs_per_prompt: 1,
      ...(competitors && { competitors: splitCsv(competitors) }),
      ...(aliases && { brand_aliases: splitCsv(aliases) }),
      ...(targetAudience && { target_audience: targetAudience.trim() }),
      ...(region && { region: region.trim() as KeywordDiscoveryRequest['region'] }),
    };

    try {
      const result = await discover(req);
      setAnalysisId(result.analysis_id ?? null);
    } catch {
      // error is surfaced via the hook
    }
  }, [brandName, category, mode, selectedProviders, competitors, aliases, targetAudience, region, discover]);

  const handleReset = useCallback(() => {
    reset();
    setAnalysisId(null);
    setBrandName('');
    setCategory('');
    setMode('standard');
    setSelectedProviders(DEFAULT_PROVIDERS);
    setOptionalOpen(false);
    setCompetitors('');
    setAliases('');
    setTargetAudience('');
    setRegion('');
  }, [reset]);

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
      {/* ── Header ── */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Keyword Discovery</h1>
        <p className="mt-1 text-muted-foreground">
          Find how your brand appears across AI models — discover keywords, gaps, and opportunities.
        </p>
      </div>

      {/* ── Form Card ── */}
      <div className={`rounded-xl border bg-card p-6 shadow-sm transition-all ${hasResults ? 'ring-1 ring-primary/20' : ''}`}>

        {/* Brand Name — Hero Input */}
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

        {/* Discovery Mode — Visual Cards */}
        <div className="mt-6 space-y-3">
          <Label className="text-base font-semibold">Discovery Mode</Label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {DISCOVERY_MODES.map(dm => (
              <button
                key={dm.id}
                type="button"
                onClick={() => setMode(dm.id)}
                className={`flex flex-col items-center gap-1.5 rounded-lg border-2 p-4 transition-all
                  ${mode === dm.id
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-muted hover:border-primary/40'
                  }`}
              >
                {dm.icon}
                <span className="font-medium">{dm.label}</span>
                <Badge variant="secondary" className="text-xs">{dm.time}</Badge>
                <span className="text-xs text-muted-foreground">{dm.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* LLM Providers — Toggle Cards */}
        <div className="mt-6 space-y-3">
          <Label className="text-base font-semibold">LLM Providers</Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {PROVIDERS.map(p => {
              const active = selectedProviders.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggleProvider(p.id)}
                  className={`flex flex-col items-center gap-1 rounded-lg border-2 px-3 py-3 text-sm transition-all
                    ${active
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-muted opacity-60 hover:border-primary/40 hover:opacity-100'
                    }`}
                >
                  <span className="text-xl">{p.icon}</span>
                  <span className="font-medium leading-tight">{p.name}</span>
                </button>
              );
            })}
          </div>
          {selectedProviders.length === 0 && (
            <p className="text-sm text-destructive">Select at least one provider</p>
          )}
        </div>

        {/* Optional Details — Collapsible */}
        <Collapsible open={optionalOpen} onOpenChange={setOptionalOpen} className="mt-6">
          <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ChevronDown className={`h-4 w-4 transition-transform ${optionalOpen ? 'rotate-180' : ''}`} />
            Optional Details
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="competitors">Competitors</Label>
              <Input id="competitors" placeholder="Comma-separated" value={competitors} onChange={e => setCompetitors(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="aliases">Brand Aliases</Label>
              <Input id="aliases" placeholder="Comma-separated" value={aliases} onChange={e => setAliases(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="audience">Target Audience</Label>
              <Input id="audience" placeholder="e.g. SMBs, developers…" value={targetAudience} onChange={e => setTargetAudience(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="region">Region</Label>
              <Input id="region" placeholder="e.g. north_america, europe…" value={region} onChange={e => setRegion(e.target.value)} />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Submit */}
        <Button
          className="mt-6 w-full h-12 text-base"
          size="lg"
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Discovering…
            </span>
          ) : (
            <span className="flex items-center gap-2"><Search className="h-5 w-5" /> Discover Keywords</span>
          )}
        </Button>
      </div>

      {/* ── Error Toast ── */}
      <ApiErrorToast error={error} />

      {/* ── Progress ── */}
      {loading && progress && (
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <AnalysisProgressBar
            status={progress.status}
            currentStage={stageLabel}
            progressPercent={progress.progress_percent}
            stageProgressPercent={progress.stage_progress_percent}
            estimatedSecondsRemaining={progress.estimated_seconds_remaining}
          />
        </div>
      )}

      {/* ── Results ── */}
      {hasResults && (
        <div className="space-y-6">
          {/* Visibility Score Cards */}
          {vis && (
            <div className="grid gap-4 sm:grid-cols-3">
              <ScoreCard
                label="Overall Visibility"
                score={vis.overall_visibility_score ?? 0}
                description="Combined score across all tested LLMs"
                size="lg"
                confidenceLower={vis.confidence_lower}
                confidenceUpper={vis.confidence_upper}
                confidenceLevel={vis.confidence_level}
              />
              <ScoreCard
                label="Base Model"
                score={vis.base_model_visibility}
                description="Visibility in standard LLM responses"
              />
              <ScoreCard
                label="RAG Model"
                score={vis.rag_model_visibility}
                description="Visibility in retrieval-augmented responses"
              />
            </div>
          )}

          {/* Tabbed Results */}
          <ResultsTabs data={data} />

          {/* Recommended Next Steps */}
          {(data.recommended_next_steps ?? data.next_steps)?.length ? (
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
                <Lightbulb className="h-5 w-5 text-yellow-500" /> Recommended Next Steps
              </h3>
              <ul className="space-y-2">
                {(data.recommended_next_steps ?? data.next_steps)!.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Badge variant="outline" className="mt-0.5 shrink-0">{i + 1}</Badge>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* New Discovery */}
          <div className="flex justify-center">
            <Button variant="outline" size="lg" onClick={handleReset}>
              <RotateCcw className="mr-2 h-4 w-4" /> New Discovery
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Results Tabs (extracted for clarity)                                */
/* ------------------------------------------------------------------ */

import type { KeywordDiscoveryResponse } from '@/lib/geo-types';

function ResultsTabs({ data }: { data: KeywordDiscoveryResponse }) {
  const opportunities = data.opportunities ?? [];
  const allKeywords = [
    ...(data.working_keywords ?? []),
    ...(data.gap_keywords ?? []),
    ...(data.your_winning_keywords ?? []),
  ];
  const competitors = data.competitor_patterns ?? [];
  const llmBreakdown = data.visibility_by_llm;
  const contentGap = data.content_gap_analysis;

  // Build tabs dynamically — only show tabs with data
  const tabs: { id: string; label: string; icon: React.ReactNode; count?: number }[] = [];
  if (opportunities.length)          tabs.push({ id: 'opportunities', label: 'Opportunities', icon: <TrendingUp className="h-4 w-4" />, count: opportunities.length });
  if (allKeywords.length)            tabs.push({ id: 'keywords',      label: 'Keywords',      icon: <Key className="h-4 w-4" />,         count: allKeywords.length });
  if (competitors.length)            tabs.push({ id: 'competitors',   label: 'Competitors',   icon: <Users className="h-4 w-4" />,       count: competitors.length });
  if (llmBreakdown && Object.keys(llmBreakdown).length) tabs.push({ id: 'llm', label: 'LLM Breakdown', icon: <BarChart3 className="h-4 w-4" /> });
  if (contentGap)                    tabs.push({ id: 'gaps',          label: 'Content Gaps',  icon: <FileWarning className="h-4 w-4" /> });

  if (tabs.length === 0) return null;

  return (
    <Tabs defaultValue={tabs[0].id} className="rounded-xl border bg-card shadow-sm">
      <TabsList className="w-full justify-start overflow-x-auto border-b bg-transparent px-4 pt-2">
        {tabs.map(t => (
          <TabsTrigger key={t.id} value={t.id} className="gap-1.5 data-[state=active]:shadow-none">
            {t.icon}
            <span className="hidden sm:inline">{t.label}</span>
            {t.count != null && <Badge variant="secondary" className="ml-1 text-xs">{t.count}</Badge>}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Opportunities */}
      <TabsContent value="opportunities" className="p-4 space-y-3">
        {opportunities.map((opp, i) => (
          <OpportunityCard key={i} opportunity={opp} index={i} />
        ))}
      </TabsContent>

      {/* Keywords */}
      <TabsContent value="keywords" className="p-4 space-y-4">
        {(data.your_winning_keywords ?? []).length > 0 && (
          <KeywordList keywords={data.your_winning_keywords!} type="winning" emptyMessage="No winning keywords yet" />
        )}
        {(data.working_keywords ?? []).length > 0 && (
          <KeywordList keywords={data.working_keywords!} type="working" emptyMessage="No working keywords yet" />
        )}
        {(data.gap_keywords ?? []).length > 0 && (
          <KeywordList keywords={data.gap_keywords!} type="gap" emptyMessage="No gap keywords found" />
        )}
      </TabsContent>

      {/* Competitors */}
      <TabsContent value="competitors" className="p-4 space-y-3">
        {competitors.map((comp, i) => (
          <CompetitorCard key={i} competitor={comp} />
        ))}
      </TabsContent>

      {/* LLM Breakdown */}
      <TabsContent value="llm" className="p-4">
        {llmBreakdown && (
          <LLMBreakdownTable visibilityByLLM={llmBreakdown} confidenceByLLM={data.confidence_by_llm} />
        )}
      </TabsContent>

      {/* Content Gaps */}
      <TabsContent value="gaps" className="p-4">
        {contentGap && <ContentGapCard gapAnalysis={contentGap} />}
      </TabsContent>
    </Tabs>
  );
}
