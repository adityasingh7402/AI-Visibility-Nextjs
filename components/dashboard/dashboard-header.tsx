'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Bell, Bolt } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  analysis: 'Run Analysis',
  reports: 'Reports',
  keywords: 'Keyword Discovery',
  content: 'Content Validator',
  progress: 'Visibility Trends',
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
            <BreadcrumbItem key={crumb.href}>
              {i > 0 && <BreadcrumbSeparator />}
              {crumb.isLast ? (
                <BreadcrumbPage className="font-semibold">{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={crumb.href}>{crumb.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Right side actions */}
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative rounded-lg h-9 w-9">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full" />
        </Button>
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
