'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import type { AnalysisProgress } from '@/lib/report-types';
import { PHASE_DISPLAY } from '@/lib/report-types';

const STAGE_LABELS: Record<string, string> = {
  // Uses PHASE_DISPLAY from report-types.ts as source of truth
  ...Object.fromEntries(Object.entries(PHASE_DISPLAY).map(([k, v]) => [k, v.description])),
  // Legacy agent-style names (backward compat)
  'Starting Analysis': 'Initializing agents…',
  'Running Crawler Agent': 'Crawling web content…',
  'Running Researcher Agent': 'Researching competitors…',
  'Running LLM Tester Agent': 'Testing AI model visibility…',
  'Running Image Analyzer': 'Analyzing brand imagery…',
  'Running Optimizer Agent': 'Generating GEO score…',
  'Running Verifier Agent': 'Verifying results…',
};

/**
 * useSSEProgress — connects to the Express SSE endpoint
 * per BACKEND_HANDOFF_v2.0 §6 (SSE Progress Streaming).
 *
 * Uses GET /api/v1/events/{job_id}?token=<jwt> (the spec-defined alias)
 * which internally routes to /api/v1/progress/stream/:analysisId.
 *
 * Passes the Supabase JWT as a query param since EventSource
 * doesn't support custom Authorization headers.
 *
 * Usage:
 *   const { progress, connected, error } = useSSEProgress(analysisId);
 */
export function useSSEProgress(analysisId: string | null) {
  const [progress, setProgress] = useState<AnalysisProgress | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!analysisId) return;

    let cancelled = false;
    let retryCount = 0;
    const MAX_RETRIES = 3;

    /**
     * Fetch a valid Supabase JWT, refreshing the session if the current
     * token is expired.  Returns null when no session exists.
     */
    const getToken = async (): Promise<string | null> => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.access_token) return null;

        const isExpired = session.expires_at
          ? session.expires_at * 1000 <= Date.now()
          : false;

        if (isExpired) {
          const { data: refreshed, error: refreshError } =
            await supabase.auth.refreshSession();
          if (refreshError || !refreshed.session) return null;
          return refreshed.session.access_token;
        }

        return session.access_token;
      } catch {
        return null;
      }
    };

    const connect = async () => {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      // Ensure we have a valid token before opening the SSE connection.
      // EventSource doesn't support Authorization headers, so the JWT is
      // passed as a query param.
      const token = await getToken();
      if (cancelled) return;

      if (!token) {
        setError('Authentication required. Please log in to track progress.');
        return;
      }

      // BACKEND_HANDOFF_v2.0 §3.4 / §6 — Use the spec-defined SSE alias endpoint
      const url = `${apiBase}/api/v1/events/${analysisId}?token=${encodeURIComponent(token)}`;

      // Close any existing connection
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      const es = new EventSource(url);
      eventSourceRef.current = es;

      es.addEventListener('connected', () => {
        setConnected(true);
        setError(null);
        retryCount = 0; // Reset on successful connection
      });

      es.addEventListener('progress', (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data) as AnalysisProgress;
          // Only update if progress moves forward (guard against server-side regression)
          setProgress(prev => {
            if (!prev) return data;
            if (data.progress_percent >= prev.progress_percent) return data;
            // Keep higher progress and stage_progress_percent but update other fields
            return {
              ...data,
              progress_percent: prev.progress_percent,
              stage_progress_percent: Math.max(
                data.stage_progress_percent ?? 0,
                prev.stage_progress_percent ?? 0,
              ),
            };
          });
        } catch {
          console.error('[SSE] Failed to parse progress event');
        }
      });

      es.addEventListener('complete', (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          setProgress(prev => prev ? {
            ...prev,
            status: data.status,
            progress_percent: 100,
            current_stage: 'completed',
            report_id: data.report_id || null,
          } : null);
        } catch { /* ignore */ }
        es.close();
        setConnected(false);
      });

      es.addEventListener('heartbeat', () => {
        // Connection alive, nothing to update
      });

      es.addEventListener('timeout', () => {
        setError('Analysis timed out');
        es.close();
        setConnected(false);
      });

      // Listen for backend-sent error events (e.g. consecutive poll failures)
      es.addEventListener('error', (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          const msg = data.message || data.error || 'Stream error from server';
          if (data.retrying) {
            // Transient error — backend is retrying, just log
            console.warn('[SSE] Server-side poll error (retrying):', msg);
          } else {
            // Fatal error — close and surface
            setError(msg);
            es.close();
            setConnected(false);
            eventSourceRef.current = null;
          }
        } catch {
          // Non-JSON error event — treat as fatal
          setError('Stream error from server');
          es.close();
          setConnected(false);
          eventSourceRef.current = null;
        }
      });

      // Network-level errors (connection dropped, 401, etc)
      es.onerror = () => {
        if (es.readyState === EventSource.CLOSED) {
          retryCount++;
          if (retryCount <= MAX_RETRIES && !cancelled) {
            console.warn(`[SSE] Connection lost, retrying (${retryCount}/${MAX_RETRIES})...`);
            es.close();
            eventSourceRef.current = null;
            setConnected(false);
            connect();
            return;
          }

          setError('Connection lost after multiple retries. Please refresh the page.');
          setConnected(false);
          eventSourceRef.current = null;
        }
      };
    };

    connect();

    return () => {
      cancelled = true;
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
    };
  }, [analysisId]);

  const disconnect = () => {
    eventSourceRef.current?.close();
    eventSourceRef.current = null;
    setConnected(false);
  };

  const stageLabel = progress?.current_stage
    ? STAGE_LABELS[progress.current_stage] ?? progress.current_stage
    : 'Waiting to start…';

  return { progress, connected, error, stageLabel, disconnect };
}
