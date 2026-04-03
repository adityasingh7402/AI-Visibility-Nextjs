'use client';

import { getGrade, getGradeColor } from '@/lib/report-types';

interface ScoreGaugeProps {
  score: number;
  size?: number;
  label?: string;
  showGrade?: boolean;
}

/**
 * Circular SVG score gauge — renders a ring that fills based on score 0-100.
 * Used on dashboard home, report header, and score summary cards.
 */
export function ScoreGauge({ score, size = 120, label, showGrade = true }: ScoreGaugeProps) {
  const grade = getGrade(score);
  const color = getGradeColor(grade);
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(score, 0), 100);
  const offset = circumference - (progress / 100) * circumference;
  const center = size / 2;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
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
          {/* Progress ring */}
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
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black" style={{ color, fontSize: size * 0.22 }}>
            {Math.round(score)}
          </span>
          {showGrade && (
            <span className="text-xs font-bold text-muted-foreground" style={{ fontSize: size * 0.1 }}>
              Grade {grade}
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
