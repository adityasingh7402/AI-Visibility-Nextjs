"use client";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Phone, Mail } from "lucide-react";
import SectionWatermark from "./SectionWatermark";

const contactItems = [
  { icon: MapPin, title: "Find us", detail: "AI Search Optimization HQ" },
  { icon: Phone, title: "Call us", detail: "+1 (800) GEO-PLATFORM" },
  { icon: Mail, title: "Mail us", detail: "hello@geoplatform.io" },
];

const linkColumns = [
  {
    title: "Useful Links",
    links: ["Home", "Features", "How It Works", "Pricing", "Contact"],
  },
  {
    title: "Resources",
    links: ["Blog", "Case Studies", "Documentation", "API", "Support"],
  },
];

const FooterCTASection = () => {
  return (
    <footer className="relative overflow-hidden">
      <SectionWatermark shape="hexagon" className="w-[400px] h-[400px] -left-24 bottom-0" />

      {/* Top contact bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="bg-foreground/95 border-b border-primary-foreground/10"
      >
        <div className="section-container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {contactItems.map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-primary-foreground text-sm font-medium">{item.title}</p>
                  <p className="text-primary-foreground/50 text-xs">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Main footer */}
      <div className="bg-foreground">
        <div className="section-container py-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1fr_1.2fr] gap-12"
          >
            {/* Brand column */}
            <div>
              <h3 className="text-primary-foreground text-xl font-semibold tracking-tight mb-1">
                GEO <span className="font-serif-italic text-accent">Platform</span>
              </h3>
              <p className="text-primary-foreground/40 text-sm leading-relaxed mt-4 max-w-[260px]">
                Enterprise-grade Generative Engine Optimization. Analyze and optimize your brand visibility across ChatGPT, Perplexity, and Gemini.
              </p>
              <div className="flex gap-3 mt-6">
                {["X", "Li", "Gh"].map((label) => (
                  <a
                    key={label}
                    href="#"
                    className="w-8 h-8 rounded-full bg-primary-foreground/10 flex items-center justify-center text-primary-foreground/50 text-xs font-medium hover:bg-accent/20 hover:text-accent transition-colors"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {linkColumns.map((col) => (
              <div key={col.title}>
                <h4 className="text-primary-foreground text-sm font-semibold mb-5">{col.title}</h4>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-primary-foreground/40 text-sm hover:text-accent transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Subscribe column */}
            <div>
              <h4 className="text-primary-foreground text-sm font-semibold mb-5">Subscribe</h4>
              <p className="text-primary-foreground/40 text-sm leading-relaxed mb-4">
                Don&apos;t miss our latest insights on AI search optimization. Subscribe below.
              </p>
              <div className="flex items-center">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="h-10 flex-1 px-4 bg-primary-foreground/5 border border-primary-foreground/10 rounded-l-lg text-primary-foreground placeholder:text-primary-foreground/25 text-sm focus:outline-none focus:border-primary-foreground/20 transition-colors"
                />
                <button aria-label="Subscribe" className="h-10 w-10 bg-accent flex items-center justify-center rounded-r-lg hover:bg-accent/90 active:scale-95 transition-all">
                  <ArrowRight className="w-4 h-4 text-accent-foreground" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/10">
          <div className="section-container py-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/30 text-xs">
              © 2026 GEO Platform. All rights reserved.
            </p>
            <div className="flex gap-6">
              {["Home", "Terms", "Privacy", "Policy", "Contact"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-primary-foreground/30 text-xs hover:text-primary-foreground/60 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterCTASection;
