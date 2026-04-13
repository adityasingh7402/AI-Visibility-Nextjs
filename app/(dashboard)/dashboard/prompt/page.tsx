'use client';

import { useState, useCallback } from 'react';
import { usePromptCheck } from '@/hooks/useGeo';
import type { ProviderSelection } from '@/lib/types/providers';
import { ProviderSelector } from '@/components/geo/ProviderSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function PromptCheckPage() {
  const { data, loading, error, check, reset } = usePromptCheck();

  const [brandName, setBrandName] = useState('');
  const [query, setQuery] = useState('');
  const [selectedProviders, setSelectedProviders] = useState<ProviderSelection>({});

  const canSubmit = brandName.trim() && query.trim() && Object.keys(selectedProviders).length > 0 && !loading;

  const handleSubmit = useCallback(async () => {
    if (!brandName.trim()) {
      toast.error('Brand name is required');
      return;
    }
    if (!query.trim() || query.trim().length < 5) {
      toast.error('Please enter a question (at least 5 characters)');
      return;
    }
    if (Object.keys(selectedProviders).length === 0) {
      toast.error('Select at least 1 AI provider');
      return;
    }
    try {
      await check({
        brand_name: brandName.trim(),
        prompt: query.trim(),
        llm_providers: Object.keys(selectedProviders),
      });
      toast.success('Prompt check complete!');
    } catch {
      toast.error('Prompt check failed', { description: 'Please try again.' });
    }
  }, [brandName, query, selectedProviders, check]);

  const handleReset = () => {
    reset();
    setQuery('');
  };

  // Parse result data
  const result = data as Record<string, unknown> | null;
  const mentioned = result?.mentioned as boolean | undefined;
  const position = result?.position as number | null | undefined;
  const context = result?.context as string | null | undefined;
  const providerResults = result?.provider_results as Array<{
    provider: string;
    mentioned: boolean;
    position: number | null;
    context: string | null;
  }> | undefined;
  const competitorsMentioned = result?.competitors_mentioned as string[] | undefined;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          Prompt Check
        </h1>
        <p className="text-muted-foreground mt-1">
          Ask a question. See if AI mentions your brand.
        </p>
      </div>

      {/* Form */}
      {!result && (
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="brand">Brand Name *</Label>
            <Input
              id="brand"
              placeholder="e.g. FreshBooks"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="query">Ask a question</Label>
            <Textarea
              id="query"
              placeholder="e.g. What are the best invoicing tools for freelancers?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Enter a natural language question that a user might ask an AI assistant
            </p>
          </div>

          <ProviderSelector
            selected={selectedProviders}
            onChange={setSelectedProviders}
            compact
          />

          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Checking…
              </>
            ) : (
              <>
                <MessageSquare className="h-4 w-4 mr-2" />
                Check Now
              </>
            )}
          </Button>
        </div>
      )}

      {/* Loading */}
      {loading && !result && (
        <div className="rounded-lg border bg-card p-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
          <p className="font-medium">Asking AI providers about your brand…</p>
          <p className="text-sm text-muted-foreground mt-1">This usually takes 5-15 seconds</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-4">
          {/* Main result card */}
          <div className={`rounded-lg border p-6 ${mentioned ? 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800'}`}>
            <div className="flex items-center gap-3 mb-3">
              {mentioned ? (
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              )}
              <div>
                <p className="text-lg font-bold">
                  {mentioned ? 'Yes — Your brand was mentioned!' : 'No — Your brand was not mentioned'}
                </p>
                {position && (
                  <p className="text-sm text-muted-foreground">
                    Position: #{position} {position === 1 ? '(first recommendation)' : ''}
                  </p>
                )}
              </div>
            </div>

            {/* Context snippet */}
            {context && (
              <div className="mt-3 p-3 rounded bg-background/80 text-sm">
                <p className="text-muted-foreground text-xs mb-1">AI Response Context:</p>
                <p className="italic">&ldquo;{context}&rdquo;</p>
              </div>
            )}
          </div>

          {/* Per-provider breakdown */}
          {providerResults && providerResults.length > 0 && (
            <div className="rounded-lg border bg-card p-4 space-y-3">
              <p className="font-medium text-sm">Per-Provider Results</p>
              <div className="space-y-2">
                {providerResults.map((pr) => (
                  <div key={pr.provider} className="flex items-center justify-between py-2 border-b last:border-0">
                    <span className="text-sm font-medium capitalize">{pr.provider}</span>
                    <Badge variant={pr.mentioned ? 'default' : 'secondary'}>
                      {pr.mentioned ? `✅ Mentioned #${pr.position ?? '-'}` : '❌ Not mentioned'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Competitors mentioned */}
          {competitorsMentioned && competitorsMentioned.length > 0 && (
            <div className="rounded-lg border bg-card p-4">
              <p className="font-medium text-sm mb-2">Also Mentioned</p>
              <div className="flex flex-wrap gap-2">
                {competitorsMentioned.map((c) => (
                  <Badge key={c} variant="outline">{c}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={handleReset} variant="outline" className="flex-1">
              Ask Another Question
            </Button>
            <Button variant="secondary" className="flex-1" disabled>
              Save Result
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
