import { useEffect, useState } from 'react';
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
  Loader2, WifiOff,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn, formatCurrency } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { getProjects, Project } from '../services/projectService';
import { getUsers, User } from '../services/userService';
import { projects as mockProjects, team as mockTeam, todaysTasks as mockTodaysTasks, recentActivity as mockRecentActivity } from '../data/mock';

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

function LoadingSkeleton() {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
    </div>
  );
}

// Helper to map API project to frontend format
const mapProject = (p: Project) => ({
  ...p,
  type: p.type || 'WEDDING',
  currentStage: p.currentStage || 'MANAGER',
  priority: p.priority || 'MEDIUM',
  status: p.status || 'ACTIVE',
  thumbnail: p.thumbnail || 'wedding',
});

// Helper to map API user to frontend format
const mapUser = (u: User) => ({
  ...u,
  role: u.role || 'EDITOR',
  color: u.color || '#2563EB',
  initials: u.initials || u.name.substring(0, 2).toUpperCase(),
  status: u.status || 'online',
});

export function DashboardPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [team, setTeam] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [projectsResponse, teamResponse] = await Promise.all([
          getProjects(undefined, 0, 50),
          getUsers(),
        ]);
        
        // Map API data to frontend format
        const apiProjects = (projectsResponse.content || []).map(mapProject);
        const apiTeam = (teamResponse || []).map(mapUser);
        
        // Use API data if available, otherwise fall back to mock data
        setProjects(apiProjects.length > 0 ? apiProjects : mockProjects.map(p => ({
          ...p,
          type: p.type.toUpperCase(),
          currentStage: p.currentStage.toUpperCase().replace('-', '_'),
          priority: p.priority.toUpperCase(),
          status: p.status.toUpperCase(),
          managerName: p.manager,
          managerId: p.manager,
          team: p.team
            .map(id => {
              const user = mockTeam.find(t => t.id === id);
              if (!user) return null;
              return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role as string,
                color: user.color,
                initials: user.initials,
                status: user.status || 'online',
              };
            })
            .filter((u): u is NonNullable<typeof u> => u !== null),
        })));
        setTeam(apiTeam.length > 0 ? apiTeam : mockTeam.map(u => ({
          ...u,
          role: u.role.toUpperCase().replace(' ', '_'),
          color: u.color,
          initials: u.initials,
          status: u.status || 'online',
        })));
        
        setError(null);
      } catch (err: any) {
        console.error('Dashboard fetch error:', err);
        
        // Graceful fallback: use mock data when API fails
        console.warn('API failed, using mock data as fallback');
        setProjects(mockProjects.map(p => ({
          ...p,
          type: p.type.toUpperCase(),
          currentStage: p.currentStage.toUpperCase().replace('-', '_'),
          priority: p.priority.toUpperCase(),
          status: p.status.toUpperCase(),
          managerName: p.manager,
          managerId: p.manager,
          team: p.team
            .map(id => {
              const user = mockTeam.find(t => t.id === id);
              if (!user) return null;
              return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role as string,
                color: user.color,
                initials: user.initials,
                status: user.status || 'online',
              };
            })
            .filter((u): u is NonNullable<typeof u> => u !== null),
        })));
        setTeam(mockTeam.map(u => ({
          ...u,
          role: u.role.toUpperCase().replace(' ', '_'),
          color: u.color,
          initials: u.initials,
          status: u.status || 'online',
        })));
        
        // Show a subtle warning instead of blocking error
        setError('Backend unavailable. Using demo data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate KPIs from real data
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'ACTIVE').length;
  const completedProjects = projects.filter(p => p.status === 'COMPLETED').length;
  const delayedProjects = projects.filter(p => p.status === 'DELAYED').length;
  const totalRevenue = projects.reduce((sum, p) => sum + (p.quotation || 0), 0);

  // For tasks, activity, team performance - we still use mock data until those APIs are built
  // TODO: Replace with real API calls once backend endpoints are ready
  const todaysTasks = [
    { id: 1, title: 'Review Sharma Wedding edits', time: '2h', priority: 'high', done: false },
    { id: 2, title: 'Approve album design for Mehta', time: '4h', priority: 'medium', done: false },
    { id: 3, title: 'Final delivery - Kapoor Portrait', time: '6h', priority: 'urgent', done: true },
    { id: 4, title: 'Team standup meeting', time: '1h', priority: 'low', done: false },
  ];

  const recentActivity = [
    { id: 1, user: team[0]?.id, action: 'completed Lightroom edits for', target: 'Sharma Wedding', time: '4m ago', type: 'completion' },
    { id: 2, user: team[1]?.id, action: 'uploaded teaser for', target: 'Apex Summit', time: '22m ago', type: 'upload' },
    { id: 3, user: team[2]?.id, action: 'requested revision on', target: 'Vogue Editorial', time: '1h ago', type: 'revision' },
    { id: 4, user: team[3]?.id, action: 'assigned team to', target: 'Mehta Wedding', time: '2h ago', type: 'assignment' },
  ];

  const teamPerformance = team.map(u => ({
    name: u.name.split(' ')[0],
    tasks: Math.floor(Math.random() * 50) + 10,
  }));

  if (loading) {
    return (
      <PageContainer>
        <LoadingSkeleton />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* Subtle warning banner when using fallback data */}
      {error && (
        <div className="mb-6 bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex items-center gap-3">
          <WifiOff className="h-4 w-4 text-amber-600" />
          <span className="text-sm text-amber-700">{error}</span>
        </div>
      )}

      <PageHeader
        title={`Welcome back, ${user?.name || 'there'}`}
        description="Here's what's happening with your projects today."
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
        <KPI label="Total Projects" value={totalProjects.toString()} delta="+12.4%" deltaUp icon={<FolderKanban className="h-5 w-5 text-blue-600 dark:text-blue-400" />} accent="bg-blue-500/10" />
        <KPI label="Active Projects" value={activeProjects.toString()} delta="+8.2%" deltaUp icon={<Zap className="h-5 w-5 text-violet-600 dark:text-violet-400" />} accent="bg-violet-500/10" />
        <KPI label="Completed" value={completedProjects.toString()} delta="+24.5%" deltaUp icon={<CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />} accent="bg-emerald-500/10" />
        <KPI label="Revenue (MTD)" value={`₹${(totalRevenue / 1000).toFixed(0)}K`} delta="+18.3%" deltaUp icon={<DollarSign className="h-5 w-5 text-amber-600 dark:text-amber-400" />} accent="bg-amber-500/10" />
      </div>

      {/* Second KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
        <KPI label="Delayed" value={delayedProjects.toString()} delta="-1.2%" deltaUp={false} icon={<AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />} accent="bg-red-500/10" />
        <KPI label="Avg. Completion" value="6.2d" delta="-0.8d" deltaUp icon={<Clock className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />} accent="bg-cyan-500/10" />
        <KPI label="Team Size" value={team.length.toString()} delta="+2" deltaUp icon={<Users className="h-5 w-5 text-pink-600 dark:text-pink-400" />} accent="bg-pink-500/10" />
        <KPI label="Upcoming Events" value={projects.filter(p => p.status === 'ACTIVE').length.toString()} delta="+3" deltaUp icon={<Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />} accent="bg-indigo-500/10" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Revenue Overview"
            subtitle="Last 7 months · INR"
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
            {projects.length === 0 ? (
              <div className="text-center py-8 text-sm text-[var(--text-muted)]">
                No projects yet. Create your first project to get started!
              </div>
            ) : (
              projects.slice(0, 5).map((p) => (
                <Link
                  key={p.id}
                  to={`/projects/${p.id}`}
                  className="flex items-center gap-3 p-2.5 -mx-2.5 rounded-xl hover:bg-[var(--surface-2)] transition-colors group"
                >
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center flex-shrink-0">
                    {p.type === 'WEDDING' ? <Video className="h-4 w-4 text-blue-600 dark:text-blue-400" /> :
                     p.type === 'CORPORATE' ? <Briefcase className="h-4 w-4 text-violet-600 dark:text-violet-400" /> :
                     p.type === 'PORTRAIT' ? <ImageIcon className="h-4 w-4 text-amber-600 dark:text-amber-400" /> :
                     p.type === 'FASHION' ? <BookOpen className="h-4 w-4 text-pink-600 dark:text-pink-400" /> :
                     <Edit3 className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold truncate">{p.name}</p>
                      <StatusChip variant={statusVariant(p.priority.toLowerCase())} size="sm" dot={false}>{p.priority}</StatusChip>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
                      <span>{p.client}</span>
                      <span>·</span>
                      <span className="capitalize">{p.currentStage.replace('_', ' ')}</span>
                      <span>·</span>
                      <span>{p.team?.length || 0} members</span>
                    </div>
                  </div>
                  <div className="w-32 hidden sm:block">
                    <ProgressBar value={p.progress} variant={p.status === 'DELAYED' ? 'danger' : 'primary'} showLabel />
                  </div>
                  {p.team && p.team.length > 0 && (
                    <AvatarStack users={p.team.map(t => ({ ...t, name: t.name, initials: t.initials, color: t.color })).slice(0, 3)} size="sm" />
                  )}
                </Link>
              ))
            )}
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
              <h4 className="text-xs font-semibold text-[var(--text)]">Team</h4>
              <span className="text-[10px] text-[var(--text-muted)]">{team.length} members</span>
            </div>
            <div className="space-y-2">
              {team.slice(0, 4).map((u) => (
                <div key={u.id} className="flex items-center gap-2">
                  <Avatar name={u.name} color={u.color} size="xs" />
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
