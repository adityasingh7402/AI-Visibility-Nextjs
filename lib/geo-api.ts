import axios, { AxiosInstance } from 'axios';
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
} from './geo-types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

class GEOApi {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: { 'Content-Type': 'application/json' },
      timeout: 120000, // 2 min — keyword discovery can take up to 90s
    });

    // Attach Supabase auth token on every request
    this.client.interceptors.request.use(async (config) => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          config.headers.Authorization = `Bearer ${session.access_token}`;
        }
      } catch (e) {
        // no-op if supabase not available
      }
      return config;
    });

    // Global error handling
    this.client.interceptors.response.use(
      (res) => res,
      (error) => {
        if (error.response?.status === 401) {
          window.location.href = '/login';
        }
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

  // ---- Full Analyze (legacy) ----

  async runAnalyze(request: KeywordDiscoveryRequest): Promise<KeywordDiscoveryResponse> {
    const { data } = await this.client.post('/api/v1/analyze', request);
    return data;
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

  async getAnalysis(id: string): Promise<Analysis> {
    const { data } = await this.client.get(`/api/v1/keywords/analyses/${id}`);
    return data;
  }

  async checkPythonHealth() {
    const { data } = await this.client.get('/api/v1/progress/health');
    return data;
  }
}

// Export as singleton
export const geoApi = new GEOApi();
