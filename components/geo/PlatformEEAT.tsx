'use client';

import type { PlatformReadiness, EEATBreakdown } from '@/lib/report-types';
import { getMaturityLevel, getMaturityColor } from '@/lib/report-v2-types';

// ── Platform Readiness Grid ──

const PLATFORM_ICONS: Record<string, string> = {
  google_aio: '🔍',
  chatgpt: '💬',
  perplexity: '🔎',
  gemini: '✨',
  bing_copilot: '🤖',
};

interface PlatformReadinessGridProps {
  readiness: PlatformReadiness;
}

export function PlatformReadinessGrid({ readiness }: PlatformReadinessGridProps) {
  const entries = Object.entries(readiness).filter(
    ([, v]) => v !== undefined && v !== null
  ) as [string, number][];

  if (entries.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {entries.map(([platform, score]) => {
        const maturity = getMaturityLevel(score);
        const color = maturity.color;
        const icon = PLATFORM_ICONS[platform] || '🌐';
        const label = platform.replace(/_/g, ' ');

        return (
          <div
            key={platform}
            className="rounded-xl border border-border bg-card p-4 flex flex-col items-center gap-2 text-center"
          >
            <span className="text-xl">{icon}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate w-full">
              {label}
            </span>
            <span className="text-2xl font-black tabular-nums" style={{ color }}>
              {Math.round(score)}
            </span>
            <span className="text-[10px] font-semibold" style={{ color }}>
              {maturity.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── EEAT Breakdown ──

const EEAT_LABELS: Record<string, { label: string; icon: string }> = {
  experience:        { label: 'Experience',        icon: '🧪' },
  expertise:         { label: 'Expertise',         icon: '🎓' },
  authoritativeness: { label: 'Authoritativeness', icon: '🏛️' },
  trustworthiness:   { label: 'Trustworthiness',   icon: '🛡️' },
};

interface EEATBreakdownCardProps {
  eeat: EEATBreakdown;
}

export function EEATBreakdownCard({ eeat }: EEATBreakdownCardProps) {
  const dimensions = ['experience', 'expertise', 'authoritativeness', 'trustworthiness'] as const;
  const totalColor = getMaturityColor(eeat.total);

  return (
    <div className="space-y-4">
      {/* Total */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-foreground">E-E-A-T Total</span>
        <span className="text-xl font-black" style={{ color: totalColor }}>
          {Math.round(eeat.total)}
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.min(eeat.total, 100)}%`, backgroundColor: totalColor }}
        />
      </div>

      {/* Individual dimensions */}
      <div className="grid grid-cols-2 gap-3">
        {dimensions.map((key) => {
          const value = eeat[key];
          const meta = EEAT_LABELS[key];
          const maturity = getMaturityLevel(value);
          const color = maturity.color;

          return (
            <div key={key} className="rounded-lg border border-border bg-card/50 p-3 space-y-2">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">{meta.icon}</span>
                <span className="text-xs font-semibold text-foreground">{meta.label}</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-xl font-black tabular-nums" style={{ color }}>
                  {Math.round(value)}
                </span>
                <span className="text-[10px] font-bold" style={{ color }}>
                  {maturity.label}
                </span>
              </div>
              <div className="h-1 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${Math.min(value, 100)}%`, backgroundColor: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
