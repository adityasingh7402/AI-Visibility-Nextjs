"use client";
import { motion } from "framer-motion";
import { TrendingDown, MousePointerClick, VolumeX, ArrowDownRight, Search, AlertTriangle } from "lucide-react";
import SectionWatermark from "./SectionWatermark";
import BackgroundHexagons from "./BackgroundHexagons";

const problems = [
  {
    icon: TrendingDown,
    tag: "AI Answer Engines",
    tagColor: "bg-destructive/10 text-destructive",
    title: "AI Answer Engine Dominance",
    description:
      "Traditional keywords no longer drive traffic as AI systems synthesize answers from multiple sources, bypassing your carefully optimized pages entirely. Your content feeds their answers — but your site never gets the click.",
    cta: "Learn More",
    visual: "traffic-drop",
  },
  {
    icon: MousePointerClick,
    tag: "Zero-Click Search",
    tagColor: "bg-amber-500/10 text-amber-600",
    title: "Zero-Click Search Growth",
    description:
      "Users get answers directly from AI interfaces without ever visiting your site. Your organic traffic is declining while your content fuels someone else's answers. The click-through era is ending.",
    cta: "Learn More",
    visual: "zero-click",
  },
  {
    icon: VolumeX,
    tag: "Brand Integrity",
    tagColor: "bg-geo-green/10 text-geo-green",
    title: "Loss of Brand Voice",
    description:
      "AI models often hallucinate or misrepresent your brand, products, and expertise. Without GEO, you have zero control over how AI presents you to millions of potential customers.",
    cta: "Learn More",
    visual: "hallucination",
  },
];

const TrafficDropVisual = () => (
  <div className="bg-card rounded-2xl border shadow-sm p-6 h-full">
    <div className="flex items-center justify-between mb-6">
      <span className="text-sm font-medium text-muted-foreground">Organic Traffic</span>
      <span className="text-xs text-destructive font-medium flex items-center gap-1">
        <ArrowDownRight className="w-3 h-3" /> -34.2%
      </span>
    </div>
    <div className="space-y-3">
      {[
        { label: "Jan", w: "92%", opacity: 0.9 },
        { label: "Feb", w: "85%", opacity: 0.8 },
        { label: "Mar", w: "72%", opacity: 0.7 },
        { label: "Apr", w: "60%", opacity: 0.6 },
        { label: "May", w: "48%", opacity: 0.5 },
        { label: "Jun", w: "38%", opacity: 0.4 },
      ].map((bar) => (
        <div key={bar.label} className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground w-8">{bar.label}</span>
          <div className="flex-1 h-6 bg-secondary/60 rounded-md overflow-hidden">
            <motion.div
              className="h-full bg-destructive/70 rounded-md"
              initial={{ width: 0 }}
              whileInView={{ width: bar.w }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ opacity: bar.opacity }}
            />
          </div>
        </div>
      ))}
    </div>
    <div className="mt-4 pt-4 border-t flex items-baseline gap-2">
      <span className="text-2xl font-semibold text-foreground tabular-nums">12,847</span>
      <span className="text-xs text-muted-foreground">visits lost this month</span>
    </div>
  </div>
);

const ZeroClickVisual = () => (
  <div className="bg-card rounded-2xl border shadow-sm p-6 h-full">
    <div className="flex items-center gap-2 mb-5">
      <Search className="w-4 h-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">Search Result Preview</span>
    </div>
    <div className="rounded-xl border bg-secondary/30 p-4 mb-4">
      <div className="text-xs text-muted-foreground mb-2">AI-Generated Answer</div>
      <div className="space-y-2">
        <div className="h-2.5 bg-foreground/10 rounded-full w-full" />
        <div className="h-2.5 bg-foreground/10 rounded-full w-11/12" />
        <div className="h-2.5 bg-foreground/10 rounded-full w-9/12" />
      </div>
      <div className="mt-3 text-[11px] text-muted-foreground/60">Sources: competitor-a.com, competitor-b.com</div>
    </div>
    <div className="rounded-xl border border-dashed border-destructive/30 bg-destructive/[0.03] p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-destructive/50" />
        <span className="text-xs font-medium text-destructive/70">Your Website — Not Cited</span>
      </div>
      <div className="text-xs text-muted-foreground">User never clicks through. Answer provided above.</div>
    </div>
    <div className="mt-4 pt-4 border-t">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Click-through rate</span>
        <span className="text-sm font-semibold text-destructive tabular-nums">0.0%</span>
      </div>
    </div>
  </div>
);

const HallucinationVisual = () => (
  <div className="bg-card rounded-2xl border shadow-sm p-6 h-full">
    <div className="flex items-center gap-2 mb-5">
      <AlertTriangle className="w-4 h-4 text-amber-500" />
      <span className="text-sm text-muted-foreground">AI Brand Mentions Audit</span>
    </div>
    <div className="space-y-3">
      {[
        { engine: "ChatGPT", status: "Inaccurate", color: "text-destructive", bg: "bg-destructive/10" },
        { engine: "Perplexity", status: "Not Mentioned", color: "text-amber-600", bg: "bg-amber-500/10" },
        { engine: "Gemini", status: "Hallucinated", color: "text-destructive", bg: "bg-destructive/10" },
        { engine: "Claude", status: "Partially Correct", color: "text-amber-600", bg: "bg-amber-500/10" },
      ].map((row) => (
        <div key={row.engine} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
          <span className="text-sm font-medium text-foreground">{row.engine}</span>
          <span className={`text-xs font-medium px-2 py-1 rounded-md ${row.bg} ${row.color}`}>{row.status}</span>
        </div>
      ))}
    </div>
    <div className="mt-4 pt-4 border-t">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Brand accuracy score</span>
        <span className="text-sm font-semibold text-destructive tabular-nums">23%</span>
      </div>
    </div>
  </div>
);

const visuals: Record<string, React.FC> = {
  "traffic-drop": TrafficDropVisual,
  "zero-click": ZeroClickVisual,
  hallucination: HallucinationVisual,
};

const ProblemStatementSection = () => {
  return (
    <section className="section-padding bg-secondary/40 relative overflow-hidden">
      <BackgroundHexagons className="w-[600px] h-[600px] -left-32 -top-20 opacity-20" />

      <div className="section-container relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="section-title"
          >
            Standard SEO is Failing You
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="section-subtitle mx-auto mt-4"
          >
            The shift to LLM-driven search requires a new paradigm of discovery.
          </motion.p>
        </div>

        <div className="flex flex-col gap-12">
          {problems.map((problem, i) => {
            const Visual = visuals[problem.visual];
            const isReversed = i % 2 !== 0;

            return (
              <motion.div
                key={problem.title}
                initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`grid md:grid-cols-2 gap-8 items-center ${isReversed ? "md:direction-rtl" : ""}`}
                style={isReversed ? { direction: "rtl" } : undefined}
              >
                {/* Text side */}
                <div className="flex flex-col justify-center" style={isReversed ? { direction: "ltr" } : undefined}>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full w-fit mb-5 ${problem.tagColor}`}>
                    <problem.icon className="w-3.5 h-3.5" />
                    {problem.tag}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-3 tracking-tight" style={{ textWrap: "balance" } as React.CSSProperties}>
                    {problem.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg">{problem.description}</p>
                  <button className="text-sm font-medium text-foreground underline underline-offset-4 decoration-foreground/30 hover:decoration-foreground transition-colors w-fit active:scale-[0.97]">
                    {problem.cta} →
                  </button>
                </div>

                {/* Visual side */}
                <div style={isReversed ? { direction: "ltr" } : undefined}>
                  <Visual />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProblemStatementSection;
