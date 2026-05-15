"use client";
import { motion, useReducedMotion } from "motion/react";
import { Sparkles, TrendingUp, TrendingDown } from "lucide-react";

const MAX_VALUE = 100;
const PEAK_INDEX = 24;

const barData = [
  { month: "Feb", value: 18 },
  { month: "", value: 22 },
  { month: "", value: 25 },
  { month: "", value: 20 },
  { month: "", value: 28 },
  { month: "", value: 32 },
  { month: "", value: 30 },
  { month: "Mar", value: 35 },
  { month: "", value: 40 },
  { month: "", value: 38 },
  { month: "", value: 45 },
  { month: "", value: 50 },
  { month: "", value: 48 },
  { month: "", value: 52 },
  { month: "Apr", value: 58 },
  { month: "", value: 62 },
  { month: "", value: 65 },
  { month: "", value: 60 },
  { month: "", value: 68 },
  { month: "", value: 72 },
  { month: "", value: 70 },
  { month: "May", value: 75 },
  { month: "", value: 80 },
  { month: "", value: 85 },
  { month: "", value: 88 },
  { month: "", value: 82 },
  { month: "", value: 78 },
  { month: "", value: 75 },
  { month: "Jun", value: 72 },
  { month: "", value: 76 },
  { month: "", value: 74 },
  { month: "", value: 70 },
];

const yLabels = [100, 80, 60, 40, 20, 0];

export const HeroDashboard = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 48 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="font-schibsted bg-white rounded-3xl border border-neutral-900 shadow-2xl shadow-neutral-900/10 overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 md:px-8 pt-7 pb-5 border-b border-neutral-100">
        <p className="font-schibsted font-semibold text-left text-[24px] text-neutral-900">
          Good morning, Acme Inc
        </p>
        <p className="font-schibsted font-medium text-left text-[14px] mt-0.1 text-neutral-400 tracking-tighter">
          Your AI visibility metrics are ready to review.
        </p>
      </div>

      {/* Stat cards */}
      <div className="px-5 md:px-8 py-5 grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-neutral-100">
        {/* Card 1 — Brand Mentions */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45, ease: "easeOut" }}
          className="relative border border-neutral-100 rounded-xl overflow-hidden bg-neutral-50/60 flex flex-col justify-between"
          style={{ minHeight: 120 }}
        >
          <div className="px-4 pt-4">
            <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest">
              Brand Mentions
            </span>
          </div>
          {/* Colored accent block */}
          {/* <div className="mx-4 mt-2 rounded-lg bg-amber-300/80 h-9 w-full max-w-[60%]" /> */}
          <div className="px-4 pb-4 mt-2 flex items-end justify-between">
            <div className="flex items-baseline gap-0.5">
              <span className="text-2xl font-bold text-neutral-900">2,847</span>
            </div>
            <span className="flex items-center gap-0.5 text-[11px] font-medium text-emerald-500">
              <TrendingUp size={11} strokeWidth={2.5} /> 12%
            </span>
          </div>
        </motion.div>

        {/* Card 2 — GEO Score */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.53, ease: "easeOut" }}
          className="relative border border-neutral-100 rounded-xl overflow-hidden bg-neutral-50/60 flex flex-col justify-between"
          style={{ minHeight: 120 }}
        >
          <div className="px-4 pt-4 flex items-start justify-between">
            <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest">
              GEO Score
            </span>
            {/* <Sparkles
              size={14}
              strokeWidth={1.5}
              className="text-neutral-300"
            /> */}
          </div>
          <div className="px-4 pb-4 mt-auto flex items-end justify-between">
            <div className="flex items-baseline gap-0.5">
              <span className="text-2xl font-bold text-neutral-900">73</span>
              <span className="text-xs font-light text-neutral-400">/100</span>
            </div>
            <span className="flex items-center gap-0.5 text-[11px] font-medium text-blue-500">
              <TrendingUp size={11} strokeWidth={2.5} /> 6 pts
            </span>
          </div>
        </motion.div>

        {/* Card 3 — Insight */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.61, ease: "easeOut" }}
          className="relative border border-neutral-100 rounded-xl overflow-hidden flex"
          style={{ minHeight: 120 }}
        >
          {/* Left visual strip */}
          <div className="w-[40%] bg-gradient-to-b from-emerald-200 to-emerald-400 flex-shrink-0" />
          {/* Right content */}
          <div className="flex-1 bg-neutral-50/60 flex flex-col justify-between px-3 py-4">
            <div className="flex justify-end">
              <span className="bg-amber-300 text-neutral-900 text-[9px] font-semibold px-2 py-0.5 rounded-full">
                Insight
              </span>
            </div>
            <p className="text-[11px] font-semibold text-neutral-800 leading-snug mt-auto">
              5 AI providers actively citing your brand
            </p>
          </div>
        </motion.div>
      </div>

      {/* Chart */}
      <div className="px-5 md:px-8 pt-5 pb-6 overflow-x-auto">
        <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest sticky left-0">
          AI Visibility Trend
        </span>

        <div className="mt-4 flex gap-3 min-w-[500px]">
          {/* Y-axis labels */}
          <div
            className="flex flex-col justify-between text-[9px] font-light text-neutral-300 text-right pb-5"
            style={{ height: 140 }}
          >
            {yLabels.map((v) => (
              <span key={v}>{v}</span>
            ))}
          </div>

          {/* Chart area */}
          <div className="flex-1 flex flex-col gap-1">
            <div className="relative" style={{ height: 140 }}>
              {/* Horizontal grid lines */}
              {yLabels.slice(0, -1).map((v) => (
                <div
                  key={v}
                  className="absolute w-full border-t border-neutral-100"
                  style={{ bottom: `${(v / MAX_VALUE) * 100}%` }}
                />
              ))}

              {/* Bars */}
              <div className="absolute inset-0 flex items-end">
                {barData.map((bar, i) => {
                  const isPeak = i === PEAK_INDEX;
                  const heightPct = (bar.value / MAX_VALUE) * 100;
                  return (
                    <div
                      key={i}
                      className="relative flex-1 flex flex-col items-center justify-end h-full"
                    >
                      {isPeak && (
                        <motion.div
                          initial={
                            shouldReduceMotion ? false : { opacity: 0, y: 4 }
                          }
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: 1.4,
                            duration: 0.3,
                            ease: "easeOut",
                          }}
                          className="absolute -top-5 bg-yellow-300 text-neutral-900 text-[9px] font-semibold px-1.5 py-0.5 rounded-full z-10 whitespace-nowrap"
                        >
                          {bar.value}
                        </motion.div>
                      )}
                      <motion.div
                        initial={shouldReduceMotion ? false : { scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{
                          duration: 0.55,
                          delay: 0.9 + i * 0.015,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        style={{
                          height: `${heightPct}%`,
                          transformOrigin: "bottom",
                          width: 3,
                        }}
                        className={`rounded-[1.5px] ${isPeak ? "bg-neutral-900" : "bg-neutral-700/60"}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* X-axis month labels */}
            <div className="flex">
              {barData.map((bar, i) => (
                <div
                  key={i}
                  className="flex-1 text-[9px] font-light text-neutral-400"
                >
                  {bar.month}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
