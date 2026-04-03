// ============================================================
// GEO Platform — TypeScript Types
// FULLY ALIGNED with BACKEND_HANDOFF_v2.0.md
// ============================================================

// ---- Enums ----
export type RegionScope = 'global' | 'north_america' | 'europe' | 'asia_pacific' | 'latin_america' | 'middle_east' | 'country';
export type DiscoveryMode = 'quick' | 'standard' | 'deep';
// All 6 providers per BACKEND_HANDOFF_v2.0 §9 — added grok + digitalocean
export type LLMProvider = 'chatgpt' | 'gemini' | 'perplexity' | 'claude' | 'grok' | 'digitalocean' | 'nvidia' | 'openai' | 'google';
export type OpportunityPriority = 'high' | 'medium' | 'low';
export type EffortLevel = 'easy' | 'medium' | 'hard' | 'moderate';
export type TimeToImpact = 'days' | 'weeks' | 'months';
export type FactorType = 'wikipedia' | 'reviews' | 'press' | 'community' | 'content' | 'technical' | 'comparison';
export type ContentType = 'blog_post' | 'faq_page' | 'comparison_page' | 'landing_page' | 'listicle' | 'other' | 'live_test';
export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type AnalysisType = 'keyword_discovery' | 'keyword_test' | 'keyword_validate' | 'content_validation' | 'content_live_test' | 'progress_tracking' | 'geo_analysis';
export type TrendDirection = 'improving' | 'declining' | 'stable';
export type Verdict = 'strong' | 'promising' | 'weak' | 'not_visible';
export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

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
  skip_cache?: boolean; // Set true to bypass 24h cache
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
  competitor: string;                    // Python field name
  competitor_name?: string;              // backward compat alias
  mention_rate: number;                  // 0-1
  avg_position: number;
  average_position?: number;             // backward compat alias
  consistency_score?: number;
  visibility_by_llm?: Record<string, number>;  // Python field: per-LLM scores
  featured_in_llms?: string[];                 // backward compat alias
  visibility_score?: number;                   // computed: mention_rate * 100
  visibility_factors: VisibilityFactor[];
  common_descriptors?: string[];
  associated_features?: string[];
  competitor_confidence?: number;
}

export interface KeywordOpportunity {
  keyword: string;
  priority: OpportunityPriority;
  gap_size?: number;                     // Python field name
  visibility_potential?: 'high' | 'medium' | 'low' | 'none';  // backward compat alias
  reason?: string;
  difficulty?: EffortLevel;              // Python field name
  effort_estimate?: EffortLevel;         // backward compat alias
  estimated_impact: string;
  specific_actions?: string[];           // Python field name
  action_items?: string[];               // backward compat alias
  recommended_action?: string;
  competitors_visible?: string[];
  your_visibility?: boolean;
  // Extended fields from handoff
  demand_estimate?: string;
  sentiment_signal?: string;
  competitor_mentions?: string[];
}

// VisibilitySummary — supports both key names from engine:
//   'your_visibility_summary' (handoff spec) and 'visibility_summary' (legacy)
export interface VisibilitySummary {
  overall_visibility_score?: number; // 0-100 — main metric (§10.1)
  your_brand_mentions?: number;
  total_prompts_tested: number;
  mention_rate: number;         // 0-1
  average_position?: number;    // backward compat
  avg_position?: number;        // Python field name
  base_model_visibility: number; // 0-100
  rag_model_visibility: number;  // 0-100
  actionable_gap: number;        // 0-100
  // Confidence intervals (per handoff spec §10)
  confidence_lower?: number;
  confidence_upper?: number;
  confidence_level?: ConfidenceLevel;
  sample_size?: number;
  data_completeness?: number;   // §8 — how many agents ran successfully
}

// Per-LLM scores from visibility_by_llm + confidence_by_llm fields
export interface LLMVisibilityScore {
  visibility_score: number;
  mention_rate: number;
  confidence?: number;
  average_position?: number;
}

export interface LLMProfile {
  provider: string;
  mention_rate: number;
  citation_quality: string;
  data_freshness: string;
}

// Individual prompt test result (for Prompt Results detailed view)
export interface LLMMention {
  brand_name: string;
  mentioned: boolean;
  position: number;
  strength?: string;
  raw_response?: string;
}

export interface PromptResult {
  prompt: string;
  prompt_type: string;
  signal_weight?: number;
  brand_mentioned: boolean;
  mention_rate: number;
  average_position?: number;
  avg_position?: number;
  // Python field name: dict of LLMMention lists
  llm_results?: Record<string, LLMMention[]>;
  // backward compat alias
  per_llm_results?: Record<string, {
    mentioned: boolean;
    position?: number;
    raw_response?: string;
  }>;
}

// Content gap analysis
export interface ContentGapAnalysis {
  covered: string[];     // keywords with strong coverage
  thin: string[];        // keywords with weak coverage
  missing: string[];     // keywords with no coverage
}

export interface KeywordDiscoveryResponse {
  brand_name: string;
  category: string;
  mode?: DiscoveryMode;                 // Python field name
  discovery_mode?: DiscoveryMode;       // backward compat alias
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
  // Both field names supported (engine may return either)
  your_visibility_summary?: VisibilitySummary;
  visibility_summary?: VisibilitySummary;
  // Per-LLM breakdowns — Python returns Record<string, number>
  visibility_by_llm?: Record<string, LLMVisibilityScore | number>;
  confidence_by_llm?: Record<string, number>;
  llm_profiles?: Record<string, LLMProfile>;
  // Prompt-level results
  prompt_results?: PromptResult[];
  // Content gap analysis
  content_gap_analysis?: ContentGapAnalysis;
  recommended_next_steps?: string[];    // Python field name
  next_steps?: string[];                // backward compat alias
  processing_time_seconds: number;
  timestamp: string;
  analysis_id: string;
  // Warning/error arrays from engine
  errors?: string[];
  warnings?: string[];
}

// Helper: resolve visibility summary from either field name
export function resolveVisibilitySummary(data: KeywordDiscoveryResponse): VisibilitySummary | null {
  return data.your_visibility_summary || data.visibility_summary || null;
}

// ---- Batch Keyword Discovery ----

export interface BatchBrandInput {
  brand_name: string;
  brand_aliases?: string[];
  category: string;
  competitors?: string[];
  target_audience?: string;
  region?: RegionScope;
  mode?: DiscoveryMode;
}

export interface BatchKeywordDiscoveryRequest {
  // BACKEND_HANDOFF_v2.0 §3.1 spec field name
  clients?: BatchBrandInput[];
  // Legacy field name (backward compat)
  brands?: BatchBrandInput[];
  shared_competitors?: string[];
  default_mode?: DiscoveryMode;
  default_llm_providers?: LLMProvider[];
  llm_providers?: LLMProvider[];
  runs_per_prompt?: number;
}

export interface BatchKeywordDiscoveryResponse {
  total_brands: number;
  completed: number;
  failed: number;
  results: KeywordDiscoveryResponse[];
  errors?: Array<{ brand_name: string; error: string }>;
  processing_time_seconds: number;
  timestamp: string;
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
  errors?: string[];
  warnings?: string[];
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
  errors?: string[];
  warnings?: string[];
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
  // Confidence intervals for shading (BACKEND_HANDOFF_v2.0 §10.7)
  confidence_lower?: number;
  confidence_upper?: number;
  // Per-LLM breakdown scores for individual provider lines
  visibility_by_llm?: Record<string, { visibility_score?: number; score?: number } | number>;
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

// ---- Full Analysis (Async) ----

export interface AnalyzeAsyncResponse {
  analysis_id: string;
  status: 'processing';
  brand_name: string;
  category: string;
}

export interface AnalyzeResultResponse {
  url?: string;
  brand_name: string;
  executive_summary: string;
  visibility_score: {
    overall: number;
    sub_scores: Record<string, number>;
    grade: string;
  };
  visibility_score_v19?: {
    overall: number;
    sub_scores: Record<string, number>;
    grade: string;
    evidence?: Record<string, string>;
    weights?: Record<string, number>;
    methodology_version?: string;
    overall_confidence?: number | null;
    confidence_details?: Record<string, { confidence: number; source: string; verified: boolean }> | null;
    verification_status?: Record<string, { verified: boolean; source: string; confidence: number }> | null;
    consistency_alerts?: Array<{ dimension: string; alert: string; severity: string }> | null;
    platform_readiness?: Record<string, number> | null;
    eeat_breakdown?: { experience: number; expertise: number; authoritativeness: number; trustworthiness: number; total: number } | null;
    schema_audit?: Record<string, unknown> | null;
    citability_dimensions?: Record<string, number> | null;
  };
  recommendations: Array<Record<string, unknown>>;
  generated_content?: Record<string, unknown>;
  battle_cards?: Array<Record<string, unknown>>;
  ai_ready_tips?: Record<string, unknown>;
  llm_visibility?: Array<Record<string, unknown>>;
  web_presence?: Record<string, unknown>;
  image_analysis?: Record<string, unknown>;
  page_audit?: Record<string, unknown>;
  what_ai_sees?: string;
  citation_sources?: Array<Record<string, unknown>>;
  competitor_comparison?: Array<{ competitor_name: string; authority_score: number; llm_mention_rate: number; strengths: string[]; weaknesses: string[]; your_advantages: string[] }>;
  improvement_roadmap?: Array<{ action: string; impact: string; timeframe: string; effort: string }>;
  platform_recommendations?: Record<string, string[]>;
  reflection_insights?: string[];
  prediction_accuracy?: number | null;
  absence_analysis?: Array<Record<string, unknown>>;
  prompt_vulnerabilities?: Array<Record<string, unknown>>;
  tested_providers?: string[];
  untested_providers?: string[];
  scan_coverage?: Record<string, unknown>;
  processing_time_seconds: number;
  quality_check_passed?: boolean;
  methodology?: Record<string, unknown> | null;
  previous_scores?: Array<{ date: string; overall: number; grade: string }> | null;
  layers_completed?: string[];
  analyzed_at?: string;
}

// ---- Score helpers ----

export function getScoreGrade(score: number): { grade: string; color: string; label: string; textClass: string; badgeClass: string } {
  if (score >= 80) return { grade: 'A', color: '#10B981', label: 'Excellent', textClass: 'text-emerald-500', badgeClass: 'bg-emerald-500/10 text-emerald-500' };
  if (score >= 60) return { grade: 'B', color: '#F59E0B', label: 'Good', textClass: 'text-amber-500', badgeClass: 'bg-amber-500/10 text-amber-500' };
  if (score >= 40) return { grade: 'C', color: '#EF4444', label: 'Fair', textClass: 'text-red-500', badgeClass: 'bg-red-500/10 text-red-500' };
  return { grade: 'D', color: '#7C3AED', label: 'Poor', textClass: 'text-violet-600', badgeClass: 'bg-violet-600/10 text-violet-600' };
}

export const VISIBILITY_LEVELS = {
  high: { color: '#10B981', icon: '📈', label: 'High Potential' },
  medium: { color: '#F59E0B', icon: '↔️', label: 'Medium Potential' },
  low: { color: '#EF4444', icon: '📉', label: 'Low Potential' },
  none: { color: '#6B7280', icon: '🚫', label: 'No Potential' },
} as const;

// LLM provider display info — all 6 providers per handoff spec
export const LLM_PROVIDER_INFO: Record<string, { label: string; icon: string; color: string; textClass: string; barClass: string; iconBadgeClass: string }> = {
  chatgpt:      { label: 'ChatGPT',          icon: '🤖', color: '#10A37F', textClass: 'text-emerald-600', barClass: 'bg-emerald-600', iconBadgeClass: 'bg-emerald-600/10 border border-emerald-600/20' },
  gemini:       { label: 'Gemini',           icon: '✨', color: '#4285F4', textClass: 'text-blue-500',    barClass: 'bg-blue-500',    iconBadgeClass: 'bg-blue-500/10 border border-blue-500/20' },
  perplexity:   { label: 'Perplexity',       icon: '🔍', color: '#20B2AA', textClass: 'text-teal-400',   barClass: 'bg-teal-400',    iconBadgeClass: 'bg-teal-400/10 border border-teal-400/20' },
  claude:       { label: 'Claude',           icon: '🧠', color: '#CC785C', textClass: 'text-orange-400', barClass: 'bg-orange-400',  iconBadgeClass: 'bg-orange-400/10 border border-orange-400/20' },
  grok:         { label: 'Grok',             icon: '⚡', color: '#1DA1F2', textClass: 'text-sky-400',    barClass: 'bg-sky-400',     iconBadgeClass: 'bg-sky-400/10 border border-sky-400/20' },
  digitalocean: { label: 'DigitalOcean AI',  icon: '🌊', color: '#0080FF', textClass: 'text-blue-600',   barClass: 'bg-blue-600',    iconBadgeClass: 'bg-blue-600/10 border border-blue-600/20' },
  nvidia:       { label: 'NVIDIA NIM',       icon: '🟢', color: '#76B900', textClass: 'text-lime-500',   barClass: 'bg-lime-500',    iconBadgeClass: 'bg-lime-500/10 border border-lime-500/20' },
  // Aliases — backend normalizes openai→chatgpt, google→gemini; keep entries so UI lookups don't fail
  openai:       { label: 'ChatGPT',          icon: '🤖', color: '#10A37F', textClass: 'text-emerald-600', barClass: 'bg-emerald-600', iconBadgeClass: 'bg-emerald-600/10 border border-emerald-600/20' },
  google:       { label: 'Gemini',           icon: '✨', color: '#4285F4', textClass: 'text-blue-500',    barClass: 'bg-blue-500',    iconBadgeClass: 'bg-blue-500/10 border border-blue-500/20' },
};
