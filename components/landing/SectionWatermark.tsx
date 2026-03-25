"use client";
import React from "react";
interface WatermarkProps {
  shape: "circle" | "diamond" | "cross" | "ring" | "grid" | "wave" | "hexagon";
  className?: string;
}

const shapes: Record<string, React.ReactNode> = {
  circle: (
    <svg viewBox="0 0 400 400" className="w-full h-full" fill="none">
      <circle cx="200" cy="200" r="180" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="200" cy="200" r="130" stroke="currentColor" strokeWidth="0.3" />
      <circle cx="200" cy="200" r="80" stroke="currentColor" strokeWidth="0.3" />
    </svg>
  ),
  diamond: (
    <svg viewBox="0 0 400 400" className="w-full h-full" fill="none">
      <rect x="80" y="80" width="240" height="240" stroke="currentColor" strokeWidth="0.5" transform="rotate(45 200 200)" />
      <rect x="120" y="120" width="160" height="160" stroke="currentColor" strokeWidth="0.3" transform="rotate(45 200 200)" />
    </svg>
  ),
  cross: (
    <svg viewBox="0 0 400 400" className="w-full h-full" fill="none">
      <line x1="200" y1="20" x2="200" y2="380" stroke="currentColor" strokeWidth="0.5" />
      <line x1="20" y1="200" x2="380" y2="200" stroke="currentColor" strokeWidth="0.5" />
      <circle cx="200" cy="200" r="100" stroke="currentColor" strokeWidth="0.3" />
    </svg>
  ),
  ring: (
    <svg viewBox="0 0 400 400" className="w-full h-full" fill="none">
      <circle cx="200" cy="200" r="190" stroke="currentColor" strokeWidth="0.8" strokeDasharray="8 12" />
      <circle cx="200" cy="200" r="150" stroke="currentColor" strokeWidth="0.4" strokeDasharray="4 8" />
      <circle cx="200" cy="200" r="110" stroke="currentColor" strokeWidth="0.3" />
    </svg>
  ),
  grid: (
    <svg viewBox="0 0 400 400" className="w-full h-full" fill="none">
      {[...Array(8)].map((_, i) => (
        <g key={i}>
          <line x1={50 * (i + 1)} y1="0" x2={50 * (i + 1)} y2="400" stroke="currentColor" strokeWidth="0.25" />
          <line x1="0" y1={50 * (i + 1)} x2="400" y2={50 * (i + 1)} stroke="currentColor" strokeWidth="0.25" />
        </g>
      ))}
    </svg>
  ),
  wave: (
    <svg viewBox="0 0 400 400" className="w-full h-full" fill="none">
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          d={`M 0 ${120 + i * 50} Q 100 ${80 + i * 50} 200 ${120 + i * 50} T 400 ${120 + i * 50}`}
          stroke="currentColor"
          strokeWidth="0.4"
        />
      ))}
    </svg>
  ),
  hexagon: (
    <svg viewBox="0 0 400 400" className="w-full h-full" fill="none">
      <polygon points="200,20 370,110 370,290 200,380 30,290 30,110" stroke="currentColor" strokeWidth="0.5" />
      <polygon points="200,80 310,140 310,260 200,320 90,260 90,140" stroke="currentColor" strokeWidth="0.3" />
    </svg>
  ),
};

const SectionWatermark = ({ shape, className = "" }: WatermarkProps) => {
  return (
    <div
      className={`absolute pointer-events-none text-foreground/[0.03] select-none ${className}`}
      aria-hidden="true"
    >
      {shapes[shape]}
    </div>
  );
};

export default SectionWatermark;
