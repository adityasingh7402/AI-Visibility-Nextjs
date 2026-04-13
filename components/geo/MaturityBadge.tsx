import { getMaturityLevel } from '@/lib/report-v2-types';
import { cn } from '@/lib/utils';

interface MaturityBadgeProps {
  score: number;
  className?: string;
  showIcon?: boolean;
  showLabel?: boolean;
}

export function MaturityBadge({ 
  score, 
  className, 
  showIcon = true, 
  showLabel = true 
}: MaturityBadgeProps) {
  const maturity = getMaturityLevel(score);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap',
        maturity.badgeClass,
        className
      )}
      title={maturity.description}
    >
      {showIcon && <span aria-hidden="true">{maturity.icon}</span>}
      {showLabel && maturity.label}
    </span>
  );
}
