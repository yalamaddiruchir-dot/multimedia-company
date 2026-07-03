import { useState } from 'react';
import { PageContainer, PageHeader } from '../components/layout/AppShell';
import { Card } from '../components/ui/Card';
import { StatusChip, statusVariant } from '../components/ui/StatusChip';
import { Avatar, AvatarStack } from '../components/ui/Avatar';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Button } from '../components/ui/Button';
import { SearchInput } from '../components/ui/Input';
import {
  Plus, Filter, Download, MoreHorizontal, LayoutGrid, List, ChevronDown,
  Video, Image as ImageIcon, BookOpen, Edit3, Briefcase, Calendar, DollarSign,
  X, ArrowUpDown, SlidersHorizontal,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects, team, type Project } from '../data/mock';
import { cn, formatCurrency } from '../lib/utils';

function ProjectIcon({ type }: { type: Project['type'] }) {
  const config = {
    Wedding: { icon: Video, color: 'from-blue-500/20 to-violet-500/20', iconColor: 'text-blue-600 dark:text-blue-400' },
    Corporate: { icon: Briefcase, color: 'from-violet-500/20 to-pink-500/20', iconColor: 'text-violet-600 dark:text-violet-400' },
    Portrait: { icon: ImageIcon, color: 'from-amber-500/20 to-orange-500/20', iconColor: 'text-amber-600 dark:text-amber-400' },
    Fashion: { icon: BookOpen, color: 'from-pink-500/20 to-rose-500/20', iconColor: 'text-pink-600 dark:text-pink-400' },
    Event: { icon: Edit3, color: 'from-cyan-500/20 to-blue-500/20', iconColor: 'text-cyan-600 dark:text-cyan-400' },
  } as const;
  const c = config[type];
  const Icon = c.icon;
  return (
    <div className={cn('h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0', c.color)}>
      <Icon className={cn('h-4 w-4', c.iconColor)} />
    </div>
  );
}

function FilterChip({ label, value, onRemove }: { label: string; value: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-xs">
      <span className="text-[var(--text-muted)]">{label}:</span>
      <span className="font-medium text-[var(--text)]">{value}</span>
      <button onClick={onRemove} className="ml-0.5 text-[var(--text-muted)] hover:text-[var(--text)]">
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

export function ProjectsPage() {
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [search, setSearch] = useState('');

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.client.toLowerCase().includes(search.toLowerCase()) ||
    p.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageContainer>
      <PageHeader
        title="Projects"
        description="Manage and track all studio productions"
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="md" icon={<Download className="h-3.5 w-3.5" />}>Export</Button>
            <Button variant="primary" size="md" icon={<Plus className="h-3.5 w-3.5" />}>New Project</Button>
          </div>
        }
      />

      {/* Toolbar */}
      <Card padding="md" className="mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <SearchInput placeholder="Search projects, clients, codes..." value={search} onChange={setSearch} className="max-w-xs" />
          <Button variant="outline" size="md" icon={<Calendar className="h-3.5 w-3.5" />} iconRight={<ChevronDown className="h-3 w-3" />}>Date range</Button>
          <Button variant="outline" size="md" icon={<Filter className="h-3.5 w-3.5" />} iconRight={<ChevronDown className="h-3 w-3" />}>Status</Button>
          <Button variant="outline" size="md" icon={<SlidersHorizontal className="h-3.5 w-3.5" />} iconRight={<ChevronDown className="h-3 w-3" />}>Priority</Button>
          <Button variant="outline" size="md" icon={<Briefcase className="h-3.5 w-3.5" />} iconRight={<ChevronDown className="h-3 w-3" />}>Manager</Button>
          <div className="flex-1" />
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
            <button
              onClick={() => setView('table')}
              className={cn('h-7 px-2.5 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-colors', view === 'table' ? 'bg-[var(--surface)] shadow-sm' : 'text-[var(--text-muted)]')}
            >
              <List className="h-3.5 w-3.5" /> List
            </button>
            <button
              onClick={() => setView('grid')}
              className={cn('h-7 px-2.5 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-colors', view === 'grid' ? 'bg-[var(--surface)] shadow-sm' : 'text-[var(--text-muted)]')}
            >
              <LayoutGrid className="h-3.5 w-3.5" /> Grid
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap mt-3 pt-3 border-t border-[var(--border)]">
          <span className="text-xs text-[var(--text-muted)]">Active filters:</span>
          <FilterChip label="Status" value="Active" onRemove={() => {}} />
          <FilterChip label="Priority" value="High" onRemove={() => {}} />
          <FilterChip label="Date" value="This month" onRemove={() => {}} />
          <button className="text-xs font-medium text-[var(--primary)] hover:opacity-80 ml-1">Clear all</button>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
        {[
          { label: 'Total', value: projects.length, color: 'text-[var(--text)]' },
          { label: 'Active', value: projects.filter(p => p.status === 'active').length, color: 'text-blue-600' },
          { label: 'In Review', value: projects.filter(p => p.status === 'review').length, color: 'text-violet-600' },
          { label: 'Delayed', value: projects.filter(p => p.status === 'delayed').length, color: 'text-red-600' },
          { label: 'Completed', value: projects.filter(p => p.status === 'completed').length, color: 'text-emerald-600' },
        ].map((s) => (
          <Card key={s.label} padding="sm" className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-muted)]">{s.label}</span>
            <span className={cn('text-xl font-bold tabular-nums', s.color)}>{s.value}</span>
          </Card>
        ))}
      </div>

      {/* Table */}
      {view === 'table' ? (
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface-2)]">
                  {['Project', 'Client', 'Event Date', 'Status', 'Stage', 'Priority', 'Team', 'Quotation', 'Progress', ''].map((h) => (
                    <th key={h} className="text-left text-[10px] uppercase tracking-wider font-semibold text-[var(--text-muted)] px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {h}
                        {h === 'Project' || h === 'Client' || h === 'Event Date' || h === 'Quotation' ? (
                          <ArrowUpDown className="h-2.5 w-2.5" />
                        ) : null}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => {
                  const m = team.find((t) => t.id === p.manager);
                  return (
                    <tr
                      key={p.id}
                      className={cn(
                        'border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-2)] transition-colors group',
                        i % 2 === 0 ? '' : ''
                      )}
                    >
                      <td className="px-4 py-3">
                        <Link to={`/projects/${p.id}`} className="flex items-center gap-3 min-w-[240px]">
                          <ProjectIcon type={p.type} />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate group-hover:text-[var(--primary)] transition-colors">{p.name}</p>
                            <p className="text-[10px] text-[var(--text-muted)]">{p.code} · {p.type}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap">{p.client}</td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap text-[var(--text-muted)]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" />
                          {new Date(p.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <StatusChip variant={statusVariant(p.status)}>{p.status}</StatusChip>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs capitalize whitespace-nowrap">{p.currentStage.replace('-', ' ')}</span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusChip variant={statusVariant(p.priority)} size="sm" dot={false}>{p.priority}</StatusChip>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <AvatarStack users={p.team.map((id) => team.find((t) => t.id === id)!).filter(Boolean)} size="xs" />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold tabular-nums whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-[var(--text-muted)]" />
                          {p.quotation.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-4 py-3 w-32">
                        <ProgressBar value={p.progress} variant={p.status === 'delayed' ? 'danger' : 'primary'} showLabel />
                      </td>
                      <td className="px-4 py-3">
                        <button className="p-1.5 rounded-lg hover:bg-[var(--surface)] opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between p-3 border-t border-[var(--border)] text-xs">
            <span className="text-[var(--text-muted)]">Showing {filtered.length} of {projects.length} projects</span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm">Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <Link key={p.id} to={`/projects/${p.id}`}>
              <Card hover padding="none" className="overflow-hidden">
                <div className={cn('h-24 bg-gradient-to-br relative', 
                  p.type === 'Wedding' ? 'from-blue-500 to-violet-600' :
                  p.type === 'Corporate' ? 'from-violet-500 to-pink-600' :
                  p.type === 'Portrait' ? 'from-amber-500 to-orange-600' :
                  p.type === 'Fashion' ? 'from-pink-500 to-rose-600' :
                  'from-cyan-500 to-blue-600'
                )}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.2),transparent)]" />
                  <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-black/20 backdrop-blur-sm text-white text-[10px] font-semibold">{p.code}</span>
                    <StatusChip variant={statusVariant(p.status)} size="sm">{p.status}</StatusChip>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold truncate">{p.name}</p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{p.client}</p>
                  <div className="flex items-center justify-between mt-3 mb-2 text-[11px]">
                    <span className="text-[var(--text-muted)] capitalize">{p.currentStage.replace('-', ' ')}</span>
                    <span className="font-semibold">{p.progress}%</span>
                  </div>
                  <ProgressBar value={p.progress} variant={p.status === 'delayed' ? 'danger' : 'primary'} />
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)]">
                    <AvatarStack users={p.team.map((id) => team.find((t) => t.id === id)!).filter(Boolean)} size="xs" />
                    <span className="text-xs font-semibold">{formatCurrency(p.quotation)}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
