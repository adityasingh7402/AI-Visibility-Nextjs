'use client';

import { useState } from 'react';
import { geoApi } from '@/lib/geo-api';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, Minus, BarChart3, Activity } from 'lucide-react';

// ---------------------------------------------------------------------------
// Types matching the rewritten POST /api/v1/progress/trend response
// ---------------------------------------------------------------------------
interface TrendDataPoint {
  brand_name?: string;
  category?: string;
  mode?: string;
  visibility_score?: number;
  overall_visibility?: number;
  created_at?: string;
  timestamp?: string;
  base_model_visibility?: number;
  rag_model_visibility?: number;
}

interface TrendResponse {
  data_points: TrendDataPoint[];
  trend_direction: string;
  total_analyses: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const TIME_RANGES = [
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
] as const;

function resolveScore(dp: TrendDataPoint): number {
  return dp.visibility_score ?? dp.overall_visibility ?? 0;
}

function resolveDate(dp: TrendDataPoint): string {
  return dp.created_at ?? dp.timestamp ?? '';
}

function formatDate(iso: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function formatFullDate(iso: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function trendIcon(direction: string) {
  switch (direction) {
    case 'up':
    case 'improving':
      return <TrendingUp className="h-5 w-5 text-emerald-500" />;
    case 'down':
    case 'declining':
      return <TrendingDown className="h-5 w-5 text-red-500" />;
    default:
      return <Minus className="h-5 w-5 text-yellow-500" />;
  }
}

function trendLabel(direction: string): string {
  switch (direction) {
    case 'up':
    case 'improving':
      return 'Improving';
    case 'down':
    case 'declining':
      return 'Declining';
    default:
      return 'Stable';
  }
}

function trendVariant(direction: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (direction) {
    case 'up':
    case 'improving':
      return 'default';
    case 'down':
    case 'declining':
      return 'destructive';
    default:
      return 'secondary';
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function ProgressPage() {
  const [brandName, setBrandName] = useState('');
  const [category, setCategory] = useState('');
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TrendResponse | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const fetchTrend = async (overrideDays?: number) => {
    const trimmed = brandName.trim();
    if (!trimmed) return;

    const useDays = overrideDays ?? days;
    setLoading(true);
    setError(null);
    setSubmitted(true);

    try {
      const result = await geoApi.getVisibilityTrend({
        brand_name: trimmed,
        category: category.trim(),
        limit: useDays,
      });
      setData(result as unknown as TrendResponse);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { error?: string } }; message?: string };
      setError(err?.response?.data?.error || err?.message || 'Failed to fetch trend data');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrend();
  };

  const handleTimeRange = (newDays: number) => {
    setDays(newDays);
    if (brandName.trim()) fetchTrend(newDays);
  };

  // Normalised chart data
  const chartData = (data?.data_points ?? []).map((dp) => ({
    date: formatDate(resolveDate(dp)),
    score: Math.round(resolveScore(dp)),
    mode: dp.mode ?? 'unknown',
    rawDate: resolveDate(dp),
  }));

  // Stats
  const latestScore = chartData.length > 0 ? chartData[chartData.length - 1].score : null;
  const firstScore = chartData.length > 0 ? chartData[0].score : null;
  const scoreChange =
    latestScore !== null && firstScore !== null && chartData.length >= 2
      ? latestScore - firstScore
      : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Visibility Trends</h1>
        <p className="text-muted-foreground mt-1">
          Track how your AI visibility changes over time.
        </p>
      </div>

      {/* Brand selector form */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="brand-name">Brand Name</Label>
              <Input
                id="brand-name"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. Notion"
                required
              />
            </div>

            <div className="flex-1 space-y-2">
              <Label htmlFor="category">Category (optional)</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. project management software"
              />
            </div>

            <Button type="submit" disabled={loading || !brandName.trim()}>
              {loading ? 'Loading…' : 'View Trends'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Time range buttons — only shown after first submit */}
      {submitted && (
        <div className="flex gap-2">
          {TIME_RANGES.map((range) => (
            <Button
              key={range.days}
              size="sm"
              variant={days === range.days ? 'default' : 'outline'}
              onClick={() => handleTimeRange(range.days)}
              disabled={loading}
            >
              {range.label}
            </Button>
          ))}
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive font-medium">
          {error}
        </div>
      )}

      {/* Results */}
      {data && !loading && chartData.length > 0 && (
        <div className="space-y-6">
          {/* Stats cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Current Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{latestScore ?? '—'}</span>
                  <span className="text-sm text-muted-foreground">/100</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Score Change
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">
                    {scoreChange !== null
                      ? `${scoreChange >= 0 ? '+' : ''}${scoreChange}`
                      : '—'}
                  </span>
                  <span className="text-sm text-muted-foreground">pts</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Trend Direction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {trendIcon(data.trend_direction)}
                  <Badge variant={trendVariant(data.trend_direction)}>
                    {trendLabel(data.trend_direction)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Analyses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <span className="text-3xl font-bold">{data.total_analyses}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trend chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Visibility Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      className="text-muted-foreground"
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 12 }}
                      className="text-muted-foreground"
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '8px',
                        border: '1px solid hsl(var(--border))',
                        background: 'hsl(var(--card))',
                        color: 'hsl(var(--card-foreground))',
                      }}
                      labelFormatter={(label) => `Date: ${label}`}
                      formatter={(value) => [`${value}`, 'Visibility Score']}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ r: 4, fill: 'hsl(var(--primary))' }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Data table */}
          <Card>
            <CardHeader>
              <CardTitle>Data Points</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead>Mode</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chartData.map((row, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">
                        {formatFullDate(row.rawDate)}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {row.score}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{row.mode}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty state after search */}
      {submitted && !loading && data && chartData.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              No trend data for &ldquo;{brandName}&rdquo;
            </h2>
            <p className="text-muted-foreground max-w-md">
              Run a Keyword Discovery analysis first — trend tracking begins after your
              initial brand analysis.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
