'use client';

import type { AnalysisProgress, GeoAnalysisType, ProgressPhase } from '@/lib/report-types';
import { PHASE_DISPLAY } from '@/lib/report-types';

// ── Stage definition with microcopy ─────────────────────────────────────

interface StageInfo {
  phase: ProgressPhase;
  microcopy: string;
}

const GEO_PIPELINE_STAGES: StageInfo[] = [
  { phase: 'resolving_brand', microcopy: 'Identifying your brand identity and variations…' },
  { phase: 'crawling',         microcopy: 'Reading your website to understand content structure…' },
  { phase: 'researching',      microcopy: 'Analyzing your market position and identifying competitors…' },
  { phase: 'testing_llms',     microcopy: 'Asking AI platforms about your brand to measure visibility…' },
  { phase: 'analyzing_images', microcopy: 'Auditing visual content for AI-readiness signals…' },
  { phase: 'optimizing',       microcopy: 'Calculating your 17-dimension AI visibility score…' },
  { phase: 'verifying',        microcopy: 'Running 20 quality checks to ensure report accuracy…' },
];

const AEO_PIPELINE_STAGES: StageInfo[] = [
  { phase: 'resolving_brand', microcopy: 'Identifying brand identity for answer-engine context…' },
  { phase: 'testing_llms',     microcopy: 'Testing AI assistants for mentions, consistency, and answer placement…' },
  { phase: 'optimizing',       microcopy: 'Scoring the 3 measured AEO dimensions across the 5-node workflow…' },
  { phase: 'verifying',        microcopy: 'Validating answer-engine findings before finalizing the report…' },
];

// ── Time estimation ──────────────────────────────────────────────────────

export interface TimeEstimateConfig {
  scanMode: 'quick' | 'full' | 'deep';
  providerCount: number;
}

const BASE_MINUTES: Record<string, [number, number]> = {
  quick: [1, 2],
  full:  [3, 5],
  deep:  [5, 10],
};

export function getTimeEstimate(config: TimeEstimateConfig): string {
  const [lo, hi] = BASE_MINUTES[config.scanMode] ?? [3, 5];
  const extra = Math.max(0, config.providerCount - 1) * 0.5;
  const adjLo = Math.ceil(lo + extra);
  const adjHi = Math.ceil(hi + extra);
  return adjLo === adjHi ? `~${adjLo} min` : `~${adjLo}–${adjHi} min`;
}

// ── Main component ───────────────────────────────────────────────────────

interface AnalysisStageListProps {
  progress: AnalysisProgress | null;
  analysisType?: Extract<GeoAnalysisType, 'full' | 'aeo_scan'>;
  /** Brand name being analyzed */
  brandName?: string;
  /** Provider names being tested (e.g. ["ChatGPT", "Gemini"]) */
  providerNames?: string[];
  /** Time estimation config */
  timeConfig?: TimeEstimateConfig;
}

export function AnalysisStageList({
  progress,
  analysisType = 'full',
  brandName,
  providerNames,
  timeConfig,
}: AnalysisStageListProps) {
  const currentStage = progress?.current_stage ?? 'queued';
  const completedStages = new Set(progress?.completed_stages ?? []);
  const elapsed = progress?.elapsed_seconds ?? 0;
  const isComplete = progress?.status === 'completed';
  const isFailed = progress?.status === 'failed';
  const percent = progress?.progress_percent ?? 0;

  const barColor = isComplete ? '#10B981' : isFailed ? '#EF4444' : '#3B82F6';
  const pipelineLabel = analysisType === 'aeo_scan' ? 'AEO Scan' : 'GEO Analysis';
  const stages = analysisType === 'aeo_scan' ? AEO_PIPELINE_STAGES : GEO_PIPELINE_STAGES;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-6 w-full max-w-xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-lg font-bold text-foreground">
          {isComplete
            ? '✅ Analysis Complete!'
            : isFailed
              ? '❌ Analysis Failed'
              : `🔍 Analyzing${brandName ? ` ${brandName}` : ''}…`}
        </h2>
        {providerNames && providerNames.length > 0 && !isComplete && !isFailed && (
          <p className="text-sm text-muted-foreground">
            {pipelineLabel} · {providerNames.length} AI Provider{providerNames.length > 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Overall progress</span>
          <span className="font-bold text-lg" style={{ color: barColor }}>{percent}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${percent}%`, backgroundColor: barColor }}
          />
        </div>
      </div>

      {/* Stage list */}
      <div className="space-y-1">
        {stages.map((stage) => {
          const isDone = completedStages.has(stage.phase) || isComplete;
          const isActive = currentStage === stage.phase && !isComplete && !isFailed;
          const isPending = !isDone && !isActive;
          const display = PHASE_DISPLAY[stage.phase];

          return (
            <div key={stage.phase} className="space-y-0.5">
              <div className={`flex items-center gap-3 py-2 px-3 rounded-lg transition-colors ${
                isActive ? 'bg-primary/5' : ''
              }`}>
                {/* Status icon */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${
                  isDone ? 'bg-emerald-500/15 text-emerald-500' :
                  isActive ? 'bg-blue-500/15 text-blue-500' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {isDone ? '✓' : isActive ? '●' : '○'}
                </div>

                {/* Label */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${
                    isDone ? 'text-emerald-600 dark:text-emerald-400' :
                    isActive ? 'text-foreground' :
                    'text-muted-foreground'
                  }`}>
                    {display.label}
                  </p>
                  {isActive && (
                    <p className="text-xs text-muted-foreground mt-0.5">{stage.microcopy}</p>
                  )}
                </div>

                {/* Per-stage status */}
                {isDone && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 shrink-0">done</span>
                )}
                {isActive && (
                  <span className="text-xs text-blue-500 animate-pulse shrink-0">running…</span>
                )}
                {isPending && (
                  <span className="text-xs text-muted-foreground shrink-0">queued</span>
                )}
              </div>

              {/* Per-provider sub-progress during testing_llms */}
              {isActive && stage.phase === 'testing_llms' && providerNames && providerNames.length > 0 && (
                <ProviderSubProgress
                  providerNames={providerNames}
                  stagePercent={progress?.stage_progress_percent ?? 0}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Node-level progress from LangGraph streaming */}
      {progress?.node_status && !isComplete && !isFailed && (
        <div className="px-3 py-2 rounded-lg bg-muted/50 text-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground font-medium">🧠 Agent Progress</span>
            <span className="text-muted-foreground">
              {progress.node_status.completed_nodes.length} agents done
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-500">✓</span>
            <span className="text-foreground">
              {progress.node_status.node.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
            <span className="text-muted-foreground">— completed</span>
          </div>
        </div>
      )}

      {/* Time estimate + elapsed */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
        <span>⏱️ Elapsed: {formatElapsed(elapsed)}</span>
        {timeConfig && !isComplete && !isFailed && (
          <span>Typically {getTimeEstimate(timeConfig)}</span>
        )}
        {progress?.estimated_seconds_remaining && !isComplete && !isFailed && (
          <span>~{Math.ceil(progress.estimated_seconds_remaining / 60)} min remaining</span>
        )}
      </div>
    </div>
  );
}

// ── Per-provider sub-progress ────────────────────────────────────────────

function ProviderSubProgress({ providerNames, stagePercent }: {
  providerNames: string[];
  stagePercent: number;
}) {
  const totalProviders = providerNames.length;
  const completedCount = Math.min(
    totalProviders,
    Math.floor((stagePercent / 100) * totalProviders),
  );

  return (
    <div className="ml-10 pl-3 border-l-2 border-blue-500/20 space-y-1 py-1">
      <p className="text-xs text-muted-foreground font-medium">
        {completedCount} of {totalProviders} provider{totalProviders > 1 ? 's' : ''} complete
      </p>
      {providerNames.map((name, idx) => {
        const isDone = idx < completedCount;
        const isActive = idx === completedCount && completedCount < totalProviders;
        return (
          <div key={name} className="flex items-center gap-2 text-xs">
            <span className={isDone ? 'text-emerald-500' : isActive ? 'text-blue-500' : 'text-muted-foreground'}>
              {isDone ? '✅' : isActive ? '🔄' : '⏳'}
            </span>
            <span className={isDone ? 'text-emerald-600 dark:text-emerald-400' : isActive ? 'text-foreground' : 'text-muted-foreground'}>
              {name}
            </span>
            <span className="text-muted-foreground">
              {isDone ? '— done' : isActive ? '— running…' : '— queued'}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────

function formatElapsed(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}m ${s}s`;
}
