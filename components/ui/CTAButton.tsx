"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/useUserStore";

interface CTAButtonProps {
  loggedInHref: string;
  loggedOutHref: string;
  children: React.ReactNode;
  icon?: React.ComponentType<{
    size?: number;
    stroke?: number;
    className?: string;
  }>;
  className?: string;
}

export function CTAButton({
  loggedInHref,
  loggedOutHref,
  children,
  icon: IconComponent,
  className,
}: CTAButtonProps) {
  const { user, isLoading } = useUserStore();
  const href = user ? loggedInHref : loggedOutHref;

  const content = (
    <span className="inline-flex items-center gap-2">
      {children}
      {IconComponent && <IconComponent size={16} stroke={2} />}
    </span>
  );

  return (
    <Link
      href={href}
      className={cn(
        "group relative inline-flex h-10 items-center justify-center rounded-full border-2 border-neutral-900 bg-neutral-900 px-6 text-sm font-medium text-white transition-colors hover:bg-neutral-800",
        isLoading && "pointer-events-none opacity-70",
        className,
      )}
    >
      <span className="relative inline-flex overflow-hidden px-3 -mx-3">
        <span className="font-schibsted tracking-tight translate-y-0 skew-y-0 transition duration-500 group-hover:-translate-y-[150%] group-hover:skew-y-12 block">
          {content}
        </span>
        <span className="absolute translate-y-[180%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0 block">
          {content}
        </span>
      </span>
    </Link>
  );
}
