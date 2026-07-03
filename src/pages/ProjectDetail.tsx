import { useParams, Link } from 'react-router-dom';
import { PageContainer, PageHeader } from '../components/layout/AppShell';
import { Card, CardHeader } from '../components/ui/Card';
import { StatusChip, statusVariant } from '../components/ui/StatusChip';
import { Avatar, AvatarStack } from '../components/ui/Avatar';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Button } from '../components/ui/Button';
import { stages, projects, team, recentActivity } from '../data/mock';
import {
  ChevronRight, Calendar, DollarSign, MapPin, Mail, Phone, Briefcase, FileText,
  MessageSquare, Paperclip, CheckSquare, Square, Clock, Download, Share2,
  MoreHorizontal, Star, GitBranch, CheckCircle2, Circle, AlertCircle,
  Upload, Send,
} from 'lucide-react';
import { cn } from '../lib/utils';

export function ProjectDetailPage() {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id) ?? projects[0];
  const manager = team.find((t) => t.id === project.manager);
  const teamMembers = project.team.map((tid) => team.find((t) => t.id === tid)!).filter(Boolean);

  const stageIndex = stages.findIndex((s) => s.id === project.currentStage);

  return (
    <PageContainer>
      <PageHeader
        breadcrumb={
          <>
            <Link to="/" className="hover:text-[var(--text)]">Dashboard</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/projects" className="hover:text-[var(--text)]">Projects</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-[var(--text)]">{project.code}</span>
          </>
        }
        title={project.name}
        description={`${project.client} · ${project.type} · ${project.code}`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="md" icon={<Share2 className="h-3.5 w-3.5" />}>Share</Button>
            <Button variant="outline" size="md" icon={<Download className="h-3.5 w-3.5" />}>Export</Button>
            <Button variant="primary" size="md" icon={<CheckCircle2 className="h-3.5 w-3.5" />}>Mark Complete</Button>
          </div>
        }
      />

      {/* Status row */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <StatusChip variant={statusVariant(project.status)}>{project.status}</StatusChip>
        <StatusChip variant={statusVariant(project.priority)} size="sm" dot={false}>{project.priority} priority</StatusChip>
        <span className="text-xs text-[var(--text-muted)] flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(project.eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        <span className="text-xs text-[var(--text-muted)] flex items-center gap-1"><DollarSign className="h-3 w-3" /> {formatCurrencyFull(project.quotation)}</span>
        <span className="text-xs text-[var(--text-muted)] flex items-center gap-1"><MapPin className="h-3 w-3" /> Mumbai, IN</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Pipeline */}
          <Card>
            <CardHeader title="Production Pipeline" subtitle="Track stages from booking to delivery" />
            <div className="relative">
              <div className="absolute top-5 left-5 right-5 h-0.5 bg-[var(--surface-2)] z-0" />
              <div
                className="absolute top-5 left-5 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 z-0 transition-all"
                style={{ width: `calc(${(stageIndex / (stages.length - 1)) * 100}% - ${stageIndex === stages.length - 1 ? '40px' : '0px'})` }}
              />
              <div className="relative flex justify-between">
                {stages.map((s, i) => {
                  const isDone = i < stageIndex;
                  const isActive = i === stageIndex;
                  const isLocked = i > stageIndex;
                  return (
                    <div key={s.id} className="flex flex-col items-center gap-2 flex-1">
                      <div
                        className={cn(
                          'h-10 w-10 rounded-full flex items-center justify-center ring-4 ring-[var(--surface)] transition-all',
                          isDone && 'bg-emerald-500 text-white',
                          isActive && 'bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow-lg shadow-blue-500/30',
                          isLocked && 'bg-[var(--surface-2)] text-[var(--text-subtle)]'
                        )}
                      >
                        {isDone ? <CheckCircle2 className="h-5 w-5" /> : isActive ? <Circle className="h-4 w-4 fill-white" /> : <Circle className="h-4 w-4" />}
                      </div>
                      <div className="text-center">
                        <p className={cn('text-[11px] font-semibold', isLocked && 'text-[var(--text-subtle)]')}>{s.name}</p>
                        {isActive && <p className="text-[9px] text-[var(--text-muted)] mt-0.5">In progress</p>}
                        {isDone && <p className="text-[9px] text-emerald-600 mt-0.5">Done</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-5 pt-5 border-t border-[var(--border)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-[var(--text)]">Overall progress</span>
                <span className="text-xs font-bold text-[var(--text)]">{project.progress}%</span>
              </div>
              <ProgressBar value={project.progress} variant="gradient" className="h-2" />
            </div>
          </Card>

          {/* Tabs */}
          <Card padding="none">
            <div className="flex items-center gap-1 px-2 pt-2 border-b border-[var(--border)]">
              {['Activity', 'Tasks', 'Files', 'Comments', 'Revisions'].map((t, i) => (
                <button
                  key={t}
                  className={cn(
                    'px-3 py-2 text-xs font-medium border-b-2 transition-colors',
                    i === 0
                      ? 'border-[var(--primary)] text-[var(--text)]'
                      : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="p-5 space-y-4">
              {recentActivity.concat(recentActivity).slice(0, 8).map((a, i) => {
                const u = team.find((t) => t.id === a.user);
                if (!u) return null;
                const colors = { completion: 'bg-emerald-500', upload: 'bg-blue-500', revision: 'bg-orange-500', assignment: 'bg-violet-500', comment: 'bg-cyan-500' };
                return (
                  <div key={i} className="flex gap-3 relative">
                    {i < 7 && <div className="absolute top-8 left-3.5 bottom-0 w-px bg-[var(--border)]" />}
                    <div className="relative flex-shrink-0">
                      <Avatar name={u.name} color={u.color} size="sm" />
                      <span className={cn('absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full ring-2 ring-[var(--surface)] flex items-center justify-center text-white text-[8px] font-bold', colors[a.type as keyof typeof colors])}>
                        {a.type[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 pb-2">
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
              <div className="pt-3 border-t border-[var(--border)]">
                <div className="flex gap-2">
                  <Avatar name={manager?.name || 'A'} color={manager?.color} size="sm" />
                  <div className="flex-1 flex items-center gap-2 bg-[var(--surface-2)] rounded-xl px-3 py-2 border border-[var(--border)] focus-within:border-[var(--primary)]">
                    <input placeholder="Write a comment..." className="flex-1 bg-transparent outline-none text-xs" />
                    <button className="text-[var(--text-muted)] hover:text-[var(--text)]"><Paperclip className="h-3.5 w-3.5" /></button>
                    <button className="text-[var(--primary)] hover:opacity-80"><Send className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Checklist */}
          <Card>
            <CardHeader
              title="Production Checklist"
              subtitle="6 of 12 completed"
              action={<span className="text-xs font-bold text-[var(--primary)]">50%</span>}
            />
            <div className="space-y-1.5">
              {[
                { title: 'Pre-production meeting with client', done: true },
                { title: 'Equipment checklist confirmed', done: true },
                { title: 'Location permits secured', done: true },
                { title: 'Shot list approved', done: true },
                { title: 'RAW files backed up to cloud', done: true },
                { title: 'Lightroom culling completed', done: true },
                { title: 'Lightroom edits (first pass)', done: false, current: true },
                { title: 'Client review on first edit', done: false },
                { title: 'Final retouching', done: false },
                { title: 'Album design draft', done: false },
                { title: 'Client approval on album', done: false },
                { title: 'Final delivery + archive', done: false },
              ].map((item, i) => (
                <div key={i} className={cn('flex items-center gap-2.5 p-2 rounded-lg transition-colors', item.current && 'bg-blue-500/5 ring-1 ring-blue-500/20')}>
                  <button className={cn('h-4 w-4 rounded-md border-2 flex items-center justify-center transition-all', item.done ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-[var(--border-strong)] hover:border-[var(--primary)]')}>
                    {item.done && <CheckCircle2 className="h-3 w-3 text-white" />}
                  </button>
                  <span className={cn('flex-1 text-xs', item.done ? 'line-through text-[var(--text-muted)]' : item.current ? 'font-semibold text-[var(--text)]' : 'text-[var(--text)]')}>
                    {item.title}
                  </span>
                  {item.current && <StatusChip variant="info" size="sm" dot={false}>In progress</StatusChip>}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Quick actions */}
          <Card>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Upload files', icon: Upload, color: 'bg-blue-500/10 text-blue-600' },
                { label: 'Add task', icon: CheckSquare, color: 'bg-violet-500/10 text-violet-600' },
                { label: 'Message', icon: MessageSquare, color: 'bg-emerald-500/10 text-emerald-600' },
                { label: 'Invoice', icon: FileText, color: 'bg-amber-500/10 text-amber-600' },
              ].map((a) => {
                const Icon = a.icon;
                return (
                  <button key={a.label} className="flex items-center gap-2 p-2.5 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--border)] transition-colors text-left">
                    <div className={cn('h-7 w-7 rounded-lg flex items-center justify-center', a.color)}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs font-medium">{a.label}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Client info */}
          <Card>
            <CardHeader title="Client" />
            <div className="flex items-center gap-3 mb-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold">
                {project.client[0]}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold">{project.client}</p>
                <p className="text-[11px] text-[var(--text-muted)]">Premium client since 2023</p>
              </div>
            </div>
            <div className="space-y-2 pt-3 border-t border-[var(--border)]">
              <div className="flex items-center gap-2 text-xs">
                <Mail className="h-3 w-3 text-[var(--text-muted)]" />
                <span className="text-[var(--text-muted)]">rohan@sharma.com</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Phone className="h-3 w-3 text-[var(--text-muted)]" />
                <span className="text-[var(--text-muted)]">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <MapPin className="h-3 w-3 text-[var(--text-muted)]" />
                <span className="text-[var(--text-muted)]">Mumbai, India</span>
              </div>
            </div>
          </Card>

          {/* Team */}
          <Card>
            <CardHeader title="Team" subtitle={`${teamMembers.length} members`} action={<button className="text-xs font-medium text-[var(--primary)]">Manage</button>} />
            <div className="space-y-2">
              {teamMembers.map((u) => (
                <div key={u.id} className="flex items-center gap-2.5">
                  <Avatar name={u.name} color={u.color} size="sm" status={u.status as any} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{u.name}</p>
                    <p className="text-[10px] text-[var(--text-muted)]">{u.role}</p>
                  </div>
                  <button className="p-1.5 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)]">
                    <MessageSquare className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Quotation */}
          <Card>
            <CardHeader title="Quotation" />
            <div className="space-y-2 text-xs">
              {[
                { label: 'Photography', value: 12500 },
                { label: 'Videography', value: 9800 },
                { label: 'Album design', value: 4200 },
                { label: 'Drone coverage', value: 2000 },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">{item.label}</span>
                  <span className="font-medium tabular-nums">${item.value.toLocaleString()}</span>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t border-[var(--border)] flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold tabular-nums">${project.quotation.toLocaleString()}</span>
              </div>
            </div>
          </Card>

          {/* Files */}
          <Card>
            <CardHeader title="Recent Files" action={<button className="text-xs font-medium text-[var(--primary)]">View all</button>} />
            <div className="space-y-2">
              {[
                { name: 'shot-list-v3.pdf', size: '340 KB', type: 'doc' },
                { name: 'venue-photos.zip', size: '124 MB', type: 'image' },
                { name: 'moodboard.fig', size: '24 MB', type: 'doc' },
              ].map((f) => (
                <div key={f.name} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[var(--surface-2)] cursor-pointer">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{f.name}</p>
                    <p className="text-[10px] text-[var(--text-muted)]">{f.size}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

function formatCurrencyFull(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}
