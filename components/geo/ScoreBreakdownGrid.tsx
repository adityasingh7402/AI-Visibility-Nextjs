import { ScoreCard } from '@/components/geo/ScoreCard';
import { V19_DIMENSIONS } from '@/lib/report-types';

export function ScoreBreakdownGrid({ rawPayload }: { rawPayload: Record<string, unknown> | null }) {
  const v19Raw = rawPayload?.visibility_score_v19;
  if (!v19Raw || typeof v19Raw !== 'object') return null;

  const v19 = v19Raw as Record<string, unknown>;
  const subScoresRaw = v19.sub_scores;
  if (!subScoresRaw || typeof subScoresRaw !== 'object') return null;

  const subScores = subScoresRaw as Record<string, number>;

  const clusters = [
    {
      id: 'ai_visibility',
      label: 'AI Base Visibility (35%)',
      keys: ['llm_mention', 'llm_consistency', 'llm_position'],
    },
    {
      id: 'authority',
      label: 'Authority Signals (20%)',
      keys: ['authority', 'web_presence', 'citation_strength'],
    },
    {
      id: 'content',
      label: 'Content & Information (20%)',
      keys: ['content_fit', 'citability', 'page_quality', 'freshness'],
    },
    {
      id: 'technical',
      label: 'Technical Readiness (10%)',
      keys: ['technical_seo', 'ai_readiness'],
    },
    {
      id: 'competitive',
      label: 'Competitive Gap (10%)',
      keys: ['competitor_gap', 'pattern_match'],
    },
    {
      id: 'signal',
      label: 'Trust & Signals (5%)',
      keys: ['sentiment', 'consistency'],
    },
  ];

  return (
    <div className="space-y-6">
      {clusters.map((cluster) => {
        const hasData = cluster.keys.some((key) => subScores[key] !== undefined);
        if (!hasData) return null;

        return (
          <div key={cluster.id} className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {cluster.label}
            </h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {cluster.keys.map((key) => {
                const score = subScores[key] ?? 0;
                const dimDef = V19_DIMENSIONS.find((d) => d.key === key);
                const label = dimDef?.label ?? key.replace(/_/g, ' ');
                return (
                  <ScoreCard
                    key={key}
                    label={label}
                    score={score}
                    size="sm"
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
