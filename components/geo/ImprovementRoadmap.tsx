import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, CheckSquare, Clock } from 'lucide-react';
import type { StructuredRecommendation } from '@/lib/report-v2-types';

function safeArray(obj: Record<string, unknown> | null | undefined, key: string): Record<string, unknown>[] {
  const val = obj?.[key];
  return Array.isArray(val) ? (val as Record<string, unknown>[]) : [];
}

export function ImprovementRoadmap({ rawPayload, recommendations }: { rawPayload: Record<string, unknown> | null, recommendations: StructuredRecommendation[] }) {
  const roadmap = safeArray(rawPayload, 'improvement_roadmap');

  if (roadmap.length === 0 && (!recommendations || recommendations.length === 0)) {
    return null;
  }

  const items: Record<string, unknown>[] = roadmap.length > 0 ? roadmap : recommendations.map(r => ({
    action: r.title || '',
    priority: r.priority || 'medium',
    effort: 'medium',
    impact_area: r.impact_area || r.category || '',
    steps: [r.description || '']
  }));

  const PRIORITY_COLORS: Record<string, string> = {
    high: '#EF4444',
    medium: '#F59E0B',
    low: '#10B981',
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold flex items-center gap-2">
        <Target className="h-6 w-6 text-primary" />
        Improvement Roadmap
      </h3>
      
      <div className="grid grid-cols-1 gap-6">
        {items.map((item, i) => {
          const priority = String(item.priority || 'medium');
          const steps = Array.isArray(item.steps) ? (item.steps as string[]) : [];
          const impactArea = typeof item.impact_area === 'string' ? item.impact_area : '';

          return (
            <Card key={i} className="border-l-4" style={{
              borderLeftColor: PRIORITY_COLORS[priority] ?? '#F59E0B'
            }}>
              <CardHeader className="pb-3 border-b bg-muted/10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg leading-tight mb-2">{String(item.action || '')}</CardTitle>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                      {impactArea.replace(/_/g, ' ')}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <Badge variant={priority === 'high' ? 'destructive' : priority === 'low' ? 'outline' : 'secondary'} className="uppercase text-[10px]">
                      {priority} Priority
                    </Badge>
                    {typeof item.effort === 'string' && item.effort && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span className="capitalize">{item.effort} Effort</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <h4 className="font-semibold text-sm mb-3">Action Steps</h4>
                <ul className="space-y-3">
                  {steps.map((step, j) => (
                    <li key={j} className="flex gap-3 text-sm text-muted-foreground items-start">
                      <CheckSquare className="h-4 w-4 shrink-0 text-muted-foreground/40 mt-0.5" />
                      <span className="leading-relaxed">{String(step)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
