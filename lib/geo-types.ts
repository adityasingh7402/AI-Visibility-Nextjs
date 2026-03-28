// ============================================================
// GEO Platform — TypeScript Types
// Based on BACKEND_INTEGRATION.md + FRONTEND_INTEGRATION.md
// ============================================================

// ---- Enums ----
export type RegionScope = 'global' | 'north_america' | 'europe' | 'asia_pacific' | 'latin_america' | 'middle_east' | 'country';
export type DiscoveryMode = 'quick' | 'standard' | 'deep';
export type LLMProvider = 'chatgpt' | 'gemini' | 'perplexity' | 'claude' | 'openai' | 'google';
export type OpportunityPriority = 'high' | 'medium' | 'low';
export type EffortLevel = 'easy' | 'medium' | 'hard' | 'moderate';
export type TimeToImpact = 'days' | 'weeks' | 'months';
export type FactorType = 'wikipedia' | 'reviews' | 'press' | 'community' | 'content' | 'technical' | 'comparison';
export type ContentType = 'blog_post' | 'faq_page' | 'comparison_page' | 'landing_page' | 'listicle' | 'other' | 'live_test';
export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type AnalysisType = 'keyword_discovery' | 'keyword_test' | 'keyword_validate' | 'content_validation' | 'content_live_test' | 'progress_tracking';
export type TrendDirection = 'improving' | 'declining' | 'stable';
export type Verdict = 'strong' | 'promising' | 'weak' | 'not_visible';

// ---- Keyword Discovery ----

export interface KeywordDiscoveryRequest {
  brand_name: string;
  brand_aliases?: string[];
  category: string;
  competitors?: string[];
  target_audience?: string;
  region: RegionScope;
  country_code?: string | null;
  mode: DiscoveryMode;
  llm_providers: LLMProvider[];
  runs_per_prompt: number;
}

export interface VisibilityFactor {
  factor_type: FactorType;
  description: string;
  evidence: string;
  impact_level: 'critical' | 'high' | 'medium' | 'low';
  actionable: boolean;
  action_to_replicate?: string;
  effort_level?: EffortLevel;
  time_to_impact?: TimeToImpact;
}

export interface CompetitorPattern {
  competitor_name: string;
  visibility_score: number;   // 0-100
  mention_rate: number;       // 0-1
  average_position: number;
  visibility_factors: VisibilityFactor[];
  featured_in_llms: string[];
  key_differentiators: string[];
}

export interface KeywordOpportunity {
  keyword: string;
  priority: OpportunityPriority;
  visibility_potential: 'high' | 'medium' | 'low' | 'none';
  reason: string;
  target_position: number;
  estimated_impact: string;
  action_items: string[];
  effort_estimate: EffortLevel;
}

export interface VisibilitySummary {
  your_brand_mentions: number;
  total_prompts_tested: number;
  mention_rate: number;         // 0-1
  average_position: number;
  base_model_visibility: number; // 0-100
  rag_model_visibility: number;  // 0-100
  actionable_gap: number;        // 0-100
}

export interface LLMProfile {
  provider: string;
  mention_rate: number;
  citation_quality: string;
  data_freshness: string;
}

export interface KeywordDiscoveryResponse {
  brand_name: string;
  category: string;
  discovery_mode: DiscoveryMode;
  working_keywords: string[];
  gap_keywords: string[];
  your_winning_keywords: string[];
  prompt_diversity: {
    category_prompts: number;
    comparison_prompts: number;
    alternative_prompts: number;
  };
  competitor_patterns: CompetitorPattern[];
  opportunities: KeywordOpportunity[];
  visibility_summary: VisibilitySummary;
  llm_profiles: Record<string, LLMProfile>;
  next_steps: string[];
  processing_time_seconds: number;
  timestamp: string;
  analysis_id: string;
}

// ---- Keyword Test ----

export interface KeywordTestRequest {
  brand_name: string;
  brand_aliases?: string[];
  keywords: string[];
  custom_prompts?: string[];
  region?: RegionScope;
  country_code?: string | null;
  llm_providers: LLMProvider[];
  runs_per_prompt?: number;
}

export interface KeywordTestResult {
  keyword: string;
  visibility_potential: 'high' | 'medium' | 'low' | 'none';
  should_target: boolean;
  reason: string;
  brands_mentioned: Record<string, string[]>;
  mention_rate: number;
  average_position: number;
  descriptor_frequency: Record<string, number>;
}

export interface KeywordTestResponse {
  brand_name: string;
  keywords_tested: number;
  summary: {
    winning_keywords: string[];
    opportunity_keywords: string[];
    weak_keywords: string[];
    total_mentions: number;
    average_position: number;
  };
  results: KeywordTestResult[];
  processing_time_seconds: number;
  timestamp: string;
}

// ---- Keyword Validate ----

export interface KeywordValidateRequest {
  prompt: string;
  brand_name: string;
  brand_aliases?: string[];
  llm_providers: LLMProvider[];
}

export interface KeywordValidateResponse {
  prompt: string;
  brand_name: string;
  results: {
    brand_mentioned: boolean;
    mention_rate: number;
    average_position: number;
    providers_mentioning: string[];
    providers_not_mentioning: string[];
  };
  raw_responses: string[];
  timestamp: string;
}

// ---- Content Validation ----

export interface ContentValidationRequest {
  content: string;
  brand_name: string;
  target_queries?: string[];
  content_type?: ContentType;
  competitors?: string[];
}

export interface ImprovementArea {
  area: 'structure' | 'factual_density' | 'query_alignment' | 'brand_mention' | 'comparison_depth' | 'citation_worthiness';
  severity: 'low' | 'medium' | 'high';
  description: string;
  suggestion: string;
}

export interface QueryAlignment {
  query: string;
  alignment_score: number;
  would_be_cited: boolean;
  missing_elements: string[];
}

export interface ContentValidationResponse {
  brand_name: string;
  content_type: string;
  rag_citability_score: number;    // 0-100 — main metric
  structure_score: number;
  factual_density_score: number;
  brand_visibility_score: number;
  improvement_areas: ImprovementArea[];
  query_alignments: QueryAlignment[];
  recommendations: string[];
  processing_time_seconds: number;
  timestamp: string;
  verdict?: Verdict;
}

// ---- Content Live Test ----

export interface ContentLiveTestRequest {
  content: string;
  brand_name: string;
  brand_aliases?: string[];
  target_queries?: string[];
  providers: LLMProvider[];
  competitors?: string[];
}

export interface ContentLiveTestResponse extends ContentValidationResponse {
  verdict: Verdict;
  structural_analysis: {
    rag_citability_score: number;
    improvement_areas: ImprovementArea[];
  };
  live_test_results: {
    total_queries: number;
    total_llm_calls: number;
    mentions_detected: number;
    mention_rate: number;
    cost_estimate: string;
  };
  verdict_reasoning: string;
  next_steps: string[];
}

// ---- Progress / Trend ----

export interface ProgressTrackingRequest {
  brand_name: string;
  category: string;
  limit?: number;
}

export interface TrendDataPoint {
  timestamp: string;
  overall_visibility: number;
  base_model_visibility: number;
  rag_model_visibility: number;
}

export interface VisibilityTrend {
  brand_name: string;
  category: string;
  data_points: TrendDataPoint[];
  total_snapshots: number;
  overall_change: number;
  base_model_change?: number;
  rag_model_change?: number;
  trend_direction: TrendDirection;
  keyword_changes?: {
    keywords_gained: string[];
    keywords_lost: string[];
    keywords_stable: string[];
    new_gaps: string[];
    stability_rate: number;
  };
}

export interface ProgressTrendResponse {
  brand_name: string;
  category: string;
  source: 'local' | 'python';
  trend: VisibilityTrend;
  latest_snapshot?: Record<string, unknown>;
  recommendation?: string;
  timestamp: string;
}

// ---- Supabase Table Types ----

export interface Analysis {
  id: string;
  user_id: string;
  brand_name: string;
  category: string;
  analysis_type: AnalysisType;
  request_payload: Record<string, unknown>;
  response_payload: Record<string, unknown>;
  overall_score: number | null;
  visibility_score: number | null;
  mention_rate: number | null;
  status: AnalysisStatus;
  error_message: string | null;
  processing_time_seconds: number | null;
  analysis_id: string | null;
  created_at: string;
  updated_at: string;
  // joined
  keywords?: DBKeyword[];
  recommendations?: DBRecommendation[];
}

export interface DBKeyword {
  id: string;
  analysis_id: string;
  user_id: string;
  keyword: string;
  keyword_type: 'working' | 'gap' | 'opportunity' | 'winning' | 'custom';
  visibility_potential: string | null;
  mention_rate: number | null;
  average_position: number | null;
  mentions_count: number | null;
  should_target: boolean;
  priority: OpportunityPriority | null;
  created_at: string;
}

export interface DBRecommendation {
  id: string;
  analysis_id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string;
  priority: OpportunityPriority;
  confidence: number | null;
  action_items: string[] | null;
  estimated_effort: EffortLevel | null;
  time_to_impact: TimeToImpact | null;
  estimated_roi: string | null;
  status: 'not_started' | 'in_progress' | 'completed';
  completed_at: string | null;
  created_at: string;
}

// ---- Score helpers ----

export function getScoreGrade(score: number): { grade: string; color: string; label: string } {
  if (score >= 80) return { grade: 'A', color: '#10B981', label: 'Excellent' };
  if (score >= 60) return { grade: 'B', color: '#F59E0B', label: 'Good' };
  if (score >= 40) return { grade: 'C', color: '#EF4444', label: 'Fair' };
  return { grade: 'D', color: '#7C3AED', label: 'Poor' };
}

export const VISIBILITY_LEVELS = {
  high: { color: '#10B981', icon: '📈', label: 'High Potential' },
  medium: { color: '#F59E0B', icon: '↔️', label: 'Medium Potential' },
  low: { color: '#EF4444', icon: '📉', label: 'Low Potential' },
  none: { color: '#6B7280', icon: '🚫', label: 'No Potential' },
} as const;
