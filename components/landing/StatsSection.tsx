"use client";
import { motion } from "framer-motion";
import SectionWatermark from "./SectionWatermark";

const stats = [
  { value: "2.4M+", label: "Prompts Analyzed", detail: "Across all AI engines" },
  { value: "847", label: "Enterprise Clients", detail: "In 42 countries" },
  { value: "96.3%", label: "Accuracy Rate", detail: "Citation detection" },
  { value: "3.2x", label: "Avg. Visibility Lift", detail: "Within 90 days" },
];

const StatsSection = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      <SectionWatermark shape="cross" className="w-[500px] h-[500px] -right-32 top-1/2 -translate-y-1/2" />

      <div className="section-container relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-foreground mb-1">{stat.label}</div>
              <div className="text-xs text-muted-foreground">{stat.detail}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
