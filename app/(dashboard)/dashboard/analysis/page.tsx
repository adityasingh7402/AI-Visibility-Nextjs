'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useFullAnalysis, useProviders } from '@/hooks/useGeo';
import { useSSEProgress } from '@/hooks/useSSEProgress';
import type { GeoAnalysisRequest, GeoAnalysisType, GeoProvider, ScanMode, IndustryProfile } from '@/lib/report-types';
import type { ProviderSelection } from '@/lib/types/providers';
import { ProviderSelector } from '@/components/geo/ProviderSelector';
import { AnalysisStageList } from '@/components/geo/AnalysisStageList';
import { ApiErrorToast } from '@/components/geo/ApiErrorToast';
import { clearActiveAnalysis, setActiveAnalysis } from '@/components/dashboard/ActiveAnalysisBanner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, Rocket, Zap, Search as SearchIcon, Play } from 'lucide-react';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SCAN_MODES: { value: ScanMode; label: string; desc: string; icon: React.ReactNode }[] = [
  { value: 'quick', label: 'Quick', desc: '~2 min · core checks', icon: <Zap className="h-5 w-5" /> },
  { value: 'full', label: 'Full', desc: '~5 min · recommended', icon: <SearchIcon className="h-5 w-5" /> },
  { value: 'deep', label: 'Deep', desc: '~10 min · comprehensive', icon: <Rocket className="h-5 w-5" /> },
];

const INDUSTRY_OPTIONS: { value: IndustryProfile; label: string }[] = [
  { value: 'saas', label: 'SaaS' },
  { value: 'local_business', label: 'Local Business' },
  { value: 'ecommerce', label: 'E-Commerce' },
  { value: 'media_publisher', label: 'Media / Publisher' },
];

const ANALYSIS_TYPES: { value: Extract<GeoAnalysisType, 'full' | 'aeo_scan'>; label: string; desc: string }[] = [
  { value: 'full', label: 'GEO Analysis', desc: 'Full 17-dimension analysis' },
  { value: 'aeo_scan', label: 'AEO Scan', desc: 'Fast answer-engine visibility check' },
];

const ANALYSIS_TYPE_META: Record<Extract<GeoAnalysisType, 'full' | 'aeo_scan'>, { scope: string; pipeline: string; bestFor: string }> = {
  full: {
    scope: '17 GEO dimensions with AEO included inside the full scorecard',
    pipeline: 'Full GEO pipeline',
    bestFor: 'Production benchmarking, competitors, roadmap, and full-site visibility work',
  },
  aeo_scan: {
    scope: '3 measured AEO core dimensions using the dedicated 5-node AEO workflow',
    pipeline: '5-node AEO pipeline',
    bestFor: 'Fast AI visibility checks focused on mentions, consistency, and answer positioning',
  },
};

const REGION_OPTIONS = [
  { value: 'global', label: 'Global' },
  { value: 'US', label: 'United States' },
  { value: 'IN', label: 'India' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'EU', label: 'Europe' },
  { value: 'APAC', label: 'APAC' },
];

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
];

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function AnalysisPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const presetAnalysisType = searchParams.get('analysis_type');
  const initialAnalysisType: GeoAnalysisType =
    presetAnalysisType === 'full' || presetAnalysisType === 'aeo_scan'
      ? presetAnalysisType
      : 'full';

  // --- Hook state ---
  const { analysisId, loading, error: hookError, submit, markComplete, markError, reset } = useFullAnalysis();
  const { progress, error: sseError } = useSSEProgress(analysisId);

  // --- Provider registry (dynamic from backend) ---
  const { providers: registry } = useProviders();

  // --- Form state ---
  const [url, setUrl] = useState('');
  const [brandName, setBrandName] = useState('');
  const [category, setCategory] = useState('');
  const [aliases, setAliases] = useState('');
  const [competitors, setCompetitors] = useState('');
  const [brandDescription, setBrandDescription] = useState('');
  const [region, setRegion] = useState('global');
  const [analysisType, setAnalysisType] = useState<Extract<GeoAnalysisType, 'full' | 'aeo_scan'>>(initialAnalysisType);
  const [industryProfile, setIndustryProfile] = useState<IndustryProfile | ''>('');
  const [targetAudiences, setTargetAudiences] = useState('');
  const [keyProducts, setKeyProducts] = useState('');
  const [uniqueSellingPoints, setUniqueSellingPoints] = useState('');
  const [brandTone, setBrandTone] = useState('');
  const [primaryLanguage, setPrimaryLanguage] = useState('en');
  const [scanMode, setScanMode] = useState<ScanMode>('full');
  const [providerSelection, setProviderSelection] = useState<ProviderSelection>({});
  const [apiError, setApiError] = useState<unknown>(null);

  // --- Derived ---
  const isRunning = !!analysisId && loading;
  const selectedProviderIds = Object.keys(providerSelection);
  const isValid = url.trim().length > 0
    && brandName.trim().length > 0
    && category.trim().length > 0
    && region.trim().length > 0
    && selectedProviderIds.length > 0;

  // Lookup display name for a provider ID
  const providerDisplayName = useCallback((id: string): string => {
    const p = registry?.providers.find((x) => x.id === id);
    return p?.display_name ?? id;
  }, [registry]);
  const analysisTypeLabel = useMemo(
    () => ANALYSIS_TYPES.find((t) => t.value === analysisType)?.label ?? analysisType,
    [analysisType]
  );
  const activeAnalysisMeta = useMemo(
    () => ANALYSIS_TYPE_META[analysisType] ?? ANALYSIS_TYPE_META.full,
    [analysisType]
  );
  const primaryLanguageLabel = useMemo(
    () => LANGUAGE_OPTIONS.find((l) => l.value === primaryLanguage)?.label ?? primaryLanguage,
    [primaryLanguage]
  );

  // --- Auto-redirect on completion ---
  useEffect(() => {
    if (progress?.status === 'completed' && analysisId) {
      clearActiveAnalysis();
      markComplete();
      // Use report_id from SSE complete event if available, else fall back to analysisId
      const targetId = progress.report_id || analysisId;
      const timer = setTimeout(() => router.push(`/dashboard/reports/${targetId}`), 2000);
      return () => clearTimeout(timer);
    }
    if (progress?.status === 'failed') {
      clearActiveAnalysis();
      markComplete();
    }
  }, [progress?.status, progress?.report_id, analysisId, router, markComplete]);

  // --- Handle SSE connection errors ---
  useEffect(() => {
    if (sseError && analysisId) {
      markError(sseError);
    }
  }, [sseError, analysisId, markError]);

  // --- Handlers ---

  const handleSubmit = useCallback(async () => {
    if (!isValid) return;
    setApiError(null);

    const csvToArray = (s: string) =>
      s.split(',').map((v) => v.trim()).filter(Boolean);

    // Build models map: only include non-default selections
    const models: Record<string, string> = {};
    for (const [pid, mid] of Object.entries(providerSelection)) {
      if (mid) models[pid] = mid;
    }

    const request: GeoAnalysisRequest = {
      url: url.trim(),
      brand_name: brandName.trim(),
      category: category.trim(),
      region: region.trim(),
      analysis_type: analysisType,
      providers: selectedProviderIds as GeoProvider[],
      scan_mode: scanMode,
      ...(aliases && { aliases: csvToArray(aliases) }),
      ...(competitors && { competitors: csvToArray(competitors) }),
      ...(brandDescription && { brand_description: brandDescription }),
      ...(targetAudiences && { target_audiences: csvToArray(targetAudiences) }),
      ...(keyProducts && { key_products: csvToArray(keyProducts) }),
      ...(uniqueSellingPoints && { unique_selling_points: csvToArray(uniqueSellingPoints) }),
      ...(brandTone && { brand_tone: brandTone.trim() }),
      ...(primaryLanguage && { primary_language: primaryLanguage.trim() }),
      ...(industryProfile && { industry_profile: industryProfile }),
      ...(Object.keys(models).length > 0 && { models }),
    };

    try {
      const result = await submit(request);
      if (result?.analysis_id) {
        setActiveAnalysis(result.analysis_id, brandName.trim(), analysisType);
      }
    } catch (err) {
      setApiError(err);
    }
  }, [
    isValid, url, brandName, selectedProviderIds, scanMode, category, region, analysisType,
    aliases, competitors, brandDescription, targetAudiences, keyProducts,
    uniqueSellingPoints, brandTone, primaryLanguage, industryProfile,
    providerSelection, submit,
  ]);

  // =========================================================================
  // Progress view (replaces form when running)
  // =========================================================================
  if (isRunning || progress) {
    const providerNames = selectedProviderIds.map(providerDisplayName);
    const timeConfig = { scanMode, providerCount: selectedProviderIds.length };
    const isComplete = progress?.status === 'completed';
    const hasFailed = progress?.status === 'failed';

    return (
      <div className="mx-auto max-w-2xl py-12 px-4 space-y-8">
        {/* Stage list with per-provider sub-progress */}
        <AnalysisStageList
          progress={progress}
          analysisType={analysisType}
          brandName={brandName || undefined}
          providerNames={providerNames}
          timeConfig={timeConfig}
        />

        {/* Navigate-away safe messaging */}
        {!isComplete && !hasFailed && (
          <div className="text-center space-y-3 rounded-xl border border-border bg-muted/30 p-5">
            <p className="text-sm text-muted-foreground">
              📌 Feel free to explore other pages — we&apos;ll send you a notification when your report is ready.
            </p>
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard')}
              className="text-sm"
            >
              Continue Exploring →
            </Button>
          </div>
        )}

        {/* Failure retry */}
        {hasFailed && (
          <div className="text-center">
            <Button variant="outline" onClick={() => { reset(); setApiError(null); }}>
              Try Again
            </Button>
          </div>
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
        <h1 className="text-2xl font-bold tracking-tight">AI Visibility Analysis</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Run focused AEO scans or full GEO analyses across AI assistants
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

          {/* Core required fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                placeholder="e.g. Project Management"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Region *</Label>
              <Select value={region} onValueChange={(v) => { if (v != null) setRegion(v); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {REGION_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Analysis type */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Analysis Type *</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ANALYSIS_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setAnalysisType(t.value)}
                  className={`rounded-lg border-2 p-3 text-left transition-all ${
                    analysisType === t.value
                      ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                      : 'border-border hover:border-muted-foreground/30'
                  }`}
                >
                  <div className="font-medium">{t.label}</div>
                  <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
                </button>
              ))}
            </div>
            <div className="rounded-xl border bg-muted/30 p-4 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="font-semibold">{analysisTypeLabel}</Badge>
                <span className="text-xs text-muted-foreground">{activeAnalysisMeta.pipeline}</span>
              </div>
              <p className="text-sm text-foreground">
                <span className="font-medium">Scope:</span> {activeAnalysisMeta.scope}
              </p>
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Best for:</span> {activeAnalysisMeta.bestFor}
              </p>
            </div>
          </div>

          {/* Advanced options (collapsed) */}
          <Collapsible>
            <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ChevronDown className="h-4 w-4" />
              Advanced Options
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
                  <Label htmlFor="targetAudiences">Target Audiences</Label>
                  <Input
                    id="targetAudiences"
                    placeholder="Comma-separated (e.g. SMB owners, CTOs)"
                    value={targetAudiences}
                    onChange={(e) => setTargetAudiences(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="keyProducts">Key Products / Services</Label>
                  <Input
                    id="keyProducts"
                    placeholder="Comma-separated"
                    value={keyProducts}
                    onChange={(e) => setKeyProducts(e.target.value)}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="usps">Unique Selling Points</Label>
                  <Input
                    id="usps"
                    placeholder="Comma-separated differentiators"
                    value={uniqueSellingPoints}
                    onChange={(e) => setUniqueSellingPoints(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brandTone">Brand Tone</Label>
                  <Input
                    id="brandTone"
                    placeholder="e.g. professional, technical, playful"
                    value={brandTone}
                    onChange={(e) => setBrandTone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Primary Language</Label>
                  <Select value={primaryLanguage} onValueChange={(v) => { if (v != null) setPrimaryLanguage(v); }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGE_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2">
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
                <div className="sm:col-span-2">
                  <p className="text-xs text-muted-foreground">
                    Advanced options improve scoring quality, prompt relevance, and regional targeting.
                  </p>
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
            </Label>
            <p className="text-xs text-muted-foreground">
              Pick providers and models to test. You can search, bulk-select, or choose recommended defaults.
            </p>
            <ProviderSelector
              selected={providerSelection}
              onChange={setProviderSelection}
            />
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
              <SummaryRow label="Region" value={region || '—'} />
              <SummaryRow label="Analysis Type" value={analysisTypeLabel} />
              <SummaryRow
                label="Scan Mode"
                value={scanMode.charAt(0).toUpperCase() + scanMode.slice(1)}
              />
              <SummaryRow label="Language" value={primaryLanguageLabel} />
              <div>
                <dt className="text-muted-foreground">Providers</dt>
                <dd className="flex flex-wrap gap-1 mt-1">
                  {selectedProviderIds.length === 0 ? (
                    <span className="text-muted-foreground italic">None selected</span>
                  ) : (
                    selectedProviderIds.map((id) => (
                      <Badge key={id} variant="secondary" className="text-xs">
                        {providerDisplayName(id)}
                      </Badge>
                    ))
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
                    : !category.trim()
                      ? 'Category is required'
                      : !region.trim()
                        ? 'Region is required'
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
