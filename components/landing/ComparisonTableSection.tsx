"use client";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AiBrain01Icon,
  Search01Icon,
  FlashIcon,
} from "@hugeicons/core-free-icons";
import { Heading } from "../ui/Heading";
import { Paragraph } from "../ui/Paragraph";

const ORANGE = "#D97757";

const rows = [
  {
    feature: "Monitoring",
    seo: "Keyword positions on Google SERPs, updated periodically",
    geo: "Real-time AI citation tracking across all major LLMs",
  },
  {
    feature: "Optimization",
    seo: "Title tags, meta descriptions, and header structures",
    geo: "Prompt pattern analysis for intent-driven AI visibility",
  },
  {
    feature: "Accuracy Detection",
    seo: "No brand misrepresentation detection",
    geo: "Hallucination alerts when AI misrepresents your brand",
  },
  {
    feature: "Engine Coverage",
    seo: "Google-centric, limited to search crawlers",
    geo: "Multi-engine: ChatGPT, Perplexity, Gemini, Claude, Grok",
  },
  {
    feature: "Update Frequency",
    seo: "Daily or weekly rank snapshots",
    geo: "Continuous monitoring with instant alerts",
  },
  {
    feature: "Insight Type",
    seo: "Traffic and click-through metrics",
    geo: "Brand sentiment and citation source analysis",
  },
];

const schibsted = { fontFamily: "var(--font-schibsted-grotesk)" };

const ComparisonTableSection = () => {
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Heading
            as="h2"
            variant="sectionHeader"
            className="text-neutral-600 font-light"
          >
            See how we
          </Heading>
          <Heading
            as="h2"
            variant="sectionHeader"
            className="text-neutral-900 font-bold"
          >
            compare.
          </Heading>
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[32px] p-6 bg-neutral-100"
        >
          <div>
            {/* Column header icons - Hidden on mobile */}
            <div className="hidden md:grid grid-cols-[180px_1fr_1fr] mb-4">
              <div />
              <div className="px-6">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center">
                  <HugeiconsIcon
                    icon={Search01Icon}
                    size={20}
                    color="#9ca3af"
                    strokeWidth={1.5}
                  />
                </div>
              </div>
              <div className="px-6">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                  <HugeiconsIcon
                    icon={AiBrain01Icon}
                    size={20}
                    color={ORANGE}
                    strokeWidth={1.5}
                  />
                </div>
              </div>
            </div>

            {/* Column header labels - Hidden on mobile */}
            <div className="hidden md:grid grid-cols-[180px_1fr_1fr] pb-4 border-b border-neutral-900">
              <span
                style={schibsted}
                className="text-[20px] text-neutral-400 font-schibsted self-end"
              >
                Feature
              </span>
              <div className="px-6">
                <span
                  style={schibsted}
                  className="text-[20px] font-schibsted text-neutral-500"
                >
                  Traditional SEO
                </span>
              </div>
              <div className="px-6 flex items-center gap-2">
                <span
                  style={schibsted}
                  className="text-[20px] font-schibsted text-neutral-900"
                >
                  GEO Platform
                </span>
                <span
                  style={schibsted}
                  className="text-[9px] font-schibsted px-2 py-0.5 rounded-full border border-orange-200 text-orange-500 bg-orange-50"
                >
                  AI-First
                </span>
              </div>
            </div>

            {/* Data rows */}
            {rows.map((row, i) => (
              <motion.div
                key={i}
                className="flex flex-col md:grid md:grid-cols-[180px_1fr_1fr] border-b border-neutral-300 py-6 md:py-5 gap-4 md:gap-0 items-start last:border-0"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.07,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {/* Feature name */}
                <div className="md:pr-4 pt-0.5">
                  <Paragraph
                    variant="small"
                    className="text-neutral-900 md:text-neutral-600 leading-tight italic font-semibold md:font-normal"
                  >
                    {row.feature}
                  </Paragraph>
                </div>

                {/* Traditional SEO */}
                <div className="md:px-6">
                  <div className="text-[11px] text-neutral-400 mb-1 md:hidden uppercase tracking-wider font-schibsted font-semibold">
                    Traditional SEO
                  </div>
                  <Paragraph
                    variant="small"
                    className="text-neutral-500 md:text-neutral-400 leading-relaxed"
                  >
                    {row.seo}
                  </Paragraph>
                </div>

                {/* GEO Platform */}
                <div className="md:px-6">
                  <div className="text-[11px] text-orange-600 mb-1 md:hidden uppercase tracking-wider font-schibsted font-semibold">
                    GEO Platform
                  </div>
                  <Paragraph
                    variant="small"
                    className="text-neutral-900 font-semibold leading-relaxed"
                  >
                    {row.geo}
                  </Paragraph>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ComparisonTableSection;
