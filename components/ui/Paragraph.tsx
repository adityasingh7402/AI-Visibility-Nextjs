import React from "react";
import { twMerge } from "tailwind-merge";

type ParagraphProps<T extends React.ElementType = "p"> = {
  className?: string;
  children: React.ReactNode;
  as?: T;
  variant?:
    | "default"
    | "muted"
    | "small"
    | "docs-par"
    | "home-par"
    | "dashboard-subHeading"
    | "docs-subPar";
};

export const Paragraph = <T extends React.ElementType = "p">({
  className,
  children,
  as,
  variant = "default",
}: ParagraphProps<T>) => {
  const Tag = as || "p";

  const variants = {
    default:
      "text-sm sm:text-base md:text-lg text-neutral-900 font-schibsted font-regular leading-relaxed",
    muted:
      "text-xs sm:text-sm md:text-base text-neutral-900 font-schibsted font-regular mb-8 leading-relaxed",
    small: "text-2xl sm:text-3xl md:text-[20px] lg:text-[15px] font-schibsted",
    "docs-par":
      "text-sm sm:text-[16px] text-neutral-900 font-schibsted font-regular mb-4 text-neutral-700 tracking-tighter leading-relaxed",
    "docs-subPar":
      "font-schibsted font-light text-neutral-700 tracking-tighter text-[16px]",
    "home-par":
      "text-base md:text-xl text-neutral-900 font-schibsted font-regular",
    "dashboard-subHeading":
      "text-lg font-schibsted text-neutral-700 tracking-tighter",
  };

  return (
    <Tag className={twMerge(variants[variant], className)}>{children}</Tag>
  );
};
