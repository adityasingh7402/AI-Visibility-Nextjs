"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const logos = [
  "TechCrunch", "Forbes", "Wired", "VentureBeat", "ProductHunt",
  "SearchEngine Journal", "Moz", "Ahrefs", "Semrush", "HubSpot",
];

const LogoSliderSection = () => {
  return (
    <section className="py-16 border-b border-t bg-background relative overflow-hidden">
      <div className="section-container mb-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-sm text-muted-foreground uppercase tracking-widest font-medium"
        >
          Trusted by leading teams worldwide
        </motion.p>
      </div>

      {/* Infinite scroll track */}
      <div className="relative">
        <div className="flex animate-[scroll_30s_linear_infinite] w-max">
          {[...logos, ...logos].map((logo, i) => (
            <div
              key={`${logo}-${i}`}
              className="flex items-center justify-center px-10 shrink-0"
            >
              <span className="text-lg font-semibold text-foreground/15 whitespace-nowrap tracking-tight">
                {logo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoSliderSection;
