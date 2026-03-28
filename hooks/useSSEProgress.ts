'use client';

import { useState, useEffect, useRef } from 'react';

export interface AnalysisProgress {
  analysis_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  current_stage: string;
  progress_percent: number;
  stage_progress_percent: number;
  completed_stages: string[];
  error_message?: string;
  estimated_seconds_remaining?: number;
  timestamp: string;
}

const STAGE_LABELS: Record<string, string> = {
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
 * and streams real-time progress for a running analysis.
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

    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const url = `${apiBase}/api/v1/progress/stream/${analysisId}`;

    // Close any existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const es = new EventSource(url, { withCredentials: true });
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
      } catch {}
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
      setError('Connection lost. Progress tracking stopped.');
      es.close();
      setConnected(false);
    };

    return () => {
      es.close();
      eventSourceRef.current = null;
    };
  }, [analysisId]);

  const disconnect = () => {
    eventSourceRef.current?.close();
    setConnected(false);
  };

  const stageLabel = progress?.current_stage
    ? STAGE_LABELS[progress.current_stage] ?? progress.current_stage
    : 'Waiting to start…';

  return { progress, connected, error, stageLabel, disconnect };
}
