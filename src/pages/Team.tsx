import { PageContainer, PageHeader } from '../components/layout/AppShell';
import { Card, CardHeader } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { StatusChip, statusVariant } from '../components/ui/StatusChip';
import { Button } from '../components/ui/Button';
import { SearchInput } from '../components/ui/Input';
import { ProgressBar } from '../components/ui/ProgressBar';
import { team } from '../data/mock';
import { Mail, MessageSquare, MoreHorizontal, Plus, Filter } from 'lucide-react';

export function TeamPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Team"
        description="Manage members, roles, and permissions"
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="md" icon={<Filter className="h-3.5 w-3.5" />}>Filter</Button>
            <Button variant="primary" size="md" icon={<Plus className="h-3.5 w-3.5" />}>Invite member</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Members', value: team.length, color: 'bg-blue-500/10 text-blue-600' },
          { label: 'Online Now', value: team.filter((t) => t.status === 'online').length, color: 'bg-emerald-500/10 text-emerald-600' },
          { label: 'Roles', value: 7, color: 'bg-violet-500/10 text-violet-600' },
          { label: 'Avg. Utilization', value: '87%', color: 'bg-amber-500/10 text-amber-600' },
        ].map((s) => (
          <Card key={s.label}>
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              <span className="text-lg font-bold">{s.value}</span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="mb-4">
        <SearchInput placeholder="Search members..." className="max-w-sm" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {team.map((u) => (
          <Card key={u.id} hover padding="md">
            <div className="flex items-start justify-between mb-3">
              <Avatar name={u.name} color={u.color} size="xl" status={u.status as any} />
              <button className="p-1.5 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)]">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            </div>
            <h4 className="text-sm font-semibold">{u.name}</h4>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{u.role}</p>
            <p className="text-[11px] text-[var(--text-subtle)] mt-1.5 truncate">{u.email}</p>

            <div className="mt-4 pt-4 border-t border-[var(--border)]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-[var(--text-muted)]">Utilization</span>
                <span className="text-[10px] font-bold tabular-nums">{Math.floor(70 + Math.random() * 25)}%</span>
              </div>
              <ProgressBar value={Math.floor(70 + Math.random() * 25)} variant="primary" />
            </div>

            <div className="mt-4 flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex-1" icon={<MessageSquare className="h-3 w-3" />}>Message</Button>
              <Button variant="outline" size="sm" icon={<Mail className="h-3 w-3" />} />
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
