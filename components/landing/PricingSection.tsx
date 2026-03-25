"use client";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useState } from "react";
import SectionWatermark from "./SectionWatermark";

const tiers = [
  {
    name: "Starter",
    description: "Unleash the power of GEO analytics.",
    monthlyPrice: 99,
    yearlyPrice: 79,
    features: ["5,000 Prompt Analysis", "2 Search Engines", "Weekly Reports"],
    ctaText: "Choose Plan",
  },
  {
    name: "Professional",
    description: "Advanced tools to take your visibility to the next level.",
    monthlyPrice: 299,
    yearlyPrice: 239,
    features: ["50,000 Prompt Analysis", "All Search Engines", "Real-time Alerts", "API Access"],
    ctaText: "Choose Plan",
  },
];

const popularTier = {
  name: "Enterprise",
  description: "Full-scale GEO with enterprise-grade features.",
  monthlyPrice: 599,
  yearlyPrice: 479,
  features: ["Unlimited Analysis", "Custom Integrations", "Dedicated Strategist", "SLA Guarantee", "SSO & SAML"],
  ctaText: "Choose Plan",
};

const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-background to-accent/10 pointer-events-none" />
      <SectionWatermark shape="circle" className="w-[600px] h-[600px] -right-40 -bottom-32" />

      <div className="section-container relative z-10">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-6">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="section-title"
            >
              Plans & Pricing
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="section-subtitle mt-3"
            >
              Whether your GEO optimization needs are large or small,<br className="hidden md:block" />
              we're here to help you scale.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center rounded-full bg-card border p-1 self-start md:self-auto"
          >
            <button
              onClick={() => setIsYearly(false)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                !isYearly ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                isYearly ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Yearly
            </button>
          </motion.div>
        </div>

        {/* Cards container — shared frosted panel with popular card alongside */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-0 max-w-5xl mx-auto items-stretch"
        >
          {/* Shared card for Starter + Professional */}
          <div className="md:col-span-2 rounded-2xl md:rounded-r-none border border-border/60 bg-card/60 backdrop-blur-md grid grid-cols-1 sm:grid-cols-2">
            {tiers.map((tier, i) => {
              const price = isYearly ? tier.yearlyPrice : tier.monthlyPrice;
              return (
                <div
                  key={tier.name}
                  className={`p-8 flex flex-col ${
                    i === 0 ? "sm:border-r border-border/40" : ""
                  }`}
                >
                  <div className="mb-4">
                    <span className="text-4xl font-bold tracking-tight text-foreground">
                      ${price}
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">/month</span>
                  </div>

                  <h3 className="text-lg font-semibold text-foreground mb-1">{tier.name}</h3>
                  <p className="text-sm text-muted-foreground mb-6">{tier.description}</p>

                  <ul className="space-y-3 mb-8 flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-accent/10">
                          <Check className="w-3 h-3 text-accent" />
                        </div>
                        <span className="text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button className="w-full py-3 rounded-xl text-sm font-medium transition-all active:scale-[0.97] bg-gradient-to-r from-foreground to-foreground/90 text-primary-foreground hover:opacity-90">
                    {tier.ctaText}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Popular / Enterprise card — dark, taller */}
          <div className="relative rounded-2xl md:rounded-l-none border border-accent/20 bg-foreground text-primary-foreground p-8 flex flex-col min-w-[280px]">
            {/* Badge */}
            <div className="absolute -top-3 right-6">
              <span className="inline-block rounded-full bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
                Most Popular
              </span>
            </div>

            <div className="mb-4">
              <span className="text-4xl font-bold tracking-tight text-accent">
                ${isYearly ? popularTier.yearlyPrice : popularTier.monthlyPrice}
              </span>
              <span className="text-sm text-primary-foreground/50 ml-1">/month</span>
            </div>

            <h3 className="text-lg font-semibold mb-1">{popularTier.name}</h3>
            <p className="text-sm text-primary-foreground/50 mb-6">{popularTier.description}</p>

            <ul className="space-y-3 mb-8 flex-1">
              {popularTier.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-accent/20">
                    <Check className="w-3 h-3 text-accent" />
                  </div>
                  <span className="text-primary-foreground/70">{f}</span>
                </li>
              ))}
            </ul>

            <button className="w-full py-3 rounded-xl text-sm font-medium transition-all active:scale-[0.97] bg-gradient-to-r from-accent to-accent/80 text-accent-foreground hover:opacity-90 shadow-lg shadow-accent/20">
              {popularTier.ctaText}
            </button>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-sm text-muted-foreground mt-10"
        >
          14-day free trial · No credit card required · Cancel anytime
        </motion.p>
      </div>
    </section>
  );
};

export default PricingSection;
