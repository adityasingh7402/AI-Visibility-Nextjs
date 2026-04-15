"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star } from "lucide-react";
import { useRef } from "react";
import { useMouseTilt } from "@/hooks/use-mouse-tilt";

const DashboardPreview = () => {
  const { ref: tiltRef, style: tiltStyle, handleMouseMove, handleMouseLeave } = useMouseTilt(6);
  const barData = [
    { v: 35, hClass: 'h-[35%]' },
    { v: 42, hClass: 'h-[42%]' },
    { v: 38, hClass: 'h-[38%]' },
    { v: 55, hClass: 'h-[55%]' },
    { v: 62, hClass: 'h-[62%]' },
    { v: 70, hClass: 'h-[70%]' },
    { v: 68, hClass: 'h-[68%]' },
    { v: 78, hClass: 'h-[78%]' },
    { v: 84, hClass: 'h-[84%]' },
    { v: 80, hClass: 'h-[80%]' },
    { v: 88, hClass: 'h-[88%]' },
    { v: 92, hClass: 'h-[92%]' },
  ];

  return (
    <div
      ref={tiltRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={tiltStyle}
      className="rounded-2xl border bg-card shadow-xl shadow-foreground/5 overflow-hidden"
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b bg-secondary/50">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-destructive/60" />
          <div className="w-3 h-3 rounded-full bg-amber-400/60" />
          <div className="w-3 h-3 rounded-full bg-geo-green/60" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="text-xs text-muted-foreground bg-secondary rounded-md px-3 py-1">geo-platform.app/dashboard</div>
        </div>
      </div>
      <div className="p-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-5 flex flex-col items-center justify-center gap-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">GEO Score</span>
          <div className="relative w-20 h-20">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(var(--geo-green))" strokeWidth="3" strokeDasharray={`${84 * 0.975} 100`} strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-2xl font-semibold text-foreground">84</span>
          </div>
          <span className="text-xs text-geo-green font-medium">+6 this week</span>
        </div>
        <div className="rounded-xl border bg-card p-5 col-span-1">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Visibility (30d)</span>
          <div className="flex items-end gap-1.5 mt-3 h-20">
            {barData.map((item, i) => (
              <div key={i} className={`flex-1 rounded-sm bg-foreground/10 ${item.hClass}`}>
                <div className={`w-full rounded-sm bg-foreground/80 transition-all ${item.hClass}`} />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border bg-card p-5 flex flex-col gap-3">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Quick Stats</span>
          <div className="space-y-3">
            {[
              { label: "Brand Citations", value: "+12%" },
              { label: "Sentiment Ratio", value: "0.82" },
              { label: "Prompt Mentions", value: "2,847" },
            ].map((stat) => (
              <div key={stat.label} className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{stat.label}</span>
                <span className="text-sm font-semibold text-foreground">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const HeroSection = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const videoY = useTransform(scrollYProgress, [0, 1], [0, 150]);

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden">

      <motion.div className="absolute inset-0 z-0" style={{ y: videoY }}>
        <video autoPlay loop muted playsInline className="w-full h-full object-cover [transform:scaleY(-1)]">
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260302_085640_276ea93b-d7da-4418-a09b-2aa5b490e838.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[26.416%] from-[rgba(255,255,255,0)] to-[66.943%] to-background" />
      </motion.div>

      <div className="relative z-10 section-container pt-[290px] pb-24 flex flex-col gap-8">
        <motion.h1
          initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-[80px] font-medium tracking-[-0.04em] leading-[0.95] text-foreground"
        >
          Simple <span className="font-serif-italic text-6xl md:text-[100px]">management</span>
          <br />for your remote team
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg text-muted-foreground/80 max-w-[554px]"
        >
          Standard SEO is dead. Analyze and optimize your visibility across ChatGPT, Perplexity, and Gemini with our enterprise-grade GEO toolkit.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-4 max-w-md"
        >
          <div className="flex items-center gap-2 bg-surface-elevated rounded-[40px] border shadow-[0px_10px_40px_5px_rgba(194,194,194,0.25)] p-1.5 pl-5">
            <input type="email" placeholder="Enter your work email" className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
            <button className="bg-foreground text-primary-foreground rounded-full px-5 py-2.5 text-sm font-medium shadow-[inset_-4px_-6px_25px_0px_rgba(201,201,201,0.08),inset_4px_4px_10px_0px_rgba(29,29,29,0.24)] active:scale-[0.97] transition-transform">
              Create Free Account
            </button>
          </div>
          <div className="flex items-center gap-3 pl-2">
            <div className="flex -space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">1,020+ Reviews</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8"
        >
          <DashboardPreview />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
