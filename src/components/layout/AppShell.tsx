import type { ReactNode } from 'react';

export function PageHeader({
  title,
  description,
  action,
  breadcrumb,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  breadcrumb?: ReactNode;
}) {
  return (
    <div className="mb-6">
      {breadcrumb && <div className="text-xs text-[var(--text-muted)] mb-2 flex items-center gap-1.5">{breadcrumb}</div>}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)]">{title}</h1>
          {description && <p className="text-sm text-[var(--text-muted)] mt-1">{description}</p>}
        </div>
        {action && <div className="flex items-center gap-2 flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
}

export function PageContainer({ children }: { children: ReactNode }) {
  return <div className="p-4 lg:p-6 max-w-[1600px] mx-auto fade-in">{children}</div>;
}
