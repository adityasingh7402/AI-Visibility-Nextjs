'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { VisibilityTrend } from '@/lib/geo-types';
import { LLM_PROVIDER_INFO } from '@/lib/geo-types';

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: unknown; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/95 p-3 shadow-xl min-w-[160px]">
      <p className="text-xs text-slate-400 mb-2">{label ? new Date(label).toLocaleDateString() : ''}</p>
      {payload.map((p) => (
        p.name !== 'confidence_range' && (
          <p key={p.name} className="text-xs font-bold" style={{ color: p.color }}>
            {p.name}: {typeof p.value === 'number' ? p.value.toFixed(1) + '%' : '—'}
          </p>
        )
      ))}
    </div>
  );
}

// Colors for per-LLM lines
const LLM_CHART_COLORS: Record<string, string> = {
  chatgpt: '#10A37F',
  gemini: '#4285F4',
  perplexity: '#5436DA',
  claude: '#D97706',
  grok: '#1DA1F2',
  digitalocean: '#0080FF',
};

export function TrendChart({ trend }: { trend: VisibilityTrend }) {
  const { data_points, overall_change, trend_direction } = trend;
  const trendColor = trend_direction === 'improving' ? '#10B981' : trend_direction === 'declining' ? '#EF4444' : '#F59E0B';
  const trendColorClass = trend_direction === 'improving' ? 'text-emerald-500' : trend_direction === 'declining' ? 'text-red-500' : 'text-amber-500';
  void trendColor; // retained for potential future use
  const trendIcon = trend_direction === 'improving' ? '📈' : trend_direction === 'declining' ? '📉' : '→';

  // Discover which LLM providers appear in the data for per-LLM lines (§10.7)
  const llmProviders = data_points.length > 0 && data_points[0].visibility_by_llm
    ? Object.keys(data_points[0].visibility_by_llm)
    : [];

  // Build chart data — flatten per-LLM scores into top-level keys
  const chartData = data_points.map(point => {
    const flat: Record<string, unknown> = {
      timestamp: point.timestamp,
      overall_visibility: point.overall_visibility,
      base_model_visibility: point.base_model_visibility,
      rag_model_visibility: point.rag_model_visibility,
      // Confidence interval bounds for shading (§10.7)
      conf_lower: point.confidence_lower,
      conf_upper: point.confidence_upper,
    };

    // Flatten per-LLM scores from visibility_by_llm object
    if (point.visibility_by_llm) {
      for (const [provider, scores] of Object.entries(point.visibility_by_llm as Record<string, Record<string, number> | number>)) {
        flat[`llm_${provider}`] = typeof scores === 'object'
          ? (scores.visibility_score ?? scores.score ?? null)
          : scores;
      }
    }

    return flat;
  });

  // Whether to show confidence shading (§10.7)
  const hasConfidence = data_points.some(p => p.confidence_lower !== undefined && p.confidence_upper !== undefined);

  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-1.5">
          <span>{trendIcon}</span>
          <span className={`text-xs font-bold capitalize ${trendColorClass}`}>{trend_direction}</span>
        </div>
        <div className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-1.5">
          <span className="text-xs text-slate-400">Change:</span>
          <span className={`text-xs font-bold ${overall_change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {overall_change >= 0 ? '+' : ''}{overall_change.toFixed(1)}%
          </span>
        </div>
        <div className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-1.5">
          <span className="text-xs text-slate-400">{trend.total_snapshots} snapshots</span>
        </div>
        {hasConfidence && (
          <div className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-1.5">
            <span className="text-xs text-slate-400">Confidence bounds shown</span>
          </div>
        )}
      </div>

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              tick={{ fill: '#6B7280', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: '#6B7280', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '12px', fontSize: '12px' }}
              formatter={(v) => <span className="text-[#94a3b8]">{v}</span>}
            />

            {/* Confidence interval shading (§10.7) — rendered as two area lines */}
            {hasConfidence && (
              <>
                <Line
                  type="monotone"
                  dataKey="conf_upper"
                  name="Conf. Upper"
                  stroke="#3B82F6"
                  strokeWidth={0}
                  dot={false}
                  legendType="none"
                />
                <Line
                  type="monotone"
                  dataKey="conf_lower"
                  name="Conf. Lower"
                  stroke="#3B82F6"
                  strokeWidth={0}
                  dot={false}
                  legendType="none"
                  // Fill area between conf_lower and conf_upper
                  fill="#3B82F6"
                  fillOpacity={0.1}
                />
              </>
            )}

            {/* Core visibility lines */}
            <Line
              type="monotone"
              dataKey="overall_visibility"
              name="Overall"
              stroke="#3B82F6"
              strokeWidth={2.5}
              dot={{ fill: '#3B82F6', r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="base_model_visibility"
              name="Base Model"
              stroke="#F59E0B"
              strokeWidth={2}
              dot={{ fill: '#F59E0B', r: 3 }}
              strokeDasharray="5 5"
            />
            <Line
              type="monotone"
              dataKey="rag_model_visibility"
              name="RAG Model"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ fill: '#10B981', r: 3 }}
            />

            {/* Per-LLM provider lines (§10.7) */}
            {llmProviders.map(provider => {
              const color = LLM_CHART_COLORS[provider] || '#9CA3AF';
              const info = LLM_PROVIDER_INFO[provider];
              return (
                <Line
                  key={provider}
                  type="monotone"
                  dataKey={`llm_${provider}`}
                  name={info?.label || provider}
                  stroke={color}
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  dot={false}
                  opacity={0.7}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-64 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
          <div className="text-center space-y-2">
            <p className="text-4xl">📊</p>
            <p className="text-sm text-slate-400">Run a keyword discovery to populate your trend chart</p>
          </div>
        </div>
      )}
    </div>
  );
}
