'use client';

interface AnalysisProgressBarProps {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  currentStage: string;
  progressPercent: number;
  stageProgressPercent?: number;
  estimatedSecondsRemaining?: number;
}

const STAGES = [
  { name: 'Crawler', icon: '🕷️', specPhase: 'crawling' },
  { name: 'Researcher', icon: '🔍', specPhase: 'researching' },
  { name: 'LLM Tester', icon: '🤖', specPhase: 'testing_llms' },
  { name: 'Image Analyzer', icon: '🖼️', specPhase: 'analyzing_images' },
  { name: 'Optimizer', icon: '⚡', specPhase: 'optimizing' },
  { name: 'Verifier', icon: '✅', specPhase: 'verifying' },
];

export function AnalysisProgressBar({
  status, currentStage, progressPercent, stageProgressPercent, estimatedSecondsRemaining,
}: AnalysisProgressBarProps) {
  const isRunning = status === 'processing' || status === 'pending';
  const barColor = status === 'completed' ? '#10B981' : status === 'failed' ? '#EF4444' : '#3B82F6';

  // Detect current stage from both legacy (agent name) and spec (phase name) formats
  const stageLower = currentStage.toLowerCase();
  const currentIdx = STAGES.findIndex(s =>
    stageLower.includes(s.name.toLowerCase()) || stageLower === s.specPhase
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isRunning && <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />}
          <p className="font-bold text-white text-sm">{currentStage || 'Starting...'}</p>
        </div>
        <span className="text-2xl font-black" style={{ color: barColor }}>{progressPercent}%</span>
      </div>

      <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%`, backgroundColor: barColor }}
        />
      </div>

      {isRunning && stageProgressPercent !== undefined && (
        <div className="space-y-1">
          <p className="text-xs text-slate-500">Stage progress</p>
          <div className="h-1 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full rounded-full bg-blue-400/50 transition-all duration-300" style={{ width: `${stageProgressPercent}%` }} />
          </div>
        </div>
      )}

      <div className="grid grid-cols-6 gap-2">
        {STAGES.map((stage, idx) => {
          const done = idx < currentIdx;
          const active = idx === currentIdx;
          return (
            <div key={stage.name} className="flex flex-col items-center gap-1 text-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                done ? 'bg-green-500/20 text-green-400' :
                active ? 'bg-blue-500/20 text-blue-400' :
                'bg-white/5 text-slate-600'
              }`}>
                {done ? '✓' : stage.icon}
              </div>
              <span className={`text-[10px] leading-tight ${active ? 'text-blue-400' : done ? 'text-green-400' : 'text-slate-600'}`}>
                {stage.name}
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
