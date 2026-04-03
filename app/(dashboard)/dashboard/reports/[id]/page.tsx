'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { geoApi } from '@/lib/geo-api';
import type { GeoAnalysisResponse, Recommendation, CompetitorComparison, ImprovementAction, PlatformReadiness, EEATBreakdown } from '@/lib/report-types';
import { getGrade, getGradeColor } from '@/lib/report-types';
import { ScoreGauge } from '@/components/geo/ScoreGauge';
import { DimensionRadar } from '@/components/geo/DimensionRadar';
import { ClusterBreakdown } from '@/components/geo/DimensionCards';
import { PlatformReadinessGrid, EEATBreakdownCard } from '@/components/geo/PlatformEEAT';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, Clock, CheckCircle2, XCircle, Shield, Brain, Globe, BarChart3, FileText, Layers, Radar, Target
} from 'lucide-react';

// Tab definitions
const TABS = [
  { id: 'overview', label: 'Overview', icon: Globe },
  { id: 'dimensions', label: 'Dimensions', icon: Radar },
  { id: 'platforms', label: 'Platforms', icon: Target },
  { id: 'recommendations', label: 'Recommendations', icon: BarChart3 },
  { id: 'competitors', label: 'Competitors', icon: Layers },
  { id: 'roadmap', label: 'Roadmap', icon: FileText },
] as const;

type TabId = typeof TABS[number]['id'];

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [data, setData] = useState<GeoAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('overview');

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
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse">
          <Brain className="h-8 w-8 text-primary" />
        </div>
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Loading Analysis Result...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
          <XCircle className="h-8 w-8 text-destructive" />
        </div>
        <div className="text-center">
          <p className="font-bold text-xl text-destructive mb-2">Analysis Not Ready</p>
          <p className="text-sm text-muted-foreground max-w-sm">{error || 'The analysis result is not available yet. It may still be processing.'}</p>
        </div>
        <Button onClick={() => router.back()} variant="outline" size="sm" className="rounded-lg">
          <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  const score = data.visibility_score;
  const v19 = data.visibility_score_v19;
  const overallScore = score.overall;
  const grade = getGrade(overallScore);
  const gradeColor = getGradeColor(grade);

  // Visible tabs (hide empty ones)
  const visibleTabs = TABS.filter(tab => {
    if (tab.id === 'overview') return true;
    if (tab.id === 'dimensions') return v19?.sub_scores;
    if (tab.id === 'platforms') return v19?.platform_readiness || v19?.eeat_breakdown;
    if (tab.id === 'recommendations') return data.recommendations?.length;
    if (tab.id === 'competitors') return data.competitor_comparison?.length || data.battle_cards?.length;
    if (tab.id === 'roadmap') return data.improvement_roadmap?.length;
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Button onClick={() => router.push('/dashboard/reports')} variant="ghost" size="sm" className="rounded-lg -ml-2 mb-2">
            <ArrowLeft className="h-4 w-4 mr-1" /> Reports
          </Button>
          <h1 className="text-2xl font-black text-foreground tracking-tight">{data.brand_name}</h1>
          {data.url && <p className="text-sm text-muted-foreground">{data.url}</p>}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-semibold">
            <Clock size={14} />
            {data.processing_time_seconds.toFixed(1)}s
          </div>
          {data.quality_check_passed !== undefined && (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${
              data.quality_check_passed
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
            }`}>
              {data.quality_check_passed ? <CheckCircle2 size={14} /> : <Shield size={14} />}
              {data.quality_check_passed ? 'Verified' : 'Unverified'}
            </div>
          )}
        </div>
      </div>

      {/* Tab Nav */}
      <div className="flex gap-1 p-1 rounded-lg bg-muted overflow-x-auto">
        {visibleTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ---- OVERVIEW TAB ---- */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Score Hero */}
          <div className="bg-card rounded-xl border border-border p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <ScoreGauge score={overallScore} size={160} label="GEO Score" />
              <div className="flex-1 space-y-4 text-center md:text-left">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: gradeColor }}>
                    Grade {grade}
                  </span>
                  <p className="text-4xl font-black text-foreground tracking-tight">{Math.round(overallScore)}</p>
                </div>
                {/* Sub-scores summary */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(score.sub_scores || {}).map(([key, value]) => (
                    <div key={key} className="bg-muted rounded-lg p-3">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{key.replace(/_/g, ' ')}</p>
                      <p className="text-lg font-black text-foreground">{Math.round(value as number)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          {data.executive_summary && (
            <div className="bg-card rounded-xl border border-border p-6 space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-amber-500" />
                <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Executive Summary</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{data.executive_summary}</p>
            </div>
          )}

          {/* Layers Completed */}
          {data.layers_completed && data.layers_completed.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mr-1">Layers:</span>
              {data.layers_completed.map(layer => (
                <span key={layer} className="text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-500/20 uppercase tracking-wider">
                  {layer}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---- DIMENSIONS TAB ---- */}
      {activeTab === 'dimensions' && v19?.sub_scores && (
        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">17-Dimension Radar</h2>
            <div className="flex justify-center">
              <DimensionRadar scores={v19.sub_scores} size={350} />
            </div>
          </div>
          <ClusterBreakdown scores={v19.sub_scores} />
        </div>
      )}

      {/* ---- PLATFORMS TAB ---- */}
      {activeTab === 'platforms' && (
        <div className="space-y-6">
          {v19?.platform_readiness && (
            <PlatformReadinessGrid readiness={v19.platform_readiness as PlatformReadiness} />
          )}
          {v19?.eeat_breakdown && (
            <EEATBreakdownCard eeat={v19.eeat_breakdown as EEATBreakdown} />
          )}
        </div>
      )}

      {/* ---- RECOMMENDATIONS TAB ---- */}
      {activeTab === 'recommendations' && data.recommendations && data.recommendations.length > 0 && (
        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.recommendations.map((rec: Recommendation, i: number) => (
              <div key={i} className="rounded-lg border border-border p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-primary/10 text-primary flex items-center justify-center text-xs font-black">{i + 1}</span>
                  <p className="text-sm font-bold text-foreground">{rec.title || `Recommendation ${i + 1}`}</p>
                </div>
                {rec.description && <p className="text-xs text-muted-foreground leading-relaxed">{rec.description}</p>}
                {rec.priority && (
                  <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    rec.priority === 'high' ? 'bg-red-500/10 text-red-500' :
                    rec.priority === 'medium' ? 'bg-amber-500/10 text-amber-500' :
                    'bg-green-500/10 text-green-500'
                  }`}>{rec.priority}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---- COMPETITORS TAB ---- */}
      {activeTab === 'competitors' && (
        <div className="space-y-6">
          {/* Battle Cards */}
          {data.battle_cards && data.battle_cards.length > 0 && (
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Battle Cards</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.battle_cards.map((card: Record<string, unknown>, i: number) => (
                  <div key={i} className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-4 space-y-2">
                    <p className="text-sm font-bold text-foreground">{String(card.competitor || card.title || `Card ${i + 1}`)}</p>
                    {Boolean(card.positioning_vs) && (
                      <p className="text-xs text-muted-foreground">{String(card.positioning_vs)}</p>
                    )}
                    {Boolean(card.key_messages && Array.isArray(card.key_messages)) && (
                      <div className="space-y-1">
                        {(card.key_messages as string[]).map((msg: string, j: number) => (
                          <p key={j} className="text-xs text-violet-600 dark:text-violet-300 flex items-start gap-2">
                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />{msg}
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
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Competitor Comparison</h2>
              <div className="space-y-2">
                {data.competitor_comparison.map((comp: CompetitorComparison, i: number) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg border border-border">
                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-sm font-bold text-foreground">
                      {(comp.competitor_name || `C${i + 1}`).charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground truncate">{comp.competitor_name}</p>
                      {comp.authority_score !== undefined && (
                        <p className="text-xs text-muted-foreground">Authority: {Math.round(comp.authority_score)}</p>
                      )}
                    </div>
                    {comp.llm_mention_rate !== undefined && (
                      <p className="text-xs font-semibold text-muted-foreground shrink-0">{(comp.llm_mention_rate * 100).toFixed(0)}% mentions</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---- ROADMAP TAB ---- */}
      {activeTab === 'roadmap' && data.improvement_roadmap && data.improvement_roadmap.length > 0 && (
        <div className="bg-card rounded-xl border border-primary/20 p-6 space-y-4">
          <h2 className="text-sm font-bold text-primary uppercase tracking-wider">Improvement Roadmap</h2>
          <div className="space-y-3">
            {data.improvement_roadmap.map((step: ImprovementAction, i: number) => (
              <div key={i} className="flex gap-4 p-4 rounded-lg border border-primary/10 bg-primary/5">
                <span className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black text-sm">{i + 1}</span>
                <div>
                  <p className="text-sm font-bold text-foreground">{step.action || `Step ${i + 1}`}</p>
                  <div className="flex gap-2 mt-1">
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      step.impact === 'high' ? 'bg-red-500/10 text-red-500' :
                      step.impact === 'medium' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-green-500/10 text-green-500'
                    }`}>{step.impact} impact</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-muted text-muted-foreground">{step.timeframe}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
