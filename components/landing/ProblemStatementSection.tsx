"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  IconArrowUpRight,
  IconRobot,
  IconPlus,
  IconWorld,
  IconDots,
  IconMicrophone,
  IconArrowUp,
} from "@tabler/icons-react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Line,
  CartesianGrid,
} from "recharts";
import { ChartContainer, type ChartConfig } from "../ui/chart";
import { Card, CardContent } from "../ui/card";
import { Heading } from "../ui/Heading";
import { CTAButton } from "../ui/CTAButton";
import { Subheading } from "../ui/Subheading";
import { Paragraph } from "../ui/Paragraph";
import { TypingText, TypingTextCursor } from "../ui/typing-text";
import { PointerHighlight } from "../ui/pointer-highlight";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PerplexityAiIcon,
  GoogleGeminiIcon,
  ChatGptIcon,
  AiAudioIcon,
  Grok02Icon,
  MetaIcon,
  CopilotIcon,
  ClaudeIcon,
} from "@hugeicons/core-free-icons";

const providers = [
  {
    Icon: PerplexityAiIcon,
    color: "#10A37F",
    label: "ChatGPT",
    score: 47,
    dot: true,
  },
  {
    Icon: GoogleGeminiIcon,
    color: "#4285F4",
    label: "Gemini",
    score: 12,
    dot: false,
  },
  {
    Icon: ChatGptIcon,
    color: "#6366F1",
    label: "Perplexity",
    score: 83,
    dot: true,
  },
  {
    Icon: AiAudioIcon,
    color: "#D97757",
    label: "Claude",
    score: 8,
    dot: false,
  },
  {
    Icon: ClaudeIcon,
    color: "#2563EB",
    label: "Bing",
    score: 19,
    dot: false,
  },
  { Icon: Grok02Icon, color: "#111827", label: "Grok", score: 31, dot: true },
  { Icon: MetaIcon, color: "#76B900", label: "NVIDIA", score: 5, dot: true },
  {
    Icon: CopilotIcon,
    color: "#2563EB",
    label: "DeepSeek",
    score: 64,
    dot: false,
  },
];

const hoursChartData = [
  { day: "Mon", s1: 1.1, s2: 1.1, s3: 1.1, s4: 1.2, total: 4.5 },
  { day: "Tue", s1: 0.8, s2: 0.8, s3: 0.8, s4: 0.8, total: 3.2 },
  { day: "Wed", s1: 1.4, s2: 1.5, s3: 1.4, s4: 1.5, total: 5.8 },
  { day: "Thu", s1: 0.7, s2: 0.7, s3: 0.8, s4: 0.7, total: 2.9 },
  { day: "Fri", s1: 1.2, s2: 1.2, s3: 1.2, s4: 1.2, total: 4.8 },
  { day: "Sat", s1: 1.3, s2: 1.3, s3: 1.3, s4: 1.3, total: 5.2 },
  { day: "Sun", s1: 0.4, s2: 0.5, s3: 0.5, s4: 0.4, total: 1.8 },
];

const hoursChartConfig = {
  s1: { label: "S1", color: "rgba(56,189,248,0.15)" },
  s2: { label: "S2", color: "rgba(14,165,233,0.35)" },
  s3: { label: "S3", color: "rgba(37,99,235,0.6)" },
  s4: { label: "S4", color: "rgba(30,64,175,0.88)" },
  total: { label: "Hrs", color: "#F87171" },
} satisfies ChartConfig;

const citationData = [
  { name: "Competitor A", count: 147, pct: 85 },
  { name: "Competitor B", count: 89, pct: 52 },
  { name: "Competitor C", count: 62, pct: 36 },
];

// ─── Visuals ──────────────────────────────────────────────────────────────────

type ChatPhase = "idle" | "typing" | "evaporating";

const AIChatVisual = ({ isHovered }: { isHovered: boolean }) => {
  const [typingKey, setTypingKey] = useState(0);
  const [phase, setPhase] = useState<ChatPhase>("idle");
  const [evaporateWords, setEvaporateWords] = useState<string[]>([]);
  const capturedRef = useRef("");
  const prevRef = useRef(false);

  useEffect(() => {
    if (isHovered && !prevRef.current) {
      capturedRef.current = "";
      setTypingKey((k) => k + 1);
      setPhase("typing");
    } else if (!isHovered && prevRef.current) {
      const words = capturedRef.current.trim().split(" ").filter(Boolean);
      if (words.length === 0) {
        setPhase("idle");
      } else {
        setEvaporateWords(words);
        setPhase("evaporating");
      }
    }
    prevRef.current = isHovered;
  }, [isHovered]);

  const handleTextChange = useCallback((t: string) => {
    capturedRef.current = t;
  }, []);

  const handleEvaporationDone = useCallback(() => setPhase("idle"), []);

  return (
    <motion.div
      layout
      className="w-full bg-white rounded-2xl border border-neutral-200 py-3.5 px-3 font-schibsted"
    >
      {/* overflow:visible so blur halos aren't clipped by the container */}
      <div className="min-h-[40px] px-1 mb-3" style={{ overflow: "visible" }}>
        {phase === "typing" && (
          <TypingText
            key={typingKey}
            text="What's the best tool for my use case?"
            duration={90}
            onTextChange={handleTextChange}
            className="font-schibsted text-[12px] text-neutral-800"
          >
            <TypingTextCursor
              style={{ backgroundColor: "#525252", marginLeft: "2px" }}
            />
          </TypingText>
        )}

        {phase === "evaporating" && (
          <div
            className="flex flex-wrap font-schibsted text-[12px] text-neutral-800"
            style={{ gap: "0.27em", overflow: "visible" }}
          >
            {evaporateWords.map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                initial={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
                animate={{ opacity: 0, filter: "blur(10px)", scale: 0.88 }}
                transition={{
                  duration: 0.38,
                  delay: (evaporateWords.length - 1 - i) * 0.07,
                  ease: "easeIn",
                }}
                onAnimationComplete={
                  i === 0 ? handleEvaporationDone : undefined
                }
              >
                {word}
              </motion.span>
            ))}
          </div>
        )}

        {phase === "idle" && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="text-[15px] font-light text-neutral-400 select-none"
          >
            Ask anything
          </motion.span>
        )}
      </div>

      {/* Bottom toolbar */}
      <div className="flex items-center justify-between">
        {/* Left: action pills */}
        <div className="flex items-center gap-1.5">
          <button className="w-7 h-7 rounded-full border border-neutral-200 bg-white flex items-center justify-center hover:bg-neutral-50 transition-colors">
            <IconPlus
              size={13}
              strokeWidth={1.8}
              className="text-neutral-600"
            />
          </button>
          <button className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-neutral-200 bg-white text-[11px] text-neutral-600 hover:bg-neutral-50 transition-colors">
            <IconWorld size={12} strokeWidth={1.7} />
            <span>Search</span>
          </button>
          <button className="w-7 h-7 rounded-full border border-neutral-200 bg-white flex items-center justify-center hover:bg-neutral-50 transition-colors">
            <IconDots
              size={13}
              strokeWidth={1.8}
              className="text-neutral-600"
            />
          </button>
        </div>

        {/* Right: mic + send */}
        <div className="flex items-center gap-1.5">
          <button className="w-8 h-8 rounded-full border border-neutral-200 bg-white flex items-center justify-center hover:bg-neutral-50 transition-colors">
            <IconMicrophone
              size={14}
              strokeWidth={1.7}
              className="text-neutral-500"
            />
          </button>
          <motion.button
            className="w-8 h-8 rounded-full flex items-center justify-center"
            animate={{
              backgroundColor: phase === "typing" ? "#4b5563" : "#9ca3af",
            }}
            transition={{ duration: 0.25 }}
          >
            <IconArrowUp size={15} strokeWidth={2} className="text-white" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const ICON_SHADOW =
  "0px 0px 8px 0px rgba(248,248,248,0.25) inset, 0px 32px 24px -16px rgba(0,0,0,0.40)";

const TOP_COL_STARTS = [
  "col-start-2",
  "col-start-4",
  "col-start-6",
  "col-start-8",
] as const;
const BTM_COL_STARTS = [
  "col-start-1",
  "col-start-3",
  "col-start-5",
  "col-start-7",
] as const;

const IconPill = ({
  Icon,
  color,
}: {
  Icon: (typeof providers)[0]["Icon"];
  color: string;
}) => (
  <div
    className="aspect-square rounded-full bg-orange-50 p-[3px] flex items-center justify-center"
    // style={{ boxShadow: ICON_SHADOW }}
  >
    <div className="w-full h-full rounded-full bg-orange-100 flex items-center justify-center">
      <HugeiconsIcon icon={Icon} size={22} color={color} strokeWidth={1.7} />
    </div>
  </div>
);

const ProviderGridVisual = () => {
  const topRow = providers.slice(0, 4);
  const bottomRow = providers.slice(4);

  return (
    <div className="relative w-full overflow-hidden">
      {/* <div className="absolute left-0 inset-y-0 w-15 bg-gradient-to-r from-orange-100 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 inset-y-0 w-15 bg-gradient-to-l from-orange-100 to-transparent z-10 pointer-events-none" /> */}
      <div className="grid grid-cols-9 gap-y-4 gap-x-3 w-full">
        {topRow.map(({ Icon, color, label }, i) => (
          <div
            key={label}
            className={`col-span-2 ${TOP_COL_STARTS[i]} row-start-1 `}
          >
            <IconPill Icon={Icon} color={color} />
          </div>
        ))}
        {bottomRow.map(({ Icon, color, label }, i) => (
          <div
            key={label}
            className={`col-span-2 ${BTM_COL_STARTS[i]} row-start-2 `}
          >
            <IconPill Icon={Icon} color={color} />
          </div>
        ))}
      </div>
    </div>
  );
};

const HoursBarChartVisual = () => (
  <ChartContainer config={hoursChartConfig} className="h-[120px] w-full">
    <ComposedChart
      data={hoursChartData}
      margin={{ top: 4, right: 2, bottom: 0, left: -10 }}
      barCategoryGap="35%"
    >
      <CartesianGrid
        vertical={false}
        strokeDasharray="4 4"
        stroke="#E5E7EB"
        strokeOpacity={0.8}
      />
      <XAxis
        dataKey="day"
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 9, fill: "#a3a3a3" }}
        height={16}
      />
      <YAxis
        axisLine={false}
        tickLine={false}
        tick={{ fontSize: 9, fill: "#a3a3a3" }}
        width={22}
        tickFormatter={(v) => `${v}h`}
        domain={[0, 7]}
        ticks={[0, 2, 4, 6]}
      />
      <Bar
        dataKey="s1"
        stackId="hrs"
        fill="rgba(56,189,248,0.15)"
        radius={[0, 0, 3, 3]}
      />
      <Bar
        dataKey="s2"
        stackId="hrs"
        fill="rgba(14,165,233,0.38)"
        radius={[0, 0, 0, 0]}
      />
      <Bar
        dataKey="s3"
        stackId="hrs"
        fill="rgba(37,99,235,0.62)"
        radius={[0, 0, 0, 0]}
      />
      <Bar
        dataKey="s4"
        stackId="hrs"
        fill="rgba(30,64,175,0.88)"
        radius={[4, 4, 0, 0]}
      />
      <Line
        type="monotone"
        dataKey="total"
        stroke="#2563eb"
        strokeWidth={2}
        dot={{ r: 3.5, fill: "white", stroke: "#2563eb", strokeWidth: 2 }}
        activeDot={false}
        isAnimationActive={false}
      />
    </ComposedChart>
  </ChartContainer>
);

const DroppingLineVisual = () => (
  <div className="relative w-full overflow-hidden" style={{ height: "84px" }}>
    {/* Dot grid */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
        backgroundSize: "16px 16px",
        opacity: 0.4,
      }}
    />
    <svg viewBox="0 0 220 84" className="w-full h-full relative z-10">
      <defs>
        <linearGradient id="risingAreaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="dropAreaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Area fill — rising */}
      <path
        d="M 0 80 C 30 80, 42 62, 62 48 C 82 32, 98 18, 118 11 L 122 11 L 122 80 Z"
        fill="url(#risingAreaFill)"
      />
      {/* Area fill — drop */}
      <path
        d="M 122 11 C 130 11, 138 36, 146 58 C 153 72, 168 70, 220 68 L 220 80 L 122 80 Z"
        fill="url(#dropAreaFill)"
      />

      {/* Rising line */}
      <path
        d="M 0 80 C 30 80, 42 62, 62 48 C 82 32, 98 18, 118 11 L 122 11"
        fill="none"
        stroke="#2563eb"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Drop line — dashed red */}
      <path
        d="M 122 11 C 130 11, 138 36, 146 58 C 153 72, 168 70, 220 68"
        fill="none"
        stroke="#ef4444"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="5 3"
      />

      {/* Vertical inflection marker */}
      <line
        x1="122" y1="14" x2="122" y2="80"
        stroke="#94a3b8"
        strokeWidth="1"
        strokeDasharray="3 3"
        strokeOpacity="0.6"
      />

      {/* Peak dot */}
      <circle cx="122" cy="11" r="4.5" fill="white" stroke="#2563eb" strokeWidth="2.2" />

      {/* "model update" pill label */}
      <rect x="129" y="4" width="56" height="14" rx="4" fill="#1e40af" />
      <text
        x="157"
        y="13.5"
        fontSize="6.5"
        fill="white"
        fontWeight="600"
        textAnchor="middle"
        fontFamily="sans-serif"
        letterSpacing="0.3"
      >
        model update
      </text>
    </svg>
  </div>
);

const ORBIT_R = 100;

const UnknownScoreVisual = ({ isHovered }: { isHovered: boolean }) => {
  const shouldReduceMotion = useReducedMotion();
  const active = isHovered && !shouldReduceMotion;

  return (
    <div className="flex items-center justify-center py-2">
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* Orbit wrapper — rotates on hover, carrying icons with it */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: active ? 360 : 0 }}
          transition={
            active
              ? {
                  duration: 10,
                  ease: "linear",
                  repeat: Infinity,
                  repeatType: "loop",
                }
              : { duration: 0.6, ease: "easeOut" }
          }
        >
          {providers.map(({ Icon, color, label }, i) => {
            const angle = ((2 * Math.PI) / providers.length) * i;
            const x = Math.round(ORBIT_R * Math.cos(angle));
            const y = Math.round(ORBIT_R * Math.sin(angle));
            return (
              <motion.div
                key={label}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                animate={
                  active
                    ? { x, y, scale: 1, opacity: 1 }
                    : { x: 0, y: 0, scale: 0, opacity: 0 }
                }
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 18,
                  delay: active ? i * 0.045 : (providers.length - 1 - i) * 0.03,
                }}
              >
                {/* Counter-rotate so icon stays upright while wrapper orbits */}
                <motion.div
                  className="w-7 h-7 rounded-full bg-white shadow-md border border-neutral-100 flex items-center justify-center"
                  animate={{ rotate: active ? -360 : 0 }}
                  transition={
                    active
                      ? {
                          duration: 10,
                          ease: "linear",
                          repeat: Infinity,
                          repeatType: "loop",
                        }
                      : { duration: 0.6, ease: "easeOut" }
                  }
                >
                  <HugeiconsIcon
                    icon={Icon}
                    size={25}
                    color={color}
                    strokeWidth={1.5}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Spinning dashed ring */}
        <svg
          viewBox="0 0 100 100"
          className={`absolute w-24 h-24 animate-[spin_8s_linear_infinite] transition-opacity duration-300 ${active ? "opacity-0" : "opacity-100"}`}
        >
          <circle
            cx="50"
            cy="50"
            r="36"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="3.5"
            strokeDasharray="7 5"
          />
        </svg>

        {/* Question mark */}
        <span className="relative z-10 font-schibsted text-[42px] font-bold text-neutral-300 leading-none">
          ?
        </span>
      </div>
    </div>
  );
};

const WHITE_CARD =
  "rounded-2xl py-0 bg-white ring-0 border border-neutral-200/70 shadow-sm h-full";
const DARK_CARD = "rounded-2xl py-0 ring-0 border-0 h-full";

// ─── Section ──────────────────────────────────────────────────────────────────

const ProblemStatementSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const [card1Hovered, setCard1Hovered] = useState(false);
  const [card7Hovered, setCard7Hovered] = useState(false);

  const fadeIn = (delay: number) =>
    ({
      initial: shouldReduceMotion
        ? false
        : { opacity: 0, y: 16, filter: "blur(4px)" },
      whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
      viewport: { once: true },
      transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
    }) as const;

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
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Heading
            as="h2"
            variant="sectionHeader"
            className="text-neutral-600 font-light"
          >
            The race has already started.
          </Heading>
          <Heading
            as="h2"
            variant="sectionHeader"
            className="text-neutral-900 font-bold"
          >
            Are you even in it?
          </Heading>
        </motion.div>

        <div
          className="relative rounded-[32px] p-4 overflow-hidden"
          style={{ background: "#EDE5D8" }}
        >
          {/* SVG noise filter definition */}
          <svg className="absolute w-0 h-0" aria-hidden="true">
            <filter id="problemGrain">
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
            className="absolute inset-0 pointer-events-none z-0 rounded-[32px]"
            style={{
              background: "#8C8C8C",
              filter: "url(#problemGrain)",
              opacity: 0.8,
            }}
          />
          {/* Grid: 3 equal columns on desktop */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* ── Left column — 2 rows ──────────────────────────────── */}
            <div className="grid grid-rows-2 gap-3 lg:h-[860px]">
              {/* Card 1: AI Chat */}
              <motion.div
                className="h-full"
                {...fadeIn(0.05)}
                onHoverStart={() => setCard1Hovered(true)}
                onHoverEnd={() => setCard1Hovered(false)}
              >
                <Card className={WHITE_CARD}>
                  <CardContent className="flex flex-col gap-4 p-5 h-full">
                    <div className="flex-1 flex items-center">
                      <AIChatVisual isHovered={card1Hovered} />
                    </div>
                    <div>
                      <Subheading
                        as="h3"
                        variant="small"
                        className="text-neutral-900 font-light text-base"
                      >
                        AI picked its favorites. Was it you?
                      </Subheading>
                      <Paragraph
                        variant="small"
                        className="text-neutral-700 mt-2 tracking-tighter font-light leading-tight mx-auto"
                      >
                        Every day, buyers ask ChatGPT what tool to use in your
                        category. AI names brands. Either yours makes the list —
                        or a competitor does.
                      </Paragraph>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Card 2: Provider Grid */}
              <motion.div className="h-full" {...fadeIn(0.1)}>
                <Card
                  className={`${WHITE_CARD} overflow-hidden flex flex-col bg-gradient-to-b from-orange-100 to-orange-200 border-orange-300`}
                >
                  {/* Icon zone — same bg as outer wrapper, visually outside the card */}
                  <div className="w-full shrink-0 px-4 pt-4 pb-3">
                    <ProviderGridVisual />
                  </div>
                  {/* Text zone */}
                  <div className="flex-1 p-5 pt-4">
                    <Subheading
                      as="h3"
                      variant="small"
                      className="text-neutral-900 font-light text-base"
                    >
                      8 AI systems. All measuring you differently.
                    </Subheading>
                    <Paragraph
                      variant="small"
                      className="text-neutral-700 mt-2 tracking-tighter font-light leading-tight mx-auto"
                    >
                      ChatGPT cites Wikipedia-heavy sources. Perplexity pulls
                      live web results. Gemini favors the Google ecosystem.
                      Traditional SEO tracks none of this.
                    </Paragraph>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* ── Middle column — 3 rows ────────────────────────────── */}
            <div className="grid grid-rows-3 gap-3 lg:h-[860px]">
              {/* Card 3: Hours bar chart (shadcn) */}
              <motion.div className="h-full" {...fadeIn(0.1)}>
                <Card className={WHITE_CARD}>
                  <CardContent className="flex flex-col gap-3 p-5 h-full">
                    <div className="flex-1 flex items-end">
                      <HoursBarChartVisual />
                    </div>
                    <div>
                      <Subheading
                        as="h3"
                        variant="small"
                        className="text-neutral-900 font-light text-base"
                      >
                        25+ hours a week. By hand.
                      </Subheading>
                      <Paragraph
                        variant="small"
                        className="text-neutral-700 mt-2 tracking-tighter font-light leading-tight mx-auto"
                      >
                        Copy-pasting queries into AI tools and logging results
                        in spreadsheets isn't a strategy.
                      </Paragraph>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Card 4: Citation list */}
              <motion.div className="h-full" {...fadeIn(0.13)}>
                <Card className={WHITE_CARD}>
                  <CardContent className="flex flex-col items-center justify-center gap-3 p-5 h-full">
                    <div>
                      <Subheading
                        as="h3"
                        variant="medium"
                        className="text-neutral-900 font-light text-base"
                      >
                        Your competitors are{" "}
                        <PointerHighlight
                          rectangleClassName="border-blue-500 rounded-sm"
                          pointerClassName="text-blue-500"
                          containerClassName="inline-flex"
                        >
                          <span className="relative z-10 px-0.5">
                            everywhere.
                          </span>
                        </PointerHighlight>
                      </Subheading>
                      <Paragraph
                        variant="small"
                        className="text-neutral-700 mt-2 tracking-tighter font-light leading-tight mx-auto"
                      >
                        AI share of voice is already being captured — just not
                        by you.
                      </Paragraph>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Card 5: Dropping line */}
              <motion.div className="h-full" {...fadeIn(0.16)}>
                <Card className={WHITE_CARD}>
                  <CardContent className="flex flex-col gap-3 p-5 h-full">
                    <div className="flex-1 flex items-center">
                      <DroppingLineVisual />
                    </div>
                    <div>
                      <Subheading
                        as="h3"
                        variant="small"
                        className="text-neutral-900 font-light text-base"
                      >
                        Model updates erase your progress.
                      </Subheading>
                      <Paragraph
                        variant="small"
                        className="text-neutral-700 mt-2 tracking-tighter font-light leading-tight mx-auto"
                      >
                        AI training data changes constantly. Manual spot-checks
                        are stale before you can act on them.
                      </Paragraph>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* ── Right column — 2 rows ─────────────────────────────── */}
            <div className="grid grid-rows-2 gap-3 lg:h-[860px]">
              {/* Card 6: Accent CTA — dark */}
              <motion.div className="h-full" {...fadeIn(0.15)}>
                <Card className={`${DARK_CARD} problem-cta-card`}>
                  <CardContent className="flex flex-col p-5 h-full">
                    {/* Arrow icon top-right, like the reference image */}
                    <div className="self-end shrink-0">
                      <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                        <IconArrowUpRight
                          size={18}
                          strokeWidth={2}
                          className="text-white"
                        />
                      </div>
                    </div>
                    <div className="flex-1" />
                    <div>
                      <Subheading
                        as="h3"
                        variant="small"
                        className="text-neutral-100 font-light text-base"
                      >
                        Find out where you stand.
                      </Subheading>
                      <Paragraph
                        variant="small"
                        className="text-neutral-200 mt-2 tracking-tighter font-light leading-tight mx-auto"
                      >
                        Run a free GEO scan and see exactly how your brand
                        appears — or doesn't — across 8 AI assistants.
                      </Paragraph>
                      <div className="mt-5">
                        <CTAButton
                          loggedInHref="/dashboard/analysis"
                          loggedOutHref="/signup"
                          icon={IconArrowUpRight}
                          className="font-schibsted rounded-md text-sm"
                        >
                          Start free scan
                        </CTAButton>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Card 7: Unknown score ring */}
              <motion.div
                className="h-full"
                {...fadeIn(0.2)}
                onHoverStart={() => setCard7Hovered(true)}
                onHoverEnd={() => setCard7Hovered(false)}
              >
                <Card className={WHITE_CARD}>
                  <CardContent className="flex flex-col gap-3 p-5 h-full">
                    <div className="flex-1 flex items-center justify-center">
                      <UnknownScoreVisual isHovered={card7Hovered} />
                    </div>
                    <div>
                      <Subheading
                        as="h3"
                        variant="medium"
                        className="text-neutral-900 font-light text-base"
                      >
                        AI Visibility Score
                      </Subheading>
                      <Paragraph
                        variant="small"
                        className="text-neutral-700 mt-2 tracking-tighter font-light leading-tight mx-auto"
                      >
                        You can't optimize what you can't see. Most brands have
                        never run a single AI visibility audit.
                      </Paragraph>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemStatementSection;
