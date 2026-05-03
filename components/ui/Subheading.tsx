import React from "react";
import { twMerge } from "tailwind-merge";

type SubheadingProps<T extends React.ElementType = "h2"> = {
  className?: string;
  children: React.ReactNode;
  as?: T;
  id?: string;
  variant?: "default" | "large" | "small";
};

export const Subheading = <T extends React.ElementType = "h2">({
  className,
  children,
  as,
  id,
  variant = "default",
}: SubheadingProps<T>) => {
  const Tag = as || "h2";

  const variants = {
    large:
      "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-tight",
    default:
      "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight",
    small:
      "text-2xl sm:text-3xl md:text-[20px] lg:text-[20px] font-light leading-tight",
  };

  return (
    <Tag
      id={id}
      className={twMerge(
        "font-schibsted text-neutral-900",
        variants[variant],
        className,
      )}
    >
      {children}
    </Tag>
  );
};
