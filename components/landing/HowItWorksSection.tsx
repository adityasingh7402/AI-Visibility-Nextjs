"use client";
import { motion, useReducedMotion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Link01Icon,
  AiBrain01Icon,
  Search01Icon,
  Settings02Icon,
  Analytics01Icon,
} from "@hugeicons/core-free-icons";
import { Heading } from "../ui/Heading";
import { Subheading } from "../ui/Subheading";
import { Paragraph } from "../ui/Paragraph";

const BLUE = "#2563eb";
const ORANGE = "#D97757";

const fadeIn = (delay: number) => ({
  initial: { opacity: 0, y: 16, filter: "blur(4px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true } as const,
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
});

const HowItWorksSection = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={
            shouldReduceMotion
              ? false
              : { opacity: 0, y: 16, filter: "blur(4px)" }
          }
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <Heading
            as="h2"
            variant="sectionHeader"
            className="text-neutral-600 font-light"
          >
            A systematic approach
          </Heading>
          <Heading
            as="h2"
            variant="sectionHeader"
            className="text-neutral-900 font-bold"
          >
            and proven process.
          </Heading>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Title cell */}
          <motion.div
            className="md:col-span-3 flex flex-col justify-start"
            {...(shouldReduceMotion ? {} : fadeIn(0.05))}
          >
            <Subheading as="h3" variant="medium" className="text-neutral-900">
              Our <br /> Process
            </Subheading>
            <Paragraph
              variant="small"
              className="text-neutral-500 font-light tracking-tighter leading-relaxed pt-4"
            >
              A repeatable, data-driven workflow to make your brand visible
              wherever AI answers questions.
            </Paragraph>
          </motion.div>

          {/* Step 01 — Connect */}
          <motion.div
            className="relative overflow-hidden md:col-span-4 bg-white p-10 rounded-2xl border border-neutral-200/70 flex flex-col justify-between h-80"
            {...(shouldReduceMotion ? {} : fadeIn(0.1))}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, #f0f4ff 0%, #dbeafe 55%, #ede9fe 100%)",
              }}
            />
            <div className="flex justify-between items-start relative z-10">
              <Subheading
                as="h3"
                variant="small"
                className="text-neutral-900 font-light uppercase tracking-widest"
              >
                Connect
              </Subheading>
              <HugeiconsIcon
                icon={Link01Icon}
                size={28}
                color={ORANGE}
                strokeWidth={1.8}
              />
            </div>
            <Paragraph
              variant="small"
              className="text-neutral-700 font-light tracking-tighter leading-tight relative z-10"
            >
              Onboard your brand, URLs, and competitors in minutes. We pull in
              everything AI engines might know about you.
            </Paragraph>
          </motion.div>

          {/* Step 02 — Analyze */}
          <motion.div
            className="md:col-span-5 bg-white p-10 rounded-2xl border border-neutral-200/70 flex flex-col justify-between h-80"
            {...(shouldReduceMotion ? {} : fadeIn(0.14))}
          >
            <div className="flex justify-between items-start">
              <Subheading
                as="h3"
                variant="small"
                className="text-neutral-900 font-light uppercase tracking-widest"
              >
                Analyze
              </Subheading>
              <HugeiconsIcon
                icon={AiBrain01Icon}
                size={28}
                color={BLUE}
                strokeWidth={1.8}
              />
            </div>
            <Paragraph
              variant="small"
              className="text-neutral-700 font-light tracking-tighter leading-tight"
            >
              Crawl LLM knowledge graphs to map how AI models currently
              understand your brand, products, and competitive landscape.
            </Paragraph>
          </motion.div>

          {/* Step 03 — Diagnose */}
          <motion.div
            className="md:col-span-4 bg-white p-10 rounded-2xl border border-neutral-200/70 flex flex-col justify-between h-80"
            {...(shouldReduceMotion ? {} : fadeIn(0.18))}
          >
            <div className="flex justify-between items-start">
              <Subheading
                as="h3"
                variant="small"
                className="text-neutral-900 font-light uppercase tracking-widest"
              >
                Diagnose
              </Subheading>
              <HugeiconsIcon
                icon={Search01Icon}
                size={28}
                color={BLUE}
                strokeWidth={1.8}
              />
            </div>
            <Paragraph
              variant="small"
              className="text-neutral-700 font-light tracking-tighter leading-tight"
            >
              Identify visibility gaps, citation deficiencies, and hallucination
              risks across every major generative search engine.
            </Paragraph>
          </motion.div>

          {/* Step 04 — Fix */}
          <motion.div
            className="md:col-span-4 bg-white p-10 rounded-2xl border border-neutral-200/70 flex flex-col justify-between h-80"
            {...(shouldReduceMotion ? {} : fadeIn(0.22))}
          >
            <div className="flex justify-between items-start">
              <Subheading
                as="h3"
                variant="small"
                className="text-neutral-900 font-light uppercase tracking-widest"
              >
                Fix
              </Subheading>
              <HugeiconsIcon
                icon={Settings02Icon}
                size={28}
                color={ORANGE}
                strokeWidth={1.8}
              />
            </div>
            <Paragraph
              variant="small"
              className="text-neutral-700 font-light tracking-tighter leading-tight"
            >
              Deploy semantic structural changes to your content that directly
              influence how AI models reference and recommend your brand.
            </Paragraph>
          </motion.div>

          {/* Step 05 — Track & Optimize */}
          <motion.div
            className="md:col-span-4 bg-blue-600 p-10 rounded-2xl flex flex-col justify-between h-80 relative overflow-hidden"
            {...(shouldReduceMotion ? {} : fadeIn(0.26))}
          >
            <div className="flex justify-between items-start">
              <Subheading
                as="h3"
                variant="small"
                className="text-white font-light uppercase tracking-widest"
              >
                Track & Optimize
              </Subheading>
              <HugeiconsIcon
                icon={Analytics01Icon}
                size={28}
                color="white"
                strokeWidth={1.8}
              />
            </div>
            <Paragraph
              variant="small"
              className="text-blue-100 font-light tracking-tighter leading-tight"
            >
              Monitor your AI rank across all engines in real-time and iterate
              on GEO improvements with AI-suggested content fixes.
            </Paragraph>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
