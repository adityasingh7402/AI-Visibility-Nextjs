import React from "react";
import { twMerge } from "tailwind-merge";

type HeadingProps<T extends React.ElementType = "h1"> = {
  className?: string;
  children: React.ReactNode;
  as?: T;
  id?: string;
  variant?: "heroHeading" | "sectionHeader";
};

export const Heading = <T extends React.ElementType = "h1">({
  className,
  children,
  as,
  id,
  variant = "heroHeading",
}: HeadingProps<T>) => {
  const Tag = as || "h1";

  const variants = {
    heroHeading: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-none",
    sectionHeader:
      "text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tighter leading-tight text-left sm:text-center",
  };

  return (
    <Tag
      id={id}
      className={twMerge("font-schibsted", variants[variant], className)}
    >
      {children}
    </Tag>
  );
};
