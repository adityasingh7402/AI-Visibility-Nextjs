'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useFullAnalysis } from '@/hooks/useGeo';
import { useSSEProgress } from '@/hooks/useSSEProgress';
import type { GeoAnalysisRequest, GeoProvider, ScanMode, IndustryProfile } from '@/lib/report-types';
import { AnalysisProgressBar } from '@/components/geo/AnalysisProgressBar';
import { ApiErrorToast } from '@/components/geo/ApiErrorToast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, ChevronDown, Rocket, Zap, Search as SearchIcon, Play } from 'lucide-react';

// ---------------------------------------------------------------------------
// Provider + model registry (local until backend provides it)
// ---------------------------------------------------------------------------
const PROVIDERS = [
  { id: 'chatgpt', name: 'ChatGPT', icon: '🤖', models: ['gpt-4o-mini', 'gpt-4o', 'gpt-4.1'] },
  { id: 'gemini', name: 'Gemini', icon: '✨', models: ['gemini-2.5-flash', 'gemini-2.0-flash'] },
  { id: 'perplexity', name: 'Perplexity', icon: '🔍', models: ['sonar-pro', 'sonar-reasoning'] },
  { id: 'claude', name: 'Claude', icon: '🧠', models: ['claude-sonnet-4-20250514', 'claude-haiku-4-20250514'] },
  { id: 'grok', name: 'Grok', icon: '⚡', models: ['grok-3-fast'] },
  { id: 'digitalocean', name: 'DigitalOcean', icon: '🌊', models: ['llama-3.3-70b'] },
] as const;

type ProviderId = (typeof PROVIDERS)[number]['id'];

const SCAN_MODES: { value: ScanMode; label: string; desc: string; icon: React.ReactNode }[] = [
  { value: 'quick', label: 'Quick', desc: '~2 min · core checks', icon: <Zap className="h-5 w-5" /> },
  { value: 'full', label: 'Full', desc: '~5 min · recommended', icon: <SearchIcon className="h-5 w-5" /> },
  { value: 'deep', label: 'Deep', desc: '~10 min · comprehensive', icon: <Rocket className="h-5 w-5" /> },
];

const FRIENDLY_STAGES: Record<string, string> = {
  queued: 'Preparing your analysis…',
  crawling: 'Reading your website…',
  researching: 'Researching your market…',
  testing_llms: 'Testing AI visibility…',
  analyzing_images: 'Analyzing visuals…',
  analyzing: 'Analyzing patterns…',
  optimizing: 'Generating recommendations…',
  verifying: 'Running quality checks…',
  completed: 'Analysis complete! Redirecting…',
  failed: 'Analysis encountered an error',
};

const INDUSTRY_OPTIONS: { value: IndustryProfile; label: string }[] = [
  { value: 'saas', label: 'SaaS' },
  { value: 'local_business', label: 'Local Business' },
  { value: 'ecommerce', label: 'E-Commerce' },
  { value: 'media_publisher', label: 'Media / Publisher' },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function AnalysisPage() {
  const router = useRouter();

  // --- Hook state ---
  const { analysisId, loading, error: hookError, submit, markComplete, markError, reset } = useFullAnalysis();
  const { progress, stageLabel, error: sseError } = useSSEProgress(analysisId);

  // --- Form state ---
  const [url, setUrl] = useState('');
  const [brandName, setBrandName] = useState('');
  const [category, setCategory] = useState('');
  const [aliases, setAliases] = useState('');
  const [competitors, setCompetitors] = useState('');
  const [brandDescription, setBrandDescription] = useState('');
  const [region, setRegion] = useState('');
  const [industryProfile, setIndustryProfile] = useState<IndustryProfile | ''>('');
  const [scanMode, setScanMode] = useState<ScanMode>('full');
  const [selectedProviders, setSelectedProviders] = useState<Set<ProviderId>>(
    new Set(['chatgpt', 'gemini', 'perplexity']),
  );
  const [selectedModels, setSelectedModels] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<unknown>(null);

  // --- Derived ---
  const isRunning = !!analysisId && loading;
  const isValid = url.trim().length > 0 && brandName.trim().length > 0 && selectedProviders.size > 0;

  // --- Auto-redirect on completion ---
  useEffect(() => {
    if (progress?.status === 'completed' && analysisId) {
      markComplete();
      const timer = setTimeout(() => router.push(`/dashboard/reports/${analysisId}`), 1500);
      return () => clearTimeout(timer);
    }
    if (progress?.status === 'failed') {
      markComplete();
    }
  }, [progress?.status, analysisId, router, markComplete]);

  // --- Handle SSE connection errors ---
  useEffect(() => {
    if (sseError && analysisId) {
      markError(sseError);
    }
  }, [sseError, analysisId, markError]);

  // --- Handlers ---
  const toggleProvider = useCallback((id: ProviderId) => {
    setSelectedProviders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!isValid) return;
    setApiError(null);

    const csvToArray = (s: string) =>
      s.split(',').map((v) => v.trim()).filter(Boolean);

    const request: GeoAnalysisRequest = {
      url: url.trim(),
      brand_name: brandName.trim(),
      providers: [...selectedProviders] as GeoProvider[],
      scan_mode: scanMode,
      ...(category && { category }),
      ...(aliases && { aliases: csvToArray(aliases) }),
      ...(competitors && { competitors: csvToArray(competitors) }),
      ...(brandDescription && { brand_description: brandDescription }),
      ...(region && { region }),
      ...(industryProfile && { industry_profile: industryProfile }),
      ...(Object.keys(selectedModels).length > 0 && { models: selectedModels }),
    };

    try {
      await submit(request);
    } catch (err) {
      setApiError(err);
    }
  }, [
    isValid, url, brandName, selectedProviders, scanMode, category,
    aliases, competitors, brandDescription, region, industryProfile,
    selectedModels, submit,
  ]);

  const friendlyStage = progress?.current_stage
    ? (FRIENDLY_STAGES[progress.current_stage] ?? stageLabel)
    : 'Starting up…';

  // =========================================================================
  // Progress view (replaces form when running)
  // =========================================================================
  if (isRunning || progress) {
    return (
      <div className="mx-auto max-w-2xl py-16 px-4 text-center space-y-8">
        <Globe className="mx-auto h-12 w-12 text-primary animate-pulse" />
        <h1 className="text-2xl font-bold">{friendlyStage}</h1>

        {progress && (
          <AnalysisProgressBar
            status={progress.status}
            currentStage={stageLabel}
            progressPercent={progress.progress_percent}
            stageProgressPercent={progress.stage_progress_percent}
            estimatedSecondsRemaining={progress.estimated_seconds_remaining}
          />
        )}

        {progress?.status === 'failed' && (
          <Button variant="outline" onClick={() => { reset(); setApiError(null); }}>
            Try Again
          </Button>
        )}

        <ApiErrorToast error={apiError ?? hookError} onDismiss={() => setApiError(null)} />
      </div>
    );
  }

  // =========================================================================
  // Form view
  // =========================================================================
  return (
    <div className="space-y-6 px-2 sm:px-4 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">GEO Analysis</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Measure how visible your brand is across AI assistants
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ---- Left column: Form ---- */}
        <div className="lg:col-span-8 space-y-6">
          {/* URL — hero input */}
          <div className="space-y-2">
            <Label htmlFor="url" className="text-base font-semibold">Website URL *</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-12 text-lg"
            />
          </div>

          {/* Brand + Category row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand Name *</Label>
              <Input
                id="brand"
                placeholder="Acme Corp"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="e.g. Project Management"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
          </div>

          {/* Optional details (collapsed) */}
          <Collapsible>
            <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ChevronDown className="h-4 w-4" />
              Optional Details
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="aliases">Brand Aliases</Label>
                  <Input
                    id="aliases"
                    placeholder="Comma-separated"
                    value={aliases}
                    onChange={(e) => setAliases(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="competitors">Competitors</Label>
                  <Input
                    id="competitors"
                    placeholder="Comma-separated"
                    value={competitors}
                    onChange={(e) => setCompetitors(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="desc">Brand Description</Label>
                  <Input
                    id="desc"
                    placeholder="Short description"
                    value={brandDescription}
                    onChange={(e) => setBrandDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Region</Label>
                  <Input
                    id="region"
                    placeholder="e.g. North America"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Industry Profile</Label>
                  <Select
                    value={industryProfile}
                    onValueChange={(v) => { if (v != null) setIndustryProfile(v as IndustryProfile); }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRY_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Scan Mode */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Scan Mode</Label>
            <div className="grid grid-cols-3 gap-3">
              {SCAN_MODES.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setScanMode(m.value)}
                  className={`rounded-lg border-2 p-4 text-left transition-all ${
                    scanMode === m.value
                      ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                      : 'border-border hover:border-muted-foreground/30'
                  }`}
                >
                  <div className="flex items-center gap-2 font-medium">
                    {m.icon}
                    {m.label}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{m.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* LLM Providers */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              AI Providers *
              <span className="text-xs font-normal text-muted-foreground ml-2">
                Select at least 1
              </span>
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PROVIDERS.map((p) => {
                const selected = selectedProviders.has(p.id);
                return (
                  <div key={p.id} className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => toggleProvider(p.id)}
                      className={`w-full rounded-lg border-2 p-3 text-left transition-all ${
                        selected
                          ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                          : 'border-border hover:border-muted-foreground/30'
                      }`}
                    >
                      <span className="text-lg mr-2">{p.icon}</span>
                      <span className="font-medium text-sm">{p.name}</span>
                    </button>
                    {selected && p.models.length > 1 && (
                      <Select
                        value={selectedModels[p.id] ?? ''}
                        onValueChange={(v) => {
                          if (v != null) setSelectedModels((prev) => ({ ...prev, [p.id]: v as string }));
                        }}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Default model" />
                        </SelectTrigger>
                        <SelectContent>
                          {p.models.map((m) => (
                            <SelectItem key={m} value={m} className="text-xs">
                              {m}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit (mobile — sidebar has it on desktop) */}
          <div className="lg:hidden pt-2">
            <Button
              className="w-full h-12 text-base"
              disabled={!isValid || loading}
              onClick={handleSubmit}
            >
              <Play className="h-4 w-4 mr-2" />
              Run Analysis
            </Button>
          </div>
        </div>

        {/* ---- Right column: Sticky sidebar ---- */}
        <div className="hidden lg:block lg:col-span-4">
          <div className="sticky top-24 rounded-xl border bg-card p-5 space-y-4 shadow-sm">
            <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
              Summary
            </h2>

            <dl className="space-y-2 text-sm">
              <SummaryRow label="URL" value={url || '—'} />
              <SummaryRow label="Brand" value={brandName || '—'} />
              {category && <SummaryRow label="Category" value={category} />}
              <SummaryRow
                label="Scan Mode"
                value={scanMode.charAt(0).toUpperCase() + scanMode.slice(1)}
              />
              <div>
                <dt className="text-muted-foreground">Providers</dt>
                <dd className="flex flex-wrap gap-1 mt-1">
                  {selectedProviders.size === 0 ? (
                    <span className="text-muted-foreground italic">None selected</span>
                  ) : (
                    [...selectedProviders].map((id) => {
                      const p = PROVIDERS.find((x) => x.id === id);
                      return p ? (
                        <Badge key={id} variant="secondary" className="text-xs">
                          {p.icon} {p.name}
                        </Badge>
                      ) : null;
                    })
                  )}
                </dd>
              </div>
            </dl>

            <Button
              className="w-full mt-2"
              size="lg"
              disabled={!isValid || loading}
              onClick={handleSubmit}
            >
              <Play className="h-4 w-4 mr-2" />
              Run Analysis
            </Button>

            {!isValid && (
              <p className="text-xs text-destructive">
                {!url.trim()
                  ? 'URL is required'
                  : !brandName.trim()
                    ? 'Brand name is required'
                    : 'Select at least 1 provider'}
              </p>
            )}
          </div>
        </div>
      </div>

      <ApiErrorToast error={apiError ?? hookError} onDismiss={() => setApiError(null)} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Small helper for sidebar rows
// ---------------------------------------------------------------------------
function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium truncate" title={value}>
        {value}
      </dd>
    </div>
  );
}
