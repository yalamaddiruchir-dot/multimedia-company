import { useState } from 'react';
import { PageContainer, PageHeader } from '../components/layout/AppShell';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { notifications, team } from '../data/mock';
import { Bell, CheckCircle2, Clock, MessageSquare, AlertTriangle, FileText, UserPlus } from 'lucide-react';
import { cn } from '../lib/utils';

const allNotifs = [
  ...notifications,
  ...notifications.map((n) => ({ ...n, id: n.id + 10, time: `${parseInt(n.time) + 4}h` })),
  ...notifications.map((n) => ({ ...n, id: n.id + 20, time: `${parseInt(n.time) + 12}h` })),
];

export function NotificationsPage() {
  const [filter, setFilter] = useState<'all' | 'unread' | 'mentions'>('all');
  const filtered = filter === 'unread' ? allNotifs.filter(n => n.unread) : filter === 'mentions' ? allNotifs.filter(n => n.type === 'mention') : allNotifs;

  return (
    <PageContainer>
      <PageHeader
        title="Notifications"
        description="Stay updated with everything happening across your studio"
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="md">Mark all read</Button>
            <Button variant="outline" size="md" icon={<Bell className="h-3.5 w-3.5" />}>Settings</Button>
          </div>
        }
      />

      <div className="flex items-center gap-2 mb-4">
        {[
          { id: 'all', label: 'All', count: allNotifs.length },
          { id: 'unread', label: 'Unread', count: allNotifs.filter(n => n.unread).length },
          { id: 'mentions', label: 'Mentions', count: allNotifs.filter(n => n.type === 'mention').length },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setFilter(t.id as any)}
            className={cn(
              'h-9 px-4 rounded-xl text-xs font-medium flex items-center gap-2 transition-colors',
              filter === t.id ? 'bg-[var(--primary)] text-white' : 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--surface-2)]'
            )}
          >
            {t.label}
            <span className={cn('h-5 px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center',
              filter === t.id ? 'bg-white/20' : 'bg-[var(--surface-2)]'
            )}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      <Card padding="none">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="h-10 w-10 text-[var(--text-subtle)] mx-auto mb-3" />
            <h3 className="text-sm font-semibold">No notifications</h3>
            <p className="text-xs text-[var(--text-muted)] mt-1">You're all caught up.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {filtered.map((n) => {
              const config = {
                mention: { icon: MessageSquare, color: 'bg-violet-500' },
                assignment: { icon: UserPlus, color: 'bg-blue-500' },
                completion: { icon: CheckCircle2, color: 'bg-emerald-500' },
                delay: { icon: AlertTriangle, color: 'bg-red-500' },
                approval: { icon: Clock, color: 'bg-amber-500' },
                revision: { icon: FileText, color: 'bg-orange-500' },
              };
              const c = config[n.type as keyof typeof config];
              const Icon = c.icon;
              return (
                <div
                  key={n.id}
                  className={cn(
                    'flex items-start gap-3 p-4 hover:bg-[var(--surface-2)] transition-colors cursor-pointer',
                    n.unread && 'bg-[var(--primary)]/[0.03]'
                  )}
                >
                  <div className={cn('h-9 w-9 rounded-xl flex items-center justify-center text-white flex-shrink-0', c.color)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{n.title}</p>
                      {n.unread && <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />}
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{n.desc}</p>
                    <p className="text-[10px] text-[var(--text-subtle)] mt-1">{n.time} ago</p>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </PageContainer>
  );
}
