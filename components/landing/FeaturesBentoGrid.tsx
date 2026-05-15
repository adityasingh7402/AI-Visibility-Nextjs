"use client";
import { motion, useReducedMotion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AiBrain01Icon,
  Link01Icon,
  Analytics01Icon,
  Alert01Icon,
  GlobeIcon,
  ChatGptIcon,
  PerplexityAiIcon,
  GoogleGeminiIcon,
  ClaudeIcon,
  Grok02Icon,
} from "@hugeicons/core-free-icons";
import { Card, CardContent } from "../ui/card";
import { Heading } from "../ui/Heading";
import { Subheading } from "../ui/Subheading";
import { Paragraph } from "../ui/Paragraph";

const ORANGE = "#D97757";
const BLUE = "#2563eb";

const promptCategories = [
  { label: "Informational", pct: 92 },
  { label: "Transactional", pct: 64 },
  { label: "Navigational", pct: 88 },
  { label: "Comparison", pct: 71 },
];

const engines = [
  { Icon: ChatGptIcon, color: "#10A37F", label: "ChatGPT" },
  { Icon: PerplexityAiIcon, color: "#6366F1", label: "Perplexity" },
  { Icon: GoogleGeminiIcon, color: "#4285F4", label: "Gemini" },
  { Icon: ClaudeIcon, color: "#D97757", label: "Claude" },
  { Icon: Grok02Icon, color: "#111827", label: "Grok" },
];

const fadeIn = (delay: number) => ({
  initial: { opacity: 0, y: 16, filter: "blur(4px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true } as const,
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
});

// ─── Large card ───────────────────────────────────────────────────────────────

const LargeCard = () => (
  <motion.div className="col-span-1 md:col-span-2 md:row-span-2" {...fadeIn(0.05)}>
    <Card className="rounded-2xl border border-neutral-200/70 shadow-sm h-full bg-white">
      <CardContent className="flex flex-col p-5 h-full">
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mb-4 shrink-0">
          <HugeiconsIcon icon={AiBrain01Icon} size={22} color={ORANGE} strokeWidth={1.6} />
        </div>

        <Subheading as="h3" variant="small" className="text-neutral-900 font-light text-base">
          Prompt Style Analysis
        </Subheading>
        <Paragraph variant="small" className="text-neutral-500 mt-1.5 tracking-tighter font-light leading-tight">
          Reverse-engineer how LLMs interpret and respond to prompts about your
          industry. Understand query patterns to optimize your content structure.
        </Paragraph>

        {/* Mockup */}
        <div className="mt-auto pt-4">
          <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-4">
            {/* Main metric */}
            <div className="flex items-end justify-between mb-1">
              <span className="text-[11px] font-medium text-neutral-500">
                Prompt Coverage
              </span>
              <span className="text-xl font-bold text-neutral-800 tabular-nums leading-none">
                78%
              </span>
            </div>
            <div className="h-2 w-full bg-neutral-200 rounded-full overflow-hidden mb-5">
              <div
                className="h-full rounded-full"
                style={{ width: "78%", backgroundColor: ORANGE }}
              />
            </div>

            {/* Sub-categories */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {promptCategories.map(({ label, pct }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-neutral-500">{label}</span>
                    <span className="text-[10px] font-semibold text-neutral-700 tabular-nums">
                      {pct}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: BLUE, opacity: 0.75 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

// ─── Small cards ──────────────────────────────────────────────────────────────

const CitationCard = () => (
  <motion.div {...fadeIn(0.1)}>
    <Card className="rounded-2xl border border-neutral-200/70 shadow-sm h-full bg-white">
      <CardContent className="flex flex-col p-5 h-full">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4 shrink-0">
          <HugeiconsIcon icon={Link01Icon} size={22} color={BLUE} strokeWidth={1.6} />
        </div>
        <Subheading as="h3" variant="small" className="text-neutral-900 font-light text-base">
          Citation Mapping
        </Subheading>
        <Paragraph variant="small" className="text-neutral-500 mt-1.5 tracking-tighter font-light leading-tight">
          Trace every source AI models cite when discussing your brand or
          competitors. Build authority in the sources that matter.
        </Paragraph>

        {/* Visual: source → brand flow */}
        <div className="mt-auto pt-4 flex items-center gap-2">
          {["Source A", "Source B", "Source C"].map((s, i) => (
            <div key={s} className="flex items-center gap-1.5">
              <span className="text-[9px] font-medium text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded-full">
                {s}
              </span>
              {i < 2 && (
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                  <path d="M0 3h8M6 1l2 2-2 2" stroke={BLUE} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          ))}
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
            <path d="M0 3h8M6 1l2 2-2 2" stroke={BLUE} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[9px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full border border-blue-100">
            Your brand
          </span>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const RankCard = () => (
  <motion.div {...fadeIn(0.14)}>
    <Card className="rounded-2xl border border-neutral-200/70 shadow-sm h-full bg-white">
      <CardContent className="flex flex-col p-5 h-full">
        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mb-4 shrink-0">
          <HugeiconsIcon icon={Analytics01Icon} size={22} color={ORANGE} strokeWidth={1.6} />
        </div>
        <Subheading as="h3" variant="small" className="text-neutral-900 font-light text-base">
          Rank Tracking
        </Subheading>
        <Paragraph variant="small" className="text-neutral-500 mt-1.5 tracking-tighter font-light leading-tight">
          Monitor your brand's position across AI-generated answers in real-time
          with engine-specific breakdowns.
        </Paragraph>

        {/* Mini sparkline */}
        <div className="mt-auto pt-4">
          <svg viewBox="0 0 120 32" className="w-full h-8">
            <polyline
              points="0,28 20,22 40,18 60,24 80,10 100,6 120,4"
              fill="none"
              stroke={ORANGE}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="120" cy="4" r="3" fill="white" stroke={ORANGE} strokeWidth="1.8" />
          </svg>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const AlertCard = () => (
  <motion.div {...fadeIn(0.18)}>
    <Card className="rounded-2xl border border-neutral-200/70 shadow-sm h-full bg-white">
      <CardContent className="flex flex-col p-5 h-full">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4 shrink-0">
          <HugeiconsIcon icon={Alert01Icon} size={22} color={BLUE} strokeWidth={1.6} />
        </div>
        <Subheading as="h3" variant="small" className="text-neutral-900 font-light text-base">
          Hallucination Alerts
        </Subheading>
        <Paragraph variant="small" className="text-neutral-500 mt-1.5 tracking-tighter font-light leading-tight">
          Get instant notifications when AI models misrepresent your brand,
          products, or key facts.
        </Paragraph>

        {/* Alert badge */}
        <div className="mt-auto pt-4 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-100 text-[10px] font-semibold text-red-500">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            Misrepresentation detected
          </span>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const EnginesCard = () => (
  <motion.div className="col-span-1 md:col-span-2" {...fadeIn(0.22)}>
    <Card className="rounded-2xl border border-neutral-200/70 shadow-sm h-full bg-white">
      <CardContent className="flex flex-col p-5 h-full">
        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center mb-4 shrink-0">
          <HugeiconsIcon icon={GlobeIcon} size={22} color={ORANGE} strokeWidth={1.6} />
        </div>
        <Subheading as="h3" variant="small" className="text-neutral-900 font-light text-base">
          Multi-Engine Support
        </Subheading>
        <Paragraph variant="small" className="text-neutral-500 mt-1.5 tracking-tighter font-light leading-tight">
          Track and optimize across ChatGPT, Perplexity, Gemini, Claude, and
          every emerging AI search platform — from one dashboard.
        </Paragraph>

        {/* Engine pills */}
        <div className="mt-auto pt-4 flex items-center gap-2 flex-wrap">
          {engines.map(({ Icon, color, label }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-neutral-100 bg-neutral-50"
            >
              <HugeiconsIcon icon={Icon} size={14} color={color} strokeWidth={1.5} />
              <span className="text-[10px] font-medium text-neutral-600">{label}</span>
            </div>
          ))}
          <span className="text-[10px] text-neutral-400 ml-1">+ 3 more</span>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

// ─── Section ──────────────────────────────────────────────────────────────────

const FeaturesBentoGrid = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={
            shouldReduceMotion ? false : { opacity: 0, y: 16, filter: "blur(4px)" }
          }
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <Heading as="h2" variant="sectionHeader" className="text-neutral-600 font-light">
            Built for high-performance
          </Heading>
          <Heading as="h2" variant="sectionHeader" className="text-neutral-900 font-bold">
            marketing teams.
          </Heading>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:auto-rows-[220px]">
          {/* Large card: col 1–2, row 1–2 */}
          <LargeCard />

          {/* Col 3 stack */}
          <CitationCard />
          <RankCard />

          {/* Row 3 */}
          <AlertCard />
          <EnginesCard />
        </div>
      </div>
    </section>
  );
};

export default FeaturesBentoGrid;
