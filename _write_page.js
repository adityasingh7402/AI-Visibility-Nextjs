const fs = require('fs');
const path = require('path');

const filePath = path.join(
  'C:', 'ASE', 'Project08', 'AI-Visibility-SaaS', 'AI-Visibility-Nextjs',
  'app', '(dashboard)', 'dashboard', 'reports', '[id]', 'page.tsx'
);

const content = `'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Clock, Globe, BarChart3, CheckCircle2, AlertTriangle,
  Lightbulb, FileText, Target, Zap,
} from 'lucide-react';

import { useGeoAnalysis, useAnalysis } from '@/hooks/useGeo';
import type {
  GeoAnalysisResponse,
  Recommendation as GeoRecommendation,
  VisibilityScoreV19,
} from '@/lib/report-types';
import { getGrade, getGradeColor } from '@/lib/report-types';
import type { KeywordDiscoveryResponse } from '@/lib/geo-types';
import { getScoreGrade, resolveVisibilitySummary } from '@/lib/geo-types';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import {
  ScoreGauge,
  ScoreCard,
  ClusterBreakdown,
  PlatformReadinessGrid,
  EEATBreakdownCard,
  KeywordList,
  OpportunityCard,
} from '@/components/geo';

// ── Types ───────────────────────────────────────────────────────────────────────

type ReportKind = 'geo' | 'keyword';

interface ReportData {
  kind: ReportKind;
  brandName: string;
  category: string;
  overallScore: number;
  grade: string;
  gradeColor: string;
  date: string;
  status: string;
  processingTime: number | null;
  geoResponse?: GeoAnalysisResponse;
  scoreV19?: VisibilityScoreV19;
  keywordResponse?: KeywordDiscoveryResponse;
}

// ── Helpers ─────────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function formatDuration(seconds: number | null): string {
  if (!seconds) return '\\u2014';
  if (seconds < 60) return \`\\\${Math.round(seconds)}s\`;
  return \`\\\${Math.floor(seconds / 60)}m \\\${Math.round(seconds % 60)}s\`;
}

const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

const IMPACT_COLORS: Record<string, string> = {
  high: 'text-red-400 bg-red-500/10 border-red-500/20',
  medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  low: 'text-green-400 bg-green-500/10 border-green-500/20',
};

const TIMEFRAME_ICONS: Record<string, string> = {
  'short-term': '\\u26A1', 'medium-term': '\\uD83D\\uDCC5', 'long-term': '\\uD83D\\uDDD3\\uFE0F',
};
`;

fs.writeFileSync(filePath, content, 'utf8');
console.log('Written', content.length, 'chars');
