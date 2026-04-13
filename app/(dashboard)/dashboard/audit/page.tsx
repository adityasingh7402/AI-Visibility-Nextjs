'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useFullAnalysis } from '@/hooks/useGeo';
import { useSSEProgress } from '@/hooks/useSSEProgress';
import { useNotifications } from '@/hooks/useNotifications';
import type { GeoAnalysisRequest, GeoProvider, ScanMode } from '@/lib/report-types';
import type { ProviderSelection } from '@/lib/types/providers';
import { ProviderSelector } from '@/components/geo/ProviderSelector';
import { ApiErrorToast } from '@/components/geo/ApiErrorToast';
import { setActiveAnalysis } from '@/components/dashboard/ActiveAnalysisBanner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Globe, ChevronDown, Rocket, Zap, Search as SearchIcon, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Scan mode options
const SCAN_MODES: { value: ScanMode; label: string; desc: string; icon: React.ReactNode }[] = [
  { value: 'quick', label: 'Quick', desc: '~2 min · core checks', icon: <Zap className="h-5 w-5" /> },
  { value: 'full', label: 'Full', desc: '~5 min · recommended', icon: <SearchIcon className="h-5 w-5" /> },
  { value: 'deep', label: 'Deep', desc: '~10 min · comprehensive', icon: <Rocket className="h-5 w-5" /> },
];

// Friendly stage messages
const FRIENDLY_STAGES: Record<string, string> = {
  queued: 'Preparing your analysis…',
  crawling: 'Reading your website…',
  researching: 'Researching your market…',
  testing_llms: 'Testing AI visibility across providers…',
  analyzing_images: 'Analyzing visuals…',
  analyzing: 'Analyzing patterns…',
  optimizing: 'Generating recommendations…',
  verifying: 'Running quality checks…',
  completed: 'Analysis complete! Redirecting…',
  failed: 'Analysis encountered an error',
};

export default function FullSiteAuditPage() {
  const router = useRouter();
  const { submit, loading: submitting, error: submitError, analysisId, markComplete, markError } = useFullAnalysis();
  const { addNotification } = useNotifications();

  // Form state
  const [url, setUrl] = useState('');
  const [brandName, setBrandName] = useState('');
  const [category, setCategory] = useState('');
  const [scanMode, setScanMode] = useState<ScanMode>('full');
  const [selectedProviders, setSelectedProviders] = useState<ProviderSelection>({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Advanced options
  const [competitors, setCompetitors] = useState('');
  const [aliases, setAliases] = useState('');
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState('global');

  // SSE progress
  const { progress: sseProgress, error: sseError, stageLabel } = useSSEProgress(analysisId ?? null);
  const stage = sseProgress?.current_stage ?? sseProgress?.status ?? null;
  const percent = sseProgress?.progress_percent ?? 0;

  // Track if we already redirected
  const redirectedRef = useRef(false);

  // Inline validation
  const urlValid = /^https?:\/\/.+/.test(url.trim());
  const brandValid = brandName.trim().length > 0;
  const categoryValid = category.trim().length > 0;
  const providersValid = Object.keys(selectedProviders).length > 0;

  // Auto-redirect when analysis completes
  useEffect(() => {
    if (stage === 'completed' && analysisId && !redirectedRef.current) {
      redirectedRef.current = true;
      markComplete();
      
      const targetId = sseProgress?.report_id || analysisId;
      addNotification({
        type: 'success',
        title: 'Analysis Complete',
        message: 'Your AI visibility report has been successfully generated.',
        link: `/dashboard/reports/${targetId}`
      });
      
      const timer = setTimeout(() => {
        router.push(`/dashboard/reports/${targetId}`);
      }, 2000);
      return () => clearTimeout(timer);
    }
    if (stage === 'failed') {
      markError('Analysis failed');
      addNotification({
        type: 'error',
        title: 'Analysis Failed',
        message: 'There was an error generating your report. Please check the details and try again.',
      });
    }
  }, [stage, analysisId, sseProgress?.report_id, router, markComplete, markError, addNotification]);

  const canSubmit = urlValid && brandValid && categoryValid && providersValid && !submitting && !analysisId;

  const handleSubmit = useCallback(async () => {
    // Mark all fields as touched to show validation errors
    setTouched({ url: true, brand: true, category: true, providers: true });

    if (!canSubmit) {
      toast.error('Please fix the errors below', {
        description: !urlValid ? 'A valid URL is required (e.g. https://example.com)'
          : !brandValid ? 'Brand name is required'
          : !categoryValid ? 'Category is required (e.g. SaaS, E-commerce)'
          : 'Select at least 1 AI provider',
      });
      return;
    }

    const providerIds = Object.keys(selectedProviders);
    const models: Record<string, string> = {};
    for (const [pid, mid] of Object.entries(selectedProviders)) {
      if (mid) models[pid] = mid;
    }

    const request: GeoAnalysisRequest = {
      url: url.trim(),
      brand_name: brandName.trim(),
      category: category.trim(),
      scan_mode: scanMode,
      providers: providerIds as GeoProvider[],
      ...(Object.keys(models).length > 0 && { models }),
      ...(competitors.trim() && { competitors: competitors.split(',').map((c) => c.trim()).filter(Boolean) }),
      ...(aliases.trim() && { aliases: aliases.split(',').map((a) => a.trim()).filter(Boolean) }),
      ...(description.trim() && { brand_description: description.trim() }),
      ...(region && region !== 'global' && { region }),
    };

    redirectedRef.current = false;
    try {
      const result = await submit(request);
      if (result?.analysis_id) {
        setActiveAnalysis(result.analysis_id, brandName.trim());
        toast.success('Analysis submitted!', {
          description: `Analyzing "${brandName.trim()}" — this may take a few minutes.`,
        });
      }
    } catch {
      toast.error('Failed to submit analysis', { description: 'Please check the error details below.' });
    }
  }, [canSubmit, urlValid, brandValid, categoryValid, url, brandName, scanMode, selectedProviders, category, competitors, aliases, description, region, submit]);

  const isRunning = !!analysisId && stage !== 'completed' && stage !== 'failed';
  const friendlyMessage = stageLabel || (stage ? FRIENDLY_STAGES[stage] ?? `Processing: ${stage}…` : 'Submitting analysis…');

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Globe className="h-6 w-6 text-primary" />
          Full Site Audit
        </h1>
        <p className="text-muted-foreground mt-1">
          Comprehensive GEO/AEO analysis of your website across AI platforms
        </p>
      </div>

      {/* Show progress when running */}
      {(submitting || isRunning) && (
        <div className="rounded-xl border bg-card p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-3">
            {stage === 'completed' ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : stage === 'failed' ? (
              <AlertCircle className="h-5 w-5 text-destructive" />
            ) : (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            )}
            <p className="font-medium">{friendlyMessage}</p>
          </div>

          {/* Progress bar */}
          {typeof percent === 'number' && (
            <div className="space-y-1">
              <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-blue-400 transition-all duration-700 ease-out"
                  style={{ width: `${Math.min(percent, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-right font-mono">{Math.round(percent)}%</p>
            </div>
          )}

          {/* Navigate-away safe messaging */}
          {!stage?.match(/completed|failed/) && (
            <div className="text-center py-2">
              <p className="text-sm text-muted-foreground">
                📌 You can navigate away — we&apos;ll notify you when your report is ready.
              </p>
            </div>
          )}

          {sseError && (
            <p className="text-sm text-destructive">{sseError}</p>
          )}
        </div>
      )}

      {/* Form (hidden while running) */}
      {!isRunning && !submitting && (
        <div className="space-y-6">
          {/* URL — Hero Input */}
          <div className="space-y-2">
            <Label htmlFor="url" className="text-base font-semibold">Website URL *</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onBlur={() => setTouched(t => ({ ...t, url: true }))}
              className={cn('h-12 text-lg', touched.url && !urlValid && url.trim() && 'border-destructive focus-visible:ring-destructive')}
              autoFocus
            />
            {touched.url && !urlValid && url.trim() ? (
              <p className="text-xs text-destructive">Please enter a valid URL starting with https://</p>
            ) : (
              <p className="text-xs text-muted-foreground">Enter the URL you want to audit for AI visibility</p>
            )}
          </div>

          {/* Brand Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand Name *</Label>
              <Input
                id="brand"
                placeholder="e.g. Acme Corp"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, brand: true }))}
                className={cn(touched.brand && !brandValid && 'border-destructive focus-visible:ring-destructive')}
              />
              {touched.brand && !brandValid && (
                <p className="text-xs text-destructive">Brand name is required</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                placeholder="e.g. SaaS, E-commerce, Developer Tools"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, category: true }))}
                className={cn(touched.category && !categoryValid && 'border-destructive focus-visible:ring-destructive')}
              />
              {touched.category && !categoryValid ? (
                <p className="text-xs text-destructive">Category is required for accurate analysis</p>
              ) : (
                <p className="text-xs text-muted-foreground">Helps AI understand your competitive landscape</p>
              )}
            </div>
          </div>

          {/* Advanced Options */}
          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ChevronDown className={cn('h-4 w-4 transition-transform', showAdvanced && 'rotate-180')} />
              Advanced Options
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="competitors">Competitors (comma-separated)</Label>
                <Input
                  id="competitors"
                  placeholder="e.g. Competitor A, Competitor B"
                  value={competitors}
                  onChange={(e) => setCompetitors(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aliases">Brand Aliases (comma-separated)</Label>
                <Input
                  id="aliases"
                  placeholder="e.g. Acme, ACME Corp, acme.com"
                  value={aliases}
                  onChange={(e) => setAliases(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Brand Description</Label>
                <Input
                  id="desc"
                  placeholder="Brief description of what your brand does"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Input
                  id="region"
                  placeholder="e.g. US, EU, global"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Scan Mode */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Scan Mode</Label>
            <div className="grid grid-cols-3 gap-3">
              {SCAN_MODES.map((mode) => (
                <button
                  key={mode.value}
                  type="button"
                  onClick={() => setScanMode(mode.value)}
                  className={cn(
                    'rounded-xl border-2 p-4 text-left transition-all',
                    scanMode === mode.value
                      ? 'border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm'
                      : 'border-border hover:border-muted-foreground/30'
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {mode.icon}
                    <span className="font-medium">{mode.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{mode.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Provider Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">AI Providers *</Label>
            <ProviderSelector
              selected={selectedProviders}
              onChange={setSelectedProviders}
            />
            {touched.providers && !providersValid && (
              <p className="text-xs text-destructive">Select at least 1 AI provider</p>
            )}
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            size="lg"
            className="w-full h-12 text-base font-semibold"
          >
            <Globe className="h-5 w-5 mr-2" />
            Start Full Audit
          </Button>
        </div>
      )}

      {/* Error display */}
      {submitError && <ApiErrorToast error={submitError} />}
    </div>
  );
}
