'use client';

import { useEffect, useMemo } from 'react';
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
import { Loader2, Globe, Check } from 'lucide-react';

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

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const providerList = useMemo(() => registry?.providers ?? [], [registry]);

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
        <div className="flex gap-2">
          <button
            type="button"
            onClick={selectAll}
            className="text-xs text-primary hover:underline"
          >
            Select All
          </button>
          <span className="text-xs text-muted-foreground">|</span>
          <button
            type="button"
            onClick={deselectAll}
            className="text-xs text-muted-foreground hover:underline"
          >
            Clear
          </button>
        </div>
      </div>

      <div className={cn(
        'grid gap-2',
        compact ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
      )}>
        {providerList.map((provider) => {
          const isSelected = !!selected[provider.id];
          const selectedModel = selected[provider.id] ?? '';
          const icon = PROVIDER_ICONS[provider.id] || '🔮';

          return (
            <div
              key={provider.id}
              className={cn(
                'relative rounded-lg border p-3 cursor-pointer transition-all',
                isSelected
                  ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                  : 'border-border hover:border-muted-foreground/30'
              )}
            >
              {/* Toggle area */}
              <div
                className="flex items-center gap-2 mb-2"
                onClick={() => toggleProvider(provider)}
              >
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
                <Select
                  value={selectedModel}
                  onValueChange={(v: string | null) => v && selectModel(provider.id, v)}
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

      {selectedCount === 0 && (
        <p className="text-xs text-amber-500">
          Select at least one provider to run analysis
        </p>
      )}
    </div>
  );
}
