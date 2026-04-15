'use client';

import * as React from 'react';
import { getMaturityLevel } from '@/lib/report-v2-types';

interface ScoreGaugeProps {
  score: number;
  size?: number;
  label?: string;
  showMaturity?: boolean;
}

/**
 * Circular SVG score gauge — renders a ring that fills based on score 0-100.
 * Uses V1.9 maturity level system (INVISIBLE→DOMINANT).
 */
export function ScoreGauge({ score, size = 120, label, showMaturity = true }: ScoreGaugeProps) {
  const maturity = getMaturityLevel(score);
  const color = maturity.color;
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(score, 0), 100);
  const offset = circumference - (progress / 100) * circumference;
  const center = size / 2;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-label={`Score: ${Math.round(score)} out of 100, ${maturity.label}`}>
          {/* Background ring */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={8}
            className="text-muted/30"
          />
          {/* Progress ring with glow */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out drop-shadow-sm"
            style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black" style={{ color, fontSize: size * 0.22 }}>
            {Math.round(score)}
          </span>
          {showMaturity && (
            <span className="text-xs font-bold text-muted-foreground" style={{ fontSize: size * 0.09 }}>
              {maturity.icon} {maturity.label}
            </span>
          )}
        </div>
      </div>
      {label && (
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
      )}
    </div>
  );
}
