import { useState } from 'react';
import { PageContainer, PageHeader } from '../components/layout/AppShell';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SearchInput } from '../components/ui/Input';
import {
  Folder, FileText, Video, Image as ImageIcon, File, Upload,
  Grid3x3, List, Filter, Download, MoreHorizontal, Plus, ChevronRight,
} from 'lucide-react';
import { files } from '../data/mock';
import { cn } from '../lib/utils';

export function FilesPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');

  return (
    <PageContainer>
      <PageHeader
        title="Files"
        description="Manage all studio assets, RAW files, and deliverables"
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="md" icon={<Filter className="h-3.5 w-3.5" />}>Filter</Button>
            <Button variant="primary" size="md" icon={<Upload className="h-3.5 w-3.5" />}>Upload</Button>
          </div>
        }
      />

      {/* Drop zone */}
      <div className="mb-4 p-6 border-2 border-dashed border-[var(--border)] rounded-2xl bg-[var(--surface)] text-center hover:border-[var(--primary)] transition-colors cursor-pointer">
        <div className="h-12 w-12 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center mx-auto mb-2">
          <Upload className="h-5 w-5 text-[var(--primary)]" />
        </div>
        <h3 className="text-sm font-semibold">Drop files to upload</h3>
        <p className="text-xs text-[var(--text-muted)] mt-1">Or click to browse · Max 50 GB per file</p>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <SearchInput placeholder="Search files..." className="max-w-sm" />
        <div className="flex-1" />
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
          <button onClick={() => setView('grid')} className={cn('h-7 w-7 rounded-lg flex items-center justify-center transition-colors', view === 'grid' ? 'bg-[var(--surface)] shadow-sm' : 'text-[var(--text-muted)]')}>
            <Grid3x3 className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => setView('list')} className={cn('h-7 w-7 rounded-lg flex items-center justify-center transition-colors', view === 'list' ? 'bg-[var(--surface)] shadow-sm' : 'text-[var(--text-muted)]')}>
            <List className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-4">
        <span className="hover:text-[var(--text)] cursor-pointer">All files</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-[var(--text)] font-medium">Lumen Studios</span>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {files.map((f) => {
            const isFolder = f.type === 'folder';
            const Icon = isFolder ? Folder : f.type === 'video' ? Video : f.type === 'image' ? ImageIcon : FileText;
            const colorClass = isFolder
              ? 'from-blue-500/20 to-violet-500/20 text-blue-600'
              : f.type === 'video'
              ? 'from-red-500/20 to-pink-500/20 text-red-600'
              : f.type === 'image'
              ? 'from-emerald-500/20 to-cyan-500/20 text-emerald-600'
              : 'from-amber-500/20 to-orange-500/20 text-amber-600';
            return (
              <Card key={f.id} hover padding="sm" className="cursor-pointer group">
                <div className={cn('h-24 rounded-xl bg-gradient-to-br flex items-center justify-center mb-2', colorClass)}>
                  <Icon className="h-8 w-8" />
                </div>
                <p className="text-xs font-medium truncate">{f.name}</p>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                  {isFolder ? `${f.items} items · ${f.size}` : `${f.size} · ${f.modified}`}
                </p>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card padding="none">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {['Name', 'Size', 'Modified', ''].map((h) => (
                  <th key={h} className="text-left text-[10px] uppercase tracking-wider font-semibold text-[var(--text-muted)] px-4 py-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {files.map((f) => {
                const Icon = f.type === 'folder' ? Folder : f.type === 'video' ? Video : f.type === 'image' ? ImageIcon : FileText;
                return (
                  <tr key={f.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-2)] group cursor-pointer">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg bg-[var(--surface-2)] flex items-center justify-center text-[var(--text-muted)]">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-medium truncate max-w-xs">{f.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--text-muted)]">{f.size}</td>
                    <td className="px-4 py-3 text-xs text-[var(--text-muted)]">{f.modified}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                        <button className="p-1.5 rounded-md hover:bg-[var(--surface)]"><Download className="h-3 w-3" /></button>
                        <button className="p-1.5 rounded-md hover:bg-[var(--surface)]"><MoreHorizontal className="h-3 w-3" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      )}
    </PageContainer>
  );
}
