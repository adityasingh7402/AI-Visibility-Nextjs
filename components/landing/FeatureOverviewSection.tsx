"use client";
import { motion, useReducedMotion } from "motion/react";
import { TrendingUp } from "lucide-react";
import { CTAButton } from "../ui/CTAButton";
import { Heading } from "../ui/Heading";
import { IconArrowRight } from "@tabler/icons-react";
import { Paragraph } from "../ui/Paragraph";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Audit02Icon,
  SearchAreaIcon,
  ThreeDPrinterIcon,
  ThreeDMoveIcon,
  Megaphone01Icon,
  SmileIcon,
  BubbleChatSparkIcon,
} from "@hugeicons/core-free-icons";

const features: {
  number: string;
  title: string;
  description: string;
  icon: any;
}[] = [
  {
    number: "001",
    title: "Audit",
    icon: Audit02Icon,
    description:
      "Score your brand across 17 AI visibility dimensions — crawlability, keyword density, LLM mention rate, and authority signals, all in one scan.",
  },
  {
    number: "002",
    title: "Discover",
    icon: SearchAreaIcon,
    description:
      "Find the exact keywords and prompts that get your brand cited by ChatGPT, Gemini, Perplexity, and 5 other AI assistants.",
  },
  {
    number: "003",
    title: "Optimize",
    icon: ThreeDPrinterIcon,
    description:
      "Rewrite and validate content to be AI-citable — check RAG-readiness, generate structured improvements, and track citation evidence.",
  },
  {
    number: "004",
    title: "Compete",
    icon: ThreeDMoveIcon,
    description:
      "Benchmark your brand against rivals across every AI assistant and grow your share-of-voice in the AI answer era.",
  },
];

const cardStats = [
  {
    icon: Megaphone01Icon,
    label: "Brand Citations",
    value: "+12%",
    gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
    shadow: "rgba(37,99,235,0.35)",
  },
  {
    icon: SmileIcon,
    label: "Sentiment Ratio",
    value: "0.82",
    gradient: "linear-gradient(135deg, #38bdf8, #0284c7)",
    shadow: "rgba(14,165,233,0.35)",
  },
  {
    icon: BubbleChatSparkIcon,
    label: "Prompt Mentions",
    value: "2,847",
    gradient: "linear-gradient(135deg, #818cf8, #4f46e5)",
    shadow: "rgba(99,102,241,0.35)",
  },
];

const GeoScoreCard = () => (
  <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-2xl shadow-neutral-900/15 px-5 py-5 w-[280px]">
    {/* Score badge header */}
    <div className="flex items-center justify-between mb-5">
      <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest">
        GEO Score
      </span>
      <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-[11px] font-bold px-2 py-0.5 rounded-full">
        <span>84</span>
        <TrendingUp size={10} strokeWidth={2.5} />
        <span className="font-normal text-emerald-500">+6 pts</span>
      </div>
    </div>

    {/* Icon + stat rows */}
    <div className="space-y-3">
      {cardStats.map((stat) => (
        <div key={stat.label} className="flex items-center gap-3.5">
          {/* Isometric-style icon chip */}
          <div
            className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
            style={{
              background: stat.gradient,
              boxShadow: `0 4px 12px ${stat.shadow}, inset 0 1px 0 rgba(255,255,255,0.2)`,
            }}
          >
            <HugeiconsIcon
              icon={stat.icon}
              size={22}
              color="white"
              strokeWidth={1.6}
            />
          </div>
          <div className="flex flex-1 items-center justify-between">
            <span className="text-[12px] text-neutral-500">{stat.label}</span>
            <span className="text-[13px] font-bold text-neutral-800">
              {stat.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const FeatureOverviewSection = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-24 px-4 bg-white">
      {/* Shared grain filter — reuses the same feTurbulence id as hero */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <filter id="featureGrain">
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
        {/* Heading */}
        <motion.div className="max-w-5xl mx-auto mb-16">
          <Heading
            as="h2"
            variant="sectionHeader"
            className="text-neutral-900 font-light"
          >
            Everything you need to
          </Heading>
          <Heading
            as="h2"
            variant="sectionHeader"
            className="text-neutral-900 font-bold"
          >
            track, measure, and optimize
          </Heading>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">
          {/* Left — hero-gradient panel + floating card */}
          <motion.div className="relative rounded-3xl overflow-hidden flex items-center justify-center bg-gradient-to-b from-sky-400 via-blue-600 to-blue-800">
            {/* Grain overlay */}
            <div
              className="absolute inset-0 pointer-events-none bg-neutral-500 opacity-80"
              style={{ filter: "url(#featureGrain)" }}
            />

            {/* Floating GEO score card */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative z-10"
            >
              <GeoScoreCard />
            </motion.div>
          </motion.div>

          {/* Right — numbered feature rows */}
          <motion.div className="flex flex-col">
            {features.map((feature, i) => (
              <div key={feature.number}>
                <motion.div className="flex items-start justify-between py-7">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HugeiconsIcon
                          icon={feature.icon}
                          size={18}
                          className="text-neutral-900 shrink-0"
                          strokeWidth={1.8}
                        />
                        <Paragraph
                          variant="paragraphHeading"
                          className="uppercase tracking-widest"
                        >
                          {feature.title}
                        </Paragraph>
                      </div>
                      <span className="font-schibsted text-[25px] text-neutral-300 font-medium tabular-nums mt-0.5 shrink-0">
                        {feature.number}
                      </span>
                    </div>
                    <Paragraph variant="paragraphtext" className="mt-2">
                      {feature.description}
                    </Paragraph>
                  </div>
                </motion.div>

                {i < features.length - 1 && (
                  <hr className="border-neutral-200" />
                )}
              </div>
            ))}

            {/* CTA */}
            <div className="mt-8">
              <CTAButton
                loggedInHref="/dashboard/analysis"
                loggedOutHref="/signup"
                icon={IconArrowRight}
                className="font-schibsted rounded-md"
              >
                Explore features
              </CTAButton>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeatureOverviewSection;
