"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { navlinks } from "@/constants/navlinks";
import { ArrowRight } from "lucide-react";

export const LandingNavbar = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.header
      initial={shouldReduceMotion ? false : { opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 w-full px-8 pt-6"
    >
      <div className="max-w-5xl mx-auto border border-neutral-900/20 rounded-xl bg-white/20 px-5 py-3 flex items-center justify-between"
        style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), 0 1px 3px rgba(0,0,0,0.06)" }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="font-schibsted font-bold text-[17px] tracking-tight text-neutral-900 select-none"
        >
          GEO
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6">
          {navlinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.url}
                href={link.url}
                className="flex items-center gap-1.5 text-[14px] font-schibsted font-light text-neutral-700 hover:text-neutral-900 transition-colors duration-150"
              >
                <Icon size={13} strokeWidth={1.8} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <Link
          href="/login"
          className="hidden md:flex items-center gap-1 font-schibsted text-[13px] font-semibold text-neutral-900 hover:gap-2 transition-all duration-150"
        >
          Get started
          <ArrowRight size={13} strokeWidth={2} />
        </Link>
      </div>
    </motion.header>
  );
};
