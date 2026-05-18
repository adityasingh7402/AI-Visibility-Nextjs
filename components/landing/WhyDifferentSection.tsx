"use client";
import { motion, useReducedMotion } from "motion/react";
import { IconTool, IconStack2, IconShieldCheck } from "@tabler/icons-react";
import { Card, CardContent } from "../ui/card";
import { Heading } from "../ui/Heading";
import { Paragraph } from "../ui/Paragraph";
import StatsSection from "./StatsSection";

const differentiators = [
  {
    icon: IconTool,
    title: "We fix it, not just flag it",
    description:
      "Every competitor stops at monitoring. We close the full loop — from audit to AI-optimized content rewrite, inside one platform.",
  },
  {
    icon: IconStack2,
    title: "17 dimensions, not just keywords",
    description:
      "A 6-agent pipeline audits everything: crawling, NLP, authority, image SEO, LLM testing, and competitor benchmarking — one proprietary GEO Score.",
  },
  {
    icon: IconShieldCheck,
    title: "8 providers, statistically reliable",
    description:
      "Test across 8 AI assistants with 5-run consistency. Circuit breakers, fallback chains, and a Quality Verifier agent keep your data trustworthy.",
  },
];

const WhyDifferentSection = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className="relative py-24 px-4 overflow-hidden"
      style={{ background: "#0F0F13" }}
    >
      {/* Grain filter */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <filter id="whyGrain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>

      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "#8C8C8C",
          filter: "url(#whyGrain)",
          opacity: 0.55,
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Two-line heading */}
        <motion.div className="text-center mb-14">
          <Heading
            as="h2"
            variant="sectionHeader"
            className="text-white/70 font-light"
          >
            Not just another rank tracker.
          </Heading>
          <Heading
            as="h2"
            variant="sectionHeader"
            className="text-white font-bold"
          >
            Built to close the loop.
          </Heading>
        </motion.div>

        {/* Cards — 3 col on md+, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {differentiators.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.title} className="h-full">
                <Card className="h-full bg-white rounded-2xl border-0 ring-0 shadow-none">
                  <CardContent className="flex flex-col gap-4 pt-2 pb-9 px-6">
                    {/* Icon + Title row */}
                    <div className="flex items-start gap-2">
                      <Icon
                        size={24}
                        strokeWidth={1.8}
                        className="text-neutral-900 shrink-0 mt-1"
                      />
                      <Paragraph as="h3" variant="paragraphHeading">
                        {item.title}
                      </Paragraph>
                    </div>

                    {/* Description */}
                    <Paragraph
                      as="p"
                      variant="paragraphtext"
                      className="text-neutral-800"
                    >
                      {item.description}
                    </Paragraph>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Stats below cards */}
        <div className="mt-12">
          <StatsSection />
        </div>
      </div>
    </section>
  );
};

export default WhyDifferentSection;
