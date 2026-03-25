"use client";
import { motion } from "framer-motion";
import { BarChart3, Settings, Lightbulb } from "lucide-react";
import SectionWatermark from "./SectionWatermark";

const rows = [
  {
    icon: BarChart3,
    geo: { title: "AI Citation Tracking", desc: "Monitor how LLMs like ChatGPT and Perplexity reference your brand in real-time with semantic analysis." },
    seo: { title: "Keyword Rank Tracking", desc: "Track traditional keyword positions on Google SERPs with periodic rank monitoring updates." },
  },
  {
    icon: Settings,
    geo: { title: "Prompt Pattern Optimization", desc: "Analyze and optimize for the prompts users actually ask AI engines, capturing intent-driven visibility." },
    seo: { title: "On-Page Meta Optimization", desc: "Optimize title tags, meta descriptions, and header structures for traditional crawler indexing." },
  },
  {
    icon: Lightbulb,
    geo: { title: "Hallucination Detection", desc: "Identify when AI models misrepresent your brand or generate inaccurate information about your products." },
    seo: { title: "Backlink Monitoring", desc: "Track inbound links and domain authority metrics to measure off-page search ranking signals." },
  },
];

const ComparisonTableSection = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      <SectionWatermark shape="wave" className="w-[600px] h-[600px] -left-40 top-10" />

      <div className="section-container relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="section-title"
          >
            How We Compare
          </motion.h2>
        </div>

        {/* Header row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto"
        >
          <div className="grid grid-cols-[1fr_auto_1fr] items-center mb-8">
            <div className="bg-accent text-accent-foreground rounded-lg py-3 px-6 text-center">
              <h3 className="text-lg font-semibold tracking-tight">GEO Platform</h3>
            </div>
            <div className="px-6">
              <span className="text-sm font-medium text-muted-foreground bg-secondary rounded-full px-4 py-2">Vs</span>
            </div>
            <div className="bg-foreground text-primary-foreground rounded-lg py-3 px-6 text-center">
              <h3 className="text-lg font-semibold tracking-tight">Traditional SEO</h3>
            </div>
          </div>

          {/* Comparison rows */}
          <div className="flex flex-col gap-4">
            {rows.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-[1fr_auto_1fr] items-stretch"
              >
                {/* GEO side */}
                <div className="bg-[hsl(var(--geo-green-light))] rounded-lg p-5 border border-[hsl(var(--geo-green)/0.15)]">
                  <h4 className="font-semibold text-sm text-foreground mb-1.5">{row.geo.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{row.geo.desc}</p>
                </div>

                {/* Center icon */}
                <div className="flex items-center justify-center px-4">
                  <div className="w-11 h-11 rounded-full bg-secondary border flex items-center justify-center">
                    <row.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>

                {/* SEO side */}
                <div className="bg-secondary/70 rounded-lg p-5 border">
                  <h4 className="font-semibold text-sm text-foreground mb-1.5">{row.seo.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{row.seo.desc}</p>
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
