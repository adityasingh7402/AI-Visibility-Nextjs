'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Bolt } from 'lucide-react';
import { NotificationCenter } from '@/components/dashboard/NotificationCenter';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

// Map route segments to display labels
const SEGMENT_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  analysis: 'GEO Analysis',
  reports: 'Reports',
  keywords: 'Keywords',
  content: 'Content',
  progress: 'Trends',
  clients: 'Clients',
  billing: 'Billing',
  settings: 'Settings',
};

export function DashboardHeader() {
  const pathname = usePathname();

  // Build breadcrumb from path segments
  const segments = pathname.split('/').filter(Boolean); // e.g. ["dashboard", "reports", "abc-123"]
  const crumbs = segments.map((seg, i) => {
    const href = '/' + segments.slice(0, i + 1).join('/');
    const label = SEGMENT_LABELS[seg] || decodeURIComponent(seg);
    return { href, label, isLast: i === segments.length - 1 };
  });

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mx-2 h-4" />

      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          {crumbs.map((crumb, i) => (
            <React.Fragment key={crumb.href}>
              {i > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {crumb.isLast ? (
                  <BreadcrumbPage className="font-semibold">{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={crumb.href}>{crumb.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Right side actions */}
      <div className="ml-auto flex items-center gap-2">
        <NotificationCenter />
        <Link
          href="/dashboard/analysis"
          className="inline-flex items-center justify-center rounded-lg font-semibold shadow-sm h-9 px-4 text-sm bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Bolt className="h-3.5 w-3.5 mr-1.5" />
          New Analysis
        </Link>
      </div>
    </header>
  );
}
