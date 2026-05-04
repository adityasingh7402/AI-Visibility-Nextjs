import React from "react";
import { twMerge } from "tailwind-merge";

type HeadingProps<T extends React.ElementType = "h1"> = {
  className?: string;
  children: React.ReactNode;
  as?: T;
  id?: string;
  variant?:
    | "default"
    | "muted"
    | "small"
    | "blogHeader"
    | "dashboardHeader"
    | "sectionHeader";
};

export const Heading = <T extends React.ElementType = "h1">({
  className,
  children,
  as,
  id,
  variant = "default",
}: HeadingProps<T>) => {
  const Tag = as || "h1";

  const variants = {
    default:
      "text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tighter font-schibsted leading-wide",
    muted:
      "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-regular leading-tight text-white",
    small:
      "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-regular leading-tight text-white",
    blogHeader:
      "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight text-neutral-100",
    dashboardHeader:
      "font-schibsted text-4xl font-semibold tracking-[0.07em] text-neutral-800",
    sectionHeader:
      "font-schibsted text-4xl md:text-5xl font-light tracking-tighter leading-tight text-neutral-700 text-center",
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
