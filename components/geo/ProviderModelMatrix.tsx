import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MaturityBadge } from '@/components/geo/MaturityBadge';
import type { StructuredProvider } from '@/lib/report-v2-types';

export function ProviderModelMatrix({ providers }: { providers: StructuredProvider[] }) {
  if (!providers || providers.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Provider &amp; Model Matrix</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="p-3 rounded-tl-lg font-medium">Provider</th>
              <th className="p-3 font-medium">Model</th>
              <th className="p-3 font-medium text-right">Visibility</th>
              <th className="p-3 font-medium text-right">Maturity</th>
              <th className="p-3 rounded-tr-lg font-medium">Sentiment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {providers.map((p, i) => {
              const score = (p.mention_rate ?? 0) * 100;
              return (
                <tr key={i} className="hover:bg-muted/20 transition-colors">
                  <td className="p-3 font-semibold">{p.provider_display || p.provider}</td>
                  <td className="p-3 text-muted-foreground">{p.model_id || 'Default'}</td>
                  <td className="p-3 text-right tabular-nums font-medium">{Math.round(score)}%</td>
                  <td className="p-3 text-right">
                    <MaturityBadge score={score} />
                  </td>
                  <td className="p-3">
                    <Badge variant="outline" className="capitalize">
                      {p.sentiment_label || 'neutral'}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
