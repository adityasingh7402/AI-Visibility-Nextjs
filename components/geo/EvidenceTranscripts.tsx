import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Quote } from 'lucide-react';

function safeArray(obj: Record<string, unknown> | null | undefined, key: string): Record<string, unknown>[] {
  const val = obj?.[key];
  return Array.isArray(val) ? (val as Record<string, unknown>[]) : [];
}

export function EvidenceTranscripts({ rawPayload }: { rawPayload: Record<string, unknown> | null }) {
  const whatAiSees = typeof rawPayload?.what_ai_sees === 'string' ? rawPayload.what_ai_sees : null;
  const citations = safeArray(rawPayload, 'citation_sources');

  if (!whatAiSees && citations.length === 0) return null;

  return (
    <div className="space-y-6">
      {whatAiSees && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3 border-b border-primary/10">
            <CardTitle className="text-lg flex items-center gap-2 text-primary">
              <Bot className="h-5 w-5" />
              What AI Sees
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="relative">
              <Quote className="absolute -top-1 -left-2 h-8 w-8 text-primary/20 rotate-180" />
              <p className="text-sm leading-relaxed text-muted-foreground pl-6 italic">
                {whatAiSees}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {citations.length > 0 && (
        <Card>
          <CardHeader className="pb-3 border-b bg-muted/20">
            <CardTitle className="text-lg">Top Citation Sources</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[300px]">
              <div className="divide-y divide-border">
                {citations.map((c, i) => (
                  <div key={i} className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-sm truncate max-w-[80%]">
                        {String(c.domain || c.url || 'Unknown Source')}
                      </h4>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {String(c.count || c.mentions || 1)} mentions
                      </span>
                    </div>
                    {typeof c.context === 'string' && c.context && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        &quot;{c.context}&quot;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
