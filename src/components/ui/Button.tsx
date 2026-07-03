import { cn } from '../../lib/utils';
import type { ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'success';
type Size = 'sm' | 'md' | 'lg' | 'icon';

type Props = {
  variant?: Variant;
  size?: Size;
  children?: ReactNode;
  className?: string;
  icon?: ReactNode;
  iconRight?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit';
};

export function Button({ variant = 'primary', size = 'md', children, className, icon, iconRight, onClick, disabled, type = 'button' }: Props) {
  const variants: Record<Variant, string> = {
    primary: 'bg-[var(--primary)] text-white hover:opacity-90 shadow-sm',
    secondary: 'bg-[var(--surface-2)] text-[var(--text)] hover:bg-[var(--border)]',
    ghost: 'text-[var(--text)] hover:bg-[var(--surface-2)]',
    outline: 'border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-2)]',
    danger: 'bg-[var(--danger)] text-white hover:opacity-90',
    success: 'bg-[var(--success)] text-white hover:opacity-90',
  };
  const sizes: Record<Size, string> = {
    sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
    md: 'h-9 px-4 text-sm gap-2 rounded-xl',
    lg: 'h-11 px-5 text-sm gap-2 rounded-xl',
    icon: 'h-9 w-9 rounded-xl',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-150 btn-press focus-ring',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {icon}
      {children}
      {iconRight}
    </button>
  );
}
