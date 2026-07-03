import { useUI } from '../../lib/uiStore';
import { Search, FolderKanban, Users, FileText, BarChart3, Sparkles, Calendar, Bell, Settings } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const commands = [
  { icon: FolderKanban, label: 'Go to Projects', to: '/projects', group: 'Navigation' },
  { icon: BarChart3, label: 'Open Analytics', to: '/analytics', group: 'Navigation' },
  { icon: Calendar, label: 'Open Calendar', to: '/calendar', group: 'Navigation' },
  { icon: Bell, label: 'View Notifications', to: '/notifications', group: 'Navigation' },
  { icon: Users, label: 'Manage Team', to: '/team', group: 'Navigation' },
  { icon: Settings, label: 'Open Settings', to: '/settings', group: 'Navigation' },
  { icon: Sparkles, label: 'Ask AI Assistant', action: 'ai', group: 'AI' },
  { icon: FileText, label: 'Create new project', action: 'create', group: 'Create' },
  { icon: FolderKanban, label: 'Upload file', action: 'upload', group: 'Create' },
];

export function CommandPalette() {
  const { commandOpen, setCommandOpen, setAiOpen, toast } = useUI();
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!commandOpen) {
      setQuery('');
      setActiveIdx(0);
    }
  }, [commandOpen]);

  const filtered = commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));
  const grouped = filtered.reduce((acc, c) => {
    acc[c.group] = acc[c.group] || [];
    acc[c.group].push(c);
    return acc;
  }, {} as Record<string, typeof commands>);

  const flat = filtered;

  const handleSelect = (idx: number) => {
    const c = flat[idx];
    if (!c) return;
    if (c.to) navigate(c.to);
    if (c.action === 'ai') setAiOpen(true);
    if (c.action === 'create') toast({ title: 'Create project', description: 'Opening new project wizard...', variant: 'info' });
    if (c.action === 'upload') toast({ title: 'Upload files', description: 'Opening file uploader...', variant: 'info' });
    setCommandOpen(false);
  };

  return (
    <AnimatePresence>
      {commandOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setCommandOpen(false)} />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-xl bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow-pop)] overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
              <Search className="h-4 w-4 text-[var(--text-muted)]" />
              <input
                autoFocus
                value={query}
                onChange={(e) => { setQuery(e.target.value); setActiveIdx(0); }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, flat.length - 1)); }
                  if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, 0)); }
                  if (e.key === 'Enter') { e.preventDefault(); handleSelect(activeIdx); }
                  if (e.key === 'Escape') { setCommandOpen(false); }
                }}
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-[var(--text-subtle)]"
              />
              <kbd className="px-1.5 py-0.5 rounded-md bg-[var(--surface-2)] border border-[var(--border)] text-[10px] font-medium text-[var(--text-muted)]">ESC</kbd>
            </div>
            <div className="max-h-96 overflow-y-auto p-2">
              {Object.entries(grouped).length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-sm text-[var(--text-muted)]">No results for "{query}"</p>
                </div>
              ) : (
                Object.entries(grouped).map(([group, items]) => (
                  <div key={group} className="mb-2">
                    <div className="px-2 py-1 text-[10px] uppercase tracking-wider font-semibold text-[var(--text-subtle)]">{group}</div>
                    {items.map((c) => {
                      const idx = flat.indexOf(c);
                      const Icon = c.icon;
                      return (
                        <button
                          key={c.label}
                          onClick={() => handleSelect(idx)}
                          onMouseEnter={() => setActiveIdx(idx)}
                          className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm transition-colors ${activeIdx === idx ? 'bg-[var(--primary)] text-white' : 'text-[var(--text)] hover:bg-[var(--surface-2)]'}`}
                        >
                          <Icon className="h-4 w-4 flex-shrink-0" />
                          <span className="flex-1 text-left">{c.label}</span>
                          {activeIdx === idx && <span className="text-[10px] opacity-70">↵</span>}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
            <div className="px-4 py-2 border-t border-[var(--border)] flex items-center justify-between text-[10px] text-[var(--text-muted)]">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-[var(--surface-2)] border border-[var(--border)]">↑↓</kbd> navigate</span>
                <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-[var(--surface-2)] border border-[var(--border)]">↵</kbd> select</span>
              </div>
              <span>ReelLine Command Palette</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
