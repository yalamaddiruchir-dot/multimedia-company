import { PageContainer, PageHeader } from '../components/layout/AppShell';
import { Card, CardHeader } from '../components/ui/Card';
import { Avatar, AvatarStack } from '../components/ui/Avatar';
import { StatusChip, statusVariant } from '../components/ui/StatusChip';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Button } from '../components/ui/Button';
import {
  Briefcase, HardDrive, Image as ImageIcon, Film, BookOpen, Edit3, PackageCheck,
  CheckCircle2, Lock, AlertTriangle, XCircle, Clock, FileText, MessageSquare,
  CheckSquare, ChevronRight, ChevronDown, Plus,
} from 'lucide-react';
import { stages, projects, team } from '../data/mock';
import { cn } from '../lib/utils';

const stageIcons = {
  manager: Briefcase,
  'data-copy': HardDrive,
  lightroom: ImageIcon,
  video: Film,
  album: BookOpen,
  editor: Edit3,
  delivery: PackageCheck,
};

const stageStatuses = ['completed', 'active', 'active', 'locked', 'locked', 'locked', 'locked'] as const;

export function WorkflowPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Workflow Board"
        description="Visual pipeline of all productions across stages"
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="md" iconRight={<ChevronDown className="h-3 w-3" />}>All projects</Button>
            <Button variant="primary" size="md" icon={<Plus className="h-3.5 w-3.5" />}>New project</Button>
          </div>
        }
      />

      {/* Kanban-style flow */}
      <div className="overflow-x-auto pb-4 -mx-4 lg:-mx-6 px-4 lg:px-6">
        <div className="flex gap-3 min-w-max">
          {stages.map((stage, i) => {
            const Icon = stageIcons[stage.id as keyof typeof stageIcons];
            const stageProjects = projects.filter((p) => p.currentStage === stage.id);
            const allProjects = i === 0 ? projects.slice(0, 2) : stageProjects;
            return (
              <div key={stage.id} className="w-80 flex-s-col flex-shrink-0">
                {/* Column header */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-7 w-7 rounded-lg flex items-center justify-center"
                      style={{ background: `${stage.color}20`, color: stage.color }}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <h3 className="text-sm font-semibold">{stage.name}</h3>
                    <span className="text-[10px] font-bold text-[var(--text-muted)] bg-[var(--surface-2)] px-1.5 py-0.5 rounded">
                      {allProjects.length}
                    </span>
                  </div>
                  <button className="p-1 rounded-md hover:bg-[var(--surface-2)] text-[var(--text-muted)]">
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Cards */}
                <div className="space-y-2.5">
                  {allProjects.map((p) => (
                    <Card key={p.id} hover padding="sm" className="cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-[10px] font-mono font-semibold text-[var(--text-muted)]">{p.code}</span>
                        <StatusChip variant={statusVariant(p.priority)} size="sm" dot={false}>{p.priority}</StatusChip>
                      </div>
                      <p className="text-sm font-semibold leading-snug mb-1">{p.name}</p>
                      <p className="text-[11px] text-[var(--text-muted)] mb-3">{p.client}</p>
                      
                      {/* Member */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <Avatar name={team.find((t) => t.id === p.team[0])?.name || 'A'} color={team.find((t) => t.id === p.team[0])?.color} size="xs" />
                          <span className="text-[11px] text-[var(--text-muted)] truncate max-w-[100px]">{team.find((t) => t.id === p.team[0])?.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)]">
                          <span className="flex items-center gap-0.5"><FileText className="h-2.5 w-2.5" /> 12</span>
                          <span className="flex items-center gap-0.5"><MessageSquare className="h-2.5 w-2.5" /> 4</span>
                        </div>
                      </div>

                      <ProgressBar value={p.progress} variant={p.status === 'delayed' ? 'danger' : 'primary'} showLabel />

                      <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-[var(--border)]">
                        <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" />
                          {new Date(p.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <AvatarStack users={p.team.slice(0, 3).map((id) => team.find((t) => t.id === id)!).filter(Boolean)} size="xs" />
                      </div>
                    </Card>
                  ))}
                  {allProjects.length === 0 && (
                    <div className="p-6 text-center text-xs text-[var(--text-subtle)] border border-dashed border-[var(--border)] rounded-xl">
                      No projects in this stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed stage view */}
      <Card className="mt-6">
        <CardHeader title="Stage Details" subtitle="Click any stage to expand" />
        <div className="relative">
          <div className="absolute top-7 left-7 right-7 h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500 rounded-full opacity-30" />
          <div className="relative grid grid-cols-7 gap-2">
            {stages.map((stage, i) => {
              const Icon = stageIcons[stage.id as keyof typeof stageIcons];
              const status = stageStatuses[i];
              const isCompleted = status === 'completed';
              const isActive = status === 'active';
              return (
                <div key={stage.id} className="flex flex-col items-center">
                  <div className={cn(
                    'h-14 w-14 rounded-2xl flex items-center justify-center ring-4 ring-[var(--surface)] transition-all',
                    isCompleted && 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30',
                    isActive && 'bg-gradient-to-br text-white shadow-lg',
                    !isCompleted && !isActive && 'bg-[var(--surface-2)] text-[var(--text-subtle)]'
                  )}
                  style={isActive ? { backgroundImage: `linear-gradient(135deg, ${stage.color}, #7C3AED)`, boxShadow: `0 8px 24px ${stage.color}50` } : {}}
                  >
                    {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : isActive ? <Icon className="h-6 w-6" /> : <Lock className="h-5 w-5" />}
                  </div>
                  <p className={cn('text-xs font-semibold mt-3 text-center', isActive ? 'text-[var(--text)]' : 'text-[var(--text-muted)]')}>{stage.name}</p>
                  <p className="text-[10px] text-[var(--text-subtle)] mt-0.5">
                    {isCompleted ? '✓ Completed' : isActive ? 'In progress' : 'Locked'}
                  </p>
                  {isActive && (
                    <div className="mt-2 flex flex-col gap-1 items-center w-full">
                      <div className="w-full px-1">
                        <ProgressBar value={68} variant="primary" />
                      </div>
                      <span className="text-[9px] text-[var(--text-muted)]">68% complete</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Stage details expanded */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        {[
          { title: 'Active Stage', subtitle: 'Lightroom · 3 active', color: 'blue' },
          { title: 'Stage Members', subtitle: '2 assigned', color: 'violet' },
          { title: 'Completion Time', subtitle: 'Avg 2.4 days', color: 'emerald' },
        ].map((c) => (
          <Card key={c.title}>
            <div className="flex items-start gap-3">
              <div className={cn('h-10 w-10 rounded-xl flex items-center justify-center',
                c.color === 'blue' && 'bg-blue-500/10 text-blue-600',
                c.color === 'violet' && 'bg-violet-500/10 text-violet-600',
                c.color === 'emerald' && 'bg-emerald-500/10 text-emerald-600'
              )}>
                <CheckSquare className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-semibold">{c.title}</h4>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{c.subtitle}</p>
                <p className="text-lg font-bold mt-1">3</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
