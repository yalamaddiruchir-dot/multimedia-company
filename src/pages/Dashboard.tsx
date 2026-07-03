import { PageContainer, PageHeader } from '../components/layout/AppShell';
import { Card, CardHeader } from '../components/ui/Card';
import { StatusChip, statusVariant } from '../components/ui/StatusChip';
import { Avatar, AvatarStack } from '../components/ui/Avatar';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Button } from '../components/ui/Button';
import { RevenueChart, TeamPerformanceChart, StageDistributionChart, ProductivityHeatmap } from '../components/charts/Charts';
import {
  TrendingUp, TrendingDown, FolderKanban, CheckCircle2, Clock, DollarSign,
  Calendar, Users, Activity, Plus, ArrowUpRight, AlertTriangle, Zap,
  Video, Image as ImageIcon, BookOpen, Edit3, PackageCheck, Briefcase, HardDrive,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects, recentActivity, team, todaysTasks, teamPerformance } from '../data/mock';
import { cn, formatCurrency } from '../lib/utils';

function KPI({
  label, value, delta, deltaUp, icon, accent,
}: {
  label: string; value: string; delta: string; deltaUp: boolean;
  icon: React.ReactNode; accent: string;
}) {
  return (
    <Card className="card-hover" padding="md">
      <div className="flex items-start justify-between mb-3">
        <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center', accent)}>
          {icon}
        </div>
        <div className={cn('flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-md', deltaUp ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-600 dark:text-red-400')}>
          {deltaUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {delta}
        </div>
      </div>
      <div className="text-[28px] font-bold tracking-tight leading-none tabular-nums">{value}</div>
      <div className="text-xs text-[var(--text-muted)] mt-1.5">{label}</div>
    </Card>
  );
}

export function DashboardPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Welcome back, Aarav"
        description="Here's what's happening at Lumen Studios today."
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="md" icon={<Calendar className="h-3.5 w-3.5" />}>
              This week
            </Button>
            <Button variant="primary" size="md" icon={<Plus className="h-3.5 w-3.5" />}>
              New Project
            </Button>
          </div>
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
        <KPI label="Total Projects" value="248" delta="+12.4%" deltaUp icon={<FolderKanban className="h-5 w-5 text-blue-600 dark:text-blue-400" />} accent="bg-blue-500/10" />
        <KPI label="Active Projects" value="32" delta="+8.2%" deltaUp icon={<Zap className="h-5 w-5 text-violet-600 dark:text-violet-400" />} accent="bg-violet-500/10" />
        <KPI label="Completed" value="216" delta="+24.5%" deltaUp icon={<CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />} accent="bg-emerald-500/10" />
        <KPI label="Revenue (MTD)" value="$284K" delta="+18.3%" deltaUp icon={<DollarSign className="h-5 w-5 text-amber-600 dark:text-amber-400" />} accent="bg-amber-500/10" />
      </div>

      {/* Second KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
        <KPI label="Delayed" value="3" delta="-1.2%" deltaUp={false} icon={<AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />} accent="bg-red-500/10" />
        <KPI label="Avg. Completion" value="6.2d" delta="-0.8d" deltaUp icon={<Clock className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />} accent="bg-cyan-500/10" />
        <KPI label="Team Utilization" value="87%" delta="+4.2%" deltaUp icon={<Users className="h-5 w-5 text-pink-600 dark:text-pink-400" />} accent="bg-pink-500/10" />
        <KPI label="Upcoming Events" value="12" delta="+3" deltaUp icon={<Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />} accent="bg-indigo-500/10" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Revenue Overview"
            subtitle="Last 7 months · USD"
            action={
              <div className="flex items-center gap-3 text-[11px]">
                <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500" /> Revenue</div>
                <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-violet-500" /> Profit</div>
              </div>
            }
          />
          <RevenueChart />
        </Card>

        <Card>
          <CardHeader title="Pipeline Stages" subtitle="Current distribution" />
          <StageDistributionChart />
        </Card>
      </div>

      {/* Projects + Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Project pipeline */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Project Pipeline"
            subtitle="Active productions"
            action={<Link to="/projects" className="text-xs font-medium text-[var(--primary)] flex items-center gap-1 hover:opacity-80">View all <ArrowUpRight className="h-3 w-3" /></Link>}
          />
          <div className="space-y-3">
            {projects.slice(0, 5).map((p) => (
              <Link
                key={p.id}
                to={`/projects/${p.id}`}
                className="flex items-center gap-3 p-2.5 -mx-2.5 rounded-xl hover:bg-[var(--surface-2)] transition-colors group"
              >
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center flex-shrink-0">
                  {p.type === 'Wedding' ? <Video className="h-4 w-4 text-blue-600 dark:text-blue-400" /> :
                   p.type === 'Corporate' ? <Briefcase className="h-4 w-4 text-violet-600 dark:text-violet-400" /> :
                   p.type === 'Portrait' ? <ImageIcon className="h-4 w-4 text-amber-600 dark:text-amber-400" /> :
                   p.type === 'Fashion' ? <BookOpen className="h-4 w-4 text-pink-600 dark:text-pink-400" /> :
                   <Edit3 className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold truncate">{p.name}</p>
                    <StatusChip variant={statusVariant(p.priority)} size="sm" dot={false}>{p.priority}</StatusChip>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
                    <span>{p.client}</span>
                    <span>·</span>
                    <span className="capitalize">{p.currentStage.replace('-', ' ')}</span>
                    <span>·</span>
                    <span>{p.team.length} members</span>
                  </div>
                </div>
                <div className="w-32 hidden sm:block">
                  <ProgressBar value={p.progress} variant={p.status === 'delayed' ? 'danger' : 'primary'} showLabel />
                </div>
                <AvatarStack users={p.team.map((id) => team.find((t) => t.id === id)!).filter(Boolean)} size="sm" />
              </Link>
            ))}
          </div>
        </Card>

        {/* Today's tasks */}
        <Card>
          <CardHeader
            title="Today's Tasks"
            subtitle={`${todaysTasks.filter((t) => !t.done).length} pending`}
            action={<Link to="/activity" className="text-xs font-medium text-[var(--primary)] hover:opacity-80">All</Link>}
          />
          <div className="space-y-2">
            {todaysTasks.map((t) => (
              <div key={t.id} className={cn('flex items-start gap-2.5 p-2 rounded-lg transition-colors', t.done ? 'opacity-50' : 'hover:bg-[var(--surface-2)]')}>
                <button className={cn('mt-0.5 h-4 w-4 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all', t.done ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-[var(--border-strong)] hover:border-[var(--primary)]')}>
                  {t.done && <CheckCircle2 className="h-3 w-3 text-white" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-xs font-medium leading-snug', t.done && 'line-through')}>{t.title}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Clock className="h-2.5 w-2.5 text-[var(--text-subtle)]" />
                    <span className="text-[10px] text-[var(--text-muted)]">{t.time}</span>
                    <StatusChip variant={statusVariant(t.priority)} size="sm" dot={false}>{t.priority}</StatusChip>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Activity + Quick + Team */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Recent activity */}
        <Card className="lg:col-span-2">
          <CardHeader title="Recent Activity" subtitle="Across all projects" />
          <div className="space-y-3">
            {recentActivity.map((a) => {
              const u = team.find((t) => t.id === a.user);
              if (!u) return null;
              const colors = { completion: 'bg-emerald-500', upload: 'bg-blue-500', revision: 'bg-orange-500', assignment: 'bg-violet-500', comment: 'bg-cyan-500' };
              return (
                <div key={a.id} className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar name={u.name} color={u.color} size="sm" />
                    <span className={cn('absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full ring-2 ring-[var(--surface)] flex items-center justify-center', colors[a.type as keyof typeof colors])}>
                      <Activity className="h-2 w-2 text-white" />
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-xs text-[var(--text)]">
                      <span className="font-semibold">{u.name}</span>{' '}
                      <span className="text-[var(--text-muted)]">{a.action}</span>{' '}
                      <span className="font-semibold">{a.target}</span>
                    </p>
                    <p className="text-[10px] text-[var(--text-subtle)] mt-0.5">{a.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardHeader title="Quick Actions" />
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: FolderKanban, label: 'New Project', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
              { icon: Users, label: 'Invite Team', color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400' },
              { icon: Calendar, label: 'Schedule', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
              { icon: PackageCheck, label: 'Delivery', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
            ].map((q) => {
              const Icon = q.icon;
              return (
                <button key={q.label} className="flex flex-col items-start gap-2 p-3 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--border)] transition-colors text-left group">
                  <div className={cn('h-8 w-8 rounded-lg flex items-center justify-center', q.color)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="text-xs font-medium">{q.label}</div>
                </button>
              );
            })}
          </div>

          {/* Team online */}
          <div className="mt-5 pt-5 border-t border-[var(--border)]">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-[var(--text)]">Team Online</h4>
              <span className="text-[10px] text-[var(--text-muted)]">{team.filter((t) => t.status === 'online').length} active</span>
            </div>
            <div className="space-y-2">
              {team.slice(0, 4).map((u) => (
                <div key={u.id} className="flex items-center gap-2">
                  <Avatar name={u.name} color={u.color} size="xs" status={u.status as any} />
                  <span className="text-xs flex-1 truncate">{u.name}</span>
                  <span className="text-[10px] text-[var(--text-muted)]">{u.role}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Team performance + Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader title="Team Performance" subtitle="Tasks completed this month" />
          <TeamPerformanceChart data={teamPerformance} />
        </Card>
        <Card>
          <CardHeader title="Productivity Heatmap" subtitle="Tasks per hour · Week view" />
          <ProductivityHeatmap />
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--border)] text-[10px] text-[var(--text-muted)]">
            <span>Less</span>
            <div className="flex gap-1">
              {[0.15, 0.35, 0.55, 0.75, 1].map((o) => (
                <div key={o} className="h-3 w-3 rounded-sm" style={{ background: `rgba(37, 99, 235, ${o})` }} />
              ))}
            </div>
            <span>More</span>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
