import axios, { AxiosInstance, AxiosError } from 'axios';
import { createClient } from '@/utils/supabase/client';
import type {
  KeywordDiscoveryRequest,
  KeywordDiscoveryResponse,
  KeywordTestRequest,
  KeywordTestResponse,
  KeywordValidateRequest,
  KeywordValidateResponse,
  ContentValidationRequest,
  ContentValidationResponse,
  ContentLiveTestRequest,
  ContentLiveTestResponse,
  ProgressTrackingRequest,
  ProgressTrendResponse,
  Analysis,
  BatchKeywordDiscoveryRequest,
  BatchKeywordDiscoveryResponse,
  AnalyzeAsyncResponse,
  AnalyzeResultResponse,
} from './geo-types';
import type {
  GeoAnalysisRequest,
  GeoAnalysisAsyncResponse,
  GeoAnalysisResponse,
  StoredGeoAnalysis,
  AnalysisProgress,
} from './report-types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// ---- Unified Reports types ----

export interface UnifiedReport {
  id: string;
  type: 'geo' | 'keywords' | 'content';
  brand_name: string;
  score: number | null;
  grade: string;
  status: string;
  created_at: string;
  summary: string;
}

export interface ReportsListResponse {
  reports: UnifiedReport[];
  total: number;
  limit: number;
  offset: number;
}

// ---- Error types per BACKEND_HANDOFF_v2.0 §8 ----

export interface GEOApiError {
  status: number;
  code: 'CONTENT_TOO_LARGE' | 'VALIDATION_ERROR' | 'QUOTA_EXCEEDED' | 'RATE_LIMITED' | 'PIPELINE_LIMIT' | 'UNAUTHORIZED' | 'SERVER_ERROR' | 'UNKNOWN';
  message: string;
  /** 422 field-level errors: [{ loc: string[], msg: string, type: string }] */
  validationErrors?: Array<{ loc: string[]; msg: string; type: string }>;
  /** 429 quota info: { used, limit, plan } */
  quota?: { used: number; limit: number; plan: string };
  /** 429 pipeline info */
  activePipelines?: number;
  maxConcurrent?: number;
  raw?: unknown;
}

/**
 * Parse an Axios error into a structured GEOApiError.
 * Components can use this to show contextual error messages.
 */
export function parseGEOError(error: unknown): GEOApiError {
  if (!axios.isAxiosError(error)) {
    return {
      status: 0,
      code: 'UNKNOWN',
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }

  const axiosErr = error as AxiosError<Record<string, unknown>>;
  const status = axiosErr.response?.status || 0;
  const data = axiosErr.response?.data || {};

  switch (status) {
    case 413:
      return {
        status: 413,
        code: 'CONTENT_TOO_LARGE',
        message: 'Content is too large. Maximum allowed size is 2MB. Please reduce your content and try again.',
        raw: data,
      };

    case 422: {
      const detail = data.detail as Array<{ loc: string[]; msg: string; type: string }> | undefined;
      const fieldErrors = Array.isArray(detail)
        ? detail.map(d => `${d.loc.join('.')}: ${d.msg}`).join('; ')
        : '';
      return {
        status: 422,
        code: 'VALIDATION_ERROR',
        message: fieldErrors || (data.error as string) || 'Invalid request data. Please check your inputs.',
        validationErrors: Array.isArray(detail) ? detail : undefined,
        raw: data,
      };
    }

    case 429: {
      // Distinguish between quota exceeded and pipeline limit
      const quota = data.quota as { used: number; limit: number; plan: string } | undefined;
      const activePipelines = data.active_pipelines as number | undefined;

      if (activePipelines !== undefined) {
        return {
          status: 429,
          code: 'PIPELINE_LIMIT',
          message: (data.message as string) || `Too many concurrent analyses running (${activePipelines}/${data.max_concurrent || 5}). Please wait for current analyses to complete.`,
          activePipelines,
          maxConcurrent: (data.max_concurrent as number) || 5,
          raw: data,
        };
      }

      if (quota) {
        return {
          status: 429,
          code: 'QUOTA_EXCEEDED',
          message: (data.message as string) || `API quota exceeded (${quota.used}/${quota.limit}). Upgrade your ${quota.plan} plan to continue.`,
          quota,
          raw: data,
        };
      }

      return {
        status: 429,
        code: 'RATE_LIMITED',
        message: (data.error as string) || 'Too many requests. Please wait a moment and try again.',
        raw: data,
      };
    }

    case 401:
      return {
        status: 401,
        code: 'UNAUTHORIZED',
        message: 'Your session has expired. Please log in again.',
        raw: data,
      };

    default:
      return {
        status,
        code: 'SERVER_ERROR',
        message: (data.error as string) || (data.message as string) || 'Something went wrong. Please try again.',
        raw: data,
      };
  }
}

// ---- API Client ----

class GEOApi {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: { 'Content-Type': 'application/json' },
      timeout: 120000, // 2 min — keyword discovery can take up to 90s
    });

    // Attach Supabase auth token on every request, refreshing if expired
    this.client.interceptors.request.use(async (config) => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
          const isExpired = session.expires_at
            ? session.expires_at * 1000 <= Date.now()
            : false;

          if (isExpired) {
            const { data: refreshed, error: refreshError } =
              await supabase.auth.refreshSession();
            if (refreshError || !refreshed.session) {
              if (typeof window !== 'undefined') {
                window.location.href = '/login';
              }
              return config;
            }
            config.headers.Authorization = `Bearer ${refreshed.session.access_token}`;
          } else {
            config.headers.Authorization = `Bearer ${session.access_token}`;
          }
        }
      } catch {
        // no-op if supabase not available (e.g. SSR)
      }
      return config;
    });

    // Global error handling — per BACKEND_HANDOFF_v2.0 §8
    this.client.interceptors.response.use(
      (res) => res,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Redirect to login on auth failure
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        // All other errors pass through — components use parseGEOError() for display
        return Promise.reject(error);
      }
    );
  }

  // ---- Keywords ----

  async discoverKeywords(request: KeywordDiscoveryRequest): Promise<KeywordDiscoveryResponse> {
    const { data } = await this.client.post('/api/v1/keywords/discover', request);
    return data;
  }

  async testKeywords(request: KeywordTestRequest): Promise<KeywordTestResponse> {
    const { data } = await this.client.post('/api/v1/keywords/test', request);
    return data;
  }

  async validateKeyword(request: KeywordValidateRequest): Promise<KeywordValidateResponse> {
    const { data } = await this.client.post('/api/v1/keywords/validate', request);
    return data;
  }

  /** Agency mode: discover keywords for multiple brands in one request */
  async batchDiscover(request: BatchKeywordDiscoveryRequest): Promise<BatchKeywordDiscoveryResponse> {
    const { data } = await this.client.post('/api/v1/keywords/batch', request);
    return data;
  }

  // ---- Content ----

  async validateContent(request: ContentValidationRequest): Promise<ContentValidationResponse> {
    const { data } = await this.client.post('/api/v1/content/validate', request);
    return data;
  }

  async testContentLive(request: ContentLiveTestRequest): Promise<ContentLiveTestResponse> {
    const { data } = await this.client.post('/api/v1/content/test-live', request);
    return data;
  }

  // ---- Full Analyze (async pipeline) ----

  /** Submit a full GEO analysis — returns immediately with {analysis_id, status: "processing"} */
  async runAnalyzeAsync(request: GeoAnalysisRequest): Promise<GeoAnalysisAsyncResponse> {
    const { data } = await this.client.post('/api/v1/analyze', request);
    return data;
  }

  /** Fetch completed analysis result by job ID */
  async getAnalyzeResult(analysisId: string): Promise<GeoAnalysisResponse> {
    // Full pipeline can take up to 420s — use extended timeout
    const { data } = await this.client.get(`/api/v1/analyze/${analysisId}/result`, { timeout: 480000 });
    return data;
  }

  /** Poll analysis progress */
  async pollProgress(analysisId: string): Promise<AnalysisProgress> {
    const { data } = await this.client.get(`/api/v1/progress/poll/${analysisId}`, { timeout: 10000 });
    return data;
  }

  /**
   * Get SSE stream URL with auth token embedded as a query param.
   * The token is passed in the URL because the EventSource API does not
   * support custom Authorization headers.
   */
  async getSSEStreamUrl(analysisId: string): Promise<string> {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error('No active session. Please log in to stream analysis progress.');
    }
    return `${API_BASE_URL}/api/v1/progress/stream/${analysisId}?token=${encodeURIComponent(session.access_token)}`;
  }

  // ---- Progress ----

  async getVisibilityTrend(request: ProgressTrackingRequest): Promise<ProgressTrendResponse> {
    const { data } = await this.client.post('/api/v1/progress/trend', request);
    return data;
  }

  // ---- Analyses (from Supabase via Express) ----

  async getAnalyses(brand?: string, type?: string, limit?: number): Promise<Analysis[]> {
    const params = new URLSearchParams();
    if (brand) params.set('brand', brand);
    if (type) params.set('type', type);
    if (limit) params.set('limit', String(limit));
    const { data } = await this.client.get(`/api/v1/progress/analyses?${params.toString()}`);
    return data;
  }

  /** Get all GEO analyses for the user */
  async getGeoAnalyses(brand?: string, limit?: number): Promise<StoredGeoAnalysis[]> {
    const params = new URLSearchParams();
    if (brand) params.set('brand', brand);
    if (limit) params.set('limit', String(limit));
    const { data } = await this.client.get(`/api/v1/progress/geo-analyses?${params.toString()}`);
    return data;
  }

  /** Get a single GEO analysis by ID (includes full response_payload) */
  async getGeoAnalysis(id: string): Promise<StoredGeoAnalysis> {
    const { data } = await this.client.get(`/api/v1/progress/geo-analyses/${id}`);
    return data;
  }

  async getAnalysis(id: string): Promise<Analysis> {
    const { data } = await this.client.get(`/api/v1/keywords/analyses/${id}`);
    return data;
  }

  async checkPythonHealth() {
    const { data } = await this.client.get('/api/v1/progress/health');
    return data;
  }

  // ---- Brands ----

  async getBrands() {
    const { data } = await this.client.get('/api/brands');
    return data;
  }

  async getBrand(id: string) {
    const { data } = await this.client.get(`/api/brands/${id}`);
    return data;
  }

  async createBrand(body: Record<string, unknown>) {
    const { data } = await this.client.post('/api/brands', body);
    return data;
  }

  async updateBrand(id: string, body: Record<string, unknown>) {
    const { data } = await this.client.put(`/api/brands/${id}`, body);
    return data;
  }

  async deleteBrand(id: string) {
    const { data } = await this.client.delete(`/api/brands/${id}`);
    return data;
  }

  async getBrandAnalyses(id: string, limit = 20) {
    const { data } = await this.client.get(`/api/brands/${id}/analyses?limit=${limit}`);
    return data;
  }

  // ---- Unified Reports ----

  async getReports(params?: {
    type?: string;
    brand?: string;
    sort?: string;
    limit?: number;
    offset?: number;
  }): Promise<ReportsListResponse> {
    const { data } = await this.client.get('/api/v1/reports', { params });
    return data;
  }
}

// Export as singleton
export const geoApi = new GEOApi();

