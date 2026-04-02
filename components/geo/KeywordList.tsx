'use client';

interface KeywordListProps {
  keywords: string[];
  type: 'working' | 'gap' | 'winning';
  emptyMessage?: string;
  onKeywordClick?: (keyword: string) => void;
}

const TYPE_CONFIG = {
  working: { label: 'Working Keywords', bg: 'bg-green-500/10', border: 'border-green-500/20', dot: 'bg-green-400', icon: '✓' },
  gap: { label: 'Gap Keywords', bg: 'bg-blue-500/10', border: 'border-blue-500/20', dot: 'bg-blue-400', icon: '🎯' },
  winning: { label: 'Winning Keywords', bg: 'bg-purple-500/10', border: 'border-purple-500/20', dot: 'bg-purple-400', icon: '⭐' },
};

export function KeywordList({ keywords, type, emptyMessage, onKeywordClick }: KeywordListProps) {
  const config = TYPE_CONFIG[type];

  return (
    <div className={`rounded-2xl border ${config.border} ${config.bg} p-5`}>
      <div className="flex items-center gap-2 mb-4">
        <span className={`w-2 h-2 rounded-full ${config.dot}`} />
        <h3 className="text-sm font-bold text-white">{config.label}</h3>
        <span className="ml-auto text-xs font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">
          {keywords.length}
        </span>
      </div>

      {keywords.length === 0 ? (
        <p className="text-sm text-slate-500">{emptyMessage || 'No keywords found'}</p>
      ) : (
        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
          {keywords.map((keyword) => (
            <button
              key={keyword}
              onClick={() => onKeywordClick?.(keyword)}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1 text-xs font-medium text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <span className="text-xs">{config.icon}</span>
              {keyword}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
