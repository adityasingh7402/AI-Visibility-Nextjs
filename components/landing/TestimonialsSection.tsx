"use client";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import BackgroundHexagons from "./BackgroundHexagons";

import sarahImg from "@/assets/testimonial-sarah.jpg";
import jamesImg from "@/assets/testimonial-james.jpg";
import anikaImg from "@/assets/testimonial-anika.jpg";
import marcusImg from "@/assets/testimonial-marcus.jpg";
import victoriaImg from "@/assets/testimonial-victoria.jpg";
import hindleyImg from "@/assets/testimonial-hindley.jpg";

const Stars = ({ count = 5 }: { count?: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: count }).map((_, i) => (
      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
    ))}
  </div>
);

const testimonials = [
  {
    quote: "Within 60 days of using the GEO platform, our brand citations in ChatGPT increased by 340%. This isn't incremental — it's a paradigm shift.",
    name: "Sarah Mendez",
    title: "VP of Growth, DataStream",
    image: sarahImg,
    stars: 5,
    variant: "with-avatar-top" as const,
  },
  {
    quote: "I really appreciate the platform!",
    longQuote: "The prompt analysis feature revealed query patterns we'd never considered. Our content strategy completely transformed.",
    name: "Hindley Earnshaw",
    title: "@Hindley.GEO",
    image: hindleyImg,
    stars: 5,
    variant: "centered-stars" as const,
  },
  {
    quote: "We were invisible to Perplexity users. Now we're the top recommended solution in our category. The hallucination alerts alone saved us from a PR crisis.",
    name: "James Okafor",
    title: "Head of SEO, Luminance Health",
    image: jamesImg,
    stars: 0,
    variant: "signature" as const,
  },
  {
    quote: "Good Job!",
    longQuote: "The real-time alerts and citation tracking gave us complete visibility into how AI models perceive our brand. Invaluable tool.",
    name: "Victoria Weston",
    title: "CEO, NexGen Analytics",
    image: victoriaImg,
    stars: 5,
    variant: "with-avatar-top" as const,
  },
  {
    quote: "Traditional SEO tools gave us vanity metrics. GEO Platform shows us exactly how AI models perceive our brand — and how to fix it.",
    name: "Anika Patel",
    title: "CMO, CloudForge",
    image: anikaImg,
    stars: 0,
    variant: "quote-block" as const,
  },
  {
    quote: "I was very impressed!",
    longQuote: "The multi-engine support across ChatGPT, Perplexity, and Gemini means we have a single source of truth for our AI visibility. Game changer.",
    name: "Marcus Chen",
    title: "Co-Founder, Apex Consulting",
    image: marcusImg,
    stars: 5,
    variant: "wide" as const,
  },
];

const ease = [0.16, 1, 0.3, 1] as const;

const TestimonialCard = ({
  t,
  index,
}: {
  t: (typeof testimonials)[number];
  index: number;
}) => {
  const delay = 0.08 * index;

  if (t.variant === "centered-stars") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay, ease }}
        className="bg-card rounded-2xl border p-6 shadow-sm hover:shadow-md transition-shadow"
      >
        <Stars count={t.stars} />
        <h3 className="text-lg font-bold text-foreground mt-3 mb-2">{t.quote}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{t.longQuote}</p>
        <div className="flex items-center gap-3">
          <Image src={t.image as StaticImageData} alt={t.name} width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
          <div>
            <div className="text-sm font-semibold text-foreground">{t.name}</div>
            <div className="text-xs text-muted-foreground">{t.title}</div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (t.variant === "with-avatar-top") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay, ease }}
        className="bg-card rounded-2xl border p-6 shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="flex items-center gap-3 mb-4">
          <Image src={t.image as StaticImageData} alt={t.name} width={48} height={48} className="w-12 h-12 rounded-full object-cover" />
          <div>
            <div className="text-sm font-semibold text-foreground">{t.name}</div>
            <div className="text-xs text-muted-foreground">{t.title}</div>
          </div>
        </div>
        {t.stars > 0 && <Stars count={t.stars} />}
        {t.longQuote ? (
          <>
            <h3 className="text-base font-bold text-foreground mt-2 mb-1">{t.quote}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{t.longQuote}</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground leading-relaxed mt-2">{t.quote}</p>
        )}
      </motion.div>
    );
  }

  if (t.variant === "signature") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay, ease }}
        className="bg-card rounded-2xl border p-6 shadow-sm hover:shadow-md transition-shadow"
      >
        <p className="text-sm text-muted-foreground leading-relaxed mb-5">{t.quote}</p>
        <div className="flex items-center gap-3">
          <Image src={t.image as StaticImageData} alt={t.name} width={56} height={56} className="w-14 h-14 rounded-full object-cover" />
          <div>
            <div className="font-serif-italic text-xl text-foreground">{t.name}</div>
            <div className="text-xs text-muted-foreground">{t.title}</div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (t.variant === "quote-block") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay, ease }}
        className="bg-card rounded-2xl border p-6 shadow-sm hover:shadow-md transition-shadow"
      >
        <Quote className="w-6 h-6 text-foreground/10 mb-3" />
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 font-medium">
          &ldquo;{t.quote}&rdquo;
        </p>
        <div className="flex items-center gap-3">
          <Image src={t.image as StaticImageData} alt={t.name} width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
          <div>
            <div className="text-sm font-semibold text-foreground">{t.name}</div>
            <div className="text-xs text-geo-green">{t.title}</div>
          </div>
        </div>
      </motion.div>
    );
  }

  // wide variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease }}
      className="bg-card rounded-2xl border p-6 shadow-sm hover:shadow-md transition-shadow col-span-1 md:col-span-2"
    >
      <h3 className="text-lg font-bold text-foreground mb-2">{t.quote}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{t.longQuote}</p>
      <div className="flex items-center gap-3">
        <Image src={t.image as StaticImageData} alt={t.name} width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
        <div>
          <div className="text-sm font-semibold text-foreground">{t.name}</div>
          <div className="text-xs text-muted-foreground">{t.title}</div>
        </div>
        {t.stars > 0 && (
          <div className="ml-auto">
            <Stars count={t.stars} />
          </div>
        )}
      </div>
    </motion.div>
  );
};

const TestimonialsSection = () => {
  return (
    <section className="section-padding bg-secondary/40 relative overflow-hidden">
      <BackgroundHexagons className="w-[600px] h-[600px] -left-40 top-1/2 -translate-y-1/2 opacity-20" />

      {/* Large decorative quotes */}
      <div className="absolute top-20 left-[8%] text-foreground/[0.04] pointer-events-none">
        <Quote className="w-24 h-24" />
      </div>
      <div className="absolute bottom-32 right-[12%] text-foreground/[0.04] pointer-events-none rotate-180">
        <Quote className="w-20 h-20" />
      </div>

      <div className="section-container relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="section-title"
          >
            What Our Clients Say
          </motion.h2>
        </div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {/* Column 1 */}
          <div className="flex flex-col gap-5">
            <TestimonialCard t={testimonials[0]} index={0} />
            <TestimonialCard t={testimonials[4]} index={4} />
          </div>
          {/* Column 2 */}
          <div className="flex flex-col gap-5 md:mt-10">
            <TestimonialCard t={testimonials[1]} index={1} />
            <TestimonialCard t={testimonials[2]} index={2} />
          </div>
          {/* Column 3 */}
          <div className="flex flex-col gap-5">
            <TestimonialCard t={testimonials[3]} index={3} />
            <TestimonialCard t={testimonials[5]} index={5} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
