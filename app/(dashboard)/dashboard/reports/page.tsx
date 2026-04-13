'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { geoApi, type UnifiedReport } from '@/lib/geo-api';
import { getMaturityLevel, getMaturityColor } from '@/lib/report-v2-types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Search,
  ArrowRight,
  Clock,
  AlertCircle,
  RefreshCw,
  Plus,
  ChevronLeft,
  ChevronRight,
  Globe,
  KeyRound,
  FileText,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const PAGE_SIZE = 20;

function relTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'Just now';
  if (min < 60) return `${min}m ago`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const TYPE_META: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  geo:      { label: 'GEO',      color: 'text-blue-600 bg-blue-500/10 border-blue-500/20',      icon: <Globe className="h-3 w-3" /> },
  keywords: { label: 'Keywords', color: 'text-violet-600 bg-violet-500/10 border-violet-500/20', icon: <KeyRound className="h-3 w-3" /> },
  content:  { label: 'Content',  color: 'text-amber-600 bg-amber-500/10 border-amber-500/20',    icon: <FileText className="h-3 w-3" /> },
};

function TypeBadge({ type }: { type: string }) {
  const meta = TYPE_META[type] ?? TYPE_META.geo;
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${meta.color}`}>
      {meta.icon}
      {meta.label}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  if (s === 'completed' || s === 'pass' || s === 'passed') {
    return <Badge variant="outline" className="text-emerald-600 border-emerald-500/30 bg-emerald-500/10 text-[10px] font-bold uppercase">Completed</Badge>;
  }
  if (s === 'failed' || s === 'fail') {
    return <Badge variant="outline" className="text-destructive border-destructive/30 bg-destructive/10 text-[10px] font-bold uppercase">Failed</Badge>;
  }
  if (s === 'processing' || s === 'pending') {
    return <Badge variant="outline" className="text-amber-600 border-amber-500/30 bg-amber-500/10 text-[10px] font-bold uppercase">{status}</Badge>;
  }
  return <Badge variant="outline" className="text-muted-foreground text-[10px] font-bold uppercase">{status}</Badge>;
}

function ScoreBadge({ score, grade }: { score: number | null; grade: string }) {
  if (score == null) return <span className="text-sm text-muted-foreground">—</span>;
  const maturity = getMaturityLevel(score);
  const color = maturity.color;
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="text-sm font-black tabular-nums" style={{ color }}>{score}</span>
      <Badge variant="outline" className="text-[10px] font-bold" style={{ color, borderColor: color }}>{maturity.label}</Badge>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ReportsPage() {
  const router = useRouter();

  // Filters
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [brandSearch, setBrandSearch] = useState('');
  const [sortBy, setSortBy] = useState<string>('date');

  // Data
  const [reports, setReports] = useState<UnifiedReport[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async (newOffset = 0) => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string | number> = {
        limit: PAGE_SIZE,
        offset: newOffset,
        sort: sortBy,
      };
      if (typeFilter !== 'all') params.type = typeFilter;
      if (brandSearch.trim()) params.brand = brandSearch.trim();

      const res = await geoApi.getReports(params);
      setReports(res.reports);
      setTotal(res.total);
      setOffset(newOffset);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch reports';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [typeFilter, brandSearch, sortBy]);

  // Re-fetch when filters change (reset to page 1)
  useEffect(() => {
    fetchReports(0);
  }, [fetchReports]);

  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const hasFilters = typeFilter !== 'all' || brandSearch.trim() !== '';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight mb-1">Reports</h1>
          <p className="text-sm text-muted-foreground">
            All your GEO analyses, keyword discoveries, and content validations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => fetchReports(offset)} variant="outline" size="sm" className="rounded-lg gap-2 font-semibold">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </Button>
          <Link href="/dashboard/audit">
            <Button size="sm" className="rounded-lg gap-2 font-semibold shadow-sm">
              <Plus className="h-3.5 w-3.5" /> New Analysis
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Type filter */}
        <Select value={typeFilter} onValueChange={(v) => { if (v != null) setTypeFilter(v); }}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="geo">GEO Analysis</SelectItem>
            <SelectItem value="keywords">Keywords</SelectItem>
            <SelectItem value="content">Content</SelectItem>
          </SelectContent>
        </Select>

        {/* Brand search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={brandSearch}
            onChange={e => setBrandSearch(e.target.value)}
            placeholder="Search by brand name…"
            className="pl-9"
          />
        </div>

        {/* Sort */}
        <Select value={sortBy} onValueChange={(v) => { if (v != null) setSortBy(v); }}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Newest First</SelectItem>
            <SelectItem value="score">Highest Score</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-6 text-center space-y-3">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto" />
          <p className="text-sm font-semibold text-destructive">{error}</p>
          <Button onClick={() => fetchReports(offset)} variant="outline" size="sm" className="rounded-lg">
            Retry
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && reports.length === 0 && (
        <div className="text-center py-16 rounded-xl border border-dashed border-border">
          <p className="text-3xl mb-3">📊</p>
          <p className="font-bold text-foreground mb-1">
            {hasFilters ? 'No reports matched' : 'No reports yet'}
          </p>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
            {hasFilters
              ? 'Try adjusting your filters or search term.'
              : 'Run your first analysis to get started.'}
          </p>
          {!hasFilters && (
            <Link href="/dashboard/audit">
              <Button size="sm" className="rounded-lg font-semibold">Run Analysis</Button>
            </Link>
          )}
        </div>
      )}

      {/* Reports Table */}
      {!loading && !error && reports.length > 0 && (
        <>
          <div className="rounded-xl border border-border overflow-hidden bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Type</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead className="w-[120px]">Score</TableHead>
                  <TableHead className="hidden md:table-cell">Summary</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[100px] text-right">Date</TableHead>
                  <TableHead className="w-[40px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow
                    key={report.id}
                    className="cursor-pointer group"
                    onClick={() => router.push(`/dashboard/reports/${report.id}`)}
                  >
                    <TableCell>
                      <TypeBadge type={report.type} />
                    </TableCell>
                    <TableCell>
                      <span className="font-bold text-foreground group-hover:text-primary transition-colors">
                        {report.brand_name || '—'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <ScoreBadge score={report.score} grade={report.grade} />
                    </TableCell>
                    <TableCell className="hidden md:table-cell max-w-[300px]">
                      <span className="text-sm text-muted-foreground truncate block">
                        {report.summary}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={report.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {relTime(report.created_at)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground font-semibold">
              Showing {offset + 1}–{Math.min(offset + PAGE_SIZE, total)} of {total} report{total !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg gap-1 font-semibold"
                disabled={currentPage <= 1}
                onClick={() => fetchReports(offset - PAGE_SIZE)}
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </Button>
              <span className="text-xs font-bold text-muted-foreground tabular-nums px-2">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg gap-1 font-semibold"
                disabled={currentPage >= totalPages}
                onClick={() => fetchReports(offset + PAGE_SIZE)}
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}