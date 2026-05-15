"use client";
import { motion } from "framer-motion";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20, filter: "blur(4px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
});

const StatsSection = () => {
  return (
    <section className="bg-white py-10">
      <div className="flex flex-col gap-20 max-w-5xl mx-auto px-4">

        {/* Hero stat */}
        <motion.div
          {...fadeUp(0)}
          className="flex flex-col md:flex-row items-baseline gap-4 border-b border-zinc-200 pb-10"
        >
          <span className="text-8xl lg:text-9xl font-medium tracking-tighter text-zinc-950 font-schibsted leading-none">
            2.4M+
          </span>
          <div className="max-w-xs">
            <h3 className="font-schibsted text-xl font-semibold tracking-tight text-zinc-950">
              Prompts Analyzed
            </h3>
            <p className="font-schibsted text-sm text-zinc-500 text-pretty mt-1">
              Tracked across ChatGPT, Perplexity, Gemini, Claude, and every
              major AI engine — in real time.
            </p>
          </div>
        </motion.div>

        {/* Secondary stats */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-10 sm:gap-5">
          {[
            { value: "847", label: "Enterprise Clients", detail: "In 42 countries" },
            { value: "96.3%", label: "Accuracy Rate", detail: "Citation detection" },
            { value: "3.2x", label: "Avg. Visibility Lift", detail: "Within 90 days" },
          ].map((stat, i) => (
            <motion.div key={stat.label} {...fadeUp(0.1 + i * 0.1)}>
              <p className="font-schibsted text-4xl md:text-5xl font-medium tracking-tighter text-zinc-950 mb-2">
                {stat.value}
              </p>
              <p className="font-schibsted text-xs font-semibold uppercase tracking-widest text-zinc-400">
                {stat.label}
              </p>
              <p className="font-schibsted text-xs text-zinc-400 mt-0.5">
                {stat.detail}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default StatsSection;
