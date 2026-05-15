"use client";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";
import { Heading } from "../ui/Heading";
import { Subheading } from "../ui/Subheading";
import { Paragraph } from "../ui/Paragraph";
import BackgroundHexagons from "./BackgroundHexagons";

const steps = [
  {
    number: "01",
    title: "Analyze",
    description:
      "Crawl LLM knowledge graphs to map how AI models currently understand your brand, products, and competitive landscape.",
  },
  {
    number: "02",
    title: "Diagnose",
    description:
      "Identify visibility gaps, citation deficiencies, and hallucination risks across every major generative search engine.",
  },
  {
    number: "03",
    title: "Fix",
    description:
      "Deploy semantic structural changes to your content that directly influence how AI models reference and recommend your brand.",
  },
];

const CARD_POSITIONS = [
  "left-[2%] top-[4%]",
  "left-[33%] top-[35%]",
  "right-[1%] bottom-[6%]",
] as const;

const DOT_POSITIONS = [
  { cx: 125, cy: 42 },
  { cx: 500, cy: 252 },
  { cx: 900, cy: 358 },
] as const;

const DOT_COLORS = ["#38bdf8", "#2563eb", "#1e40af"] as const;

const StepCard = ({
  step,
  delay,
  position,
}: {
  step: (typeof steps)[0];
  delay: number;
  position: string;
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`${position === 'relative' ? 'relative' : 'absolute ' + position} w-full max-w-[260px]`}
      initial={
        shouldReduceMotion ? false : { opacity: 0, y: 20, filter: "blur(4px)" }
      }
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const }}
    >
      <div className="rounded-2xl bg-white p-5 relative overflow-hidden border border-neutral-200/70 shadow-sm">
        {/* Ghost number */}
        <span className="absolute font-schibsted -top-3 -right-1 text-[80px] font-light leading-none select-none pointer-events-none text-black/[0.04]">
          {step.number}
        </span>

        <Subheading
          as="h3"
          variant="small"
          className="text-neutral-900 font-light uppercase tracking-wide text-base relative z-10 mb-8"
        >
          {step.title}
        </Subheading>
        <Paragraph
          variant="small"
          className="text-neutral-500 mt-2 tracking-tighter font-light leading-tight relative z-10"
        >
          {step.description}
        </Paragraph>
      </div>
    </motion.div>
  );
};

const HowItWorksSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const pathLength = useTransform(scrollYProgress, [0.1, 0.55], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="py-24 px-4 bg-white relative overflow-hidden"
    >
      {/* Right-side decorative hexagons */}
      <BackgroundHexagons className="absolute w-[560px] h-[560px] -right-36 -bottom-16 opacity-[0.18] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
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

        {/* Outer warm container */}
        <div
          className="relative rounded-[32px] p-4 overflow-hidden"
          style={{ background: "#EDE5D8" }}
        >
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
          <div
            className="absolute inset-0 pointer-events-none z-0 rounded-[32px]"
            style={{
              background: "#8C8C8C",
              filter: "url(#howItWorksGrain)",
              opacity: 0.8,
            }}
          />

          {/* Timeline area (Desktop) */}
          <div className="relative z-10 h-[440px] hidden md:block">
            {/* SVG connecting curve */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 1000 400"
              preserveAspectRatio="xMidYMid meet"
              fill="none"
            >
              <defs>
                <linearGradient
                  id="howItWorksCurveGrad"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#1e40af" />
                </linearGradient>

                {/* Glow filter for dots */}
                <filter
                  id="dotGlow"
                  x="-50%"
                  y="-50%"
                  width="200%"
                  height="200%"
                >
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Main animated curve */}
              <motion.path
                d="M 80 30 C 180 30, 260 180, 410 205 C 535 225, 590 315, 740 330 C 825 338, 875 350, 955 362"
                stroke="url(#howItWorksCurveGrad)"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
                style={{ pathLength }}
              />

              {/* Connection dots with glow */}
              {DOT_POSITIONS.map(({ cx, cy }, i) => (
                <motion.circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r="7"
                  fill="white"
                  stroke={DOT_COLORS[i]}
                  strokeWidth="3"
                  filter="url(#dotGlow)"
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: 0.2 + i * 0.2,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              ))}

              {/* Arrowhead at end */}
              <motion.path
                d="M 944 354 L 960 362 L 944 370"
                stroke="#1e40af"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.75 }}
              />
            </svg>

            {/* Step cards */}
            {steps.map((step, i) => (
              <StepCard
                key={step.number}
                step={step}
                delay={0.15 + i * 0.15}
                position={CARD_POSITIONS[i]}
              />
            ))}
          </div>

          {/* Mobile layout */}
          <div className="relative z-10 flex flex-col gap-6 md:hidden py-4 items-center">
            {steps.map((step, i) => (
              <StepCard
                key={step.number}
                step={step}
                delay={0.15 + i * 0.15}
                position="relative"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
