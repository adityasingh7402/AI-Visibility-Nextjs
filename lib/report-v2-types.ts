// ============================================================
// V2 Report Types — Structured Report from GET /reports/:id/full
// Aligned with backend routes/reports.js structuredResponse
// ============================================================

export type ReportFamily = 'geo' | 'keywords' | 'content';
export type ReportVariant = 'geo' | 'aeo' | 'combined' | 'keywords' | 'content';

export const REPORT_VARIANT_LABELS: Record<ReportVariant, string> = {
  geo: 'GEO Analysis',
  aeo: 'AEO Scan',
  combined: 'GEO Analysis',
  keywords: 'Keyword Discovery',
  content: 'Content Validation',
};

export function getPublicReportVariant(variant: ReportVariant): Exclude<ReportVariant, 'combined'> | 'geo' {
  return variant === 'combined' ? 'geo' : variant;
}

export function getPublicReportLabel(variant: ReportVariant): string {
  return REPORT_VARIANT_LABELS[getPublicReportVariant(variant)];
}

// ── Maturity Level System (replaces A-F grades) ──

export type MaturityLevel = 'INVISIBLE' | 'EMERGING' | 'RECOGNIZED' | 'ESTABLISHED' | 'DOMINANT';

export interface MaturityConfig {
  level: MaturityLevel;
  label: string;
  description: string;
  min: number;
  max: number;
  color: string;
  darkColor: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  badgeClass: string;
  icon: string;
}

export const MATURITY_LEVELS: MaturityConfig[] = [
  {
    level: 'INVISIBLE',
    label: 'Invisible',
    description: 'AI models rarely mention your brand',
    min: 0, max: 20,
    color: '#EF4444', darkColor: '#F87171',
    bgClass: 'bg-red-500/10',
    textClass: 'text-red-500 dark:text-red-400',
    borderClass: 'border-red-500/20',
    badgeClass: 'bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20',
    icon: '👻',
  },
  {
    level: 'EMERGING',
    label: 'Emerging',
    description: 'Starting to appear in AI responses',
    min: 21, max: 40,
    color: '#F97316', darkColor: '#FB923C',
    bgClass: 'bg-orange-500/10',
    textClass: 'text-orange-500 dark:text-orange-400',
    borderClass: 'border-orange-500/20',
    badgeClass: 'bg-orange-500/10 text-orange-500 dark:text-orange-400 border border-orange-500/20',
    icon: '🌱',
  },
  {
    level: 'RECOGNIZED',
    label: 'Recognized',
    description: 'Consistently mentioned across AI platforms',
    min: 41, max: 60,
    color: '#EAB308', darkColor: '#FACC15',
    bgClass: 'bg-yellow-500/10',
    textClass: 'text-yellow-600 dark:text-yellow-400',
    borderClass: 'border-yellow-500/20',
    badgeClass: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20',
    icon: '⭐',
  },
  {
    level: 'ESTABLISHED',
    label: 'Established',
    description: 'Strong presence in AI-generated content',
    min: 61, max: 80,
    color: '#3B82F6', darkColor: '#60A5FA',
    bgClass: 'bg-blue-500/10',
    textClass: 'text-blue-500 dark:text-blue-400',
    borderClass: 'border-blue-500/20',
    badgeClass: 'bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20',
    icon: '🏆',
  },
  {
    level: 'DOMINANT',
    label: 'Dominant',
    description: 'Leading brand in AI visibility',
    min: 81, max: 100,
    color: '#10B981', darkColor: '#34D399',
    bgClass: 'bg-emerald-500/10',
    textClass: 'text-emerald-500 dark:text-emerald-400',
    borderClass: 'border-emerald-500/20',
    badgeClass: 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20',
    icon: '👑',
  },
];

/** Get maturity config for a score (0-100) */
export function getMaturityLevel(score: number | null | undefined): MaturityConfig {
  if (score == null || score < 0) return MATURITY_LEVELS[0];
  const clamped = Math.min(Math.round(score), 100);
  const found = MATURITY_LEVELS.find(m => clamped >= m.min && clamped <= m.max);
  return found ?? MATURITY_LEVELS[0];
}

/** Get maturity color for a score */
export function getMaturityColor(score: number | null | undefined): string {
  return getMaturityLevel(score).color;
}

// ── Structured Report Types (from GET /reports/:id/full) ──

export interface StructuredScore {
  dimension: string;
  score: number;
  weight: number | null;
  evidence: string | null;
}

export interface StructuredProvider {
  provider: string;
  provider_display: string;
  model_name: string;
  model_id: string;
  mention_rate: number;
  validated_mention_rate: number | null;
  average_position: number;
  sentiment_label: string;
  total_queries: number;
  mentioned_count: number;
}

export interface StructuredRecommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  impact_area: string;
  sort_order: number;
}

export interface StructuredCompetitor {
  competitor_name: string;
  authority_score: number;
  llm_mention_rate: number;
  strengths: string[];
  weaknesses: string[];
  your_advantages: string[];
}

export interface ScanCoverageV2 {
  scan_mode: string;
  providers_tested: number;
  total_data_points: number;
  prompts_per_provider: number;
  [key: string]: unknown;
}

export interface StructuredReport {
  // Identity
  id: string;
  type: ReportFamily;
  variant: ReportVariant;
  report_type: string;
  display_label: string;
  brand_name: string;
  category: string;
  score: number | null;
  grade: string;
  status: string;
  scan_mode: string;
  methodology_version: string;
  processing_time_seconds: number | null;
  created_at: string;

  // Summary
  executive_summary: string | null;
  summary: string;

  // Structured child data
  scores: StructuredScore[] | null;
  providers: StructuredProvider[] | null;
  recommendations: StructuredRecommendation[] | null;
  competitors: StructuredCompetitor[] | null;

  // Provider coverage
  tested_providers: string[];
  untested_providers: string[];
  scan_coverage: ScanCoverageV2 | null;

  // Multi-model comparison
  provider_model_matrix: Record<string, unknown> | null;

  // Markdown report
  markdown_report: string | null;

  // Raw Python response payload (for V1.9 rich features like battle_cards)
  raw_payload: Record<string, unknown> | null;

  // Metadata
  _has_structured_data: boolean;
}

// ── Report Tab definitions ──

export type ReportTab = 'overview' | 'providers' | 'competitors' | 'recommendations' | 'evidence' | 'report';

export interface ReportTabConfig {
  id: ReportTab;
  label: string;
  icon: string;
  description: string;
}

export const REPORT_TABS: ReportTabConfig[] = [
  { id: 'overview',        label: 'Overview',         icon: '📊', description: 'Score breakdown and key metrics' },
  { id: 'providers',       label: 'AI Providers',     icon: '🤖', description: 'Per-provider visibility results' },
  { id: 'competitors',     label: 'Competitors',      icon: '🏁', description: 'Competitive landscape analysis' },
  { id: 'recommendations', label: 'Recommendations',  icon: '💡', description: 'Actionable improvement steps' },
  { id: 'evidence',        label: 'Evidence',         icon: '🔬', description: 'LLM transcripts and verification' },
  { id: 'report',          label: 'Full Report',      icon: '📄', description: 'Complete markdown report' },
];

// ── Helper: Days since report ──

export function daysSinceReport(createdAt: string | null | undefined): number {
  if (!createdAt) return 0;
  const created = new Date(createdAt);
  const now = new Date();
  return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
}

/** Is the report stale (>7 days old)? */
export function isReportStale(createdAt: string | null | undefined): boolean {
  return daysSinceReport(createdAt) > 7;
}
