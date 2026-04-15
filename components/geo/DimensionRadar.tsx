'use client';

import { V19_DIMENSIONS, V19_CLUSTERS, type VisibilitySubScoresV19 } from '@/lib/report-types';

interface DimensionRadarProps {
  scores: VisibilitySubScoresV19;
  size?: number;
}

/**
 * Pure SVG radar chart for V1.9 dimensions — renders 17-point radar
 * colored by cluster. No external charting lib required.
 */
export function DimensionRadar({ scores, size = 300 }: DimensionRadarProps) {
  const dims = V19_DIMENSIONS;
  const count = dims.length;
  const center = size / 2;
  const maxRadius = (size - 40) / 2;
  const angleStep = (2 * Math.PI) / count;

  // Map cluster name → color
  const clusterColor: Record<string, string> = {};
  for (const c of V19_CLUSTERS) {
    clusterColor[c.name] = c.color;
  }

  const getPoint = (index: number, value: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / 100) * maxRadius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Build polygon path from scores
  const points = dims.map((dim, i) => {
    const value = scores[dim.key] ?? 0;
    return getPoint(i, value);
  });
  const polygonPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  // Grid rings at 25, 50, 75, 100
  const rings = [25, 50, 75, 100];

  return (
    <div className="flex flex-col items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grid rings */}
        {rings.map((r) => (
          <circle
            key={r}
            cx={center}
            cy={center}
            r={(r / 100) * maxRadius}
            fill="none"
            stroke="currentColor"
            strokeWidth={0.5}
            className="text-border"
          />
        ))}

        {/* Axis lines */}
        {dims.map((_, i) => {
          const end = getPoint(i, 100);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={end.x}
              y2={end.y}
              stroke="currentColor"
              strokeWidth={0.5}
              className="text-border"
            />
          );
        })}

        {/* Fill area */}
        <path d={polygonPath} fill="hsl(var(--primary))" fillOpacity={0.12} />

        {/* Stroke */}
        <path d={polygonPath} fill="none" stroke="hsl(var(--primary))" strokeWidth={2} strokeLinejoin="round" />

        {/* Dimension dots */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={4}
            fill={clusterColor[dims[i].cluster] || 'hsl(var(--primary))'}
            stroke="hsl(var(--background))"
            strokeWidth={2}
          />
        ))}

        {/* Labels */}
        {dims.map((dim, i) => {
          const labelPoint = getPoint(i, 115);
          const angle = angleStep * i - Math.PI / 2;
          const textAnchor = Math.abs(Math.cos(angle)) < 0.1
            ? 'middle'
            : Math.cos(angle) > 0
              ? 'start'
              : 'end';
          return (
            <text
              key={dim.key}
              x={labelPoint.x}
              y={labelPoint.y}
              textAnchor={textAnchor}
              dominantBaseline="central"
              className="fill-muted-foreground"
              fontSize={9}
              fontWeight={600}
            >
              {dim.label}
            </text>
          );
        })}
      </svg>

      {/* Cluster legend */}
      <div className="flex flex-wrap justify-center gap-3">
        {V19_CLUSTERS.map((cluster) => (
          <div key={cluster.name} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cluster.color }} />
            <span className="text-[10px] font-semibold text-muted-foreground">
              {cluster.name} ({Math.round(cluster.weight * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
