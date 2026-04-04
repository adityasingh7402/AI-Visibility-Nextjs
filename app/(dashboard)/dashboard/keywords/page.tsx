'use client';

import { useState, useCallback } from 'react';
import { useKeywordTest } from '@/hooks/useGeo';
import type { ProviderSelection } from '@/lib/types/providers';
import type { KeywordTestRequest, KeywordTestResponse, LLMProvider } from '@/lib/geo-types';
import { ProviderSelector } from '@/components/geo/ProviderSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Key, Loader2, Plus, X, ClipboardPaste, RotateCcw } from 'lucide-react';

export default function KeywordTestPage() {
  const { data, loading, error, test, reset: resetHook } = useKeywordTest();

  const [brandName, setBrandName] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [selectedProviders, setSelectedProviders] = useState<ProviderSelection>({});

  const addKeyword = () => {
    const kw = keywordInput.trim();
    if (kw && !keywords.includes(kw)) {
      setKeywords((prev) => [...prev, kw]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (kw: string) => {
    setKeywords((prev) => prev.filter((k) => k !== kw));
  };

  const pasteKeywords = () => {
    navigator.clipboard.readText().then((text) => {
      const newKws = text.split(/[,\n]+/).map((k) => k.trim()).filter(Boolean);
      setKeywords((prev) => [...new Set([...prev, ...newKws])]);
    });
  };

  const canSubmit = brandName.trim() && keywords.length > 0 && Object.keys(selectedProviders).length > 0 && !loading;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;
    const request: KeywordTestRequest = {
      brand_name: brandName.trim(),
      keywords,
      llm_providers: Object.keys(selectedProviders) as LLMProvider[],
    };
    await test(request);
  }, [canSubmit, brandName, keywords, selectedProviders, test]);

  const handleReset = () => {
    resetHook();
    setKeywords([]);
    setKeywordInput('');
  };

  const results = data as KeywordTestResponse | null;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Key className="h-6 w-6 text-primary" />
          Keyword Test
        </h1>
        <p className="text-muted-foreground mt-1">
          Test if AI mentions your brand for specific keywords
        </p>
      </div>

      {/* Form */}
      {!results && (
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="brand">Brand Name *</Label>
            <Input
              id="brand"
              placeholder="e.g. Acme Corp"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            />
          </div>

          {/* Keyword input */}
          <div className="space-y-2">
            <Label>Keywords to Test *</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Type a keyword and press Add"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                className="flex-1"
              />
              <Button type="button" onClick={addKeyword} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
              <Button type="button" onClick={pasteKeywords} size="sm" variant="ghost" title="Paste from clipboard">
                <ClipboardPaste className="h-4 w-4" />
              </Button>
            </div>

            {/* Keyword chips */}
            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2 p-3 rounded-lg border bg-muted/30">
                {keywords.map((kw) => (
                  <Badge key={kw} variant="secondary" className="gap-1 pr-1">
                    {kw}
                    <button onClick={() => removeKeyword(kw)} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              {keywords.length} keyword{keywords.length !== 1 ? 's' : ''} added
            </p>
          </div>

          <ProviderSelector selected={selectedProviders} onChange={setSelectedProviders} />

          <Button onClick={handleSubmit} disabled={!canSubmit} className="w-full" size="lg">
            {loading ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Testing Keywords…</>
            ) : (
              <><Key className="h-4 w-4 mr-2" /> Test Keywords</>
            )}
          </Button>
        </div>
      )}

      {/* Loading */}
      {loading && !results && (
        <div className="rounded-lg border bg-card p-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
          <p className="font-medium">Testing your keywords across AI providers…</p>
          <p className="text-sm text-muted-foreground mt-1">This usually takes 10-60 seconds</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Results */}
      {results && !loading && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="rounded-lg border bg-card p-4">
            <p className="font-medium mb-3">
              Results: {results.keywords_tested} keywords tested in {results.processing_time_seconds.toFixed(1)}s
            </p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20">
                <p className="text-2xl font-bold text-green-600">{results.summary.winning_keywords.length}</p>
                <p className="text-xs text-muted-foreground">Winning</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20">
                <p className="text-2xl font-bold text-amber-600">{results.summary.opportunity_keywords.length}</p>
                <p className="text-xs text-muted-foreground">Opportunities</p>
              </div>
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20">
                <p className="text-2xl font-bold text-red-600">{results.summary.weak_keywords.length}</p>
                <p className="text-xs text-muted-foreground">Weak</p>
              </div>
            </div>
          </div>

          {/* Per-keyword results table */}
          <div className="rounded-lg border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left p-3 font-medium">Keyword</th>
                  <th className="text-center p-3 font-medium">Visible?</th>
                  <th className="text-center p-3 font-medium">Position</th>
                  <th className="text-center p-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {results.results.map((r) => (
                  <tr key={r.keyword} className="border-b last:border-0">
                    <td className="p-3 font-medium">{r.keyword}</td>
                    <td className="p-3 text-center">
                      {r.should_target ? (
                        <Badge variant="default" className="bg-green-600">✅ Yes</Badge>
                      ) : (
                        <Badge variant="secondary">❌ No</Badge>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      {r.average_position > 0 ? `#${Math.round(r.average_position)}` : '—'}
                    </td>
                    <td className="p-3 text-center">
                      <Badge
                        variant="outline"
                        className={cn(
                          r.visibility_potential === 'high' && 'border-green-500 text-green-600',
                          r.visibility_potential === 'medium' && 'border-amber-500 text-amber-600',
                          r.visibility_potential === 'low' && 'border-red-500 text-red-600',
                          r.visibility_potential === 'none' && 'border-muted text-muted-foreground',
                        )}
                      >
                        {r.should_target ? 'Target ⭐' : 'Avoid'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={handleReset} variant="outline" className="flex-1">
              <RotateCcw className="h-4 w-4 mr-2" /> Test More
            </Button>
            <Button variant="secondary" className="flex-1" disabled>
              Save Results
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
