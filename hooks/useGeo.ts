'use client';

import { useState, useCallback } from 'react';
import { geoApi } from '@/lib/geo-api';
import type {
  KeywordDiscoveryRequest,
  KeywordDiscoveryResponse,
  KeywordTestRequest,
  KeywordTestResponse,
  ContentValidationRequest,
  ContentValidationResponse,
  ContentLiveTestRequest,
  ContentLiveTestResponse,
  ProgressTrackingRequest,
  ProgressTrendResponse,
  Analysis,
  BatchKeywordDiscoveryRequest,
  BatchKeywordDiscoveryResponse,
} from '@/lib/geo-types';

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
    } catch (e: any) {
      const msg = e.response?.data?.error || e.message || 'Keyword discovery failed';
      setError(msg);
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
    } catch (e: any) {
      const msg = e.response?.data?.error || e.message || 'Batch discovery failed';
      setError(msg);
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
    } catch (e: any) {
      const msg = e.response?.data?.error || e.message || 'Keyword test failed';
      setError(msg);
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
    } catch (e: any) {
      const msg = e.response?.data?.error || e.message || 'Content validation failed';
      setError(msg);
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
    } catch (e: any) {
      const msg = e.response?.data?.error || e.message || 'Live test failed';
      setError(msg);
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
    } catch (e: any) {
      const msg = e.response?.data?.error || e.message || 'Failed to load trend data';
      setError(msg);
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
    } catch (e: any) {
      const msg = e.response?.data?.error || e.message || 'Failed to load analyses';
      setError(msg);
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
    } catch (e: any) {
      const msg = e.response?.data?.error || e.message || 'Analysis not found';
      setError(msg);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchAnalysis };
}
