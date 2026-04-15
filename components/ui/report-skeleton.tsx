'use client';

/**
 * Skeleton screens for report/dashboard loading states.
 * Provides shimmer animations that match the actual layout structure.
 */

import { cn } from '@/lib/utils';

function Shimmer({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse rounded-lg bg-muted', className)} />
  );
}

/** Skeleton for the report detail page hero + tabs layout */
export function ReportDetailSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Hero area */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-start gap-6">
          <Shimmer className="h-24 w-24 rounded-full shrink-0" />
          <div className="flex-1 space-y-3">
            <Shimmer className="h-8 w-64" />
            <Shimmer className="h-4 w-48" />
            <div className="flex gap-2 mt-3">
              <Shimmer className="h-6 w-24 rounded-full" />
              <Shimmer className="h-6 w-32 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2">
        {Array.from({ length: 5 }, (_, i) => (
          <Shimmer key={i} className="h-9 w-24 rounded-lg" />
        ))}
      </div>

      {/* Content area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <Shimmer className="h-5 w-40" />
          <Shimmer className="h-4 w-full" />
          <Shimmer className="h-4 w-3/4" />
          <Shimmer className="h-4 w-5/6" />
        </div>
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <Shimmer className="h-5 w-40" />
          <Shimmer className="h-48 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/** Skeleton for the reports list page */
export function ReportsListSkeleton() {
  return (
    <div className="space-y-3 animate-in fade-in duration-500">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
          <Shimmer className="h-12 w-12 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Shimmer className="h-4 w-48" />
            <Shimmer className="h-3 w-32" />
          </div>
          <Shimmer className="h-6 w-20 rounded-full" />
          <Shimmer className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

/** Skeleton for dashboard stat cards */
export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-500">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-5 space-y-3">
          <Shimmer className="h-10 w-10 rounded-lg" />
          <Shimmer className="h-3 w-20" />
          <Shimmer className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
}

/** Generic card skeleton */
export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3 animate-in fade-in duration-500">
      <Shimmer className="h-5 w-40" />
      {Array.from({ length: lines }, (_, i) => (
        <Shimmer key={i} className={cn('h-4', i % 2 === 0 ? 'w-full' : 'w-3/4')} />
      ))}
    </div>
  );
}
