// "use client";
// import { useState } from "react";
// import { motion, AnimatePresence, useReducedMotion } from "motion/react";
// import { HugeiconsIcon } from "@hugeicons/react";
// import {
//   Analytics01Icon,
//   Chart01Icon,
//   SearchAreaIcon,
//   FlashIcon,
//   AiBrain01Icon,
//   ArrowUp02Icon,
//   CalendarIcon,
// } from "@hugeicons/core-free-icons";
// import { Heading } from "../ui/Heading";
// import { Paragraph } from "../ui/Paragraph";
// import { CTAButton } from "../ui/CTAButton";
// import { IconArrowRight } from "@tabler/icons-react";
// import { RingChart } from "@/components/charts/ring-chart";
// import { Ring } from "@/components/charts/ring";
// import { RingCenter } from "@/components/charts/ring-center";
// import { Gauge } from "@/components/charts/gauge";
// import { BarChart } from "@/components/charts/bar-chart";
// import { Bar } from "@/components/charts/bar";
// import { BarYAxis } from "@/components/charts/bar-y-axis";
// import { BarXAxis } from "@/components/charts/bar-x-axis";
// import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip } from "recharts";
// import type { RingData } from "@/components/charts/ring-context";
// import Grid from "../charts/grid";
// import { PatternLines } from "@visx/pattern";
// import { ChartTooltip } from "@/components/charts/tooltip/chart-tooltip";

// // HoursBarChartVisual palette
// const C = {
//   sky: "rgba(56,189,248,0.88)",
//   mid: "rgba(37,99,235,0.88)",
//   deep: "rgba(30,64,175,0.88)",
//   primary: "#2563eb",
// } as const;

// // ── mock data ─────────────────────────────────────────────────────────────────

// const ringData: RingData[] = [
//   { label: "Latest", value: 73, maxValue: 100, color: C.sky },
//   { label: "Average", value: 61, maxValue: 100, color: C.mid },
//   { label: "Best", value: 88, maxValue: 100, color: C.deep },
// ];

// const brandData = [
//   { brand: "Acme Inc", score: 88 },
//   { brand: "TechCorp", score: 72 },
//   { brand: "BrandX", score: 61 },
//   { brand: "StartupY", score: 45 },
// ];

// const noise = (i: number) => {
//   const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
//   return (x - Math.floor(x) - 0.5) * 2;
// };
// const DATE_LABELS = [
//   "Apr 17",
//   "Apr 21",
//   "Apr 25",
//   "Apr 29",
//   "May 3",
//   "May 7",
//   "May 11",
//   "May 16",
// ];
// const TICK_LABELS = new Set(["Apr 17", "Apr 25", "May 3", "May 16"]);
// const trendData = DATE_LABELS.map((date, i) => ({
//   date,
//   overall:
//     Math.round(
//       Math.max(28, Math.min(88, 36 + i * 1.18 + noise(i) * 3.5)) * 10,
//     ) / 10,
// }));

// const providerData = [
//   { provider: "ChatGPT", mention: 71 },
//   { provider: "Gemini", mention: 54 },
//   { provider: "Perplexity", mention: 68 },
//   { provider: "Claude", mention: 43 },
//   { provider: "Grok", mention: 37 },
// ];

// const radarMetrics = [
//   "Mention",
//   "Citation",
//   "Sentiment",
//   "Authority",
//   "Freshness",
// ];
// const radarProviderData = [
//   {
//     label: "ChatGPT",
//     color: C.sky,
//     values: {
//       Mention: 71,
//       Citation: 65,
//       Sentiment: 80,
//       Authority: 75,
//       Freshness: 68,
//     },
//   },
//   {
//     label: "Gemini",
//     color: C.mid,
//     values: {
//       Mention: 54,
//       Citation: 58,
//       Sentiment: 72,
//       Authority: 61,
//       Freshness: 74,
//     },
//   },
//   {
//     label: "Perplexity",
//     color: C.deep,
//     values: {
//       Mention: 68,
//       Citation: 72,
//       Sentiment: 65,
//       Authority: 69,
//       Freshness: 82,
//     },
//   },
// ];

// // ── charts ────────────────────────────────────────────────────────────────────

// const dimensionData = [
//   { label: "Citation", value: 81 },
//   { label: "Mention", value: 74 },
//   { label: "Sentiment", value: 68 },
//   { label: "Authority", value: 77 },
//   { label: "Entity", value: 55 },
//   { label: "Depth", value: 63 },
//   { label: "Links", value: 70 },
//   { label: "Freshness", value: 82 },
//   { label: "Schema", value: 49 },
//   { label: "Voice", value: 72 },
//   { label: "Topics", value: 66 },
//   { label: "Keywords", value: 78 },
//   { label: "Answers", value: 60 },
//   { label: "Context", value: 85 },
//   { label: "Trust", value: 71 },
//   { label: "Response", value: 58 },
//   { label: "AI Rank", value: 73 },
// ];

// const geoScoreDimensions = [
//   { label: "Crawlability", value: 96 },
//   { label: "NLP Relevance", value: 78 },
//   { label: "Authority Signals", value: 88 },
//   { label: "Citation Depth", value: 52 },
//   { label: "Mention Rate", value: 71 },
//   { label: "Sentiment", value: 85 },
//   { label: "Entity Recognition", value: 43 },
//   { label: "Content Freshness", value: 92 },
//   { label: "Backlink Quality", value: 59 },
//   { label: "Topic Relevance", value: 81 },
//   { label: "Keyword Match", value: 48 },
//   { label: "Schema Markup", value: 94 },
//   { label: "Image SEO", value: 37 },
//   { label: "LLM Testing", value: 89 },
//   { label: "Page Speed", value: 65 },
//   { label: "Trust Score", value: 83 },
//   { label: "Competitor Benchmark", value: 44 },
// ];

// function GeoScoreChart() {
//   return (
//     <div className="flex flex-col gap-2">
//       {/* Top row: gauge + text */}
//       <div className="flex gap-2 items-stretch">
//         {/* Left: Gauge */}
//         <div className="flex items-center justify-center bg-neutral-50 rounded-xl p-1 flex-1">
//           <Gauge
//             value={73}
//             centerValue={73}
//             width={200}
//             height={185}
//             useGradient
//             activeGradient={["rgba(56,189,248,1)", "rgba(30,64,175,1)"]}
//             inactiveGradient={["#e2e8f0", "#cbd5e1"]}
//             inactiveFillOpacity={0.5}
//             defaultLabel="GEO Score"
//             totalNotches={32}
//             notchCornerRadius={2}
//           />
//         </div>

//         {/* Right: supporting text */}
//         <div className="flex flex-col justify-center bg-neutral-50 rounded-xl p-4 flex-1 gap-2">
//           <span className="font-schibsted text-[9px] font-semibold text-blue-500 uppercase tracking-widest">
//             GEO Score
//           </span>
//           <div className="flex flex-col gap-1 mt-1">
//             <div className="flex items-center gap-1.5">
//               <HugeiconsIcon
//                 icon={Analytics01Icon}
//                 size={12}
//                 className="text-blue-500 shrink-0"
//                 strokeWidth={2}
//               />
//               <span className="font-schibsted text-[11px] font-semibold text-neutral-700">
//                 Grade B+
//               </span>
//             </div>
//             <div className="flex items-center gap-1.5">
//               <HugeiconsIcon
//                 icon={FlashIcon}
//                 size={12}
//                 className="text-emerald-500 shrink-0"
//                 strokeWidth={2}
//               />
//               <span className="font-schibsted text-[11px] font-semibold text-neutral-700">
//                 +5 pts this month
//               </span>
//             </div>
//           </div>
//           <Paragraph
//             variant="paragraphtext"
//             className="text-[10px] leading-snug mt-1"
//           >
//             Improving · 17 dimensions tracked
//           </Paragraph>
//         </div>
//       </div>

//       <Paragraph
//         variant="paragraphtext"
//         className="text-[6px] leading-tight mt-2"
//       >
//         Analyzed across 17 dimensions including mention rate, sentiment,
//         authority, and citation depth.
//       </Paragraph>

//       {/* Bottom row: 17-bar dimension chart */}
//       <div className="bg-neutral-50 rounded-xl px-4 pb-2">
//         <BarChart
//           data={dimensionData}
//           xDataKey="label"
//           barGap={0.2}
//           margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
//         >
//           <PatternLines
//             height={8}
//             id="barPattern"
//             orientation={["diagonal"]}
//             stroke="var(--chart-2)"
//             strokeWidth={2}
//             width={8}
//           />
//           <Grid horizontal />
//           <Bar
//             dataKey="value"
//             fill="url(#barPattern)"
//             lineCap={4}
//             stroke="var(--chart-2)"
//           />
//           <ChartTooltip />
//         </BarChart>
//       </div>
//     </div>
//   );
// }

// function ScoreOverviewChart() {
//   return (
//     <div className="flex flex-col gap-3">
//       {/* Header row */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-1.5 font-schibsted text-[12px] text-neutral-800 tracking-tight">
//           <HugeiconsIcon
//             icon={CalendarIcon}
//             size={12}
//             className="text-blue-500 shrink-0"
//             strokeWidth={2}
//           />
//           <span>Last 30 days</span>
//         </div>
//       </div>

//       {/* Middle: ring chart + stat panel */}
//       <div className="flex gap-3 items-stretch">
//         {/* Left: RingChart */}
//         <div className="flex items-center justify-center bg-neutral-50 rounded-xl p-3 flex-1">
//           <RingChart
//             data={ringData}
//             size={180}
//             strokeWidth={11}
//             ringGap={5}
//             baseInnerRadius={28}
//           >
//             <Ring index={0} />
//             <Ring index={1} />
//             <Ring index={2} />
//             <RingCenter
//               defaultLabel="Latest"
//               valueClassName="text-[13px] font-black text-neutral-900 tabular-nums"
//               labelClassName="text-[8px] font-medium text-neutral-400"
//             />
//           </RingChart>
//         </div>

//         {/* Right: stat panel */}
//         <div className="flex flex-col justify-between bg-neutral-50 rounded-xl p-3 flex-1">
//           {[
//             { label: "Latest", value: "222", color: C.sky },
//             { label: "Average", value: "61", color: C.mid },
//             { label: "Best", value: "88", color: C.deep },
//           ].map(({ label, value, color }) => (
//             <div key={label} className="flex items-center justify-between">
//               <div className="flex items-center gap-1">
//                 <div
//                   className="h-2 w-2 rounded-full shrink-0"
//                   style={{ backgroundColor: color }}
//                 />
//                 <span className="font-schibsted text-[10px] text-neutral-800 tracking-tight">
//                   {label}
//                 </span>
//               </div>
//               <span className="font-schibsted text-[13px] text-neutral-800 tabular-nums">
//                 {value}
//               </span>
//             </div>
//           ))}
//           <hr className="border-neutral-200" />
//           {/* <div className="flex items-center gap-1">
//             <HugeiconsIcon
//               icon={FlashIcon}
//               size={11}
//               className="text-emerald-500 shrink-0"
//               strokeWidth={2}
//             />
//             <span className="font-schibsted text-[10px] font-semibold text-emerald-600">
//               +12 pts
//             </span>
//             <span className="font-schibsted text-[10px] text-neutral-400 font-medium">
//               · 3 runs
//             </span>
//           </div> */}
//           <Paragraph
//             variant="paragraphtext"
//             className="text-[10px] leading-snug"
//           >
//             Your average score goes up by <span className="font-bold">94%</span>
//           </Paragraph>
//         </div>
//       </div>

//       {/* Bottom insight */}
//       <Paragraph variant="paragraphtext" className="text-[11px] leading-snug">
//         Your visibility is trending upward
//       </Paragraph>

//       <div className="bg-neutral-50 rounded-xl px-4 pb-2">
//         <BarChart
//           data={geoScoreDimensions}
//           xDataKey="label"
//           barGap={0.2}
//           margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
//         >
//           <PatternLines
//             height={8}
//             id="barPattern"
//             orientation={["vertical"]}
//             stroke="var(--chart-2)"
//             strokeWidth={2}
//             width={8}
//           />
//           <Grid horizontal />
//           <Bar
//             dataKey="value"
//             fill="url(#barPattern)"
//             lineCap={4}
//             stroke="var(--chart-2)"
//           />
//           <ChartTooltip />
//         </BarChart>
//       </div>
//     </div>
//   );
// }

// function BrandRankingChart() {
//   return (
//     <div className="flex flex-col gap-3">
//       <BarChart
//         data={brandData}
//         xDataKey="brand"
//         orientation="horizontal"
//         aspectRatio="2 / 1"
//         barGap={0.35}
//         margin={{ top: 6, right: 16, bottom: 6, left: 80 }}
//       >
//         <Bar
//           dataKey="score"
//           fill={C.deep}
//           lineCap="round"
//           animationType="grow"
//           fadedOpacity={0.2}
//         />
//         <BarYAxis />
//       </BarChart>
//       <Paragraph variant="paragraphHeading" className="text-sm leading-snug">
//         Your Brand leads · 88 / 100
//       </Paragraph>
//       <Paragraph variant="paragraphtext">
//         4 brands tracked · You rank #1
//       </Paragraph>
//     </div>
//   );
// }

// function VisibilityTrendChart() {
//   return (
//     <div className="flex flex-col gap-3">
//       <ResponsiveContainer width="100%" height={140}>
//         <AreaChart
//           data={trendData}
//           margin={{ top: 8, right: 0, bottom: 0, left: 0 }}
//         >
//           <defs>
//             <linearGradient id="dmGrad" x1="0" y1="0" x2="0" y2="1">
//               <stop
//                 offset="0%"
//                 stopColor="rgba(56,189,248,1)"
//                 stopOpacity={0.25}
//               />
//               <stop
//                 offset="100%"
//                 stopColor="rgba(30,64,175,1)"
//                 stopOpacity={0.02}
//               />
//             </linearGradient>
//           </defs>
//           <XAxis
//             dataKey="date"
//             axisLine={false}
//             tickLine={false}
//             tick={{
//               fontSize: 9,
//               fill: "#a3a3a3",
//               fontFamily: "var(--font-schibsted)",
//             }}
//             height={18}
//             interval={0}
//             tickFormatter={(v) => (TICK_LABELS.has(v) ? v : "")}
//           />
//           <Tooltip
//             contentStyle={{
//               background: "white",
//               border: "1px solid #e5e7eb",
//               borderRadius: 8,
//               fontSize: 10,
//               padding: "4px 8px",
//             }}
//             itemStyle={{ color: "#374151", fontWeight: 600 }}
//             labelStyle={{ color: "#9ca3af", marginBottom: 2 }}
//           />
//           <Area
//             type="monotone"
//             dataKey="overall"
//             stroke={C.primary}
//             strokeWidth={2}
//             fill="url(#dmGrad)"
//             dot={false}
//             activeDot={{ r: 3.5, fill: C.primary, strokeWidth: 0 }}
//             animationDuration={1600}
//             animationEasing="ease-out"
//           />
//         </AreaChart>
//       </ResponsiveContainer>
//       <Paragraph variant="paragraphHeading" className="text-sm leading-snug">
//         <span className="text-emarld-400 flex flex-row items-center gap-1">
//           {" "}
//           <HugeiconsIcon
//             icon={ArrowUp02Icon}
//             size={20}
//             className="text-blue-500 shrink-0"
//             strokeWidth={2}
//           />
//           12 pts over 30 days
//         </span>{" "}
//       </Paragraph>
//       <Paragraph variant="paragraphtext">
//         Improving trajectory · 8 data points tracked
//       </Paragraph>
//     </div>
//   );
// }

// function ProviderRadarVisual({ size = 190 }: { size?: number }) {
//   const cx = size / 2;
//   const cy = size / 2;
//   const radius = (size / 2) * 0.62;
//   const n = radarMetrics.length;

//   const pt = (metricIdx: number, value: number) => {
//     const angle = (Math.PI * 2 * metricIdx) / n - Math.PI / 2;
//     const r = (value / 100) * radius;
//     return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
//   };

//   const axisEnd = (metricIdx: number) => {
//     const angle = (Math.PI * 2 * metricIdx) / n - Math.PI / 2;
//     return {
//       x: cx + radius * Math.cos(angle),
//       y: cy + radius * Math.sin(angle),
//     };
//   };

//   const labelPos = (metricIdx: number) => {
//     const angle = (Math.PI * 2 * metricIdx) / n - Math.PI / 2;
//     const r = radius + 18;
//     return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
//   };

//   const polygonPts = (values: Record<string, number>) =>
//     radarMetrics
//       .map((m, i) => {
//         const p = pt(i, values[m]);
//         return `${p.x},${p.y}`;
//       })
//       .join(" ");

//   const gridLevels = [25, 50, 75, 100];

//   return (
//     <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
//       {/* Grid polygons */}
//       {gridLevels.map((level) => (
//         <polygon
//           key={level}
//           points={radarMetrics
//             .map((_, i) => {
//               const p = pt(i, level);
//               return `${p.x},${p.y}`;
//             })
//             .join(" ")}
//           fill="none"
//           stroke="#e5e7eb"
//           strokeWidth={0.75}
//         />
//       ))}
//       {/* Axis lines */}
//       {radarMetrics.map((_, i) => {
//         const end = axisEnd(i);
//         return (
//           <line
//             key={i}
//             x1={cx}
//             y1={cy}
//             x2={end.x}
//             y2={end.y}
//             stroke="#e5e7eb"
//             strokeWidth={0.75}
//           />
//         );
//       })}
//       {/* Data polygons */}
//       {radarProviderData.map(({ label, color, values }) => (
//         <polygon
//           key={label}
//           points={polygonPts(values)}
//           fill={color}
//           fillOpacity={0.13}
//           stroke={color}
//           strokeWidth={1.5}
//           strokeLinejoin="round"
//         />
//       ))}
//       {/* Data dots */}
//       {radarProviderData.map(({ label, color, values }) =>
//         radarMetrics.map((m, i) => {
//           const p = pt(i, (values as Record<string, number>)[m]);
//           return (
//             <circle
//               key={`${label}-${m}`}
//               cx={p.x}
//               cy={p.y}
//               r={2.5}
//               fill={color}
//               fillOpacity={0.9}
//             />
//           );
//         }),
//       )}
//       {/* Axis labels */}
//       {radarMetrics.map((metric, i) => {
//         const pos = labelPos(i);
//         return (
//           <text
//             key={metric}
//             x={pos.x}
//             y={pos.y}
//             textAnchor="middle"
//             dominantBaseline="middle"
//             fontSize={7.5}
//             fill="#9ca3af"
//             fontFamily="var(--font-schibsted)"
//             fontWeight={600}
//           >
//             {metric}
//           </text>
//         );
//       })}
//     </svg>
//   );
// }

// function ProviderCoverageChart() {
//   return (
//     <div className="flex flex-col gap-2">
//       {/* Top row: radar + supporting text */}
//       <div className="flex gap-2 items-stretch">
//         {/* Left: Radar chart */}
//         <div className="flex items-center justify-center bg-neutral-50 rounded-xl p-1 flex-1">
//           <ProviderRadarVisual size={190} />
//         </div>

//         {/* Right: supporting text */}
//         <div className="flex flex-col justify-center bg-neutral-50 rounded-xl p-4 flex-1 gap-2">
//           <span className="font-schibsted text-[9px] font-semibold text-blue-500 uppercase tracking-widest">
//             AI Coverage
//           </span>
//           <div className="flex flex-col gap-1 mt-1">
//             <div className="flex items-center gap-1.5">
//               <HugeiconsIcon
//                 icon={AiBrain01Icon}
//                 size={12}
//                 className="text-blue-500 shrink-0"
//                 strokeWidth={2}
//               />
//               <span className="font-schibsted text-[11px] font-semibold text-neutral-700">
//                 ChatGPT leads · 71%
//               </span>
//             </div>
//             <div className="flex items-center gap-1.5">
//               <HugeiconsIcon
//                 icon={FlashIcon}
//                 size={12}
//                 className="text-amber-500 shrink-0"
//                 strokeWidth={2}
//               />
//               <span className="font-schibsted text-[11px] font-semibold text-neutral-700">
//                 Grok gap · 34 pts
//               </span>
//             </div>
//           </div>
//           {/* Series legend */}
//           <div className="flex flex-col gap-1 mt-2">
//             {radarProviderData.map(({ label, color }) => (
//               <div key={label} className="flex items-center gap-1.5">
//                 <div
//                   className="h-2 w-2 rounded-full shrink-0"
//                   style={{ backgroundColor: color }}
//                 />
//                 <span className="font-schibsted text-[10px] font-medium text-neutral-400">
//                   {label}
//                 </span>
//               </div>
//             ))}
//           </div>
//           <Paragraph
//             variant="paragraphtext"
//             className="text-[10px] leading-snug mt-1"
//           >
//             3 engines · 5 dimensions
//           </Paragraph>
//         </div>
//       </div>

//       <Paragraph
//         variant="paragraphtext"
//         className="text-[6px] leading-tight mt-2"
//       >
//         Scored across mention rate, citation depth, sentiment, authority, and
//         content freshness.
//       </Paragraph>
//     </div>
//   );
// }

// // ── categories ────────────────────────────────────────────────────────────────
// const categories = [
//   {
//     number: "001",
//     title: "GEO Score",
//     icon: Analytics01Icon,
//     description:
//       "Your brand's proprietary 0–100 AI visibility score, computed across 17 dimensions including mention rate, sentiment, authority, and citation depth.",
//     chart: <GeoScoreChart />,
//   },
//   {
//     number: "002",
//     title: "Score Overview",
//     icon: Chart01Icon,
//     description:
//       "Compare your latest scan against your historical average and all-time best. See at a glance whether your brand is trending up or stagnating.",
//     chart: <ScoreOverviewChart />,
//   },
//   {
//     number: "003",
//     title: "Brand Ranking",
//     icon: SearchAreaIcon,
//     description:
//       "Benchmark your AI visibility score against tracked competitors. Know exactly where you stand — and how far you need to go to lead your category.",
//     chart: <BrandRankingChart />,
//   },
//   {
//     number: "004",
//     title: "Visibility Trend",
//     icon: FlashIcon,
//     description:
//       "Track your GEO score over every analysis run. Spot improvement patterns, catch sudden drops, and measure the impact of your content changes.",
//     chart: <VisibilityTrendChart />,
//   },
//   {
//     number: "005",
//     title: "AI Provider Coverage",
//     icon: AiBrain01Icon,
//     description:
//       "See how often your brand gets mentioned by ChatGPT, Gemini, Perplexity, Claude, and Grok — and which engines are your biggest blind spots.",
//     chart: <ProviderCoverageChart />,
//   },
// ] as const;

// // ── chart card ────────────────────────────────────────────────────────────────
// function MetricChartCard({ active }: { active: number }) {
//   const cat = categories[active];
//   return (
//     <motion.div
//       layout
//       className="w-full px-3 pt-2"
//       style={{
//         maskImage: "linear-gradient(to bottom, black 72%, transparent 100%)",
//       }}
//     >
//       <motion.div
//         layout
//         className="bg-white/20 ring-1 ring-white/30 shadow-md overflow-hidden rounded-t-[18px] border border-transparent px-2 pt-2"
//       >
//         <motion.div
//           layout
//           className="bg-white ring-1 ring-sky-100/60 shadow overflow-hidden rounded-t-[10px] px-5 pt-4 pb-48"
//         >
//           <div className="flex items-center justify-between mb-4">
//             <span className="font-schibsted text-[10px] font-medium text-neutral-400 uppercase tracking-widest">
//               {cat.title}
//             </span>
//             <span className="font-schibsted text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
//               {cat.number}
//             </span>
//           </div>

//           <AnimatePresence mode="popLayout">
//             <motion.div
//               key={active}
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               transition={{ duration: 0.15 }}
//             >
//               {cat.chart}
//             </motion.div>
//           </AnimatePresence>
//         </motion.div>
//       </motion.div>
//     </motion.div>
//   );
// }

// // ── main component ────────────────────────────────────────────────────────────
// const DataMetricsSection = () => {
//   const shouldReduceMotion = useReducedMotion();
//   const [active, setActive] = useState(0);

//   return (
//     <section className="relative overflow-hidden py-24 px-4 bg-white">
//       <svg className="absolute w-0 h-0" aria-hidden="true">
//         <filter id="dataMetricsGrain">
//           <feTurbulence
//             type="fractalNoise"
//             baseFrequency="0.65"
//             numOctaves="3"
//             stitchTiles="stitch"
//           />
//           <feColorMatrix type="saturate" values="0" />
//         </filter>
//       </svg>

//       <div className="max-w-5xl mx-auto">
//         <motion.div
//           className="max-w-5xl mx-auto mb-16"
//           initial={
//             shouldReduceMotion
//               ? false
//               : { opacity: 0, y: 16, filter: "blur(4px)" }
//           }
//           whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
//         >
//           <Heading
//             as="h2"
//             variant="sectionHeader"
//             className="font-schibsted text-neutral-900 font-light"
//           >
//             Every metric that matters,
//           </Heading>
//           <Heading
//             as="h2"
//             variant="sectionHeader"
//             className="font-schibsted text-neutral-900 font-bold"
//           >
//             visualised in real time.
//           </Heading>
//         </motion.div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">
//           {/* Left — gradient panel */}
//           <motion.div
//             layout
//             className="relative rounded-[20px] overflow-hidden flex items-end justify-center bg-gradient-to-b from-sky-400 via-blue-600 to-blue-800"
//             transition={{
//               layout: { type: "spring", stiffness: 280, damping: 28 },
//             }}
//           >
//             <div
//               className="absolute inset-0 pointer-events-none bg-neutral-500 opacity-80"
//               style={{ filter: "url(#dataMetricsGrain)" }}
//             />
//             <motion.div layout className="relative z-10 w-full">
//               <MetricChartCard active={active} />
//             </motion.div>
//           </motion.div>

//           {/* Right — clickable rows */}
//           <motion.div
//             className="flex flex-col"
//             initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
//           >
//             {categories.map((cat, i) => (
//               <div key={cat.number}>
//                 <button
//                   onClick={() => setActive(i)}
//                   className={`w-full text-left flex items-start justify-between py-5 transition-all duration-200 ${
//                     active === i
//                       ? "pl-3 border-l-2 border-blue-500"
//                       : "pl-0 border-l-2 border-transparent hover:border-neutral-200"
//                   }`}
//                 >
//                   <div className="flex-1 pr-4">
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center gap-2">
//                         <HugeiconsIcon
//                           icon={cat.icon}
//                           size={18}
//                           className={
//                             active === i
//                               ? "text-blue-600 shrink-0"
//                               : "text-neutral-900 shrink-0"
//                           }
//                           strokeWidth={1.8}
//                         />
//                         <Paragraph
//                           variant="paragraphHeading"
//                           className={`font-schibsted uppercase tracking-widest ${active === i ? "text-blue-600" : ""}`}
//                         >
//                           {cat.title}
//                         </Paragraph>
//                       </div>
//                       <span
//                         className={`font-schibsted text-[25px] font-medium tabular-nums mt-0.5 shrink-0 transition-colors duration-200 ${
//                           active === i ? "text-blue-200" : "text-neutral-300"
//                         }`}
//                       >
//                         {cat.number}
//                       </span>
//                     </div>
//                     <Paragraph
//                       variant="paragraphtext"
//                       className="font-schibsted mt-2"
//                     >
//                       {cat.description}
//                     </Paragraph>
//                   </div>
//                 </button>
//                 {i < categories.length - 1 && (
//                   <hr className="border-neutral-200" />
//                 )}
//               </div>
//             ))}

//             <div className="mt-8">
//               <CTAButton
//                 loggedInHref="/dashboard"
//                 loggedOutHref="/signup"
//                 icon={IconArrowRight}
//                 className="font-schibsted rounded-md"
//               >
//                 See your metrics
//               </CTAButton>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default DataMetricsSection;

"use client";
import { useState, useRef, useEffect, useId } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useAnimate,
} from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Analytics01Icon,
  Chart01Icon,
  SearchAreaIcon,
  FlashIcon,
  AiBrain01Icon,
  ArrowUp02Icon,
  CalendarIcon,
} from "@hugeicons/core-free-icons";
import { Heading } from "../ui/Heading";
import { Paragraph } from "../ui/Paragraph";
import { CTAButton } from "../ui/CTAButton";
import { IconArrowRight } from "@tabler/icons-react";
import { RingChart } from "@/components/charts/ring-chart";
import { Ring } from "@/components/charts/ring";
import { RingCenter } from "@/components/charts/ring-center";
import { Gauge } from "@/components/charts/gauge";
import { BarChart } from "@/components/charts/bar-chart";
import { Bar } from "@/components/charts/bar";
import { BarYAxis } from "@/components/charts/bar-y-axis";
import { BarXAxis } from "@/components/charts/bar-x-axis";
import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import type { RingData } from "@/components/charts/ring-context";
import Grid from "../charts/grid";
import { PatternLines } from "@visx/pattern";
import { ChartTooltip } from "@/components/charts/tooltip/chart-tooltip";

// HoursBarChartVisual palette
const C = {
  sky: "rgba(56,189,248,0.88)",
  mid: "rgba(37,99,235,0.88)",
  deep: "rgba(30,64,175,0.88)",
  primary: "#2563eb",
} as const;

// ── mock data ─────────────────────────────────────────────────────────────────

const ringData: RingData[] = [
  { label: "Latest", value: 73, maxValue: 100, color: C.sky },
  { label: "Average", value: 61, maxValue: 100, color: C.mid },
  { label: "Best", value: 88, maxValue: 100, color: C.deep },
];

const brandData = [
  { brand: "Acme Inc", score: 88 },
  { brand: "TechCorp", score: 72 },
  { brand: "BrandX", score: 61 },
  { brand: "StartupY", score: 45 },
];

const noise = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return (x - Math.floor(x) - 0.5) * 2;
};
const DATE_LABELS = [
  "Apr 17",
  "Apr 21",
  "Apr 25",
  "Apr 29",
  "May 3",
  "May 7",
  "May 11",
  "May 16",
];
const TICK_LABELS = new Set(["Apr 17", "Apr 25", "May 3", "May 16"]);
const trendData = DATE_LABELS.map((date, i) => ({
  date,
  overall:
    Math.round(
      Math.max(28, Math.min(88, 36 + i * 1.18 + noise(i) * 3.5)) * 10,
    ) / 10,
}));

const providerData = [
  { provider: "ChatGPT", mention: 71 },
  { provider: "Gemini", mention: 54 },
  { provider: "Perplexity", mention: 68 },
  { provider: "Claude", mention: 43 },
  { provider: "Grok", mention: 37 },
];

const radarMetrics = [
  "Mention",
  "Citation",
  "Sentiment",
  "Authority",
  "Freshness",
];
const radarProviderData = [
  {
    label: "ChatGPT",
    color: C.sky,
    values: {
      Mention: 71,
      Citation: 65,
      Sentiment: 80,
      Authority: 75,
      Freshness: 68,
    },
  },
  {
    label: "Gemini",
    color: C.mid,
    values: {
      Mention: 54,
      Citation: 58,
      Sentiment: 72,
      Authority: 61,
      Freshness: 74,
    },
  },
  {
    label: "Perplexity",
    color: C.deep,
    values: {
      Mention: 68,
      Citation: 72,
      Sentiment: 65,
      Authority: 69,
      Freshness: 82,
    },
  },
];

// ── charts ────────────────────────────────────────────────────────────────────

const dimensionData = [
  { label: "Citation", value: 81 },
  { label: "Mention", value: 74 },
  { label: "Sentiment", value: 68 },
  { label: "Authority", value: 77 },
  { label: "Entity", value: 55 },
  { label: "Depth", value: 63 },
  { label: "Links", value: 70 },
  { label: "Freshness", value: 82 },
  { label: "Schema", value: 49 },
  { label: "Voice", value: 72 },
  { label: "Topics", value: 66 },
  { label: "Keywords", value: 78 },
  { label: "Answers", value: 60 },
  { label: "Context", value: 85 },
  { label: "Trust", value: 71 },
  { label: "Response", value: 58 },
  { label: "AI Rank", value: 73 },
];

const geoScoreDimensions = [
  { label: "Crawlability", value: 96 },
  { label: "NLP Relevance", value: 78 },
  { label: "Authority Signals", value: 88 },
  { label: "Citation Depth", value: 52 },
  { label: "Mention Rate", value: 71 },
  { label: "Sentiment", value: 85 },
  { label: "Entity Recognition", value: 43 },
  { label: "Content Freshness", value: 92 },
  { label: "Backlink Quality", value: 59 },
  { label: "Topic Relevance", value: 81 },
  { label: "Keyword Match", value: 48 },
  { label: "Schema Markup", value: 94 },
  { label: "Image SEO", value: 37 },
  { label: "LLM Testing", value: 89 },
  { label: "Page Speed", value: 65 },
  { label: "Trust Score", value: 83 },
  { label: "Competitor Benchmark", value: 44 },
];

function GeoScoreChart() {
  return (
    <div className="flex flex-col gap-2">
      {/* Top row: gauge + text */}
      <div className="flex gap-2 items-stretch">
        {/* Left: Gauge */}
        <div className="flex items-center justify-center bg-neutral-50 rounded-xl p-1 flex-1">
          <Gauge
            value={73}
            centerValue={73}
            width={200}
            height={185}
            useGradient
            activeGradient={["rgba(56,189,248,1)", "rgba(30,64,175,1)"]}
            inactiveGradient={["#e2e8f0", "#cbd5e1"]}
            inactiveFillOpacity={0.5}
            defaultLabel="GEO Score"
            totalNotches={32}
            notchCornerRadius={2}
          />
        </div>

        {/* Right: supporting text */}
        <div className="flex flex-col justify-center bg-neutral-50 rounded-xl p-4 flex-1 gap-2">
          <span className="font-schibsted text-[9px] font-semibold text-blue-500 uppercase tracking-widest">
            GEO Score
          </span>
          <div className="flex flex-col gap-1 mt-1">
            <div className="flex items-center gap-1.5">
              <HugeiconsIcon
                icon={Analytics01Icon}
                size={12}
                className="text-blue-500 shrink-0"
                strokeWidth={2}
              />
              <span className="font-schibsted text-[11px] font-semibold text-neutral-700">
                Grade B+
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <HugeiconsIcon
                icon={FlashIcon}
                size={12}
                className="text-emerald-500 shrink-0"
                strokeWidth={2}
              />
              <span className="font-schibsted text-[11px] font-semibold text-neutral-700">
                +5 pts this month
              </span>
            </div>
          </div>
          <Paragraph
            variant="paragraphtext"
            className="text-[10px] leading-snug mt-1"
          >
            Improving · 17 dimensions tracked
          </Paragraph>
        </div>
      </div>

      <Paragraph
        variant="paragraphtext"
        className="text-[6px] leading-tight mt-2"
      >
        Analyzed across 17 dimensions including mention rate, sentiment,
        authority, and citation depth.
      </Paragraph>

      {/* Bottom row: 17-bar dimension chart */}
      <div className="bg-neutral-50 rounded-xl px-4 pb-2">
        <BarChart
          data={dimensionData}
          xDataKey="label"
          barGap={0.2}
          margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
        >
          <PatternLines
            height={8}
            id="barPattern"
            orientation={["diagonal"]}
            stroke="var(--chart-2)"
            strokeWidth={2}
            width={8}
          />
          <Grid horizontal />
          <Bar
            dataKey="value"
            fill="url(#barPattern)"
            lineCap={4}
            stroke="var(--chart-2)"
          />
          <ChartTooltip />
        </BarChart>
      </div>
    </div>
  );
}

function ScoreOverviewChart() {
  return (
    <div className="flex flex-col gap-3">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-schibsted text-[12px] text-neutral-800 tracking-tight">
          <HugeiconsIcon
            icon={CalendarIcon}
            size={12}
            className="text-blue-500 shrink-0"
            strokeWidth={2}
          />
          <span>Last 30 days</span>
        </div>
      </div>

      {/* Middle: ring chart + stat panel */}
      <div className="flex gap-3 items-stretch">
        {/* Left: RingChart */}
        <div className="flex items-center justify-center bg-neutral-50 rounded-xl p-3 flex-1">
          <RingChart
            data={ringData}
            size={180}
            strokeWidth={11}
            ringGap={5}
            baseInnerRadius={28}
          >
            <Ring index={0} />
            <Ring index={1} />
            <Ring index={2} />
            <RingCenter
              defaultLabel="Latest"
              valueClassName="text-[13px] font-black text-neutral-900 tabular-nums"
              labelClassName="text-[8px] font-medium text-neutral-400"
            />
          </RingChart>
        </div>

        {/* Right: stat panel */}
        <div className="flex flex-col justify-between bg-neutral-50 rounded-xl p-3 flex-1">
          {[
            { label: "Latest", value: "222", color: C.sky },
            { label: "Average", value: "61", color: C.mid },
            { label: "Best", value: "88", color: C.deep },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <div
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="font-schibsted text-[10px] text-neutral-800 tracking-tight">
                  {label}
                </span>
              </div>
              <span className="font-schibsted text-[13px] text-neutral-800 tabular-nums">
                {value}
              </span>
            </div>
          ))}
          <hr className="border-neutral-200" />
          {/* <div className="flex items-center gap-1">
            <HugeiconsIcon
              icon={FlashIcon}
              size={11}
              className="text-emerald-500 shrink-0"
              strokeWidth={2}
            />
            <span className="font-schibsted text-[10px] font-semibold text-emerald-600">
              +12 pts
            </span>
            <span className="font-schibsted text-[10px] text-neutral-400 font-medium">
              · 3 runs
            </span>
          </div> */}
          <Paragraph
            variant="paragraphtext"
            className="text-[10px] leading-snug"
          >
            Your average score goes up by <span className="font-bold">94%</span>
          </Paragraph>
        </div>
      </div>

      {/* Bottom insight */}
      <Paragraph variant="paragraphtext" className="text-[11px] leading-snug">
        Your visibility is trending upward
      </Paragraph>

      <div className="bg-neutral-50 rounded-xl px-4 pb-2">
        <BarChart
          data={geoScoreDimensions}
          xDataKey="label"
          barGap={0.2}
          margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
        >
          <PatternLines
            height={8}
            id="barPattern"
            orientation={["vertical"]}
            stroke="var(--chart-2)"
            strokeWidth={2}
            width={8}
          />
          <Grid horizontal />
          <Bar
            dataKey="value"
            fill="url(#barPattern)"
            lineCap={4}
            stroke="var(--chart-2)"
          />
          <ChartTooltip />
        </BarChart>
      </div>
    </div>
  );
}

function BrandRankingChart() {
  return (
    <div className="flex flex-col gap-3">
      <BarChart
        data={brandData}
        xDataKey="brand"
        orientation="horizontal"
        aspectRatio="2 / 1"
        barGap={0.35}
        margin={{ top: 6, right: 16, bottom: 6, left: 80 }}
      >
        <Bar
          dataKey="score"
          fill={C.deep}
          lineCap="round"
          animationType="grow"
          fadedOpacity={0.2}
        />
        <BarYAxis />
      </BarChart>
      <Paragraph variant="paragraphHeading" className="text-sm leading-snug">
        Your Brand leads · 88 / 100
      </Paragraph>
      <Paragraph variant="paragraphtext">
        4 brands tracked · You rank #1
      </Paragraph>
    </div>
  );
}

function VisibilityTrendChart() {
  return (
    <div className="flex flex-col gap-3">
      <ResponsiveContainer width="100%" height={140}>
        <AreaChart
          data={trendData}
          margin={{ top: 8, right: 0, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id="dmGrad" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="rgba(56,189,248,1)"
                stopOpacity={0.25}
              />
              <stop
                offset="100%"
                stopColor="rgba(30,64,175,1)"
                stopOpacity={0.02}
              />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 9,
              fill: "#a3a3a3",
              fontFamily: "var(--font-schibsted)",
            }}
            height={18}
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
            }}
            itemStyle={{ color: "#374151", fontWeight: 600 }}
            labelStyle={{ color: "#9ca3af", marginBottom: 2 }}
          />
          <Area
            type="monotone"
            dataKey="overall"
            stroke={C.primary}
            strokeWidth={2}
            fill="url(#dmGrad)"
            dot={false}
            activeDot={{ r: 3.5, fill: C.primary, strokeWidth: 0 }}
            animationDuration={1600}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
      <Paragraph variant="paragraphHeading" className="text-sm leading-snug">
        <span className="text-emarld-400 flex flex-row items-center gap-1">
          {" "}
          <HugeiconsIcon
            icon={ArrowUp02Icon}
            size={20}
            className="text-blue-500 shrink-0"
            strokeWidth={2}
          />
          12 pts over 30 days
        </span>{" "}
      </Paragraph>
      <Paragraph variant="paragraphtext">
        Improving trajectory · 8 data points tracked
      </Paragraph>
    </div>
  );
}

function ProviderRadarVisual({ size = 190 }: { size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = (size / 2) * 0.62;
  const n = radarMetrics.length;

  const pt = (metricIdx: number, value: number) => {
    const angle = (Math.PI * 2 * metricIdx) / n - Math.PI / 2;
    const r = (value / 100) * radius;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const axisEnd = (metricIdx: number) => {
    const angle = (Math.PI * 2 * metricIdx) / n - Math.PI / 2;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  };

  const labelPos = (metricIdx: number) => {
    const angle = (Math.PI * 2 * metricIdx) / n - Math.PI / 2;
    const r = radius + 18;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  const polygonPts = (values: Record<string, number>) =>
    radarMetrics
      .map((m, i) => {
        const p = pt(i, values[m]);
        return `${p.x},${p.y}`;
      })
      .join(" ");

  const gridLevels = [25, 50, 75, 100];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Grid polygons */}
      {gridLevels.map((level) => (
        <polygon
          key={level}
          points={radarMetrics
            .map((_, i) => {
              const p = pt(i, level);
              return `${p.x},${p.y}`;
            })
            .join(" ")}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={0.75}
        />
      ))}
      {/* Axis lines */}
      {radarMetrics.map((_, i) => {
        const end = axisEnd(i);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={end.x}
            y2={end.y}
            stroke="#e5e7eb"
            strokeWidth={0.75}
          />
        );
      })}
      {/* Data polygons */}
      {radarProviderData.map(({ label, color, values }) => (
        <polygon
          key={label}
          points={polygonPts(values)}
          fill={color}
          fillOpacity={0.13}
          stroke={color}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
      ))}
      {/* Data dots */}
      {radarProviderData.map(({ label, color, values }) =>
        radarMetrics.map((m, i) => {
          const p = pt(i, (values as Record<string, number>)[m]);
          return (
            <circle
              key={`${label}-${m}`}
              cx={p.x}
              cy={p.y}
              r={2.5}
              fill={color}
              fillOpacity={0.9}
            />
          );
        }),
      )}
      {/* Axis labels */}
      {radarMetrics.map((metric, i) => {
        const pos = labelPos(i);
        return (
          <text
            key={metric}
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={7.5}
            fill="#9ca3af"
            fontFamily="var(--font-schibsted)"
            fontWeight={600}
          >
            {metric}
          </text>
        );
      })}
    </svg>
  );
}

function ProviderCoverageChart() {
  return (
    <div className="flex flex-col gap-2">
      {/* Top row: radar + supporting text */}
      <div className="flex gap-2 items-stretch">
        {/* Left: Radar chart */}
        <div className="flex items-center justify-center bg-neutral-50 rounded-xl p-1 flex-1">
          <ProviderRadarVisual size={190} />
        </div>

        {/* Right: supporting text */}
        <div className="flex flex-col justify-center bg-neutral-50 rounded-xl p-4 flex-1 gap-2">
          <span className="font-schibsted text-[9px] font-semibold text-blue-500 uppercase tracking-widest">
            AI Coverage
          </span>
          <div className="flex flex-col gap-1 mt-1">
            <div className="flex items-center gap-1.5">
              <HugeiconsIcon
                icon={AiBrain01Icon}
                size={12}
                className="text-blue-500 shrink-0"
                strokeWidth={2}
              />
              <span className="font-schibsted text-[11px] font-semibold text-neutral-700">
                ChatGPT leads · 71%
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <HugeiconsIcon
                icon={FlashIcon}
                size={12}
                className="text-amber-500 shrink-0"
                strokeWidth={2}
              />
              <span className="font-schibsted text-[11px] font-semibold text-neutral-700">
                Grok gap · 34 pts
              </span>
            </div>
          </div>
          {/* Series legend */}
          <div className="flex flex-col gap-1 mt-2">
            {radarProviderData.map(({ label, color }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                <span className="font-schibsted text-[10px] font-medium text-neutral-400">
                  {label}
                </span>
              </div>
            ))}
          </div>
          <Paragraph
            variant="paragraphtext"
            className="text-[10px] leading-snug mt-1"
          >
            3 engines · 5 dimensions
          </Paragraph>
        </div>
      </div>

      <Paragraph
        variant="paragraphtext"
        className="text-[6px] leading-tight mt-2"
      >
        Scored across mention rate, citation depth, sentiment, authority, and
        content freshness.
      </Paragraph>
    </div>
  );
}

// ── categories ────────────────────────────────────────────────────────────────
const categories = [
  {
    number: "001",
    title: "GEO Score",
    icon: Analytics01Icon,
    description:
      "Your brand's proprietary 0–100 AI visibility score, computed across 17 dimensions including mention rate, sentiment, authority, and citation depth.",
    chart: <GeoScoreChart />,
  },
  {
    number: "002",
    title: "Score Overview",
    icon: Chart01Icon,
    description:
      "Compare your latest scan against your historical average and all-time best. See at a glance whether your brand is trending up or stagnating.",
    chart: <ScoreOverviewChart />,
  },
  {
    number: "003",
    title: "Brand Ranking",
    icon: SearchAreaIcon,
    description:
      "Benchmark your AI visibility score against tracked competitors. Know exactly where you stand — and how far you need to go to lead your category.",
    chart: <BrandRankingChart />,
  },
  {
    number: "004",
    title: "Visibility Trend",
    icon: FlashIcon,
    description:
      "Track your GEO score over every analysis run. Spot improvement patterns, catch sudden drops, and measure the impact of your content changes.",
    chart: <VisibilityTrendChart />,
  },
  {
    number: "005",
    title: "AI Provider Coverage",
    icon: AiBrain01Icon,
    description:
      "See how often your brand gets mentioned by ChatGPT, Gemini, Perplexity, Claude, and Grok — and which engines are your biggest blind spots.",
    chart: <ProviderCoverageChart />,
  },
] as const;

// ── animated number (clip-path left-to-right reveal per digit) ───────────────
const DIGIT_W = 20;
const DIGIT_H = 32;

function AnimatedNumber({
  number,
  isActive,
  onComplete,
}: {
  number: string;
  isActive: boolean;
  onComplete?: () => void;
}) {
  const id = useId();
  const digits = number.split("");
  const r0 = useRef<SVGRectElement>(null);
  const r1 = useRef<SVGRectElement>(null);
  const r2 = useRef<SVGRectElement>(null);
  const rectRefs = [r0, r1, r2];
  const [, animate] = useAnimate();
  const hasRun = useRef(false);
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (!isActive) {
      cancelledRef.current = true;
      hasRun.current = false;
      rectRefs.forEach((r) => {
        if (r.current) animate(r.current, { width: 0 }, { duration: 0 });
      });
      return;
    }

    if (hasRun.current) return;
    cancelledRef.current = false;
    hasRun.current = true;

    const run = async () => {
      for (let i = 0; i < digits.length; i++) {
        if (cancelledRef.current) return;
        const rect = rectRefs[i].current;
        if (!rect) continue;
        animate(rect, { width: 0 }, { duration: 0 });
        await animate(
          rect,
          { width: DIGIT_W },
          { duration: 0.8, ease: [0.645, 0.045, 0.355, 1] },
        );
      }
      if (!cancelledRef.current) onComplete?.();
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive]);

  return (
    <div className="flex items-baseline" aria-hidden="true">
      {digits.map((digit, i) => (
        <svg
          key={i}
          width={DIGIT_W}
          height={DIGIT_H}
          viewBox={`0 0 ${DIGIT_W} ${DIGIT_H}`}
        >
          <defs>
            <clipPath id={`${id}-${i}`}>
              <rect
                ref={rectRefs[i]}
                x="0"
                y="0"
                height={DIGIT_H}
                width={isActive ? 0 : DIGIT_W}
              />
            </clipPath>
          </defs>
          {/* Ghost layer — always visible at low opacity */}
          <text
            x={DIGIT_W / 2}
            y={DIGIT_H - 4}
            textAnchor="middle"
            fontFamily="var(--font-schibsted)"
            fontSize="40"
            fontWeight="500"
            fill={isActive ? "#bfdbfe" : "#d4d4d4"}
            opacity="0.35"
          >
            {digit}
          </text>
          {/* Revealed layer — full opacity, clipped */}
          <text
            x={DIGIT_W / 2}
            y={DIGIT_H - 4}
            textAnchor="middle"
            fontFamily="var(--font-schibsted)"
            fontSize="40"
            fontWeight="500"
            fill={isActive ? "#fffff" : "#d4d4d4"}
            clipPath={`url(#${id}-${i})`}
          >
            {digit}
          </text>
        </svg>
      ))}
    </div>
  );
}

// ── chart card ────────────────────────────────────────────────────────────────
function MetricChartCard({ active }: { active: number }) {
  const cat = categories[active];
  return (
    <motion.div
      layout
      className="w-full px-3 pt-2"
      style={{
        maskImage: "linear-gradient(to bottom, black 72%, transparent 100%)",
      }}
    >
      <motion.div
        layout
        className="bg-white/20 ring-1 ring-white/30 shadow-md overflow-hidden rounded-t-[18px] border border-transparent px-2 pt-2"
      >
        <motion.div
          layout
          className="bg-white ring-1 ring-sky-100/60 shadow overflow-hidden rounded-t-[10px] px-5 pt-4 pb-48"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="font-schibsted text-[10px] font-medium text-neutral-400 uppercase tracking-widest">
              {cat.title}
            </span>
            <span className="font-schibsted text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
              {cat.number}
            </span>
          </div>

          <AnimatePresence mode="popLayout">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {cat.chart}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// ── main component ────────────────────────────────────────────────────────────
const DataMetricsSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  const handleNumberComplete = () => {
    advanceTimer.current = setTimeout(() => {
      setActive((prev) => (prev + 1) % categories.length);
    }, 150);
  };

  const handleManualSelect = (i: number) => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    setActive(i);
  };

  return (
    <section className="relative overflow-hidden py-24 px-4 bg-white">
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <filter id="dataMetricsGrain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>

      <div className="max-w-5xl mx-auto">
        <motion.div
          className="max-w-5xl mx-auto mb-16"
          initial={
            shouldReduceMotion
              ? false
              : { opacity: 0, y: 16, filter: "blur(4px)" }
          }
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Heading
            as="h2"
            variant="sectionHeader"
            className="font-schibsted text-neutral-900 font-light"
          >
            Every metric that matters,
          </Heading>
          <Heading
            as="h2"
            variant="sectionHeader"
            className="font-schibsted text-neutral-900 font-bold"
          >
            visualised in real time.
          </Heading>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">
          {/* Left — gradient panel */}
          <motion.div
            layout
            className="relative rounded-[20px] overflow-hidden flex items-end justify-center bg-gradient-to-b from-sky-400 via-blue-600 to-blue-800"
            transition={{
              layout: { type: "spring", stiffness: 280, damping: 28 },
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none bg-neutral-500 opacity-80"
              style={{ filter: "url(#dataMetricsGrain)" }}
            />
            <motion.div layout className="relative z-10 w-full">
              <MetricChartCard active={active} />
            </motion.div>
          </motion.div>

          {/* Right — clickable rows */}
          <motion.div
            className="flex flex-col"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            {categories.map((cat, i) => (
              <div key={cat.number}>
                <button
                  onClick={() => handleManualSelect(i)}
                  className={`w-full text-left flex items-start justify-between py-5 transition-all duration-200`}
                >
                  <div className="flex-1 pr-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HugeiconsIcon
                          icon={cat.icon}
                          size={18}
                          className="text-neutral-900 shrink-0"
                          strokeWidth={1.8}
                        />
                        <Paragraph
                          variant="paragraphHeading"
                          className={`font-schibsted uppercase tracking-widest`}
                        >
                          {cat.title}
                        </Paragraph>
                      </div>
                      <AnimatedNumber
                        number={cat.number}
                        isActive={active === i}
                        onComplete={
                          active === i ? handleNumberComplete : undefined
                        }
                      />
                    </div>
                    <Paragraph
                      variant="paragraphtext"
                      className="font-schibsted mt-2"
                    >
                      {cat.description}
                    </Paragraph>
                  </div>
                </button>
                {i < categories.length - 1 && (
                  <hr className="border-neutral-200" />
                )}
              </div>
            ))}

            <div className="mt-8">
              <CTAButton
                loggedInHref="/dashboard"
                loggedOutHref="/signup"
                icon={IconArrowRight}
                className="font-schibsted rounded-md"
              >
                See your metrics
              </CTAButton>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DataMetricsSection;
