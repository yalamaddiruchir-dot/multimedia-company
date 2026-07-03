import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FolderKanban, Workflow, Calendar, BarChart3, Bell, Activity,
  Users, Files, Sparkles, Building2, Settings, HelpCircle, LogOut, ChevronDown,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useUI } from '../../lib/uiStore';
import { team } from '../../data/mock';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { to: '/projects', label: 'Projects', icon: FolderKanban, badge: '8' },
  { to: '/workflow', label: 'Workflow', icon: Workflow, badge: null },
  { to: '/calendar', label: 'Calendar', icon: Calendar, badge: '3' },
  { to: '/analytics', label: 'Analytics', icon: BarChart3, badge: null },
  { to: '/notifications', label: 'Notifications', icon: Bell, badge: '5' },
  { to: '/activity', label: 'Activity', icon: Activity, badge: null },
  { to: '/team', label: 'Team', icon: Users, badge: null },
  { to: '/files', label: 'Files', icon: Files, badge: null },
  { to: '/ai', label: 'AI Assistant', icon: Sparkles, badge: 'New' },
  { to: '/organization', label: 'Organization', icon: Building2, badge: null },
  { to: '/settings', label: 'Settings', icon: Settings, badge: null },
];

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useUI();
  const location = useLocation();
  const me = team[0];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 h-screen w-64 z-50 lg:z-30 flex flex-col',
          'bg-[var(--surface)] border-r border-[var(--border)]',
          'transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[var(--border)]">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="relative h-8 w-8 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center shadow-md">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-white">
                <path d="M5 4l3 12 4-8 4 8 3-12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight">ReelLine</div>
              <div className="text-[10px] text-[var(--text-muted)] -mt-0.5">Studio Suite</div>
            </div>
          </Link>
        </div>

        {/* Workspace switcher */}
        <div className="px-3 pt-3">
          <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-[var(--surface-2)] transition-colors group">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
              LS
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="text-xs font-semibold text-[var(--text)] truncate">Lumen Studios</div>
              <div className="text-[10px] text-[var(--text-muted)]">Enterprise</div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-[var(--text-muted)]" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-[var(--text-subtle)] px-2.5 mb-2">
            Workspace
          </div>
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const active = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-all',
                    active
                      ? 'bg-[var(--primary)] text-white shadow-sm'
                      : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={cn(
                        'h-5 min-w-5 px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center',
                        item.badge === 'New'
                          ? 'bg-gradient-to-r from-[#7C3AED] to-[#EC4899] text-white'
                          : active
                          ? 'bg-white/20 text-white'
                          : 'bg-[var(--surface-2)] text-[var(--text-muted)]'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Help */}
        <div className="px-3 pb-3">
          <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] transition-colors">
            <HelpCircle className="h-4 w-4" />
            <span className="flex-1 text-left">Help & Support</span>
          </button>
        </div>

        {/* User */}
        <div className="px-3 pb-3 border-t border-[var(--border)] pt-3">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-[var(--surface-2)] transition-colors cursor-pointer group">
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: me.color }}
            >
              {me.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-[var(--text)] truncate">{me.name}</div>
              <div className="text-[10px] text-[var(--text-muted)]">{me.role}</div>
            </div>
            <LogOut className="h-3.5 w-3.5 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </aside>
    </>
  );
}
