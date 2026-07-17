import { Search, Plus, Bell, Sun, Moon, Command, Menu } from 'lucide-react';
import { useTheme } from '../../lib/theme';
import { useUI } from '../../lib/uiStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '../ui/Avatar';
import { team, notifications } from '../../data/mock';
import { cn, relativeTime, formatRole, toPresenceStatus } from '../../lib/utils';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export function TopBar() {
  const { theme, toggle } = useTheme();
  const { toggleSidebar, setCommandOpen, notifOpen, setNotifOpen, setAiOpen } = useUI();
  const { user, isDemo, logout } = useAuth();
  // Falls back to mock data only if somehow rendered with no authenticated
  // user at all (shouldn't happen behind ProtectedRoute, but keeps this
  // component safe to use in isolation).
  const me = user ?? team[0];
  const [profileOpen, setProfileOpen] = useState(false);
  const unread = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-30 h-16 glass border-b border-[var(--border)]">
      <div className="h-full flex items-center gap-2 px-4 lg:px-6">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)]"
        >
          <Menu className="h-4 w-4" />
        </button>

        {isDemo && (
          <button
            onClick={logout}
            title="Exit demo mode"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 h-7 rounded-full bg-purple-500/15 text-purple-400 text-[11px] font-semibold border border-purple-500/30 hover:bg-purple-500/25 transition-colors"
          >
            DEMO MODE · Exit
          </button>
        )}

        {/* Search / Command palette trigger */}
        <button
          onClick={() => setCommandOpen(true)}
          className="flex-1 max-w-md flex items-center gap-2.5 h-9 px-3 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--border)] text-[var(--text-muted)] transition-colors text-sm group"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="flex-1 text-left text-xs">Search projects, clients, files...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 h-5 rounded-md bg-[var(--surface)] border border-[var(--border)] text-[10px] font-medium text-[var(--text-muted)]">
            <Command className="h-2.5 w-2.5" />K
          </kbd>
        </button>

        <div className="flex-1" />

        {/* Quick create */}
        <button
          onClick={() => useUI().toast({ title: 'Quick create', description: 'Press / to navigate create options', variant: 'info' })}
          className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-[var(--primary)] hover:opacity-90 text-white text-xs font-medium transition-all btn-press"
        >
          <Plus className="h-3.5 w-3.5" />
          Create
        </button>

        {/* AI */}
        <button
          onClick={() => setAiOpen(true)}
          className="hidden md:inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white text-xs font-medium btn-press"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5">
            <path d="M12 2l1.6 4.8L18 8l-4.4 1.2L12 14l-1.6-4.8L6 8l4.4-1.2L12 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M19 14l.7 2.1L22 17l-2.3.9L19 20l-.7-2.1L16 17l2.3-.9L19 14z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
          Ask AI
        </button>

        {/* Theme switch */}
        <button
          onClick={toggle}
          className="h-9 w-9 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] flex items-center justify-center transition-all"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className={cn(
              'relative h-9 w-9 rounded-xl flex items-center justify-center transition-all',
              notifOpen ? 'bg-[var(--surface-2)] text-[var(--text)]' : 'hover:bg-[var(--surface-2)] text-[var(--text-muted)]'
            )}
          >
            <Bell className="h-4 w-4" />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 h-4 min-w-4 px-1 rounded-full bg-[var(--danger)] text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-[var(--surface)]">
                {unread}
              </span>
            )}
          </button>
          <AnimatePresence>
            {notifOpen && <NotificationDropdown onClose={() => setNotifOpen(false)} />}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 h-9 pl-1 pr-2 rounded-xl hover:bg-[var(--surface-2)] transition-colors"
          >
            <Avatar name={me.name} color={me.color} size="sm" status={toPresenceStatus(me.status)} />
            <div className="hidden md:block text-left">
              <div className="text-xs font-semibold text-[var(--text)] leading-tight">{me.name.split(' ')[0]}</div>
              <div className="text-[10px] text-[var(--text-muted)] leading-tight">{formatRole(me.role)}</div>
            </div>
          </button>
          <AnimatePresence>
            {profileOpen && <ProfileDropdown me={me} onLogout={logout} onClose={() => setProfileOpen(false)} />}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

function NotificationDropdown({ onClose }: { onClose: () => void }) {
  const { toast } = useUI();
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.96 }}
        transition={{ duration: 0.15 }}
        className="absolute right-0 top-12 w-96 max-w-[calc(100vw-2rem)] z-50 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow-pop)] overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <div>
            <h3 className="text-sm font-semibold">Notifications</h3>
            <p className="text-xs text-[var(--text-muted)]">{notifications.filter((n) => n.unread).length} unread</p>
          </div>
          <button onClick={() => toast({ title: 'Marked all as read', variant: 'success' })} className="text-xs font-medium text-[var(--primary)] hover:opacity-80">
            Mark all read
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.map((n) => {
            const colors = {
              mention: 'bg-violet-500',
              assignment: 'bg-blue-500',
              completion: 'bg-emerald-500',
              delay: 'bg-red-500',
              approval: 'bg-amber-500',
              revision: 'bg-orange-500',
            };
            return (
              <button
                key={n.id}
                className={cn(
                  'w-full flex items-start gap-3 p-3 hover:bg-[var(--surface-2)] transition-colors text-left border-b border-[var(--border)] last:border-0',
                  n.unread && 'bg-[var(--primary)]/5'
                )}
              >
                <div className={cn('h-2 w-2 rounded-full mt-1.5 flex-shrink-0', colors[n.type as keyof typeof colors] || 'bg-slate-500')} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-[var(--text)]">{n.title}</p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5 line-clamp-2">{n.desc}</p>
                  <p className="text-[10px] text-[var(--text-subtle)] mt-1">{n.time} ago</p>
                </div>
              </button>
            );
          })}
        </div>
        <div className="p-2 border-t border-[var(--border)]">
          <button className="w-full py-2 text-xs font-medium text-[var(--primary)] hover:bg-[var(--surface-2)] rounded-lg transition-colors">
            View all notifications
          </button>
        </div>
      </motion.div>
    </>
  );
}

function ProfileDropdown({
  me,
  onLogout,
  onClose,
}: {
  me: { name: string; email: string; color: string };
  onLogout: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.96 }}
        transition={{ duration: 0.15 }}
        className="absolute right-0 top-12 w-64 z-50 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-[var(--shadow-pop)] overflow-hidden"
      >
        <div className="p-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <Avatar name={me.name} color={me.color} size="md" />
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{me.name}</p>
              <p className="text-[11px] text-[var(--text-muted)] truncate">{me.email}</p>
            </div>
          </div>
        </div>
        <div className="p-1.5">
          {['Profile', 'Preferences', 'Keyboard shortcuts', 'Switch account'].map((label) => (
            <button key={label} className="w-full text-left px-3 py-2 text-xs font-medium rounded-lg hover:bg-[var(--surface-2)] text-[var(--text)]">
              {label}
            </button>
          ))}
        </div>
        <div className="p-1.5 border-t border-[var(--border)]">
          <button
            onClick={onLogout}
            className="w-full text-left px-3 py-2 text-xs font-medium rounded-lg hover:bg-red-500/10 text-red-500"
          >
            Sign out
          </button>
        </div>
      </motion.div>
    </>
  );
}
