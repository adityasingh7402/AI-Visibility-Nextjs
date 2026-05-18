"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import NumberFlow from "@number-flow/react";
import { cn } from "@/lib/utils";
import { Heading } from "../ui/Heading";
import { Paragraph } from "../ui/Paragraph";

const PLANS = [
  {
    name: "Starter",
    monthlyPrice: 99,
    yearlyPrice: 79,
    description: "For teams just getting started with AI visibility.",
    features: [
      "5,000 prompt analyses / mo",
      "2 AI engines monitored",
      "Weekly citation reports",
      "Basic hallucination alerts",
      "Email support",
    ],
    featured: false,
  },
  {
    name: "Professional",
    monthlyPrice: 299,
    yearlyPrice: 239,
    description: "Advanced tools to own your AI search presence.",
    features: [
      "50,000 prompt analyses / mo",
      "All AI engines monitored",
      "Real-time citation alerts",
      "Hallucination detection",
      "API access",
      "Priority support",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    monthlyPrice: 599,
    yearlyPrice: 479,
    description: "Full-scale GEO with enterprise-grade controls.",
    features: [
      "Unlimited prompt analyses",
      "Custom engine integrations",
      "Dedicated GEO strategist",
      "SLA guarantee",
      "SSO & SAML",
      "Custom contracts",
    ],
    featured: false,
  },
];

const PricingSection = () => {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <section className="py-24 px-4 md:px-10 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Centered header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Heading
            as="h2"
            variant="sectionHeader"
            className="text-neutral-600 font-light"
          >
            Simple, transparent
          </Heading>
          <Heading
            as="h2"
            variant="sectionHeader"
            className="text-neutral-900 font-bold"
          >
            pricing.
          </Heading>
        </motion.div>

        {/* Billing toggle — centered below heading */}
        <motion.div
          className="flex justify-center mb-14"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="bg-neutral-100 p-1 rounded-full flex gap-1 font-schibsted">
            <button
              onClick={() => setBilling("monthly")}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-full transition-all",
                billing === "monthly"
                  ? "bg-white shadow-sm text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-900",
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={cn(
                "px-4 py-1.5 text-sm font-medium rounded-full transition-all",
                billing === "yearly"
                  ? "bg-white shadow-sm text-neutral-900"
                  : "text-neutral-500 hover:text-neutral-900",
              )}
            >
              Annual <span className="text-neutral-400">-20%</span>
            </button>
          </div>
        </motion.div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {PLANS.map((plan, idx) => {
            const price =
              billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={cn(
                  "relative rounded-2xl p-7 flex flex-col overflow-hidden",
                  plan.featured
                    ? "bg-neutral-950 text-white border-none shadow-2xl"
                    : "bg-neutral-100 border-2 border-dashed border-neutral-300",
                )}
              >
                {/* Featured gradient + badge */}
                {plan.featured && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-pink-500/10 to-transparent blur-3xl opacity-60 pointer-events-none" />
                    <div className="absolute font-schibsted top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider z-20">
                      Most Popular
                    </div>
                  </>
                )}

                <div className="relative z-10 flex-1 flex flex-col">
                  {/* Plan name */}
                  <span
                    className={cn(
                      "font-schibsted text-sm block mb-4 text-neutral-400",
                    )}
                  >
                    {plan.name}
                  </span>

                  {/* Price */}
                  <div className="mb-4 font-schibsted">
                    <span
                      className={cn(
                        "text-4xl font-bold",
                        plan.featured ? "text-white" : "text-neutral-900",
                      )}
                    >
                      $<NumberFlow value={price} />
                    </span>
                    <span
                      className={cn(
                        "text-sm ml-1",
                        plan.featured ? "text-neutral-500" : "text-neutral-400",
                      )}
                    >
                      /month
                    </span>
                  </div>

                  {/* Description */}
                  <Paragraph
                    variant="paragraphtext"
                    className={cn(
                      "font-medium leading-snug mb-6",
                      plan.featured ? "text-white" : "text-neutral-800",
                    )}
                  >
                    {plan.description}
                  </Paragraph>

                  {/* Features */}
                  <div className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-1.5 h-1.5 rounded-full shrink-0",
                            plan.featured ? "bg-white/40" : "bg-neutral-400",
                          )}
                        />
                        <span
                          className={cn(
                            "font-schibsted text-sm",
                            plan.featured
                              ? "text-neutral-300"
                              : "text-neutral-600",
                          )}
                        >
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <button
                    className={cn(
                      "font-schibsted w-full h-12 rounded-xl text-sm font-medium transition-all active:scale-[0.97] flex items-center justify-center gap-2 border mt-auto",
                      plan.featured
                        ? "bg-white text-neutral-900 border-transparent shadow-lg hover:bg-neutral-100"
                        : "text-neutral-600 border-neutral-300 hover:bg-white active:scale-95",
                    )}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      className={cn(
                        "stroke-current fill-none",
                        plan.featured
                          ? "stroke-neutral-900"
                          : "stroke-neutral-600",
                      )}
                      strokeWidth="2"
                    >
                      <path d="M3.32352 13.0113C3.6739 10.009 4.18586 7.75784 4.66063 6.15851C5.04994 4.84711 5.24459 4.19141 6.04283 3.5957C6.84107 3 7.65697 3 9.28876 3H14.7113C16.3431 3 17.159 3 17.9572 3.5957C18.7554 4.19141 18.9501 4.84711 19.3394 6.15851C19.8142 7.75784 20.3261 10.009 20.6765 13.0113C21.0895 16.5497 21.2959 18.3189 20.1027 19.6594C18.9095 21 16.9758 21 13.1084 21H10.8916C7.02422 21 5.09052 21 3.89731 19.6594C2.70411 18.3189 2.91058 16.5497 3.32352 13.0113Z" />
                      <path d="M9 7C9 8.65685 10.3431 10 12 10C13.6569 10 15 8.65685 15 7" />
                    </svg>
                    Subscribe
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-10"
        >
          <Paragraph
            variant="paragraphtext"
            className="text-neutral-400"
          >
            14-day free trial · No credit card required · Cancel anytime
          </Paragraph>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
