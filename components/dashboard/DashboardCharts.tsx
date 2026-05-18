'use client';

import { useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import { BarChart } from '@/components/charts/bar-chart';
import { Bar } from '@/components/charts/bar';
import { BarYAxis } from '@/components/charts/bar-y-axis';
import { LineChart, Line } from '@/components/charts/line-chart';
import { Grid } from '@/components/charts/grid';
import { XAxis } from '@/components/charts/x-axis';
import { RingChart } from '@/components/charts/ring-chart';
import { Ring } from '@/components/charts/ring';
import { RingCenter } from '@/components/charts/ring-center';
import { Gauge } from '@/components/charts/gauge';
import { ChartTooltip } from '@/components/charts/tooltip';
import type { StoredGeoAnalysis } from '@/lib/report-types';
import type { Brand } from '@/lib/brands-api';
import type { RingData } from '@/components/charts/ring-context';

// sky→blue palette matching HoursBarChartVisual
const C = {
  primary: '#2563eb',
  sky:     '#38bdf8',
  deep:    '#1e40af',
  grid:    '#E5E7EB',
} as const;

// ── Score Ring Chart ──────────────────────────────────────────────────────────
export function ScoreRingChart({ analyses }: { analyses: StoredGeoAnalysis[] }) {
  const ringData = useMemo<RingData[]>(() => {
    const scores = analyses
      .filter(a => a.overall_score != null)
      .map(a => a.overall_score!);
    if (scores.length === 0) return [];
    const latest  = scores[0] ?? 0;
    const average = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const best    = Math.max(...scores);
    return [
      { label: 'Latest',  value: latest,   maxValue: 100, color: C.sky },
      { label: 'Average', value: average,  maxValue: 100, color: C.primary },
      { label: 'Best',    value: best,     maxValue: 100, color: C.deep },
    ];
  }, [analyses]);

  if (ringData.length === 0) return null;

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col gap-4 h-full">
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-600 inline-block" />
        Score Overview
      </p>

      <div className="flex-1 flex items-center justify-center">
        <RingChart
          data={ringData}
          size={160}
          strokeWidth={13}
          ringGap={7}
          baseInnerRadius={38}
        >
          <Ring index={0} />
          <Ring index={1} />
          <Ring index={2} />
          <RingCenter
            defaultLabel="Latest"
            valueClassName="text-xl font-black text-foreground tabular-nums"
            labelClassName="text-[10px] font-medium text-muted-foreground mt-0.5"
          />
        </RingChart>
      </div>

      <div className="flex justify-center gap-4">
        {ringData.map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
            <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── GEO Score Gauge ───────────────────────────────────────────────────────────
export function ScoreGaugeChart({ analyses }: { analyses: StoredGeoAnalysis[] }) {
  const { latestScore, delta } = useMemo(() => {
    const scored = analyses.filter(a => a.overall_score != null);
    const latestScore = scored[0]?.overall_score ?? 0;
    const prevScore   = scored[1]?.overall_score ?? latestScore;
    return { latestScore, delta: latestScore - prevScore };
  }, [analyses]);

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col gap-3 h-full">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 inline-block" />
          GEO Score
        </p>
        {delta !== 0 && (
          <span className={`text-xs font-bold tabular-nums ${delta > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {delta > 0 ? '+' : ''}{delta} pts
          </span>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center">
        <Gauge
          value={latestScore}
          centerValue={latestScore}
          width={240}
          height={176}
          useGradient
          activeGradient={[C.sky, C.deep]}
          inactiveGradient={['#e2e8f0', '#cbd5e1']}
          inactiveFillOpacity={0.5}
          defaultLabel="GEO Score"
          totalNotches={36}
          notchCornerRadius={2}
        />
      </div>
    </div>
  );
}

// ── Brand Ranking Bar Chart ───────────────────────────────────────────────────
export function BrandBarChart({
  brands,
  brandScoreMap,
}: {
  brands: Brand[];
  brandScoreMap: Record<string, number | null>;
}) {
  const barData = useMemo(() => {
    return brands
      .map(b => ({ brand: b.brand_name, score: brandScoreMap[b.id] ?? 0 }))
      .filter(b => b.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }, [brands, brandScoreMap]);

  if (barData.length === 0) return null;

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col gap-4 h-full">
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-600 inline-block" />
        Brand Ranking
      </p>

      <div className="flex-1">
        <BarChart
          data={barData}
          xDataKey="brand"
          orientation="horizontal"
          aspectRatio="4 / 3"
          barGap={0.35}
          margin={{ top: 8, right: 20, bottom: 8, left: 90 }}
        >
          <Bar
            dataKey="score"
            fill={C.primary}
            lineCap="round"
            animationType="grow"
            fadedOpacity={0.25}
          />
          <BarYAxis />
        </BarChart>
      </div>
    </div>
  );
}

// ── Visibility Line Chart (full-width) ────────────────────────────────────────
export function VisibilityLineChart({ analyses }: { analyses: StoredGeoAnalysis[] }) {
  const lineData = useMemo(() => {
    return [...analyses]
      .filter(a => a.overall_score != null && a.created_at)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map(a => ({
        date:  a.created_at,
        score: a.overall_score ?? 0,
      }));
  }, [analyses]);

  const hasEnoughData = lineData.length >= 2;

  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Visibility Trend
        </h3>
        {lineData.length > 0 && (
          <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-full">
            {lineData.length} data point{lineData.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {!hasEnoughData ? (
        <div className="h-44 rounded-xl border border-dashed border-border/50 bg-muted/20 flex items-center justify-center">
          <p className="text-sm text-muted-foreground font-medium">
            Run at least 2 analyses to see the trend
          </p>
        </div>
      ) : (
        <LineChart
          data={lineData}
          xDataKey="date"
          aspectRatio="4 / 1"
          margin={{ top: 24, right: 24, bottom: 44, left: 48 }}
        >
          <Grid
            horizontal
            stroke={C.grid}
            strokeOpacity={0.9}
            numTicksRows={4}
          />
          <XAxis numTicks={6} />
          <Line
            dataKey="score"
            stroke={C.primary}
            strokeWidth={2}
            fadeEdges={false}
            showHighlight
          />
          <ChartTooltip showDatePill showDots />
        </LineChart>
      )}
    </div>
  );
}
