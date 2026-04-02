'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { geoApi } from '@/lib/geo-api';
import { getScoreGrade } from '@/lib/geo-types';
import type { AnalyzeResultResponse } from '@/lib/geo-types';
import { ScoreCard } from '@/components/geo/ScoreCard';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, Clock, CheckCircle2, XCircle, Shield, Brain, Globe, BarChart3, FileText, Layers
} from 'lucide-react';

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [data, setData] = useState<AnalyzeResultResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    geoApi.getAnalyzeResult(id)
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(err => {
        setError(err.response?.data?.error || err.message || 'Failed to load result');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <div className="w-16 h-16 rounded-[2rem] bg-primary/10 flex items-center justify-center animate-pulse">
          <Brain className="h-8 w-8 text-primary" />
        </div>
        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Loading Analysis Result...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
          <XCircle className="h-8 w-8 text-red-500" />
        </div>
        <div className="text-center">
          <p className="font-black text-xl text-red-500 uppercase tracking-tighter mb-2">Analysis Not Ready</p>
          <p className="text-sm text-slate-400 font-medium max-w-sm">{error || 'The analysis result is not available yet. It may still be processing.'}</p>
        </div>
        <Button onClick={() => router.back()} variant="outline" className="rounded-xl">
          <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  const score = data.visibility_score;
  const v19 = data.visibility_score_v19;
  const { grade, color, label: gradeLabel } = getScoreGrade(score.overall);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <Button onClick={() => router.push('/dashboard/reports')} variant="ghost" size="sm"
            className="rounded-xl text-slate-400 hover:text-white -ml-2 mb-2">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Reports
          </Button>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {data.brand_name}
          </h1>
          {data.url && (
            <p className="text-sm text-slate-400 font-medium">{data.url}</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/5 border border-primary/10">
            <Clock size={14} className="text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">
              {data.processing_time_seconds.toFixed(1)}s
            </span>
          </div>
          {data.quality_check_passed !== undefined && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border ${
              data.quality_check_passed
                ? 'bg-emerald-500/5 border-emerald-500/10 text-emerald-500'
                : 'bg-amber-500/5 border-amber-500/10 text-amber-500'
            }`}>
              {data.quality_check_passed ? <CheckCircle2 size={14} /> : <Shield size={14} />}
              <span className="text-[10px] font-black uppercase tracking-widest">
                {data.quality_check_passed ? 'Verified' : 'Unverified'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Overall GEO Score */}
      <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/5 p-8 md:p-10 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="text-center md:text-left">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">GEO Visibility Score</p>
            <p className="text-7xl font-black tracking-tighter" style={{ color }}>{Math.round(score.overall)}</p>
            <span className="text-sm font-black px-3 py-1 rounded-full mt-2 inline-block" style={{ backgroundColor: `${color}20`, color }}>
              Grade {score.grade || grade} — {gradeLabel}
            </span>
          </div>

          {/* Sub-scores */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(score.sub_scores || {}).map(([key, value]) => (
              <ScoreCard key={key} label={key.replace(/_/g, ' ')} score={value as number} size="sm" />
            ))}
          </div>
        </div>
      </div>

      {/* V1.9 Enhanced Scores */}
      {v19 && (
        <div className="space-y-6">
          {/* Platform Readiness */}
          {v19.platform_readiness && Object.keys(v19.platform_readiness).length > 0 && (
            <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/5 p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Platform Readiness</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {(Object.entries(v19.platform_readiness) as [string, Record<string, unknown> | number][]).map(([platform, detail]) => (
                  <div key={platform} className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{platform.replace(/_/g, ' ')}</p>
                    <p className="text-2xl font-black text-white">{typeof detail === 'object' ? Math.round((detail.score as number) ?? (detail.total as number) ?? 0) : Math.round(detail)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* E-E-A-T Breakdown */}
          {v19.eeat_breakdown && Object.keys(v19.eeat_breakdown).length > 0 && (
            <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/5 p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-emerald-500" />
                <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">E-E-A-T Breakdown</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(Object.entries(v19.eeat_breakdown) as [string, Record<string, unknown> | number][]).map(([dim, val]) => (
                  <ScoreCard key={dim} label={dim.replace(/_/g, ' ')} score={typeof val === 'number' ? val : ((val?.score as number) ?? 0)} size="sm" />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Executive Summary */}
      {data.executive_summary && (
        <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/5 p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Executive Summary</h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">{data.executive_summary}</p>
        </div>
      )}

      {/* Recommendations */}
      {data.recommendations && data.recommendations.length > 0 && (
        <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/5 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Recommendations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.recommendations.map((rec: Record<string, unknown>, i: number) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-black">{i + 1}</span>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{String(rec.title || rec.recommendation || `Recommendation ${i + 1}`)}</p>
                </div>
                {Boolean(rec.description || rec.detail) && (
                  <p className="text-xs text-slate-400 leading-relaxed">{String(rec.description || rec.detail)}</p>
                )}
                {Boolean(rec.priority) && (
                  <span className={`inline-block text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                    (rec.priority as string) === 'high' ? 'bg-red-500/10 text-red-400' :
                    (rec.priority as string) === 'medium' ? 'bg-amber-500/10 text-amber-400' :
                    'bg-green-500/10 text-green-400'
                  }`}>{rec.priority as string}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Battle Cards */}
      {data.battle_cards && data.battle_cards.length > 0 && (
        <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/5 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <Layers className="h-5 w-5 text-violet-500" />
            <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Battle Cards</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.battle_cards.map((card: Record<string, unknown>, i: number) => (
              <div key={i} className="rounded-2xl border border-violet-500/20 bg-violet-500/5 p-5 space-y-3">
                <p className="text-sm font-black text-slate-900 dark:text-white">{String(card.competitor || card.title || `Card ${i + 1}`)}</p>
                {Boolean(card.positioning_vs) && (
                  <p className="text-xs text-slate-400">{String(card.positioning_vs)}</p>
                )}
                {Boolean(card.key_messages && Array.isArray(card.key_messages)) && (
                  <div className="space-y-1">
                    {(card.key_messages as string[]).map((msg: string, j: number) => (
                      <p key={j} className="text-xs text-violet-300 flex items-start gap-2">
                        <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                        {msg}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Competitor Comparison */}
      {data.competitor_comparison && data.competitor_comparison.length > 0 && (
        <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-white/5 p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Competitor Comparison</h2>
          <div className="space-y-3">
            {data.competitor_comparison.map((comp: Record<string, unknown>, i: number) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/5">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-sm font-black text-white">
                  {((comp.name || comp.competitor || `C${i + 1}`) as string).charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-white">{String(comp.name || comp.competitor)}</p>
                  {comp.visibility_score !== undefined && (
                    <p className="text-xs text-slate-400">Visibility: {Math.round(comp.visibility_score as number)}</p>
                  )}
                </div>
                {comp.mention_rate !== undefined && (
                  <p className="text-xs font-bold text-slate-300">{((comp.mention_rate as number) * 100).toFixed(0)}% mentions</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Improvement Roadmap */}
      {data.improvement_roadmap && data.improvement_roadmap.length > 0 && (
        <div className="bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-primary/20 p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-black text-primary uppercase tracking-tighter">Improvement Roadmap</h2>
          <div className="space-y-4">
            {data.improvement_roadmap.map((step: Record<string, unknown>, i: number) => (
              <div key={i} className="flex gap-4 bg-white/50 dark:bg-black/20 p-5 rounded-3xl border border-primary/10">
                <span className="shrink-0 w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm">{i + 1}</span>
                <div>
                  <p className="text-sm font-black text-slate-900 dark:text-white">{String(step.title || step.action || `Step ${i + 1}`)}</p>
                  {Boolean(step.description || step.detail) && (
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{String(step.description || step.detail)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Layers Completed / Metadata */}
      {data.layers_completed && data.layers_completed.length > 0 && (
        <div className="flex flex-wrap gap-2 px-2">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mr-2">Completed Layers:</span>
          {data.layers_completed.map(layer => (
            <span key={layer} className="text-[9px] font-black bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-500/20 uppercase tracking-widest">
              {layer}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
