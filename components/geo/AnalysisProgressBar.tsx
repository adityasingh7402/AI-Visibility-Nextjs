'use client';

import { PHASE_DISPLAY, type ProgressPhase, type ProgressStatus } from '@/lib/report-types';

interface AnalysisProgressBarProps {
  status: ProgressStatus;
  currentStage: string;
  progressPercent: number;
  stageProgressPercent?: number;
  estimatedSecondsRemaining?: number | null;
}

const ORDERED_PHASES: ProgressPhase[] = [
  'crawling', 'researching', 'testing_llms', 'analyzing_images', 'optimizing', 'verifying',
];

export function AnalysisProgressBar({
  status, currentStage, progressPercent, stageProgressPercent, estimatedSecondsRemaining,
}: AnalysisProgressBarProps) {
  const isRunning = status === 'processing' || status === 'pending';
  const barColor = status === 'completed' ? '#10B981' : status === 'failed' ? '#EF4444' : '#3B82F6';

  // Match the current stage against known phase names
  const stageLower = currentStage.toLowerCase();
  const currentIdx = ORDERED_PHASES.findIndex(p =>
    stageLower === p || stageLower.includes(p.replace(/_/g, ' '))
  );

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isRunning && <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />}
          <p className="font-bold text-foreground text-sm">{currentStage || 'Starting...'}</p>
        </div>
        <span className="text-2xl font-black" style={{ color: barColor }}>{progressPercent}%</span>
      </div>

      <div className="h-2.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%`, backgroundColor: barColor }}
        />
      </div>

      {isRunning && stageProgressPercent !== undefined && (
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Stage progress</p>
          <div className="h-1 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-blue-400/50 transition-all duration-300" style={{ width: `${stageProgressPercent}%` }} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-6 gap-2">
        {ORDERED_PHASES.map((phase, idx) => {
          const done = idx < currentIdx;
          const active = idx === currentIdx;
          const display = PHASE_DISPLAY[phase];
          return (
            <div key={phase} className="flex flex-col items-center gap-1 text-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                done ? 'bg-green-500/20 text-green-400' :
                active ? 'bg-blue-500/20 text-blue-400' :
                'bg-muted text-muted-foreground'
              }`}>
                {done ? '✓' : display.icon}
              </div>
              <span className={`text-[10px] leading-tight ${active ? 'text-blue-400' : done ? 'text-green-400' : 'text-muted-foreground'}`}>
                {display.label}
              </span>
            </div>
          );
        })}
      </div>

      {isRunning && estimatedSecondsRemaining && (
        <p className="text-xs text-slate-500 text-center">⏱️ ~{Math.ceil(estimatedSecondsRemaining / 60)} min remaining</p>
      )}
      {status === 'completed' && <p className="text-sm font-bold text-green-400 text-center">✓ Analysis complete!</p>}
      {status === 'failed' && <p className="text-sm font-bold text-red-400 text-center">✗ Failed. Please try again.</p>}
    </div>
  );
}
