"use client";
import { motion } from "framer-motion";
import { Brain, Network, BarChart3, ShieldAlert, Globe } from "lucide-react";
import { useMouseTilt } from "@/hooks/use-mouse-tilt";
import SectionWatermark from "./SectionWatermark";

const features = [
  { title: "Prompt Style Analysis", icon: Brain, text: "Reverse-engineer how LLMs interpret and respond to prompts about your industry. Understand query patterns to optimize your content structure.", isLarge: true, hasMockup: true },
  { title: "Citation Mapping", icon: Network, text: "Trace every source AI models cite when discussing your brand or competitors. Build authority in the sources that matter." },
  { title: "Rank Tracking", icon: BarChart3, text: "Monitor your brand's position across AI-generated answers in real-time with engine-specific breakdowns." },
  { title: "Hallucination Alerts", icon: ShieldAlert, text: "Get instant notifications when AI models misrepresent your brand, products, or key facts." },
  { title: "Multi-Engine Support", icon: Globe, text: "Track and optimize across ChatGPT, Perplexity, Gemini, Claude, and emerging AI search platforms." },
];

const TiltFeatureCard = ({ feature, i }: { feature: typeof features[0]; i: number }) => {
  const tilt = useMouseTilt(4);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className={feature.isLarge ? "md:col-span-2 md:row-span-2" : ""}
    >
      <div
        ref={tilt.ref}
        onMouseMove={tilt.handleMouseMove}
        onMouseLeave={tilt.handleMouseLeave}
        style={tilt.style}
        className="rounded-2xl border bg-card p-7 shadow-sm group hover:shadow-lg transition-shadow h-full"
      >
        <div className="w-10 h-10 rounded-xl bg-foreground/[0.05] flex items-center justify-center mb-4 group-hover:bg-foreground/[0.08] transition-colors">
          <feature.icon className="w-5 h-5 text-foreground/70" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{feature.text}</p>

        {feature.hasMockup && (
          <div className="mt-6 rounded-xl border bg-secondary/50 p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
              <span>Prompt Coverage</span>
              <span className="font-medium text-foreground">78%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-border overflow-hidden">
              <div className="h-full rounded-full bg-foreground/70 w-[78%]" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {[
                { label: "Informational", pct: 92 },
                { label: "Transactional", pct: 64 },
                { label: "Navigational", pct: 88 },
                { label: "Comparison", pct: 71 },
              ].map((item) => (
                <div key={item.label} className="text-xs">
                  <div className="flex justify-between text-muted-foreground mb-1">
                    <span>{item.label}</span><span>{item.pct}%</span>
                  </div>
                  <div className="h-1 rounded-full bg-border overflow-hidden">
                    <div className="h-full rounded-full bg-foreground/50" style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const FeaturesBentoGrid = () => {
  return (
    <section className="section-padding bg-secondary/40 relative overflow-hidden">
      <SectionWatermark shape="hexagon" className="w-[500px] h-[500px] -right-32 top-20" />

      <div className="section-container relative z-10">
        <div className="text-center mb-16">
          <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="section-title">
            Technical Capabilities
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }} className="section-subtitle mx-auto mt-4">
            Built for high-performance marketing teams.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {features.map((feature, i) => (
            <TiltFeatureCard key={feature.title} feature={feature} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesBentoGrid;
