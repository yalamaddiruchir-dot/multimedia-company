import { cn } from '../../lib/utils';
import type { ReactNode } from 'react';

type Variant =
  | 'default'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'purple'
  | 'neutral';

const variants: Record<Variant, { bg: string; text: string; dot: string }> = {
  default: { bg: 'bg-[var(--surface-2)]', text: 'text-[var(--text-muted)]', dot: 'bg-[var(--text-subtle)]' },
  success: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
  warning: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' },
  danger: { bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', dot: 'bg-red-500' },
  info: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-500' },
  purple: { bg: 'bg-violet-500/10', text: 'text-violet-600 dark:text-violet-400', dot: 'bg-violet-500' },
  neutral: { bg: 'bg-slate-500/10', text: 'text-slate-600 dark:text-slate-400', dot: 'bg-slate-500' },
};

export function StatusChip({
  children,
  variant = 'default',
  dot = true,
  className,
  size = 'md',
}: {
  children: ReactNode;
  variant?: Variant;
  dot?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}) {
  const v = variants[variant];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap',
        size === 'sm' ? 'h-5 px-2 text-[10px]' : 'h-6 px-2.5 text-xs',
        v.bg,
        v.text,
        className
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', v.dot, variant === 'success' && 'pulse-soft')} />}
      {children}
    </span>
  );
}

export function statusVariant(status: string): Variant {
  const map: Record<string, Variant> = {
    active: 'info',
    completed: 'success',
    delayed: 'danger',
    review: 'purple',
    rejected: 'danger',
    locked: 'neutral',
    high: 'warning',
    urgent: 'danger',
    medium: 'info',
    low: 'neutral',
    online: 'success',
    away: 'warning',
    offline: 'neutral',
  };
  return map[status] ?? 'default';
}
