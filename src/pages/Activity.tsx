import { PageContainer, PageHeader } from '../components/layout/AppShell';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Activity, Filter, Plus, MessageSquare, Upload, CheckCircle2, UserPlus, FileEdit } from 'lucide-react';
import { team, recentActivity } from '../data/mock';
import { cn } from '../lib/utils';

const extendedActivity = [
  ...recentActivity,
  ...recentActivity.map((a) => ({ ...a, id: a.id + 10, time: `${parseInt(a.time) + 6}h ago` })),
  ...recentActivity.map((a) => ({ ...a, id: a.id + 20, time: `${parseInt(a.time) + 24}h ago` })),
  ...recentActivity.map((a) => ({ ...a, id: a.id + 30, time: `${parseInt(a.time) + 72}h ago` })),
];

const colorMap = {
  completion: { bg: 'bg-emerald-500', icon: CheckCircle2 },
  upload: { bg: 'bg-blue-500', icon: Upload },
  revision: { bg: 'bg-orange-500', icon: FileEdit },
  assignment: { bg: 'bg-violet-500', icon: UserPlus },
  comment: { bg: 'bg-cyan-500', icon: MessageSquare },
};

export function ActivityPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Activity"
        description="GitHub-style timeline of all studio events"
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="md" icon={<Filter className="h-3.5 w-3.5" />}>Filter</Button>
            <Button variant="primary" size="md" icon={<Plus className="h-3.5 w-3.5" />}>Log activity</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <Card padding="none">
            <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
              <h3 className="text-sm font-semibold flex items-center gap-2"><Activity className="h-4 w-4" /> Timeline</h3>
              <div className="flex items-center gap-1 text-[10px]">
                {['Today', 'Yesterday', 'This week', 'All time'].map((p, i) => (
                  <button key={p} className={cn('h-7 px-2.5 rounded-lg font-medium transition-colors', i === 0 ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)]')}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-5">
              {extendedActivity.slice(0, 18).map((a, i) => {
                const u = team.find((t) => t.id === a.user);
                if (!u) return null;
                const c = colorMap[a.type as keyof typeof colorMap];
                const Icon = c.icon;
                return (
                  <div key={a.id} className="flex gap-3 relative pb-5 last:pb-0">
                    {i < 17 && <div className="absolute top-10 left-4 bottom-0 w-px bg-[var(--border)]" />}
                    <div className="relative flex-shrink-0">
                      <Avatar name={u.name} color={u.color} size="md" />
                      <span className={cn('absolute -bottom-1 -right-1 h-5 w-5 rounded-full ring-2 ring-[var(--surface)] flex items-center justify-center text-white', c.bg)}>
                        <Icon className="h-2.5 w-2.5" />
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <p className="text-sm text-[var(--text)] leading-relaxed">
                        <span className="font-semibold">{u.name}</span>
                        <span className="text-[var(--text-muted)]"> {a.action} </span>
                        <span className="font-semibold text-[var(--primary)]">{a.target}</span>
                      </p>
                      <p className="text-[11px] text-[var(--text-subtle)] mt-1">{a.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <h3 className="text-sm font-semibold mb-3">Activity Types</h3>
            <div className="space-y-2">
              {Object.entries({ completion: 'Completions', upload: 'Uploads', revision: 'Revisions', assignment: 'Assignments', comment: 'Comments' }).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--surface-2)]">
                  <div className="flex items-center gap-2">
                    <span className={cn('h-2 w-2 rounded-full', colorMap[k as keyof typeof colorMap].bg)} />
                    <span className="text-xs">{v}</span>
                  </div>
                  <span className="text-xs font-semibold tabular-nums">{Math.floor(Math.random() * 30) + 5}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold mb-3">Top Contributors</h3>
            <div className="space-y-3">
              {team.slice(0, 5).map((u, i) => (
                <div key={u.id} className="flex items-center gap-2.5">
                  <span className="text-[10px] font-bold text-[var(--text-muted)] w-4">{i + 1}</span>
                  <Avatar name={u.name} color={u.color} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{u.name}</p>
                    <p className="text-[10px] text-[var(--text-muted)]">{u.role}</p>
                  </div>
                  <span className="text-xs font-bold tabular-nums">{42 - i * 3}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
