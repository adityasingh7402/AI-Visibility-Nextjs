'use client';

import { useEffect, useState, useMemo } from 'react';
import { parseGEOError, type GEOApiError } from '@/lib/geo-api';

// ---- Error code styling ----

const ERROR_STYLES: Record<GEOApiError['code'], {
  icon: string;
  bg: string;
  border: string;
  text: string;
  title: string;
}> = {
  CONTENT_TOO_LARGE: {
    icon: '📦',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-300',
    title: 'Content Too Large',
  },
  VALIDATION_ERROR: {
    icon: '⚠️',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    text: 'text-orange-300',
    title: 'Validation Error',
  },
  QUOTA_EXCEEDED: {
    icon: '🚫',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-300',
    title: 'Quota Exceeded',
  },
  RATE_LIMITED: {
    icon: '⏱️',
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    text: 'text-yellow-300',
    title: 'Rate Limited',
  },
  PIPELINE_LIMIT: {
    icon: '🔄',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-300',
    title: 'Too Many Analyses',
  },
  UNAUTHORIZED: {
    icon: '🔒',
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/30',
    text: 'text-slate-300',
    title: 'Session Expired',
  },
  SERVER_ERROR: {
    icon: '💥',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-300',
    title: 'Server Error',
  },
  UNKNOWN: {
    icon: '❓',
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/30',
    text: 'text-slate-300',
    title: 'Error',
  },
};

interface ApiErrorToastProps {
  /** Pass the raw caught error — we'll parse it */
  error: unknown | null;
  /** Auto-dismiss after N ms (0 = never) */
  autoDismissMs?: number;
  /** Callback when dismissed */
  onDismiss?: () => void;
}

/**
 * ApiErrorToast — displays a styled, auto-dismissible error toast
 * for any BACKEND_HANDOFF_v2.0 §8 error code (413/422/429/500/etc).
 *
 * Usage:
 *   const [apiError, setApiError] = useState(null);
 *   try { await geoApi.discoverKeywords(...) }
 *   catch (err) { setApiError(err); }
 *   <ApiErrorToast error={apiError} onDismiss={() => setApiError(null)} />
 */
export function ApiErrorToast({ error, autoDismissMs = 8000, onDismiss }: ApiErrorToastProps) {
  const [dismissedError, setDismissedError] = useState<unknown>(null);
  const parsed = useMemo(() => (error ? parseGEOError(error) : null), [error]);
  const visible = !!error && error !== dismissedError;

  useEffect(() => {
    if (!error || !visible) return;

    if (autoDismissMs > 0) {
      const timer = setTimeout(() => {
        setDismissedError(error);
        onDismiss?.();
      }, autoDismissMs);
      return () => clearTimeout(timer);
    }
  }, [error, visible, autoDismissMs, onDismiss]);

  if (!visible || !parsed) return null;

  const style = ERROR_STYLES[parsed.code] || ERROR_STYLES.UNKNOWN;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 max-w-md w-full rounded-2xl border ${style.border} ${style.bg} backdrop-blur-xl shadow-2xl p-5 animate-in slide-in-from-bottom-4 duration-300`}
    >
      <div className="flex items-start gap-3">
        <span className="text-xl flex-shrink-0 mt-0.5">{style.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className={`text-sm font-black ${style.text}`}>{style.title}</h4>
            <span className="text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">
              {parsed.status || '—'}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{parsed.message}</p>

          {/* 422: Show field errors */}
          {parsed.validationErrors && parsed.validationErrors.length > 0 && (
            <ul className="mt-2 space-y-1">
              {parsed.validationErrors.map((ve, i) => (
                <li key={i} className="text-[10px] text-orange-400 bg-orange-500/10 rounded-lg px-2 py-1">
                  <span className="font-bold">{ve.loc.join('.')}</span>: {ve.msg}
                </li>
              ))}
            </ul>
          )}

          {/* 429 quota: Show usage */}
          {parsed.quota && (
            <div className="mt-2 flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-red-400 transition-all"
                  style={{ width: `${Math.min((parsed.quota.used / parsed.quota.limit) * 100, 100)}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-red-400">
                {parsed.quota.used}/{parsed.quota.limit}
              </span>
            </div>
          )}

          {/* 429 pipeline: Show active count */}
          {parsed.activePipelines !== undefined && (
            <p className="mt-1 text-[10px] text-blue-400 font-bold">
              {parsed.activePipelines}/{parsed.maxConcurrent || 5} pipelines active
            </p>
          )}
        </div>

        <button
          onClick={() => { setDismissedError(error); onDismiss?.(); }}
          className="text-slate-500 hover:text-white transition-colors text-sm flex-shrink-0"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
