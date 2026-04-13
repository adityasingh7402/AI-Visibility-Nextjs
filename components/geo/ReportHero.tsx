'use client';

import { ScoreGauge } from './ScoreGauge';
import {
  getMaturityLevel,
  isReportStale,
  daysSinceReport,
  type StructuredReport,
} from '@/lib/report-v2-types';
import { buildScanCoverage } from '@/lib/report-adapters';

interface ReportHeroProps {
  report: StructuredReport;
}

/** Report header hero section — score gauge, brand info, scan coverage, stale banner. */
export function ReportHero({ report }: ReportHeroProps) {
  const maturity = getMaturityLevel(report.score);
  const stale = isReportStale(report.created_at);
  const days = daysSinceReport(report.created_at);
  const coverage = buildScanCoverage(report.tested_providers, report.untested_providers);
  const createdDate = report.created_at
    ? new Date(report.created_at).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
      })
    : 'Unknown';

  return (
    <div className="space-y-4">
      {/* Stale report banner */}
      {stale && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-2.5 text-sm text-amber-600 dark:text-amber-400">
          <span className="text-lg">⚠️</span>
          <span>
            This report is <strong>{days} days old</strong> and may be outdated.{' '}
            <span className="text-muted-foreground">AI visibility changes as models update.</span>
          </span>
        </div>
      )}

      {/* Main hero card */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Left: Brand info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">{report.brand_name || 'Unnamed Brand'}</h1>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${maturity.badgeClass}`}>
                {maturity.icon} {maturity.label}
              </span>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span title="Report date">{createdDate}</span>
              {report.scan_mode && (
                <span className="capitalize" title="Scan mode">
                  {report.scan_mode} scan
                </span>
              )}
              {report.methodology_version && (
                <span title="Methodology version">V{report.methodology_version}</span>
              )}
              {report.type && (
                <span className="uppercase font-medium text-xs tracking-wider" title="Report type">
                  {report.type === 'geo' ? 'GEO Analysis' : report.type}
                </span>
              )}
            </div>

            {/* Maturity description */}
            <p className={`text-sm font-medium ${maturity.textClass}`}>
              {maturity.description}
            </p>
          </div>

          {/* Right: Score gauge */}
          <div className="flex-shrink-0">
            <ScoreGauge score={report.score ?? 0} size={140} showMaturity />
          </div>
        </div>
      </div>

      {/* Scan coverage banner */}
      <div className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm ${
        coverage.isPartial
          ? 'border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400'
          : 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400'
      }`}>
        <span className="text-lg">{coverage.isPartial ? 'ℹ️' : '✅'}</span>
        <span>
          <strong>{coverage.label}</strong>
          {coverage.isPartial && (
            <span className="text-muted-foreground">
              {' — '}Results reflect only tested providers ({coverage.names.join(', ')}). Run with more providers for broader coverage.
            </span>
          )}
        </span>
      </div>

      {/* Processing time (if available) */}
      {report.processing_time_seconds != null && report.processing_time_seconds > 0 && (
        <p className="text-xs text-muted-foreground">
          Analysis completed in {Math.round(report.processing_time_seconds)}s
        </p>
      )}
    </div>
  );
}
