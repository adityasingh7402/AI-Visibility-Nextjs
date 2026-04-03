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

    const connect = async () => {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      // Fetch the JWT from Supabase to pass as a query param
      let token = '';
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        token = session?.access_token || '';
      } catch {
        // If we can't get a token, try connecting anyway — backend will reject
      }

      if (cancelled) return;

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
      });

      es.addEventListener('progress', (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data) as AnalysisProgress;
          setProgress(data);
        } catch {
          console.error('[SSE] Failed to parse progress event');
        }
      });

      es.addEventListener('complete', (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          setProgress(prev => prev ? { ...prev, status: data.status } : null);
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

      es.onerror = () => {
        // Only close on CLOSED state; EventSource auto-reconnects on transient errors
        if (es.readyState === EventSource.CLOSED) {
          setError('Connection lost. Progress tracking stopped.');
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
