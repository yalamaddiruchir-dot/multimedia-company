import { PageContainer, PageHeader } from '../components/layout/AppShell';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { RevenueChart, ProjectGrowthChart, TeamPerformanceChart, StageDistributionChart, ProductivityHeatmap } from '../components/charts/Charts';
import {
  TrendingUp, DollarSign, Users, FolderKanban, Clock, ArrowUpRight,
  CheckCircle2, AlertTriangle, ChevronDown,
} from 'lucide-react';
import { teamPerformance, stageDistribution } from '../data/mock';
import { cn } from '../lib/utils';

export function AnalyticsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Analytics"
        description="Executive insights into studio performance"
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="md" iconRight={<ChevronDown className="h-3 w-3" />}>Last 7 months</Button>
            <Button variant="outline" size="md">Export PDF</Button>
          </div>
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Revenue', value: '$1.45M', delta: '+24.5%', icon: DollarSign, color: 'blue' },
          { label: 'Profit Margin', value: '42.8%', delta: '+3.2%', icon: TrendingUp, color: 'emerald' },
          { label: 'Avg. Project Value', value: '$18.4K', delta: '+8.1%', icon: FolderKanban, color: 'violet' },
          { label: 'Customer Satisfaction', value: '4.9/5', delta: '+0.2', icon: CheckCircle2, color: 'amber' },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <Card key={k.label} hover>
              <div className="flex items-start justify-between mb-3">
                <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center',
                  k.color === 'blue' && 'bg-blue-500/10 text-blue-600',
                  k.color === 'emerald' && 'bg-emerald-500/10 text-emerald-600',
                  k.color === 'violet' && 'bg-violet-500/10 text-violet-600',
                  k.color === 'amber' && 'bg-amber-500/10 text-amber-600'
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600">
                  {k.delta}
                </span>
              </div>
              <div className="text-2xl font-bold tracking-tight">{k.value}</div>
              <div className="text-xs text-[var(--text-muted)] mt-1">{k.label}</div>
            </Card>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader title="Revenue & Profit" subtitle="Performance over time" />
          <RevenueChart />
        </Card>
        <Card>
          <CardHeader title="Project Growth" subtitle="Active projects per month" />
          <ProjectGrowthChart />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader title="Team Performance" subtitle="Tasks completed" />
          <TeamPerformanceChart data={teamPerformance} />
        </Card>
        <Card>
          <CardHeader title="Stage Distribution" subtitle="Projects across stages" />
          <StageDistributionChart />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader title="Monthly Productivity" subtitle="Heatmap of team activity" />
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

        <Card>
          <CardHeader title="Stage Completion Times" subtitle="Average days per stage" />
          <div className="space-y-3">
            {[
              { name: 'Manager', time: 1.2, pct: 30, color: '#2563EB' },
              { name: 'Data Copy', time: 0.8, pct: 20, color: '#7C3AED' },
              { name: 'Lightroom', time: 2.4, pct: 60, color: '#F59E0B' },
              { name: 'Video Editing', time: 3.6, pct: 90, color: '#EF4444' },
              { name: 'Album Design', time: 1.8, pct: 45, color: '#06B6D4' },
              { name: 'Editor', time: 0.9, pct: 22, color: '#EC4899' },
              { name: 'Delivery', time: 0.3, pct: 8, color: '#22C55E' },
            ].map((s) => (
              <div key={s.name} className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-sm flex-shrink-0" style={{ background: s.color }} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium">{s.name}</span>
                    <span className="text-xs text-[var(--text-muted)] tabular-nums">{s.time}d</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[var(--surface-2)] overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Employee productivity */}
      <Card>
        <CardHeader title="Employee Productivity" subtitle="Tasks completed per team member" />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {['Member', 'Role', 'Tasks', 'Rating', 'Utilization', 'Trend'].map((h) => (
                  <th key={h} className="text-left text-[10px] uppercase tracking-wider font-semibold text-[var(--text-muted)] px-3 py-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teamPerformance.map((m, i) => (
                <tr key={m.name} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-2)]">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-[10px] font-bold">
                        {m.name[0]}
                      </div>
                      <span className="text-xs font-medium">{m.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-xs text-[var(--text-muted)]">Specialist</td>
                  <td className="px-3 py-3 text-xs font-semibold tabular-nums">{m.tasks}</td>
                  <td className="px-3 py-3 text-xs">⭐ {m.rating}</td>
                  <td className="px-3 py-3 w-40">
                    <div className="h-1.5 rounded-full bg-[var(--surface-2)] overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-violet-500" style={{ width: `${60 + i * 5}%` }} />
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className={cn('inline-flex items-center gap-0.5 text-xs font-medium',
                      i % 3 === 0 ? 'text-emerald-600' : i % 3 === 1 ? 'text-blue-600' : 'text-amber-600'
                    )}>
                      <ArrowUpRight className="h-3 w-3" />
                      +{(i + 5) * 2}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </PageContainer>
  );
}
