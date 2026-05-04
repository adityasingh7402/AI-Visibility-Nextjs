"use client";
import { motion, useReducedMotion } from "motion/react";
import { TrendingUp } from "lucide-react";
import { CTAButton } from "../ui/CTAButton";
import { Heading } from "../ui/Heading";
import { IconArrowRight } from "@tabler/icons-react";
import { Subheading } from "../ui/Subheading";
import { Paragraph } from "../ui/Paragraph";

const features = [
  {
    number: "001",
    title: "Audit",
    description:
      "Score your brand across 17 AI visibility dimensions — crawlability, keyword density, LLM mention rate, and authority signals, all in one scan.",
  },
  {
    number: "002",
    title: "Discover",
    description:
      "Find the exact keywords and prompts that get your brand cited by ChatGPT, Gemini, Perplexity, and 5 other AI assistants.",
  },
  {
    number: "003",
    title: "Optimize",
    description:
      "Rewrite and validate content to be AI-citable — check RAG-readiness, generate structured improvements, and track citation evidence.",
  },
  {
    number: "004",
    title: "Compete",
    description:
      "Benchmark your brand against rivals across every AI assistant and grow your share-of-voice in the AI answer era.",
  },
];

const GeoScoreCard = () => (
  <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-2xl shadow-neutral-900/15 px-6 py-5 w-[268px]">
    <div className="flex items-start justify-between">
      <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest">
        GEO Score
      </span>
      <span className="text-neutral-300 text-base leading-none">✦</span>
    </div>

    <div className="mt-3 flex items-end justify-between">
      <div className="flex items-baseline gap-1">
        <span className="font-schibsted text-[52px] font-bold leading-none text-neutral-900">
          84
        </span>
        <span className="text-sm font-light text-neutral-400 mb-1">/100</span>
      </div>
      <span className="flex items-center gap-1 text-[12px] font-semibold text-emerald-500 mb-1">
        <TrendingUp size={13} strokeWidth={2.5} />
        +6 pts
      </span>
    </div>

    <div className="mt-5 pt-4 border-t border-neutral-100 space-y-2.5">
      {[
        { label: "Brand Citations", value: "+12%" },
        { label: "Sentiment Ratio", value: "0.82" },
        { label: "Prompt Mentions", value: "2,847" },
      ].map((stat) => (
        <div key={stat.label} className="flex justify-between items-center">
          <span className="text-[12px] text-neutral-500">{stat.label}</span>
          <span className="text-[12px] font-semibold text-neutral-800">
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const FeatureOverviewSection = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-24 px-4 bg-white">
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
        <motion.div className="max-w-3xl mx-auto mb-16">
          <Heading as="h2" variant="sectionHeader">
            Everything you need to measure, optimize, and dominate AI visibility
          </Heading>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">
          {/* Left — hero-gradient panel + floating card */}
          <motion.div
            className="relative rounded-3xl overflow-hidden flex items-center justify-center"
            style={{
              background: "linear-gradient(to bottom, #A8D3FF, #FFF4DF)",
            }}
          >
            {/* Grain overlay — identical to hero */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "#8C8C8C",
                filter: "url(#featureGrain)",
                opacity: 0.8,
              }}
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
                      <h3 className="font-schibsted text-xl font-light uppercase tracking-widest text-neutral-900">
                        {feature.title}
                      </h3>
                      <span className="font-schibsted text-[25px] text-neutral-300 font-medium tabular-nums mt-0.5 shrink-0">
                        {feature.number}
                      </span>
                    </div>
                    <Paragraph
                      variant="small"
                      className="text-neutral-500 mt-2 tracking-tighter font-light leading-tight mx-auto"
                    >
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
