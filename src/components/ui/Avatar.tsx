import { cn, initials } from '../../lib/utils';

export function Avatar({
  name,
  color,
  size = 'md',
  status,
  className,
}: {
  name: string;
  color?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'away' | 'offline';
  className?: string;
}) {
  const sizes = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-7 w-7 text-xs',
    md: 'h-8 w-8 text-xs',
    lg: 'h-10 w-10 text-sm',
    xl: 'h-12 w-12 text-base',
  };
  const dotSizes = {
    xs: 'h-1.5 w-1.5 border',
    sm: 'h-2 w-2 border',
    md: 'h-2 w-2 border-2',
    lg: 'h-2.5 w-2.5 border-2',
    xl: 'h-3 w-3 border-2',
  };
  const statusColors = {
    online: 'bg-emerald-500',
    away: 'bg-amber-500',
    offline: 'bg-slate-400',
  };
  return (
    <div className={cn('relative inline-flex flex-shrink-0', className)}>
      <div
        className={cn('rounded-full flex items-center justify-center font-semibold text-white ring-2 ring-[var(--surface)]', sizes[size])}
        style={{ background: color || '#64748B' }}
      >
        {initials(name)}
      </div>
      {status && (
        <span
          className={cn(
            'absolute -bottom-0 -right-0 rounded-full ring-2 ring-[var(--surface)]',
            dotSizes[size],
            statusColors[status]
          )}
        />
      )}
    </div>
  );
}

export function AvatarStack({ users, max = 4, size = 'sm' }: { users: { name: string; color?: string }[]; max?: number; size?: 'xs' | 'sm' | 'md' | 'lg'; }) {
  const shown = users.slice(0, max);
  const rest = users.length - shown.length;
  return (
    <div className="flex -space-x-2">
      {shown.map((u, i) => (
        <Avatar key={i} name={u.name} color={u.color} size={size} />
      ))}
      {rest > 0 && (
        <div className={cn(
          'rounded-full flex items-center justify-center font-semibold bg-[var(--surface-2)] text-[var(--text-muted)] ring-2 ring-[var(--surface)]',
          size === 'xs' ? 'h-6 w-6 text-[10px]' : size === 'sm' ? 'h-7 w-7 text-xs' : size === 'md' ? 'h-8 w-8 text-xs' : 'h-10 w-10 text-sm'
        )}>
          +{rest}
        </div>
      )}
    </div>
  );
}
