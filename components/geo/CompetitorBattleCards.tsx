import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';

function str(val: unknown): string {
  return typeof val === 'string' ? val : String(val ?? '');
}

function num(val: unknown): number {
  return typeof val === 'number' ? val : 0;
}

function strArr(val: unknown): string[] {
  return Array.isArray(val) ? val.map(v => String(v)) : [];
}

export function CompetitorBattleCards({ battleCards }: { battleCards: Record<string, unknown>[] }) {
  if (!battleCards || battleCards.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {battleCards.map((card, i) => {
        const name = str(card.competitor_name || card.name);
        const threatLevel = str(card.threat_level || 'medium');
        const winRate = num(card.win_rate);
        const yourAdvantages = strArr(card.your_advantages || card.strengths);
        const theirAdvantages = strArr(card.their_advantages || card.weaknesses);

        return (
          <Card key={i} className="flex flex-col">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{name}</CardTitle>
                <Badge variant={threatLevel === 'high' ? 'destructive' : 'secondary'}>
                  {threatLevel || 'Medium'} Threat
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-6 pt-6">
              <div className="flex justify-between items-center px-2">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Your Win Rate</p>
                  <p className="text-2xl font-bold text-primary">{Math.round(winRate)}%</p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground opacity-50" />
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Their Win Rate</p>
                  <p className="text-2xl font-bold">{Math.round(100 - winRate)}%</p>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" /> Your Advantages
                  </h4>
                  <ul className="space-y-2">
                    {yourAdvantages.slice(0, 3).map((adv, j) => (
                      <li key={j} className="text-muted-foreground leading-relaxed pl-6 relative">
                        <span className="absolute left-2 top-2 h-1 w-1 rounded-full bg-emerald-500" />
                        {adv}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold flex items-center gap-2 mb-2 text-destructive">
                    <ShieldAlert className="h-4 w-4" /> Their Advantages
                  </h4>
                  <ul className="space-y-2">
                    {theirAdvantages.slice(0, 3).map((weak, j) => (
                      <li key={j} className="text-muted-foreground leading-relaxed pl-6 relative">
                        <span className="absolute left-2 top-2 h-1 w-1 rounded-full bg-destructive/70" />
                        {weak}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
