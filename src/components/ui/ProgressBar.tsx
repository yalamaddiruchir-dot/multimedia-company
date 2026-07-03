import { cn } from '../../lib/utils';

export function ProgressBar({
  value,
  max = 100,
  className,
  showLabel = false,
  variant = 'primary',
}: {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  variant?: 'primary' | 'gradient' | 'success' | 'warning' | 'danger';
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const fills: Record<string, string> = {
    primary: 'bg-[var(--primary)]',
    gradient: 'bg-gradient-to-r from-[#2563EB] to-[#7C3AED]',
    success: 'bg-[var(--success)]',
    warning: 'bg-[var(--warning)]',
    danger: 'bg-[var(--danger)]',
  };
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex-1 h-1.5 rounded-full bg-[var(--surface-2)] overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', fills[variant])}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && <span className="text-[11px] font-medium text-[var(--text-muted)] tabular-nums w-9 text-right">{Math.round(pct)}%</span>}
    </div>
  );
}
