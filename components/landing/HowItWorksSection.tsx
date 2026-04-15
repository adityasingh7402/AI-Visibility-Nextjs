"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useMouseTilt } from "@/hooks/use-mouse-tilt";
import BackgroundHexagons from "./BackgroundHexagons";

const steps = [
  { number: 1, title: "Analyze", description: "Crawl LLM knowledge graphs to map how AI models currently understand your brand, products, and competitive landscape." },
  { number: 2, title: "Diagnose", description: "Identify visibility gaps, citation deficiencies, and hallucination risks across every major generative search engine." },
  { number: 3, title: "Fix", description: "Deploy semantic structural changes to your content that directly influence how AI models reference and recommend your brand." },
];

const StepCard = ({ step, delay }: { step: typeof steps[0]; delay: number }) => {
  const { ref, style, handleMouseMove, handleMouseLeave } = useMouseTilt(6);

  return (
    <motion.div
      ref={ref}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className="relative cursor-default"
    >
      <div className="absolute -top-6 -left-3 text-[110px] font-bold leading-none text-foreground/[0.04] select-none pointer-events-none">
        {step.number}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1.5 relative z-10">{step.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed relative z-10 max-w-[260px]">{step.description}</p>
    </motion.div>
  );
};

const HowItWorksSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const pathLength = useTransform(scrollYProgress, [0.1, 0.55], [0, 1]);

  return (
    <section ref={sectionRef} className="section-padding relative overflow-hidden">
      <BackgroundHexagons className="w-[600px] h-[600px] -right-40 -bottom-20 opacity-20" />

      <div className="section-container relative z-10">
        {/* Header */}
        <div className="grid md:grid-cols-2 gap-12 mb-24">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs font-semibold tracking-[0.2em] uppercase text-accent mb-4"
            >
              Our Process
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="section-title"
            >
              A systematic approach
              <br />and proven process
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="section-subtitle mt-4"
            >
              Winning the generative search era requires precision, not guesswork.
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="mt-6 px-6 py-3 rounded-full bg-accent text-accent-foreground text-sm font-medium"
            >
              Get Started
            </motion.button>
          </div>
        </div>

        {/* Timeline area */}
        <div className="relative h-[380px]">
          {/* SVG with curve and dots */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 1000 340"
            preserveAspectRatio="xMidYMid meet"
            fill="none"
          >
            {/* The curved line */}
            <motion.path
              d="M 50 290 C 150 290, 200 180, 350 180 C 500 180, 500 100, 650 100 C 800 100, 800 30, 950 30"
              stroke="hsl(var(--accent))"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              style={{ pathLength }}
            />

            {/* Dot 1 - start of curve */}
            <motion.circle
              cx="100"
              cy="280"
              r="7"
              fill="hsl(var(--background))"
              stroke="hsl(var(--muted-foreground) / 0.35)"
              strokeWidth="3"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            />

            {/* Dot 2 - middle of curve */}
            <motion.circle
              cx="500"
              cy="140"
              r="7"
              fill="hsl(var(--background))"
              stroke="hsl(var(--muted-foreground) / 0.35)"
              strokeWidth="3"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 }}
            />

            {/* Dot 3 - end of curve */}
            <motion.circle
              cx="900"
              cy="35"
              r="7"
              fill="hsl(var(--background))"
              stroke="hsl(var(--accent))"
              strokeWidth="3"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.6 }}
            />

            {/* Arrowhead at end */}
            <motion.path
              d="M 940 25 L 955 33 L 940 41"
              stroke="hsl(var(--accent))"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.7 }}
            />
          </svg>

          {/* Step cards positioned to align with dots */}
          <div className="absolute left-[5%] top-[82%]">
            <StepCard step={steps[0]} delay={0.15} />
          </div>

          <div className="absolute left-[38%] top-[45%]">
            <StepCard step={steps[1]} delay={0.3} />
          </div>

          <div className="absolute right-0 top-[12%]">
            <StepCard step={steps[2]} delay={0.45} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
