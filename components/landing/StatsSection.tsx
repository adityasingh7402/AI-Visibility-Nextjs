"use client";
import { motion } from "framer-motion";
import { Paragraph } from "../ui/Paragraph";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20, filter: "blur(4px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
});

const StatsSection = () => {
  return (
    <section className="py-10">
      <div className="flex flex-col gap-20 max-w-5xl mx-auto px-4">
        {/* Hero stat */}
        <motion.div
          {...fadeUp(0)}
          className="flex flex-col md:flex-row items-baseline gap-4 border-b border-zinc-200 pb-10"
        >
          <span className="text-6xl lg:text-8xl font-medium tracking-tighter text-neutral-100 font-schibsted leading-none">
            2.4M+
          </span>
          <div className="max-w-xs">
            <Paragraph
              as="h3"
              variant="paragraphHeading"
              className="text-neutral-200 uppercase tracking-widest font-schibsted"
            >
              Prompts Analyzed
            </Paragraph>
            <Paragraph
              as="p"
              variant="paragraphtext"
              className="text-neutral-300 mt-2"
            >
              Tracked across ChatGPT, Perplexity, Gemini, Claude, and every
              major AI engine — in real time.
            </Paragraph>
          </div>
        </motion.div>

        {/* Secondary stats */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-10 sm:gap-5">
          {[
            {
              value: "847",
              label: "Enterprise Clients",
              detail: "In 42 countries",
            },
            {
              value: "96.3%",
              label: "Accuracy Rate",
              detail: "Citation detection",
            },
            {
              value: "3.2x",
              label: "Avg. Visibility Lift",
              detail: "Within 90 days",
            },
          ].map((stat, i) => (
            <motion.div key={stat.label} {...fadeUp(0.1 + i * 0.1)}>
              <Paragraph
                as="p"
                variant="paragraphHeading"
                className="text-4xl font-semibold text-neutral-100 tracking-tighter"
              >
                {stat.value}
              </Paragraph>
              <Paragraph
                as="p"
                className="font-schibsted text-xs font-semibold uppercase tracking-widest text-neutral-400"
              >
                {stat.label}
              </Paragraph>
              <p className="font-schibsted text-[14px] text-neutral-400/90 mt-0.5">
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
