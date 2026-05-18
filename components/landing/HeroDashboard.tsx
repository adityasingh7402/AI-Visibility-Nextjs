"use client";
import { motion, useReducedMotion } from "motion/react";
import { TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Paragraph } from "../ui/Paragraph";
import { RingChart } from "@/components/charts/ring-chart";
import { Ring } from "@/components/charts/ring";
import { RingCenter } from "@/components/charts/ring-center";
import { Gauge } from "@/components/charts/gauge";
import { BarChart } from "@/components/charts/bar-chart";
import { Bar } from "@/components/charts/bar";
import { BarYAxis } from "@/components/charts/bar-y-axis";
import type { RingData } from "@/components/charts/ring-context";

// ── palette: sky-400 → blue-600 → blue-800
const C = {
  primary: "#2563eb",
  sky: "#38bdf8",
  deep: "#1e40af",
} as const;

// ── mock data ─────────────────────────────────────────────────────────────────
const ringData: RingData[] = [
  { label: "Latest", value: 73, maxValue: 100, color: C.sky },
  { label: "Average", value: 61, maxValue: 100, color: C.primary },
  { label: "Best", value: 88, maxValue: 100, color: C.deep },
];

const brandData = [
  { brand: "Acme Inc", score: 88 },
  { brand: "TechCorp", score: 72 },
  { brand: "BrandX", score: 61 },
  { brand: "StartupY", score: 45 },
];

// Deterministic noise — no hydration mismatch
const noise = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return (x - Math.floor(x) - 0.5) * 2;
};

const DATE_LABELS = [
  "Apr 17",
  "Apr 18",
  "Apr 19",
  "Apr 20",
  "Apr 21",
  "Apr 22",
  "Apr 23",
  "Apr 24",
  "Apr 25",
  "Apr 26",
  "Apr 27",
  "Apr 28",
  "Apr 29",
  "Apr 30",
  "May 1",
  "May 2",
  "May 3",
  "May 4",
  "May 5",
  "May 6",
  "May 7",
  "May 8",
  "May 9",
  "May 10",
  "May 11",
  "May 12",
  "May 13",
  "May 14",
  "May 15",
  "May 16",
];

const TICK_LABELS = new Set(["Apr 17", "Apr 24", "May 1", "May 9", "May 16"]);

const trendData = DATE_LABELS.map((date, i) => ({
  date,
  overall:
    Math.round(
      Math.max(28, Math.min(88, 36 + i * 1.18 + noise(i) * 3.5)) * 10,
    ) / 10,
  AEO:
    Math.round(
      Math.max(18, Math.min(72, 26 + i * 1.05 + noise(i + 50) * 3.0)) * 10,
    ) / 10,
}));

// ── sub-components ────────────────────────────────────────────────────────────
function ScoreRing() {
  return (
    <div className="flex flex-col items-center gap-1 h-full rounded-xl border border-neutral-200/80 shadow-[inset_-12px_-8px_40px_#46464620] bg-white/60 p-4">
      <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
        Score Overview
      </span>
      <RingChart
        data={ringData}
        size={110}
        strokeWidth={10}
        ringGap={5}
        baseInnerRadius={28}
      >
        <Ring index={0} />
        <Ring index={1} />
        <Ring index={2} />
        <RingCenter
          defaultLabel="Latest"
          valueClassName="text-[11px] font-black text-neutral-900 tabular-nums"
          labelClassName="text-[7px] font-medium text-neutral-400 mt-0.1"
        />
      </RingChart>
      <div className="flex gap-3">
        {ringData.map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1">
            <div
              className="h-1.5 w-1.5 rounded-full shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="text-[9px] font-medium text-neutral-400">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScoreGaugeChart() {
  return (
    <div className="flex flex-col items-center gap-1 h-full rounded-xl border border-neutral-200/80 shadow-[inset_-12px_-8px_40px_#46464620] bg-white/60 p-4">
      <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
        GEO Score
      </span>
      <div className="flex items-center justify-center">
        <Gauge
          value={73}
          centerValue={73}
          width={180}
          height={124}
          useGradient
          activeGradient={[C.sky, C.deep]}
          inactiveGradient={["#e2e8f0", "#cbd5e1"]}
          inactiveFillOpacity={0.5}
          defaultLabel="GEO Score"
          totalNotches={32}
          notchCornerRadius={2}
        />
      </div>
      <span className="text-[9px] font-semibold text-emerald-500">
        +5 pts this month
      </span>
    </div>
  );
}

function BrandBar() {
  return (
    <div className="flex flex-col gap-1 h-full rounded-xl border border-neutral-200/80 shadow-[inset_-12px_-8px_40px_#46464620] bg-white/60 p-4">
      <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
        Brand Ranking
      </span>
      <BarChart
        data={brandData}
        xDataKey="brand"
        orientation="horizontal"
        aspectRatio="3 / 2"
        barGap={0.35}
        margin={{ top: 6, right: 12, bottom: 6, left: 72 }}
      >
        <Bar
          dataKey="score"
          fill={C.primary}
          lineCap="round"
          animationType="grow"
          fadedOpacity={0.2}
        />
        <BarYAxis />
      </BarChart>
    </div>
  );
}

function VisibilityArea() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
          <TrendingUp size={11} className="text-blue-600" />
          AI Visibility Trend
        </span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: C.primary }}
            />
            <span className="text-[9px] text-neutral-400">Overall</span>
          </div>
          <div className="flex items-center gap-1">
            <div
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: C.sky }}
            />
            <span className="text-[9px] text-neutral-400">AEO</span>
          </div>
        </div>
      </div>

      {/* Chart with left/right fade mask */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart
            data={trendData}
            margin={{ top: 8, right: 0, bottom: 0, left: 0 }}
          >
            <defs>
              {/* Primary area gradient */}
              <linearGradient id="gradPrimary" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.primary} stopOpacity={0.18} />
                <stop offset="100%" stopColor={C.primary} stopOpacity={0.01} />
              </linearGradient>
              {/* Secondary area gradient */}
              <linearGradient id="gradSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={C.sky} stopOpacity={0.12} />
                <stop offset="100%" stopColor={C.sky} stopOpacity={0.01} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: "#a3a3a3" }}
              height={20}
              interval={0}
              tickFormatter={(v) => (TICK_LABELS.has(v) ? v : "")}
            />

            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                fontSize: 10,
                padding: "4px 8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
              itemStyle={{ color: "#374151", fontWeight: 600 }}
              labelStyle={{ color: "#9ca3af", marginBottom: 2 }}
            />

            {/* Secondary line (AEO) */}
            <Area
              type="monotone"
              dataKey="AEO"
              stroke={C.sky}
              strokeWidth={1.5}
              strokeOpacity={0.7}
              fill="url(#gradSky)"
              dot={false}
              activeDot={{ r: 3, fill: C.sky, strokeWidth: 0 }}
              isAnimationActive
              animationDuration={1800}
              animationEasing="ease-out"
            />

            {/* Primary line (Overall) */}
            <Area
              type="monotone"
              dataKey="overall"
              stroke={C.primary}
              strokeWidth={2}
              fill="url(#gradPrimary)"
              dot={false}
              activeDot={{ r: 3.5, fill: C.primary, strokeWidth: 0 }}
              isAnimationActive
              animationDuration={1600}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Left edge fade */}
        <div
          className="absolute inset-y-0 left-0 w-12 pointer-events-none"
          style={{
            background: "linear-gradient(to right, white, transparent)",
          }}
        />
        {/* Right edge fade */}
        <div
          className="absolute inset-y-0 right-0 w-12 pointer-events-none"
          style={{ background: "linear-gradient(to left, white, transparent)" }}
        />
      </div>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────
export const HeroDashboard = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 48 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="max-w-4xl mx-auto font-schibsted shadow-[inset_0px_20px_20px_10px_#00000024] bg-white relative rounded-[18px] border border-neutral-200 shadow-2xl shadow-neutral-900/10 overflow-hidden"
    >
      {/* Grain overlay */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <filter id="dashboardGrain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>
      <div
        className="absolute inset-0 z-0 pointer-events-none bg-neutral-300 opacity-[0.10]"
        style={{ filter: "url(#dashboardGrain)" }}
      />
      {/* Header */}
      <div className="relative z-10 px-5 md:px-8 pt-7 pb-5 border-b border-neutral-100">
        <Paragraph variant="paragraphHeading" className="font-semibold">
          Good morning, Acme Inc
        </Paragraph>
        <Paragraph
          variant="paragraphtext"
          className="font-medium text-neutral-400 mt-1"
        >
          Your AI visibility metrics are ready to review.
        </Paragraph>
      </div>

      {/* Top row: Ring + Gauge + Bar */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
        className="relative z-10 px-5 md:px-8 py-3 grid grid-cols-3 gap-6 border-b border-neutral-100"
      >
        <ScoreRing />
        <ScoreGaugeChart />
        <BrandBar />
      </motion.div>

      {/* Bottom: Area chart */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.65, ease: "easeOut" }}
        className="relative z-10 px-5 md:px-8 pt-5 pb-7"
      >
        <VisibilityArea />
      </motion.div>
    </motion.div>
  );
};
