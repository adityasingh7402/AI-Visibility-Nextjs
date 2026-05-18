import React from "react";
import { twMerge } from "tailwind-merge";

type SubheadingProps<T extends React.ElementType = "h2"> = {
  className?: string;
  children: React.ReactNode;
  as?: T;
  id?: string;
  variant?: "herosubHeading";
};

export const Subheading = <T extends React.ElementType = "h2">({
  className,
  children,
  as,
  id,
  variant = "herosubHeading",
}: SubheadingProps<T>) => {
  const Tag = as || "h2";

  const variants = {
    herosubHeading:
      "text-[15px] sm:text-[17px] md:text-[18px] lg:text-[20px] font-light leading-tight tracking-tight",
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
