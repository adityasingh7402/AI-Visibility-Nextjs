'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { VisibilityTrend } from '@/lib/geo-types';

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/95 p-3 shadow-xl">
      <p className="text-xs text-slate-400 mb-2">{new Date(label).toLocaleDateString()}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="text-xs font-bold" style={{ color: p.color }}>
          {p.name}: {p.value?.toFixed(1)}%
        </p>
      ))}
    </div>
  );
}

export function TrendChart({ trend }: { trend: VisibilityTrend }) {
  const { data_points, overall_change, trend_direction } = trend;
  const trendColor = trend_direction === 'improving' ? '#10B981' : trend_direction === 'declining' ? '#EF4444' : '#F59E0B';
  const trendIcon = trend_direction === 'improving' ? '📈' : trend_direction === 'declining' ? '📉' : '→';

  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-1.5">
          <span>{trendIcon}</span>
          <span className="text-xs font-bold capitalize" style={{ color: trendColor }}>{trend_direction}</span>
        </div>
        <div className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-1.5">
          <span className="text-xs text-slate-400">Change:</span>
          <span className="text-xs font-bold" style={{ color: overall_change >= 0 ? '#10B981' : '#EF4444' }}>
            {overall_change >= 0 ? '+' : ''}{overall_change.toFixed(1)}%
          </span>
        </div>
        <div className="flex items-center gap-2 bg-white/5 rounded-full px-3 py-1.5">
          <span className="text-xs text-slate-400">{trend.total_snapshots} snapshots</span>
        </div>
      </div>

      {data_points.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data_points} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="timestamp" tickFormatter={(d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
            <YAxis domain={[0, 100]} tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '12px', fontSize: '12px' }} formatter={(v) => <span style={{ color: '#94a3b8' }}>{v}</span>} />
            <Line type="monotone" dataKey="overall_visibility" name="Overall" stroke="#3B82F6" strokeWidth={2.5} dot={{ fill: '#3B82F6', r: 3 }} activeDot={{ r: 5 }} />
            <Line type="monotone" dataKey="base_model_visibility" name="Base Model" stroke="#F59E0B" strokeWidth={2} dot={{ fill: '#F59E0B', r: 3 }} strokeDasharray="5 5" />
            <Line type="monotone" dataKey="rag_model_visibility" name="RAG Model" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', r: 3 }} />
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
