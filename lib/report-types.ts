// ============================================================
// GEO V1.9 Report Types — Full Analysis Response
// Aligned with Python AnalyzeResponse (models/analysis.py)
// ============================================================

// ── Scan mode / analysis type enums ──
export type ScanMode = 'quick' | 'full' | 'deep';
export type GeoAnalysisType = 'full' | 'geo_only' | 'seo_only' | 'marketing_only';
export type IndustryProfile = 'saas' | 'local_business' | 'ecommerce' | 'media_publisher';
export type GeoProvider = 'chatgpt' | 'gemini' | 'perplexity' | 'claude' | 'grok' | 'nvidia' | 'digitalocean';

// ── V1.9 Score Models ──

export interface VisibilitySubScoresV19 {
  // AI Visibility Cluster (35%)
  llm_mention: number;
  llm_consistency: number;
  llm_position: number;
  // Authority Cluster (20%)
  authority: number;
  web_presence: number;
  citation_strength: number;
  // Content Cluster (20%)
  content_fit: number;
  citability: number;
  page_quality: number;
  freshness: number;
  // Technical Cluster (10%)
  technical_seo: number;
  ai_readiness: number;
  // Competitive Cluster (10%)
  competitor_gap: number;
  pattern_match: number;
  // Signal Cluster (3%)
  sentiment: number;
  consistency: number;
  // AEO
  aeo_readiness: number;
}

export interface VisibilityScoreV19 {
  overall: number;
  sub_scores: VisibilitySubScoresV19;
  grade: string;
  evidence: Record<string, string>;
  weights: Record<string, number>;
  methodology_version: string;
  // Confidence
  overall_confidence: number | null;
  confidence_details: Record<string, { confidence: number; source: string; verified: boolean }> | null;
  // Anti-hallucination
  verification_status: Record<string, { verified: boolean; source: string; confidence: number }> | null;
  consistency_alerts: Array<{ dimension: string; alert: string; severity: string }> | null;
  // Extended scores
  platform_readiness: PlatformReadiness | null;
  eeat_breakdown: EEATBreakdown | null;
  schema_audit: SchemaAudit | null;
  citability_dimensions: Record<string, number> | null;
}

export interface PlatformReadiness {
  google_aio?: number;
  chatgpt?: number;
  perplexity?: number;
  gemini?: number;
  bing_copilot?: number;
  [key: string]: number | undefined;
}

export interface EEATBreakdown {
  experience: number;
  expertise: number;
  authoritativeness: number;
  trustworthiness: number;
  total: number;
}

export interface SchemaAudit {
  same_as_links: string[];
  speakable_detected: boolean;
  deprecated_schemas: string[];
  per_type_scores: Record<string, number>;
  overall_score: number;
}

// ── V1.8 Legacy Score ──

export interface VisibilityScore {
  overall: number;
  sub_scores: {
    llm_mention: number;
    llm_consistency: number;
    llm_position: number;
    authority: number;
    web_presence: number;
    citation_strength: number;
    content_fit: number;
  };
  grade: string;
  weights: Record<string, number>;
}

// ── Competitor Comparison ──

export interface CompetitorComparison {
  competitor_name: string;
  authority_score: number;
  llm_mention_rate: number;
  strengths: string[];
  weaknesses: string[];
  your_advantages: string[];
}

// ── Improvement Roadmap ──

export interface ImprovementAction {
  action: string;
  impact: 'low' | 'medium' | 'high';
  timeframe: 'short-term' | 'medium-term' | 'long-term';
  effort: 'low' | 'medium' | 'high';
}

// ── Recommendation ──

export interface Recommendation {
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  confidence: number;
  action_items: string[];
  estimated_effort: string;
  time_to_impact: string;
  estimated_roi: string;
}

// ── LLM Visibility Result ──

export interface LLMVisibilityResult {
  provider: string;
  mentioned: boolean;
  mention_rate: number;
  average_position: number;
  consistency_score: number;
  prompts_tested: number;
  raw_responses?: string[];
}

// ── Absence Analysis (M11) ──

export interface AbsenceAnalysis {
  provider: string;
  prompt: string;
  reason: string;
  competing_brands: string[];
  fix_suggestion: string;
}

// ── Prompt Vulnerability (M11) ──

export interface PromptVulnerability {
  prompt: string;
  prompt_type: string;
  vulnerability: string;
  brands_visible: string[];
  fix_approach: string;
}

// ── Scan Coverage ──

export interface ScanCoverage {
  scan_mode: ScanMode;
  providers_tested: number;
  total_data_points: number;
  prompts_per_provider: number;
  [key: string]: unknown;
}

// ── Methodology ──

export interface Methodology {
  version: string;
  layers_run: number;
  total_data_points: number;
  scan_mode: ScanMode;
  providers: string[];
  [key: string]: unknown;
}

// ============================================================
// FULL GEO ANALYSIS RESPONSE (Python AnalyzeResponse)
// ============================================================

export interface GeoAnalysisResponse {
  // Core
  url: string;
  brand_name: string;
  executive_summary: string;
  visibility_score: VisibilityScore;

  // V1.9 enhanced
  visibility_score_v19: VisibilityScoreV19 | null;
  competitor_comparison: CompetitorComparison[];
  improvement_roadmap: ImprovementAction[];
  platform_recommendations: Record<string, string[]>;
  reflection_insights: string[];
  prediction_accuracy: number | null;
  layers_completed: string[];

  // Detailed results
  recommendations: Recommendation[];
  generated_content: Record<string, unknown>;
  battle_cards: Array<Record<string, unknown>>;
  ai_ready_tips: Record<string, unknown>;
  llm_visibility: LLMVisibilityResult[];
  web_presence: Record<string, unknown>;
  image_analysis: Record<string, unknown>;
  page_audit: Record<string, unknown>;
  what_ai_sees: string;
  citation_sources: Array<Record<string, unknown>>;

  // M11 differentiators
  absence_analysis: AbsenceAnalysis[];
  prompt_vulnerabilities: PromptVulnerability[];

  // Scan coverage
  tested_providers: string[];
  untested_providers: string[];
  scan_coverage: ScanCoverage;

  // Metadata
  processing_time_seconds: number;
  quality_check_passed: boolean;
  analyzed_at: string;
  methodology: Methodology | null;
  previous_scores: Array<{ date: string; overall: number; grade: string }> | null;
}

// ============================================================
// API Request / Async Types
// ============================================================

export interface GeoAnalysisRequest {
  url: string;
  brand_name: string;
  aliases?: string[];
  competitors?: string[];
  category?: string;
  brand_description?: string;
  region?: string;
  analysis_type?: GeoAnalysisType;
  scan_mode?: ScanMode;
  industry_profile?: IndustryProfile;
  providers?: GeoProvider[];
  provider_weights?: Record<string, number>;
  models?: Record<string, string>;
}

export interface GeoAnalysisAsyncResponse {
  analysis_id: string;
  status: 'processing';
  brand_name: string;
  scan_mode: ScanMode;
  analysis_type: GeoAnalysisType;
}

// ============================================================
// Progress Types
// ============================================================

export type ProgressPhase =
  | 'queued'
  | 'crawling'
  | 'researching'
  | 'testing_llms'
  | 'analyzing_images'
  | 'optimizing'
  | 'verifying'
  | 'completed'
  | 'failed';

export type ProgressStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface AnalysisProgress {
  analysis_id: string;
  status: ProgressStatus;
  current_stage: ProgressPhase;
  progress_percent: number;
  stage_progress_percent: number;
  completed_stages: ProgressPhase[];
  error_message?: string;
  message?: string;
  elapsed_seconds: number;
  has_result: boolean;
  estimated_seconds_remaining: number | null;
  timestamp: string;
  report_id?: string | null;
}

// ── Phase display metadata ──

export const PHASE_DISPLAY: Record<ProgressPhase, { label: string; icon: string; description: string }> = {
  queued:           { label: 'Queued',           icon: '⏳', description: 'Waiting in queue' },
  crawling:         { label: 'Crawling',         icon: '🕸️', description: 'Scanning website pages' },
  researching:      { label: 'Researching',      icon: '🔬', description: 'Analyzing competitors & web presence' },
  testing_llms:     { label: 'Testing LLMs',     icon: '🤖', description: 'Probing AI models for brand mentions' },
  analyzing_images: { label: 'Image Analysis',   icon: '🖼️', description: 'Auditing visual content' },
  optimizing:       { label: 'Optimizing',       icon: '⚡', description: 'Generating recommendations' },
  verifying:        { label: 'Verifying',        icon: '✅', description: 'Quality verification' },
  completed:        { label: 'Complete',         icon: '🎉', description: 'Analysis finished' },
  failed:           { label: 'Failed',           icon: '❌', description: 'Analysis failed' },
};

// ── Active Pipeline (running analysis) ──

export interface ActivePipeline {
  id: string;
  analysis_id: string;
  brand_name: string;
  status: string;
  started_at: string;
  progress: AnalysisProgress | null;
}

// ============================================================
// Stored Analysis (from Supabase analyses table)
// ============================================================

export interface StoredGeoAnalysis {
  id: string;
  analysis_id: string | null;
  brand_name: string;
  category: string;
  overall_score: number | null;
  status: string;
  processing_time_seconds: number | null;
  created_at: string;
  request_payload: GeoAnalysisRequest;
  response_payload?: GeoAnalysisResponse;
}

// ============================================================
// V1.9 Dimension Metadata (for radar charts, dimension cards)
// ============================================================

export type V19Dimension = keyof VisibilitySubScoresV19;

export interface DimensionMeta {
  key: V19Dimension;
  label: string;
  cluster: string;
  weight: number;
  description: string;
}

export const V19_DIMENSIONS: DimensionMeta[] = [
  // AI Visibility Cluster (35%)
  { key: 'llm_mention',      label: 'LLM Mention',       cluster: 'AI Visibility',  weight: 0.15, description: 'How often AI models mention your brand' },
  { key: 'llm_consistency',  label: 'LLM Consistency',   cluster: 'AI Visibility',  weight: 0.10, description: 'Consistency of mentions across runs' },
  { key: 'llm_position',     label: 'LLM Position',      cluster: 'AI Visibility',  weight: 0.10, description: 'Where your brand appears in AI responses' },
  // Authority Cluster (20%)
  { key: 'authority',         label: 'Authority',         cluster: 'Authority',      weight: 0.08, description: 'Domain authority and backlink profile' },
  { key: 'web_presence',     label: 'Web Presence',      cluster: 'Authority',      weight: 0.06, description: 'Breadth of online presence' },
  { key: 'citation_strength', label: 'Citation Strength', cluster: 'Authority',      weight: 0.06, description: 'Quality of external citations and mentions' },
  // Content Cluster (20%)
  { key: 'content_fit',      label: 'Content Fit',       cluster: 'Content',        weight: 0.06, description: 'How well content matches AI query patterns' },
  { key: 'citability',       label: 'Citability',        cluster: 'Content',        weight: 0.06, description: 'How easily AI can extract and cite your content' },
  { key: 'page_quality',     label: 'Page Quality',      cluster: 'Content',        weight: 0.04, description: 'Technical page quality metrics' },
  { key: 'freshness',        label: 'Freshness',         cluster: 'Content',        weight: 0.04, description: 'How recently content was updated' },
  // Technical Cluster (10%)
  { key: 'technical_seo',    label: 'Technical SEO',     cluster: 'Technical',      weight: 0.05, description: 'Schema markup, structured data, technical signals' },
  { key: 'ai_readiness',     label: 'AI Readiness',      cluster: 'Technical',      weight: 0.05, description: 'llms.txt, speakable schema, AI-specific signals' },
  // Competitive Cluster (10%)
  { key: 'competitor_gap',   label: 'Competitor Gap',    cluster: 'Competitive',    weight: 0.05, description: 'How you compare vs competitors in AI' },
  { key: 'pattern_match',    label: 'Pattern Match',     cluster: 'Competitive',    weight: 0.05, description: 'Match with successful competitor patterns' },
  // Signal Cluster (3%)
  { key: 'sentiment',        label: 'Sentiment',         cluster: 'Signals',        weight: 0.015, description: 'Online sentiment about your brand' },
  { key: 'consistency',      label: 'Consistency',       cluster: 'Signals',        weight: 0.015, description: 'Cross-platform brand consistency' },
  // AEO (2%)
  { key: 'aeo_readiness',    label: 'AEO Readiness',    cluster: 'AEO',            weight: 0.02, description: 'Answer Engine Optimization readiness' },
];

export const V19_CLUSTERS = [
  { name: 'AI Visibility', weight: 0.35, color: '#8B5CF6' },
  { name: 'Authority',     weight: 0.20, color: '#3B82F6' },
  { name: 'Content',       weight: 0.20, color: '#10B981' },
  { name: 'Technical',     weight: 0.10, color: '#F59E0B' },
  { name: 'Competitive',   weight: 0.10, color: '#EF4444' },
  { name: 'Signals',       weight: 0.03, color: '#6366F1' },
  { name: 'AEO',           weight: 0.02, color: '#EC4899' },
] as const;

// ── Score helpers ──

export function getGrade(score: number): string {
  if (score >= 80) return 'A';
  if (score >= 60) return 'B';
  if (score >= 40) return 'C';
  if (score >= 20) return 'D';
  return 'F';
}

export function getGradeColor(grade: string): string {
  switch (grade) {
    case 'A': return '#10B981';
    case 'B': return '#F59E0B';
    case 'C': return '#EF4444';
    case 'D': return '#7C3AED';
    default:  return '#6B7280';
  }
}
