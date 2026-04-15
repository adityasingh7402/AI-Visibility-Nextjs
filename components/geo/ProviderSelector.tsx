'use client';

import { useEffect, useMemo, useState } from 'react';
import { useProviders } from '@/hooks/useGeo';
import type { Provider, ProviderSelection } from '@/lib/types/providers';
import { getDefaultModel } from '@/lib/types/providers';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Globe, Check, Search } from 'lucide-react';

interface ProviderSelectorProps {
  /** Map of providerId → selected modelId */
  selected: ProviderSelection;
  /** Called when selection changes */
  onChange: (selection: ProviderSelection) => void;
  /** Compact mode for smaller layouts */
  compact?: boolean;
}

const PROVIDER_ICONS: Record<string, string> = {
  chatgpt: '🤖',
  gemini: '✨',
  grok: '⚡',
  claude: '🧠',
  perplexity: '🔍',
  nvidia: '🟢',
  digitalocean: '🌊',
};

export function ProviderSelector({ selected, onChange, compact }: ProviderSelectorProps) {
  const { providers: registry, loading, error, fetchProviders } = useProviders();
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const providerList = useMemo(() => registry?.providers ?? [], [registry]);
  const visibleProviders = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return providerList;
    return providerList.filter((p) =>
      p.display_name.toLowerCase().includes(q)
      || p.company.toLowerCase().includes(q)
      || p.id.toLowerCase().includes(q)
    );
  }, [providerList, query]);
  const selectedProviders = useMemo(
    () => providerList.filter((p) => Boolean(selected[p.id])),
    [providerList, selected]
  );

  const toggleProvider = (provider: Provider) => {
    const next = { ...selected };
    if (next[provider.id]) {
      delete next[provider.id];
    } else {
      next[provider.id] = getDefaultModel(provider);
    }
    onChange(next);
  };

  const selectModel = (providerId: string, modelId: string) => {
    onChange({ ...selected, [providerId]: modelId });
  };

  const selectAll = () => {
    const all: ProviderSelection = {};
    providerList.forEach((p) => {
      all[p.id] = selected[p.id] || getDefaultModel(p);
    });
    onChange(all);
  };

  const deselectAll = () => onChange({});
  const selectRecommended = () => {
    const priority = ['chatgpt', 'gemini', 'perplexity', 'claude', 'digitalocean'];
    const ranked = [...providerList].sort((a, b) => {
      const ai = priority.indexOf(a.id);
      const bi = priority.indexOf(b.id);
      const av = ai === -1 ? 999 : ai;
      const bv = bi === -1 ? 999 : bi;
      return av - bv;
    });
    const next: ProviderSelection = {};
    ranked.slice(0, Math.min(3, ranked.length)).forEach((p) => {
      next[p.id] = selected[p.id] || getDefaultModel(p);
    });
    onChange(next);
  };

  const selectedCount = Object.keys(selected).length;

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading providers...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-destructive py-2">
        Failed to load providers. <button className="underline" onClick={() => fetchProviders()}>Retry</button>
      </div>
    );
  }

  if (!providerList.length) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">
          AI Providers ({selectedCount}/{providerList.length})
        </p>
        <div className="flex gap-3 text-xs">
          <button
            type="button"
            onClick={selectRecommended}
            className="text-primary hover:underline"
          >
            Recommended
          </button>
          <button
            type="button"
            onClick={selectAll}
            className="text-primary hover:underline"
          >
            Select All
          </button>
          <button
            type="button"
            onClick={deselectAll}
            className="text-muted-foreground hover:underline"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="relative">
        <Search className="h-3.5 w-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search provider..."
          className="w-full rounded-md border bg-background py-2 pl-8 pr-3 text-sm"
        />
      </div>

      {selectedProviders.length > 0 && (
        <div className="rounded-md border bg-muted/30 p-2">
          <p className="text-xs text-muted-foreground mb-1">Selected models</p>
          <div className="flex flex-wrap gap-1">
            {selectedProviders.map((provider) => {
              const selectedModel = selected[provider.id];
              const modelName = provider.models.find((m) => m.id === selectedModel)?.name || selectedModel;
              return (
                <Badge key={provider.id} variant="secondary" className="text-[11px]">
                  {provider.display_name}: {modelName}
                </Badge>
              );
            })}
          </div>
        </div>
      )}

      <div className={cn(
        'grid gap-2',
        compact ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
      )}>
        {visibleProviders.map((provider) => {
          const isSelected = !!selected[provider.id];
          const selectedModel = selected[provider.id] ?? '';
          const icon = PROVIDER_ICONS[provider.id] || '🔮';

          return (
            <div
              key={provider.id}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              onClick={() => toggleProvider(provider)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleProvider(provider);
                }
              }}
              className={cn(
                'relative rounded-lg border p-3 cursor-pointer transition-all',
                isSelected
                  ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                  : 'border-border hover:border-muted-foreground/30'
              )}
            >
              {/* Toggle area */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{provider.display_name}</p>
                  <p className="text-xs text-muted-foreground truncate">{provider.company}</p>
                </div>
                {isSelected && (
                  <Check className="h-4 w-4 text-primary shrink-0" />
                )}
              </div>

              {/* Web access badge */}
              {provider.models.some((m) => m.has_web_access) && (
                <Badge variant="outline" className="text-[10px] px-1 py-0 mb-2">
                  <Globe className="h-2.5 w-2.5 mr-0.5" />
                  Web
                </Badge>
              )}

              {/* Model selector (only when selected) */}
              {isSelected && provider.models.length > 1 && (
                <div onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
                  <Select
                    value={selectedModel}
                    onValueChange={(v: string | null) => {
                      if (v != null) selectModel(provider.id, v);
                    }}
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {provider.models.map((model) => (
                        <SelectItem key={model.id} value={model.id} className="text-xs">
                          {model.name}
                          {model.is_default && (
                            <span className="text-muted-foreground ml-1">(default)</span>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Single model display */}
              {isSelected && provider.models.length === 1 && (
                <p className="text-xs text-muted-foreground truncate">
                  {provider.models[0].name}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {visibleProviders.length === 0 && (
        <p className="text-xs text-muted-foreground">No providers match your search.</p>
      )}

      {selectedCount === 0 && (
        <p className="text-xs text-amber-500">
          Select at least one provider to run analysis
        </p>
      )}
    </div>
  );
}
