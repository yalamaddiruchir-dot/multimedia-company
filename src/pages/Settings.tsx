import { useState } from 'react';
import { PageContainer, PageHeader } from '../components/layout/AppShell';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { Input } from '../components/ui/Input';
import { StatusChip } from '../components/ui/StatusChip';
import { team, auditLogs } from '../data/mock';
import { User, Lock, Shield, Bell, Globe, Palette, Smartphone, Monitor, Moon, Sun, Check, Laptop, Phone, Key } from 'lucide-react';
import { useTheme } from '../lib/theme';
import { cn } from '../lib/utils';

const sections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'sessions', label: 'Sessions', icon: Monitor },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'audit', label: 'Audit Logs', icon: Lock },
];

export function SettingsPage() {
  const [tab, setTab] = useState('profile');
  const { theme, setTheme } = useTheme();

  return (
    <PageContainer>
      <PageHeader title="Settings" description="Personal account preferences" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card padding="sm" className="lg:col-span-1 h-fit">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setTab(s.id)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
                  tab === s.id ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]'
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {s.label}
              </button>
            );
          })}
        </Card>

        <div className="lg:col-span-3 space-y-4">
          {tab === 'profile' && (
            <Card>
              <CardHeader title="Profile Information" subtitle="Update your personal details" />
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[var(--border)]">
                <Avatar name={team[0].name} color={team[0].color} size="xl" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold">{team[0].name}</h3>
                  <p className="text-xs text-[var(--text-muted)]">{team[0].email}</p>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm">Upload photo</Button>
                    <Button variant="ghost" size="sm">Remove</Button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">First name</label>
                  <Input value="Aarav" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">Last name</label>
                  <Input value="Kapoor" />
                </div>
                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">Email</label>
                  <Input value="aarav@reelline.io" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">Phone</label>
                  <Input value="+91 98765 43210" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">Role</label>
                  <Input value="Owner" />
                </div>
              </div>
              <div className="mt-5 pt-5 border-t border-[var(--border)] flex justify-end">
                <Button variant="primary">Save changes</Button>
              </div>
            </Card>
          )}

          {tab === 'security' && (
            <>
              <Card>
                <CardHeader title="Password" subtitle="Last changed 3 months ago" />
                <div className="space-y-3 max-w-md">
                  <Input type="password" placeholder="Current password" />
                  <Input type="password" placeholder="New password" />
                  <Input type="password" placeholder="Confirm new password" />
                  <Button variant="primary">Update password</Button>
                </div>
              </Card>
              <Card>
                <CardHeader title="Two-Factor Authentication" subtitle="Extra layer of security for your account" />
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">2FA is enabled</p>
                      <p className="text-xs text-[var(--text-muted)]">Authenticator app · Backup codes available</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
              </Card>
              <Card>
                <CardHeader title="API Keys" subtitle="Manage programmatic access" />
                <div className="space-y-2">
                  {['Production key', 'Staging key'].map((k) => (
                    <div key={k} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                      <Key className="h-4 w-4 text-[var(--text-muted)]" />
                      <span className="text-xs font-medium flex-1">{k}</span>
                      <code className="text-[10px] font-mono text-[var(--text-muted)]">rl_live_••••••••4242</code>
                      <Button variant="ghost" size="sm">Revoke</Button>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}

          {tab === 'sessions' && (
            <Card>
              <CardHeader title="Active Sessions" subtitle="Devices currently logged into your account" />
              <div className="space-y-2">
                {[
                  { device: 'MacBook Pro 16"', location: 'Mumbai, India', ip: '192.168.1.42', current: true, icon: Laptop },
                  { device: 'iPhone 15 Pro', location: 'Mumbai, India', ip: '192.168.1.55', current: false, icon: Phone },
                  { device: 'iPad Air', location: 'Delhi, India', ip: '203.45.67.89', current: false, icon: Monitor },
                ].map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)]">
                      <div className="h-10 w-10 rounded-xl bg-[var(--surface-2)] flex items-center justify-center">
                        <Icon className="h-5 w-5 text-[var(--text-muted)]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold">{s.device}</p>
                          {s.current && <StatusChip variant="success" size="sm">Current</StatusChip>}
                        </div>
                        <p className="text-[11px] text-[var(--text-muted)]">{s.location} · {s.ip}</p>
                      </div>
                      {!s.current && <Button variant="outline" size="sm">Revoke</Button>}
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {tab === 'notifications' && (
            <Card>
              <CardHeader title="Notification Preferences" subtitle="Choose what you want to be notified about" />
              <div className="space-y-2">
                {[
                  { label: 'Project assignments', desc: 'When you are assigned to a project', email: true, push: true, sms: false },
                  { label: 'Stage completions', desc: 'When a stage is marked complete', email: true, push: true, sms: false },
                  { label: 'Mentions & comments', desc: 'When someone mentions you', email: true, push: true, sms: true },
                  { label: 'Delay alerts', desc: 'When projects fall behind schedule', email: true, push: true, sms: true },
                  { label: 'Weekly reports', desc: 'Summary of studio performance', email: true, push: false, sms: false },
                  { label: 'Marketing updates', desc: 'New features and tips', email: false, push: false, sms: false },
                ].map((p, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)]">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{p.label}</p>
                      <p className="text-[11px] text-[var(--text-muted)]">{p.desc}</p>
                    </div>
                    {(['email', 'push', 'sms'] as const).map((ch) => (
                      <label key={ch} className="flex flex-col items-center gap-1 cursor-pointer">
                        <span className={cn('h-9 w-5 rounded-full transition-colors relative', p[ch] ? 'bg-[var(--primary)]' : 'bg-[var(--border)]')}>
                          <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all', p[ch] ? 'left-0.5' : 'left-0.5')} style={{ left: p[ch] ? 'calc(100% - 18px)' : '2px' }} />
                        </span>
                        <span className="text-[9px] uppercase font-semibold text-[var(--text-muted)]">{ch}</span>
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {tab === 'appearance' && (
            <Card>
              <CardHeader title="Appearance" subtitle="Customize how ReelLine looks" />
              <div>
                <h4 className="text-xs font-semibold mb-3">Theme</h4>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'light', label: 'Light', icon: Sun, bg: 'bg-white', text: 'text-slate-900' },
                    { id: 'dark', label: 'Dark', icon: Moon, bg: 'bg-slate-900', text: 'text-white' },
                    { id: 'system', label: 'System', icon: Monitor, bg: 'bg-gradient-to-br from-white to-slate-900', text: 'text-slate-700' },
                  ].map((t) => {
                    const Icon = t.icon;
                    const active = theme === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id as any)}
                        className={cn(
                          'p-3 rounded-xl border-2 transition-all text-left',
                          active ? 'border-[var(--primary)] ring-2 ring-[var(--ring)]' : 'border-[var(--border)] hover:border-[var(--border-strong)]'
                        )}
                      >
                        <div className={cn('h-16 rounded-lg flex items-center justify-center mb-2', t.bg)}>
                          <Icon className={cn('h-5 w-5', t.text)} />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">{t.label}</span>
                          {active && <Check className="h-3.5 w-3.5 text-[var(--primary)]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>
          )}

          {tab === 'audit' && (
            <Card padding="none">
              <div className="p-4 border-b border-[var(--border)]">
                <h3 className="text-sm font-semibold">Your Activity</h3>
                <p className="text-xs text-[var(--text-muted)]">Personal security log</p>
              </div>
              <div className="divide-y divide-[var(--border)]">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex items-center gap-3 p-4">
                    <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Lock className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium">{log.action}</p>
                      <p className="text-[10px] text-[var(--text-muted)]">{log.target}</p>
                    </div>
                    <span className="text-xs text-[var(--text-muted)]">{log.time}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
