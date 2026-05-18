import React from "react";
import { twMerge } from "tailwind-merge";

type ParagraphProps<T extends React.ElementType = "p"> = {
  className?: string;
  children: React.ReactNode;
  as?: T;
  variant?: "default" | "small" | "paragraphHeading" | "paragraphtext";
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
    small:
      "text-sm sm:text-[15px] md:text-[16px] lg:text-[17px] font-schibsted",
    paragraphHeading:
      "font-schibsted text-lg sm:text-xl md:text-2xl lg:text-2xl font-light text-neutral-900",
    paragraphtext:
      "text-sm sm:text-[15px] md:text-[16px] lg:text-[17px] font-schibsted text-neutral-700 font-light tracking-tighter leading-tight",
  };

  return (
    <Tag className={twMerge(variants[variant], className)}>{children}</Tag>
  );
};
