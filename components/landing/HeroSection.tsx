"use client";
import { motion, useReducedMotion } from "motion/react";
import { Heading } from "../ui/Heading";
import { Subheading } from "../ui/Subheading";
import { Container } from "../ui/Container";
import { HeroDashboard } from "./HeroDashboard";
import { LandingNavbar } from "./LandingNavbar";
import { IconCalendarEvent, IconArrowRight } from "@tabler/icons-react";
import { CTAButton } from "../ui/CTAButton";

const HeroSection = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    // Outer wrapper: white background — chart section of card sits on this
    <div className="relative bg-white flex flex-col min-h-screen">
      {/* Gradient section — ends at stat/chart boundary of the card */}
      <section
        // className="relative overflow-hidden bg-gradient-to-b from-[#A8D3FF] to-[#FFF4DF] flex flex-col items-center justify-start pt-0 px-4 text-center"

        className="relative overflow-hidden bg-gradient-to-b from-sky-400 via-blue-600 to-blue-800 flex flex-col items-center justify-start pt-0 px-4 text-center"
        style={{ height: "calc(100vh - 130px)" }}
      >
        {/* SVG noise filter definition */}
        <svg className="absolute w-0 h-0" aria-hidden="true">
          <filter id="heroGrain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </svg>

        {/* Grain overlay — mirrors body::before from the reference */}
        <div
          className="absolute inset-0 pointer-events-none z-0 bg-neutral-500 opacity-80"
          style={{ filter: "url(#heroGrain)" }}
        />
        <LandingNavbar />

        <Container className="relative z-10 mx-auto mt-12">
          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, y: 16, filter: "blur(4px)" }
            }
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0, ease: [0.16, 1, 0.3, 1] }}
          >
            <Heading className="max-w-5xl mx-auto">
              <span className="font-extralight tracking-tighter text-neutral-300">
                Simple management for your{" "}
              </span>
              <br />
              <span className="font-medium tracking-widest text-neutral-300/80">
                remote team
              </span>
            </Heading>
          </motion.div>

          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, y: 16, filter: "blur(4px)" }
            }
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-3xl mx-auto"
          >
            <Subheading
              variant="small"
              className="text-neutral-300/80 tracking-tight mx-auto"
            >
              Standard SEO is dead. Analyze and optimize your visibility across
              ChatGPT, Perplexity, and Gemini with our enterprise-grade GEO
              toolkit.
            </Subheading>
          </motion.div>

          <motion.div
            initial={
              shouldReduceMotion
                ? false
                : { opacity: 0, y: 16, filter: "blur(4px)" }
            }
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
          >
            <CTAButton
              loggedInHref="/dashboard"
              loggedOutHref="/signup"
              icon={IconCalendarEvent}
              className="font-schibsted rounded-md w-full sm:w-auto justify-center"
            >
              Request a demo
            </CTAButton>
            <CTAButton
              loggedInHref="/dashboard/analysis"
              loggedOutHref="/login"
              icon={IconArrowRight}
              className="font-schibsted rounded-md w-full sm:w-auto justify-center"
            >
              Explore the platform
            </CTAButton>
          </motion.div>
        </Container>
      </section>

      {/* Card — relative to flow naturally but pulled up to overlap */}
      <div className="relative w-[95%] md:w-[88%] max-w-5xl mx-auto -mt-40 z-20 mb-12">
        <HeroDashboard />
      </div>
    </div>
  );
};

export default HeroSection;
