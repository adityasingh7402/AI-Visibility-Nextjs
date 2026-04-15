// ============================================================
// Report Adapters — Transform StructuredReport data shapes
// to match existing orphaned component prop interfaces
// ============================================================

import type { StructuredScore, StructuredProvider, StructuredCompetitor } from './report-v2-types';
import type { VisibilitySubScoresV19 } from './report-types';

// ── DimensionRadar Adapter ──

/** Convert StructuredScore[] (flat array) → VisibilitySubScoresV19 (17-key record).
 *  DimensionRadar component expects the record form.
 *  Provides 0-defaults for any missing dimension to avoid undefined access. */
export function scoresToSubScores(scores: StructuredScore[] | null): VisibilitySubScoresV19 | null {
  if (!scores || scores.length === 0) return null;
  const defaults: VisibilitySubScoresV19 = {
    llm_mention: 0, llm_consistency: 0, llm_position: 0,
    authority: 0, web_presence: 0, citation_strength: 0,
    content_fit: 0, citability: 0, page_quality: 0, freshness: 0,
    technical_seo: 0, ai_readiness: 0,
    competitor_gap: 0, pattern_match: 0,
    sentiment: 0, consistency: 0,
    aeo_readiness: 0,
  };
  for (const s of scores) {
    if (s.dimension in defaults) {
      defaults[s.dimension as keyof VisibilitySubScoresV19] = s.score;
    }
  }
  return defaults;
}

// ── LLMBreakdownTable Adapter ──

export interface LLMBreakdownEntry {
  visibility_score: number;
  mention_rate: number;
  average_position: number;
  sentiment?: string;
  total_queries?: number;
  mentioned_count?: number;
  provider_display?: string;
  model_name?: string;
}

/** Convert StructuredProvider[] → Record<providerID, LLMBreakdownEntry>.
 *  LLMBreakdownTable expects keyed-by-provider record. */
export function providersToBreakdownMap(
  providers: StructuredProvider[] | null
): Record<string, LLMBreakdownEntry> | null {
  if (!providers || providers.length === 0) return null;
  const result: Record<string, LLMBreakdownEntry> = {};
  for (const p of providers) {
    result[p.provider] = {
      visibility_score: (p.mention_rate ?? 0) * 100,
      mention_rate: p.mention_rate ?? 0,
      average_position: p.average_position ?? 0,
      sentiment: p.sentiment_label,
      total_queries: p.total_queries,
      mentioned_count: p.mentioned_count,
      provider_display: p.provider_display,
      model_name: p.model_name,
    };
  }
  return result;
}

// ── CompetitorCard Adapter ──

export interface CompetitorCardData {
  competitor_name: string;
  authority_score: number;
  llm_mention_rate: number;
  strengths: string[];
  weaknesses: string[];
  your_advantages: string[];
}

/** Normalize StructuredCompetitor[] → CompetitorCardData[] for rendering.
 *  Clamps values and provides defaults for null fields. */
export function normalizeCompetitors(
  competitors: StructuredCompetitor[] | null
): CompetitorCardData[] {
  if (!competitors || competitors.length === 0) return [];
  return competitors.map(c => ({
    competitor_name: c.competitor_name ?? 'Unknown',
    authority_score: c.authority_score ?? 0,
    llm_mention_rate: c.llm_mention_rate ?? 0,
    strengths: c.strengths ?? [],
    weaknesses: c.weaknesses ?? [],
    your_advantages: c.your_advantages ?? [],
  }));
}

// ── Scan Coverage Helpers ──

export interface ScanCoverageSummary {
  tested: number;
  total: number;
  names: string[];
  isPartial: boolean;
  label: string;
}

const ALL_KNOWN_PROVIDERS = ['chatgpt', 'gemini', 'perplexity', 'claude', 'grok', 'digitalocean', 'copilot'];

/** Build scan coverage summary from tested/untested provider lists */
export function buildScanCoverage(
  testedProviders: string[] | null,
  untestedProviders: string[] | null,
): ScanCoverageSummary {
  const tested = testedProviders ?? [];
  const total = new Set([...tested, ...(untestedProviders ?? []), ...ALL_KNOWN_PROVIDERS]).size;
  const isPartial = tested.length < total;
  const label = isPartial
    ? `Tested ${tested.length} of ${total} AI providers`
    : `All ${total} AI providers tested`;
  return { tested: tested.length, total, names: tested, isPartial, label };
}
