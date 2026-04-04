'use client';

import { useEffect, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useActivePipelines } from '@/hooks/useGeo';
import { useSSEProgress } from '@/hooks/useSSEProgress';
import { PHASE_DISPLAY } from '@/lib/report-types';
import type { ActivePipeline } from '@/lib/report-types';
import { Loader2, ExternalLink, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const POLL_INTERVAL = 15000; // Refresh active pipelines every 15s
const LOCAL_STORAGE_KEY = 'geo_active_analysis';

/** Store active analysis in localStorage for persistence across page navigation */
export function setActiveAnalysis(analysisId: string, brandName: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ analysisId, brandName, ts: Date.now() }));
  }
}

export function getActiveAnalysis(): { analysisId: string; brandName: string } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Expire after 20 minutes
    if (Date.now() - parsed.ts > 20 * 60 * 1000) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearActiveAnalysis() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
}

/** Single pipeline progress tracker */
function PipelineTracker({ pipeline }: { pipeline: ActivePipeline }) {
  const { progress, connected } = useSSEProgress(pipeline.analysis_id);
  const router = useRouter();

  const percent = progress?.progress_percent ?? pipeline.progress?.progress_percent ?? 0;
  const stage = progress?.current_stage ?? pipeline.progress?.current_stage ?? 'queued';
  const phaseInfo = PHASE_DISPLAY[stage as keyof typeof PHASE_DISPLAY] ?? PHASE_DISPLAY.queued;
  const isComplete = progress?.status === 'completed';
  const isFailed = progress?.status === 'failed';

  useEffect(() => {
    if (isComplete || isFailed) {
      clearActiveAnalysis();
    }
  }, [isComplete, isFailed]);

  if (isComplete) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
          ✅ Analysis complete for &quot;{pipeline.brand_name}&quot;
        </span>
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs"
          onClick={() => router.push('/dashboard/reports')}
        >
          View Reports <ExternalLink className="ml-1 h-3 w-3" />
        </Button>
      </div>
    );
  }

  if (isFailed) {
    return (
      <div className="flex items-center gap-3 text-sm text-red-600 dark:text-red-400 font-semibold">
        ❌ Analysis failed for &quot;{pipeline.brand_name}&quot;
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 w-full">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />
        <span className="text-sm font-medium truncate">
          Analyzing &quot;{pipeline.brand_name}&quot;
        </span>
        <span className="text-xs text-muted-foreground hidden sm:inline">
          {phaseInfo.icon} {phaseInfo.description}
        </span>
        {!connected && (
          <span className="text-xs text-amber-500">(reconnecting…)</span>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, percent)}%` }}
          />
        </div>
        <span className="text-xs font-mono text-muted-foreground w-8 text-right">
          {percent}%
        </span>
      </div>
    </div>
  );
}

/**
 * ActiveAnalysisBanner — global banner showing running analyses.
 * Mount this in the dashboard layout so it's visible on every page.
 */
export function ActiveAnalysisBanner() {
  const { pipelines, refresh } = useActivePipelines();
  const [dismissed, setDismissed] = useState(false);
  const [localPipeline] = useState<ActivePipeline | null>(() => {
    const stored = getActiveAnalysis();
    if (!stored) return null;
    return {
      id: 'local',
      analysis_id: stored.analysisId,
      brand_name: stored.brandName,
      status: 'running',
      started_at: new Date().toISOString(),
      progress: null,
    };
  });

  // Initial + periodic refresh
  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [refresh]);

  // Merge API pipelines with localStorage pipeline (dedup by analysis_id)
  const allPipelines = useCallback(() => {
    const apiIds = new Set(pipelines.map(p => p.analysis_id));
    const merged = [...pipelines];
    if (localPipeline && !apiIds.has(localPipeline.analysis_id)) {
      merged.push(localPipeline);
    }
    return merged;
  }, [pipelines, localPipeline]);

  const activePipelines = allPipelines();

  if (activePipelines.length === 0 || dismissed) return null;

  return (
    <div className="border-b border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 px-4 py-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 space-y-1">
          {activePipelines.map(p => (
            <PipelineTracker key={p.analysis_id} pipeline={p} />
          ))}
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-muted-foreground hover:text-foreground p-1"
          title="Dismiss (analysis continues in background)"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
