import { cn } from '../../lib/utils';
import { Search } from 'lucide-react';
import type { ReactNode } from 'react';

export function Input({
  icon,
  placeholder,
  value,
  onChange,
  className,
  size = 'md',
  type = 'text',
}: {
  icon?: ReactNode;
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  type?: string;
}) {
  const sizes = {
    sm: 'h-8 text-xs',
    md: 'h-9 text-sm',
    lg: 'h-10 text-sm',
  };
  return (
    <div className={cn('relative w-full', className)}>
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-subtle)] pointer-events-none">
          {icon}
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          'w-full rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text-subtle)]',
          'focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--ring)]',
          'transition-all duration-150',
          icon ? 'pl-9 pr-3' : 'px-3',
          sizes[size],
          className
        )}
      />
    </div>
  );
}

export function SearchInput({ placeholder = 'Search...', className, value, onChange }: { placeholder?: string; className?: string; value?: string; onChange?: (v: string) => void }) {
  return <Input icon={<Search className="h-3.5 w-3.5" />} placeholder={placeholder} className={className} value={value} onChange={onChange} />;
}
