"use client";
import React from "react";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useMotionTemplate,
  useInView,
} from "motion/react";
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
  Search01Icon,
  FlashIcon,
  Chart01Icon,
  DatabaseIcon,
  Settings02Icon,
  AiAudioIcon,
  MetaIcon,
  CopilotIcon,
} from "@hugeicons/core-free-icons";
import { Card, CardContent } from "../ui/card";
import { Heading } from "../ui/Heading";
import { Paragraph } from "../ui/Paragraph";

const ORANGE = "#D97757";
const BLUE = "#2563eb";

const TAG_ROWS = [
  [
    { id: "informational", icon: AiBrain01Icon, label: "Informational" },
    { id: "transactional", icon: FlashIcon, label: "Transactional" },
    { id: "navigational", icon: GlobeIcon, label: "Navigational" },
    { id: "comparison", icon: Chart01Icon, label: "Comparison" },
    { id: "brand-mention", icon: Search01Icon, label: "Brand Mention" },
  ],
  [
    { id: "citation-tracking", icon: Link01Icon, label: "Citation Tracking" },
    {
      id: "hallucination-alert",
      icon: Alert01Icon,
      label: "Hallucination Alert",
    },
    { id: "rank-tracking", icon: Analytics01Icon, label: "Rank Tracking" },
    { id: "ai-coverage", icon: DatabaseIcon, label: "AI Coverage" },
    { id: "optimization", icon: Settings02Icon, label: "GEO Optimization" },
  ],
  [
    { id: "chatgpt", icon: ChatGptIcon, label: "ChatGPT" },
    { id: "perplexity", icon: PerplexityAiIcon, label: "Perplexity" },
    { id: "gemini", icon: GoogleGeminiIcon, label: "Gemini" },
    { id: "claude", icon: ClaudeIcon, label: "Claude" },
    { id: "grok", icon: Grok02Icon, label: "Grok" },
  ],
];

const engines = [
  { Icon: PerplexityAiIcon, color: "#10A37F", label: "ChatGPT" },
  { Icon: GoogleGeminiIcon, color: "#4285F4", label: "Gemini" },
  { Icon: ChatGptIcon, color: "#6366F1", label: "Perplexity" },
  { Icon: AiAudioIcon, color: "#D97757", label: "Claude" },
  { Icon: ClaudeIcon, color: "#2563EB", label: "Bing" },
  { Icon: Grok02Icon, color: "#111827", label: "Grok" },
  { Icon: MetaIcon, color: "#76B900", label: "NVIDIA" },
  { Icon: CopilotIcon, color: "#2563EB", label: "DeepSeek" },
];

const fadeIn = (delay: number) => ({
  initial: { opacity: 0, y: 16, filter: "blur(4px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true } as const,
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
});

// ─── Magnifying lens SVG ──────────────────────────────────────────────────────

const MagnifyingLens = ({ size = 56 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 512 512"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M365.424 335.392L342.24 312.192L311.68 342.736L334.88 365.936L365.424 335.392Z"
      fill="#B0BDC6"
    />
    <path
      d="M358.08 342.736L334.88 319.552L319.04 335.392L342.24 358.584L358.08 342.736Z"
      fill="#DFE9EF"
    />
    <path
      d="M352.368 321.808L342.752 312.192L312.208 342.752L321.824 352.36L352.368 321.808Z"
      fill="#B0BDC6"
    />
    <path
      d="M332 332C260 404 142.4 404 69.6001 332C-2.3999 260 -2.3999 142.4 69.6001 69.6C141.6 -3.20003 259.2 -2.40002 332 69.6C404.8 142.4 404.8 260 332 332ZM315.2 87.2C252 24 150.4 24 88.0001 87.2C24.8001 150.4 24.8001 252 88.0001 314.4C151.2 377.6 252.8 377.6 315.2 314.4C377.6 252 377.6 150.4 315.2 87.2Z"
      fill="#DFE9EF"
    />
    <path
      d="M319.2 319.2C254.4 384 148.8 384 83.2001 319.2C18.4001 254.4 18.4001 148.8 83.2001 83.2C148 18.4 253.6 18.4 319.2 83.2C384 148.8 384 254.4 319.2 319.2ZM310.4 92C250.4 32 152 32 92.0001 92C32.0001 152 32.0001 250.4 92.0001 310.4C152 370.4 250.4 370.4 310.4 310.4C370.4 250.4 370.4 152 310.4 92Z"
      fill="#7A858C"
    />
    <path
      d="M484.104 428.784L373.8 318.472L318.36 373.912L428.672 484.216L484.104 428.784Z"
      fill="#333333"
    />
    <path
      d="M471.664 441.224L361.344 330.928L330.8 361.48L441.12 471.76L471.664 441.224Z"
      fill="#575B5E"
    />
    <path
      d="M495.2 423.2C504 432 432.8 504 423.2 495.2L417.6 489.6C408.8 480.8 480 408.8 489.6 417.6L495.2 423.2Z"
      fill="#B0BDC6"
    />
    <path
      d="M483.2 435.2C492 444 444.8 492 435.2 483.2L429.6 477.6C420.8 468.8 468 420.8 477.6 429.6L483.2 435.2Z"
      fill="#DFE9EF"
    />
  </svg>
);

// ─── Large card ───────────────────────────────────────────────────────────────

const LargeCard = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const lensX = useMotionValue(0);
  const lensY = useMotionValue(0);

  const clipPath = useMotionTemplate`circle(46px at calc(50% + ${lensX}px - 14px) calc(50% + ${lensY}px - 14px))`;
  const inverseMask = useMotionTemplate`radial-gradient(circle 46px at calc(50% + ${lensX}px - 14px) calc(50% + ${lensY}px - 14px), transparent 100%, black 100%)`;

  return (
    <motion.div
      className="col-span-1 md:col-span-2 row-span-2"
      {...fadeIn(0.05)}
    >
      <Card className="rounded-2xl border border-neutral-200/70 shadow-sm h-full min-h-[400px] md:min-h-0 bg-white">
        <CardContent className="flex flex-col p-5 h-full">
          {/* Magnified tag scroll — top */}
          <div
            ref={containerRef}
            className="relative overflow-hidden rounded-xl flex-1 flex flex-col items-center justify-center bg-neutral-50 border border-neutral-100"
          >
            {/* base layer — dimmed */}
            <motion.div
              style={{ WebkitMaskImage: inverseMask, maskImage: inverseMask }}
              className="flex flex-col gap-2.5 w-full h-full justify-center"
            >
              {TAG_ROWS.map((row, rowIndex) => (
                <motion.div
                  key={`row-${rowIndex}`}
                  className="flex gap-2.5 w-max"
                  animate={{
                    x:
                      rowIndex % 2 === 0
                        ? ["0%", "-33.333%"]
                        : ["-33.333%", "0%"],
                  }}
                  transition={{
                    duration: 28,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                >
                  {[...row, ...row, ...row].map((item, idx) => (
                    <div
                      key={`${item.id}-${idx}`}
                      style={{ fontFamily: "var(--font-schibsted-grotesk)" }}
                      className="flex gap-1.5 bg-white whitespace-nowrap text-neutral-400 p-1.5 px-2.5 items-center border border-neutral-100 rounded-full text-[10px]"
                    >
                      <HugeiconsIcon icon={item.icon} size={11} />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </motion.div>
              ))}
            </motion.div>

            {/* reveal layer — highlighted under lens */}
            <motion.div
              className="absolute inset-0 flex flex-col gap-2.5 justify-center pointer-events-none select-none z-10"
              style={{ clipPath }}
            >
              {TAG_ROWS.map((row, rowIndex) => (
                <motion.div
                  key={`row-reveal-${rowIndex}`}
                  className="flex gap-2.5 w-max"
                  animate={{
                    x:
                      rowIndex % 2 === 0
                        ? ["0%", "-33.333%"]
                        : ["-33.333%", "0%"],
                  }}
                  transition={{
                    duration: 28,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                >
                  {[...row, ...row, ...row].map((item, idx) => (
                    <div
                      key={`${item.id}-${idx}-reveal`}
                      style={{ fontFamily: "var(--font-schibsted-grotesk)" }}
                      className="flex gap-1.5 bg-white whitespace-nowrap text-orange-600 p-1.5 px-2.5 items-center border border-orange-200 shadow-sm rounded-full text-[10px] scale-125"
                    >
                      <HugeiconsIcon
                        icon={item.icon}
                        size={11}
                        color={ORANGE}
                      />
                      <span className="font-semibold">{item.label}</span>
                    </div>
                  ))}
                </motion.div>
              ))}
            </motion.div>

            {/* draggable lens */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 cursor-grab active:cursor-grabbing drop-shadow-lg"
              drag
              dragMomentum={false}
              dragConstraints={containerRef}
              style={{ x: lensX, y: lensY }}
            >
              <MagnifyingLens size={92} />
            </motion.div>

            {/* fade edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-neutral-50 to-transparent z-20" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/5 bg-gradient-to-l from-neutral-50 to-transparent z-20" />
          </div>

          {/* Text — bottom */}
          <div className="pt-4 shrink-0">
            <div className="flex items-center gap-2 mb-2">
              {/* <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
                <HugeiconsIcon
                  icon={AiBrain01Icon}
                  size={16}
                  color={ORANGE}
                  strokeWidth={1.6}
                />
              </div> */}
              <Paragraph
                as="h3"
                variant="paragraphHeading"
              >
                Prompt Intelligence
              </Paragraph>
            </div>
            <Paragraph
              variant="paragraphtext"
            >
              Discover how every AI engine interprets queries about your brand —
              across intent types, citation sources, and platforms. Drag the
              lens to explore.
            </Paragraph>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// ─── Small cards ──────────────────────────────────────────────────────────────

const CitationCard = () => {
  return (
    <motion.div {...fadeIn(0.1)}>
      <Card className="rounded-2xl border border-neutral-200/70 shadow-sm h-full bg-white">
        <CardContent className="flex flex-col p-5 h-full">
          {/* Text — bottom */}
          <div className="pt-4 shrink-0">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
                <HugeiconsIcon
                  icon={Link01Icon}
                  size={24}
                  color="#171717"
                  strokeWidth={1.8}
                />
              </div>
              <Paragraph
                as="h3"
                variant="paragraphHeading"
              >
                Citation Mapping
              </Paragraph>
            </div>
            <Paragraph
              variant="paragraphtext"
            >
              Trace every source AI models cite when discussing your brand.
              Build authority where it matters.
            </Paragraph>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const RankCard = () => (
  <motion.div {...fadeIn(0.14)}>
    <Card className="rounded-2xl border border-neutral-200/70 shadow-sm h-full bg-white">
      <CardContent className="flex flex-col p-5 h-full">
        {/* Text — bottom */}
        <div className="pt-4 shrink-0">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
              <HugeiconsIcon
                icon={Analytics01Icon}
                size={24}
                color="#171717"
                strokeWidth={1.8}
              />
            </div>
            <Paragraph
              as="h3"
              variant="paragraphHeading"
            >
              Rank Tracking
            </Paragraph>
          </div>
          <Paragraph
            variant="paragraphtext"
            className="text-neutral-800"
          >
            Monitor your brand's position across AI-generated answers in
            real-time with engine-specific breakdowns.
          </Paragraph>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const AlertCard = () => (
  <motion.div {...fadeIn(0.18)}>
    <Card className="rounded-2xl border border-neutral-200/70 shadow-sm h-full bg-white">
      <CardContent className="flex flex-col p-5 h-full">
        {/* Text — bottom */}
        <div className="pt-4 shrink-0">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
              <HugeiconsIcon
                icon={Alert01Icon}
                size={24}
                color="#171717"
                strokeWidth={1.8}
              />
            </div>
            <Paragraph
              as="h3"
              variant="paragraphHeading"
            >
              Hallucination Alerts
            </Paragraph>
          </div>
          <Paragraph
            variant="paragraphtext"
            className="text-neutral-800"
          >
            Get instant notifications when AI models misrepresent your brand,
            products, or key facts.
          </Paragraph>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const EnginesCard = () => (
  <motion.div className="col-span-1 md:col-span-2" {...fadeIn(0.22)}>
    <Card className="rounded-2xl border border-neutral-200/70 shadow-sm h-full bg-white">
      <CardContent className="flex flex-col gap-5 p-5 h-full">
        {/* Text — bottom */}
        <div className="pt-4 shrink-0">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0">
              <HugeiconsIcon
                icon={GlobeIcon}
                size={24}
                color="#171717"
                strokeWidth={1.8}
              />
            </div>
            <Paragraph
              as="h3"
              variant="paragraphHeading"
            >
              Multi-Engine Support
            </Paragraph>
          </div>
          <Paragraph
            variant="paragraphtext"
            className="text-neutral-800"
          >
            Track and optimize across ChatGPT, Perplexity, Gemini, Claude, and
            every emerging AI search platform — from one dashboard.
          </Paragraph>
        </div>

        <div className="flex items-center gap-2 flex-wrap justify-between">
          {engines.map(({ Icon, color, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1.5 px-2.5 py-1"
            >
              <HugeiconsIcon
                icon={Icon}
                size={35}
                color={color}
                strokeWidth={1.8}
              />
              <span className="text-[14px] font-schibsted tracking-tighter text-neutral-200">
                {label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

// ─── Section ──────────────────────────────────────────────────────────────────

const FeaturesBentoGrid = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-24 px-6 md:px-8 bg-white">
      <div className="max-w-5xl mx-auto">
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
            Built for high-performance
          </Heading>
          <Heading
            as="h2"
            variant="sectionHeader"
            className="text-neutral-900 font-bold"
          >
            marketing teams.
          </Heading>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-3 auto-rows-auto md:auto-rows-[220px]">
          <LargeCard />
          <CitationCard />
          <RankCard />
          <AlertCard />
          <EnginesCard />
        </div>
      </div>
    </section>
  );
};

export default FeaturesBentoGrid;
