"use client";
import { motion, useReducedMotion } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ConnectIcon,
  AnalysisTextLinkIcon,
  Search01Icon,
  Settings02Icon,
  Analytics01Icon,
  CheckmarkCircle01Icon,
  RadioButtonIcon,
} from "@hugeicons/core-free-icons";
import { Heading } from "../ui/Heading";
import { Paragraph } from "../ui/Paragraph";
import { CTAButton } from "../ui/CTAButton";
import { IconArrowRight } from "@tabler/icons-react";

const steps: {
  number: string;
  title: string;
  description: string;
  icon: any;
  done: boolean;
}[] = [
  {
    number: "001",
    title: "Connect",
    icon: ConnectIcon,
    done: true,
    description:
      "Onboard your brand, URLs, and competitors in minutes. We pull in everything AI engines might know about you.",
  },
  {
    number: "002",
    title: "Analyze",
    icon: AnalysisTextLinkIcon,
    done: true,
    description:
      "Crawl LLM knowledge graphs to map how AI models currently understand your brand, products, and competitive landscape.",
  },
  {
    number: "003",
    title: "Diagnose",
    icon: Search01Icon,
    done: false,
    description:
      "Identify visibility gaps, citation deficiencies, and hallucination risks across every major generative search engine.",
  },
  {
    number: "004",
    title: "Fix",
    icon: Settings02Icon,
    done: false,
    description:
      "Deploy semantic structural changes to your content that directly influence how AI models reference and recommend your brand.",
  },
  {
    number: "005",
    title: "Track & Optimize",
    icon: Analytics01Icon,
    done: false,
    description:
      "Monitor your AI rank across all engines in real-time and iterate on GEO improvements with AI-suggested content fixes.",
  },
];

const ProcessTrackerCard = () => (
  <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-2xl shadow-neutral-900/15 px-5 py-5 w-[268px]">
    <div className="flex items-center justify-between mb-4">
      <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest">
        Process Status
      </span>
      <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
        2 / 5 done
      </span>
    </div>

    <div className="space-y-2.5">
      {steps.map((step, i) => (
        <div key={step.number} className="flex items-center gap-3">
          {/* Icon chip */}
          <div
            className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: step.done
                ? "linear-gradient(135deg, #3b82f6, #1d4ed8)"
                : "#f3f4f6",
              boxShadow: step.done
                ? "0 3px 8px rgba(37,99,235,0.30), inset 0 1px 0 rgba(255,255,255,0.2)"
                : "none",
            }}
          >
            <HugeiconsIcon
              icon={step.done ? CheckmarkCircle01Icon : RadioButtonIcon}
              size={16}
              color={step.done ? "white" : "#d1d5db"}
              strokeWidth={1.8}
            />
          </div>

          {/* Step info */}
          <div className="flex flex-1 items-center justify-between">
            <span
              className={`text-[12px] font-medium ${step.done ? "text-neutral-800" : "text-neutral-400"}`}
            >
              {step.title}
            </span>
            <span
              className={`text-[10px] tabular-nums font-semibold ${step.done ? "text-blue-500" : "text-neutral-300"}`}
            >
              {step.number}
            </span>
          </div>

          {/* Active pulse indicator */}
          {!step.done && i === steps.findIndex((s) => !s.done) && (
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
          )}
        </div>
      ))}
    </div>
  </div>
);

const HowItWorksSection = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-24 px-4 bg-white">
      {/* Grain filter */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <filter id="howItWorksGrain">
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
            className="text-neutral-900 font-light"
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

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">
          {/* Left — gradient panel + floating tracker card */}
          <motion.div
            className="relative rounded-3xl overflow-hidden flex items-center justify-center bg-gradient-to-b from-sky-400 via-blue-600 to-blue-800 min-h-[420px]"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Grain overlay */}
            <div
              className="absolute inset-0 pointer-events-none bg-neutral-500 opacity-80"
              style={{ filter: "url(#howItWorksGrain)" }}
            />
            {/* Floating card */}
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: 0.25,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative z-10"
            >
              <ProcessTrackerCard />
            </motion.div>
          </motion.div>

          {/* Right — numbered step rows */}
          <motion.div
            className="flex flex-col"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            {steps.map((step, i) => (
              <div key={step.number}>
                <div className="flex items-start justify-between py-5">
                  <div className="flex-1 pr-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HugeiconsIcon
                          icon={step.icon}
                          size={18}
                          className="text-neutral-900 shrink-0"
                          strokeWidth={1.8}
                        />
                        <Paragraph
                          variant="paragraphHeading"
                          className="uppercase tracking-widest"
                        >
                          {step.title}
                        </Paragraph>
                      </div>
                      <span className="font-schibsted text-[25px] text-neutral-300 font-medium tabular-nums mt-0.5 shrink-0">
                        {step.number}
                      </span>
                    </div>
                    <Paragraph variant="paragraphtext" className="mt-2">
                      {step.description}
                    </Paragraph>
                  </div>
                </div>
                {i < steps.length - 1 && <hr className="border-neutral-200" />}
              </div>
            ))}

            {/* CTA */}
            <div className="mt-8">
              <CTAButton
                loggedInHref="/dashboard"
                loggedOutHref="/signup"
                icon={IconArrowRight}
                className="font-schibsted rounded-md"
              >
                Start the process
              </CTAButton>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
