'use client';

import { useState, useCallback } from 'react';
import { geoApi } from '@/lib/geo-api';
import type {
  KeywordDiscoveryRequest,
  KeywordDiscoveryResponse,
  KeywordTestRequest,
  KeywordTestResponse,
  KeywordValidateResponse,
  ContentValidationRequest,
  ContentValidationResponse,
  ContentLiveTestRequest,
  ProgressTrackingRequest,
  ProgressTrendResponse,
  Analysis,
  BatchKeywordDiscoveryRequest,
  BatchKeywordDiscoveryResponse,
} from '@/lib/geo-types';
import type {
  GeoAnalysisRequest,
  GeoAnalysisResponse,
  StoredGeoAnalysis,
  AnalysisProgress,
  ActivePipeline,
} from '@/lib/report-types';
import type { ProviderRegistry } from '@/lib/types/providers';

// Helper: extract error message from unknown catch value
type ApiErr = { response?: { data?: { error?: string } }; message?: string };
function apiMsg(e: unknown, fallback: string): string {
  const err = e as ApiErr;
  return err?.response?.data?.error || err?.message || fallback;
}

// ---- useKeywordDiscovery ----
export function useKeywordDiscovery() {
  const [data, setData] = useState<KeywordDiscoveryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const discover = useCallback(async (request: KeywordDiscoveryRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await geoApi.discoverKeywords(request);
      setData(result);
      return result;
    } catch (e: unknown) {
      setError(apiMsg(e, 'Keyword discovery failed'));
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => { setData(null); setError(null); }, []);
  return { data, loading, error, discover, reset };
}

// ---- useBatchDiscovery ----
export function useBatchDiscovery() {
  const [data, setData] = useState<BatchKeywordDiscoveryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const batchDiscover = useCallback(async (request: BatchKeywordDiscoveryRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await geoApi.batchDiscover(request);
      setData(result);
      return result;
    } catch (e: unknown) {
      setError(apiMsg(e, 'Batch discovery failed'));
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => { setData(null); setError(null); }, []);
  return { data, loading, error, batchDiscover, reset };
}

// ---- useKeywordTest ----
export function useKeywordTest() {
  const [data, setData] = useState<KeywordTestResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const test = useCallback(async (request: KeywordTestRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await geoApi.testKeywords(request);
      setData(result);
      return result;
    } catch (e: unknown) {
      setError(apiMsg(e, 'Keyword test failed'));
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, test };
}

// ---- useContentValidation ----
export function useContentValidation() {
  const [data, setData] = useState<ContentValidationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback(async (request: ContentValidationRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await geoApi.validateContent(request);
      setData(result);
      return result;
    } catch (e: unknown) {
      setError(apiMsg(e, 'Content validation failed'));
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const testLive = useCallback(async (request: ContentLiveTestRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await geoApi.testContentLive(request);
      setData(result as ContentValidationResponse);
      return result;
    } catch (e: unknown) {
      setError(apiMsg(e, 'Live test failed'));
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => { setData(null); setError(null); }, []);
  return { data, loading, error, validate, testLive, reset };
}

// ---- useVisibilityTrend ----
export function useVisibilityTrend() {
  const [data, setData] = useState<ProgressTrendResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrend = useCallback(async (request: ProgressTrackingRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await geoApi.getVisibilityTrend(request);
      setData(result);
      return result;
    } catch (e: unknown) {
      setError(apiMsg(e, 'Failed to load trend data'));
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchTrend };
}

// ---- useAnalyses ----
export function useAnalyses() {
  const [data, setData] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyses = useCallback(async (brand?: string, type?: string, limit?: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await geoApi.getAnalyses(brand, type, limit);
      setData(result);
      return result;
    } catch (e: unknown) {
      setError(apiMsg(e, 'Failed to load analyses'));
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchAnalyses };
}

// ---- useAnalysis (single) ----
export function useAnalysis() {
  const [data, setData] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await geoApi.getAnalysis(id);
      setData(result);
      return result;
    } catch (e: unknown) {
      setError(apiMsg(e, 'Analysis not found'));
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchAnalysis };
}

// ---- useFullAnalysis (V1.9 GEO pipeline) ----
export function useFullAnalysis() {
  const [data, setData] = useState<GeoAnalysisResponse | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [progress, setProgress] = useState<AnalysisProgress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(async (request: GeoAnalysisRequest) => {
    setLoading(true);
    setError(null);
    setData(null);
    setProgress(null);
    try {
      const result = await geoApi.runAnalyzeAsync(request);
      setAnalysisId(result.analysis_id);
      return result;
    } catch (e: unknown) {
      setError(apiMsg(e, 'Analysis failed'));
      setLoading(false);
      throw e;
    }
  }, []);

  const pollStatus = useCallback(async (id: string) => {
    try {
      const progressData = await geoApi.pollProgress(id);
      setProgress(progressData);
      return progressData;
    } catch {
      // non-fatal — poll again
      return null;
    }
  }, []);

  const fetchResult = useCallback(async (id: string) => {
    try {
      const result = await geoApi.getAnalyzeResult(id);
      if (result.visibility_score) {
        setData(result);
        setLoading(false);
      }
      return result;
    } catch (e: unknown) {
      setError(apiMsg(e, 'Failed to fetch result'));
      setLoading(false);
      throw e;
    }
  }, []);

  /** Call when SSE reports completion/failure to reset loading state */
  const markComplete = useCallback(() => {
    setLoading(false);
  }, []);

  /** Call when SSE encounters a fatal error */
  const markError = useCallback((msg: string) => {
    setError(msg);
    setLoading(false);
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setAnalysisId(null);
    setProgress(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, analysisId, progress, loading, error, submit, pollStatus, fetchResult, markComplete, markError, reset };
}

// ---- useGeoAnalyses (list stored analyses) ----
export function useGeoAnalyses() {
  const [data, setData] = useState<StoredGeoAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyses = useCallback(async (brand?: string, limit?: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await geoApi.getGeoAnalyses(brand, limit);
      setData(result);
      return result;
    } catch (e: unknown) {
      setError(apiMsg(e, 'Failed to load GEO analyses'));
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchAnalyses };
}

// ---- useGeoAnalysis (single stored analysis with full report) ----
export function useGeoAnalysis() {
  const [data, setData] = useState<StoredGeoAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await geoApi.getGeoAnalysis(id);
      setData(result);
      return result;
    } catch (e: unknown) {
      setError(apiMsg(e, 'GEO analysis not found'));
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchAnalysis };
}

// ---- useProviders (provider registry) ----
export function useProviders() {
  const [providers, setProviders] = useState<ProviderRegistry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await geoApi.getProviders();
      setProviders(result);
      return result;
    } catch (e: unknown) {
      setError(apiMsg(e, 'Failed to load providers'));
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { providers, loading, error, fetchProviders };
}

// ---- usePromptCheck ----
export function usePromptCheck() {
  const [data, setData] = useState<KeywordValidateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const check = useCallback(async (request: {
    brand_name: string;
    prompt: string;
    llm_providers?: string[];
  }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await geoApi.checkPrompt(request);
      setData(result);
      return result;
    } catch (e: unknown) {
      setError(apiMsg(e, 'Prompt check failed'));
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => { setData(null); setError(null); }, []);
  return { data, loading, error, check, reset };
}

// ---- useKeywordGeneration ----
export function useKeywordGeneration() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (request: {
    brand_name: string;
    category: string;
    competitors?: string[];
    target_audience?: string;
    url?: string;
    discovery_results?: Record<string, unknown>;
    llm_providers?: string[];
    keyword_style?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await geoApi.generateKeywords(request);
      setData(result);
      return result;
    } catch (e: unknown) {
      setError(apiMsg(e, 'Keyword generation failed'));
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => { setData(null); setError(null); }, []);
  return { data, loading, error, generate, reset };
}

// ---- useContentEnhancement ----
export function useContentEnhancement() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enhance = useCallback(async (request: {
    content: string;
    brand_name: string;
    target_queries?: string[];
    competitors?: string[];
    content_type?: string;
    validation_results?: Record<string, unknown>;
    enhancement_mode?: string;
    llm_provider?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await geoApi.enhanceContent(request);
      setData(result);
      return result;
    } catch (e: unknown) {
      setError(apiMsg(e, 'Content enhancement failed'));
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => { setData(null); setError(null); }, []);
  return { data, loading, error, enhance, reset };
}

// ---- Active Pipelines (running analyses) ----

export function useActivePipelines() {
  const [pipelines, setPipelines] = useState<ActivePipeline[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const result = await geoApi.getActivePipelines();
      setPipelines(result);
    } catch {
      setPipelines([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { pipelines, loading, refresh };
}
