"use client";
import { motion, useReducedMotion } from "motion/react";
import { IconTool, IconStack2, IconShieldCheck } from "@tabler/icons-react";
import { Card, CardContent } from "../ui/card";
import { Heading } from "../ui/Heading";
import { Paragraph } from "../ui/Paragraph";
import { Subheading } from "../ui/Subheading";

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
                  <CardContent className="flex flex-col gap-6 pt-7 pb-9 px-6">
                    {/* Icon in circular outline */}
                    <div className="w-11 h-11 rounded-full border border-neutral-300 flex items-center justify-center shrink-0">
                      <Icon
                        size={20}
                        strokeWidth={1.5}
                        className="text-neutral-700"
                      />
                    </div>

                    {/* Title + description */}
                    <div className="flex flex-col gap-2">
                      <Subheading
                        as="h3"
                        variant="small"
                        className="text-neutral-900 font-light text-base"
                      >
                        {item.title}
                      </Subheading>
                      <Paragraph
                        variant="small"
                        className="text-neutral-500 mt-2 tracking-tighter font-light leading-tight mx-auto"
                      >
                        {item.description}
                      </Paragraph>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyDifferentSection;
