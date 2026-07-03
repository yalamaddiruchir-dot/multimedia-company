import { useState } from 'react';
import { PageContainer, PageHeader } from '../components/layout/AppShell';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { StatusChip } from '../components/ui/StatusChip';
import { team, auditLogs } from '../data/mock';
import { Building2, Globe, Users, CreditCard, Key, Plug, FileText, Check, X } from 'lucide-react';
import { cn } from '../lib/utils';

const roles = ['Owner', 'Manager', 'Data Copy', 'Lightroom', 'Video', 'Album', 'Editor'];
const permissions = ['View Projects', 'Create Projects', 'Edit Projects', 'Delete Projects', 'Manage Team', 'Manage Billing', 'View Analytics', 'Manage Settings'];

const matrix: Record<string, Record<string, boolean>> = {
  Owner:    { 'View Projects': true, 'Create Projects': true, 'Edit Projects': true, 'Delete Projects': true, 'Manage Team': true, 'Manage Billing': true, 'View Analytics': true, 'Manage Settings': true },
  Manager:  { 'View Projects': true, 'Create Projects': true, 'Edit Projects': true, 'Delete Projects': true, 'Manage Team': true, 'Manage Billing': false, 'View Analytics': true, 'Manage Settings': false },
  'Data Copy': { 'View Projects': true, 'Create Projects': false, 'Edit Projects': true, 'Delete Projects': false, 'Manage Team': false, 'Manage Billing': false, 'View Analytics': false, 'Manage Settings': false },
  Lightroom:{ 'View Projects': true, 'Create Projects': false, 'Edit Projects': true, 'Delete Projects': false, 'Manage Team': false, 'Manage Billing': false, 'View Analytics': false, 'Manage Settings': false },
  Video:    { 'View Projects': true, 'Create Projects': false, 'Edit Projects': true, 'Delete Projects': false, 'Manage Team': false, 'Manage Billing': false, 'View Analytics': false, 'Manage Settings': false },
  Album:    { 'View Projects': true, 'Create Projects': false, 'Edit Projects': true, 'Delete Projects': false, 'Manage Team': false, 'Manage Billing': false, 'View Analytics': false, 'Manage Settings': false },
  Editor:   { 'View Projects': true, 'Create Projects': false, 'Edit Projects': true, 'Delete Projects': false, 'Manage Team': false, 'Manage Billing': false, 'View Analytics': false, 'Manage Settings': false },
};

const tabs = [
  { id: 'profile', label: 'Studio Profile', icon: Building2 },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'roles', label: 'Roles & Permissions', icon: Key },
  { id: 'billing', label: 'Subscription', icon: CreditCard },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'audit', label: 'Audit Logs', icon: FileText },
];

export function OrganizationPage() {
  const [tab, setTab] = useState('profile');

  return (
    <PageContainer>
      <PageHeader title="Organization" description="Studio settings and administration" />

      <div className="flex flex-wrap gap-1 mb-4 border-b border-[var(--border)]">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex items-center gap-2 h-10 px-3 text-xs font-medium border-b-2 transition-colors',
                tab === t.id ? 'border-[var(--primary)] text-[var(--text)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text)]'
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader title="Studio Profile" subtitle="Public information about your studio" />
            <div className="flex items-center gap-4 mb-5 pb-5 border-b border-[var(--border)]">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                LS
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold">Lumen Studios</h3>
                <p className="text-xs text-[var(--text-muted)]">Premium wedding & corporate photography</p>
                <div className="flex items-center gap-2 mt-2">
                  <StatusChip variant="success">Enterprise</StatusChip>
                  <span className="text-[11px] text-[var(--text-muted)]">Mumbai, India · Since 2019</span>
                </div>
              </div>
              <Button variant="outline" size="sm">Edit</Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Studio name', value: 'Lumen Studios' },
                { label: 'Tagline', value: 'Capturing moments, creating memories' },
                { label: 'Email', value: 'hello@lumenstudios.io' },
                { label: 'Phone', value: '+91 98765 43210' },
                { label: 'Website', value: 'lumenstudios.io' },
                { label: 'Address', value: 'Bandra Kurla Complex, Mumbai' },
              ].map((f) => (
                <div key={f.label} className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-[var(--text-muted)]">{f.label}</label>
                  <div className="h-9 px-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs flex items-center">{f.value}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader title="Branding" subtitle="Customize appearance" />
            <div className="space-y-3">
              <div className="h-20 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500" />
              <div className="grid grid-cols-5 gap-1.5">
                {['#F59E0B', '#2563EB', '#7C3AED', '#22C55E', '#EF4444'].map((c) => (
                  <button key={c} className="aspect-square rounded-lg ring-2 ring-offset-2 ring-offset-[var(--surface)] ring-transparent hover:ring-[var(--primary)]" style={{ background: c }} />
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {tab === 'roles' && (
        <Card padding="none">
          <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
            <h3 className="text-sm font-semibold">Permission Matrix</h3>
            <Button variant="outline" size="sm">Export</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface-2)]">
                  <th className="text-left text-[10px] uppercase tracking-wider font-semibold text-[var(--text-muted)] px-4 py-3 sticky left-0 bg-[var(--surface-2)]">Permission</th>
                  {roles.map((r) => (
                    <th key={r} className="text-center text-[10px] uppercase tracking-wider font-semibold text-[var(--text-muted)] px-4 py-3">{r}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {permissions.map((perm) => (
                  <tr key={perm} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-2)]">
                    <td className="px-4 py-3 text-xs font-medium sticky left-0 bg-[var(--surface)]">{perm}</td>
                    {roles.map((r) => (
                      <td key={r} className="px-4 py-3 text-center">
                        <button className={cn(
                          'h-5 w-5 rounded-md flex items-center justify-center mx-auto transition-colors',
                          matrix[r][perm] ? 'bg-[var(--primary)] text-white' : 'bg-[var(--surface-2)] border border-[var(--border)]'
                        )}>
                          {matrix[r][perm] ? <Check className="h-3 w-3" /> : <X className="h-3 w-3 text-[var(--text-subtle)]" />}
                        </button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 'billing' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2 p-6 bg-gradient-to-br from-blue-500/10 to-violet-500/10 border-blue-500/20">
            <div className="flex items-start justify-between">
              <div>
                <StatusChip variant="success">Active</StatusChip>
                <h3 className="text-2xl font-bold mt-2">Enterprise Plan</h3>
                <p className="text-sm text-[var(--text-muted)] mt-1">Unlimited projects · Priority support · Custom roles</p>
                <div className="flex items-baseline gap-1 mt-4">
                  <span className="text-4xl font-bold">$499</span>
                  <span className="text-sm text-[var(--text-muted)]">/month</span>
                </div>
              </div>
              <Button variant="primary">Manage plan</Button>
            </div>
            <div className="mt-5 pt-5 border-t border-[var(--border)]/50 grid grid-cols-3 gap-4">
              <div><p className="text-xs text-[var(--text-muted)]">Storage used</p><p className="text-sm font-semibold mt-1">2.4 TB / 10 TB</p></div>
              <div><p className="text-xs text-[var(--text-muted)]">Active seats</p><p className="text-sm font-semibold mt-1">8 / 25</p></div>
              <div><p className="text-xs text-[var(--text-muted)]">Next billing</p><p className="text-sm font-semibold mt-1">Aug 1, 2026</p></div>
            </div>
          </Card>
          <Card>
            <CardHeader title="Payment Method" />
            <div className="rounded-xl p-4 bg-gradient-to-br from-slate-700 to-slate-900 text-white">
              <p className="text-xs opacity-70">VISA</p>
              <p className="text-base font-semibold tracking-wider mt-3">•••• •••• •••• 4242</p>
              <p className="text-xs opacity-70 mt-1">Aarav Kapoor · 12/27</p>
            </div>
          </Card>
        </div>
      )}

      {tab === 'integrations' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Google Drive', desc: 'Sync files automatically', connected: true, color: 'from-blue-500 to-green-500' },
            { name: 'Dropbox', desc: 'Backup & share files', connected: true, color: 'from-blue-600 to-blue-400' },
            { name: 'Slack', desc: 'Team notifications', connected: true, color: 'from-violet-500 to-pink-500' },
            { name: 'Adobe Lightroom', desc: 'Direct import', connected: false, color: 'from-blue-500 to-cyan-500' },
            { name: 'Stripe', desc: 'Payments & invoicing', connected: true, color: 'from-violet-600 to-indigo-500' },
            { name: 'Zapier', desc: '500+ integrations', connected: false, color: 'from-orange-500 to-red-500' },
          ].map((i) => (
            <Card key={i.name} hover>
              <div className="flex items-start justify-between mb-3">
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${i.color} flex items-center justify-center text-white font-bold text-lg`}>
                  {i.name[0]}
                </div>
                {i.connected ? <StatusChip variant="success" size="sm">Connected</StatusChip> : <StatusChip variant="neutral" size="sm">Not connected</StatusChip>}
              </div>
              <h4 className="text-sm font-semibold">{i.name}</h4>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{i.desc}</p>
              <Button variant={i.connected ? 'outline' : 'primary'} size="sm" className="mt-3 w-full">
                {i.connected ? 'Manage' : 'Connect'}
              </Button>
            </Card>
          ))}
        </div>
      )}

      {tab === 'audit' && (
        <Card padding="none">
          <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
            <h3 className="text-sm font-semibold">Audit Logs</h3>
            <Button variant="outline" size="sm">Export</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface-2)]">
                  {['Who', 'Action', 'Target', 'Old → New', 'Time', 'IP', 'Role'].map((h) => (
                    <th key={h} className="text-left text-[10px] uppercase tracking-wider font-semibold text-[var(--text-muted)] px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-2)]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={log.who} size="sm" />
                        <span className="text-xs font-medium">{log.who}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs">{log.action}</td>
                    <td className="px-4 py-3 text-xs text-[var(--text-muted)]">{log.target}</td>
                    <td className="px-4 py-3 text-[11px]">
                      <span className="text-[var(--text-muted)]">{log.oldValue}</span>
                      <span className="mx-1.5">→</span>
                      <span className="font-medium">{log.newValue}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--text-muted)]">{log.time}</td>
                    <td className="px-4 py-3 text-[11px] font-mono text-[var(--text-muted)]">{log.ip}</td>
                    <td className="px-4 py-3"><StatusChip variant="info" size="sm" dot={false}>{log.role}</StatusChip></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 'team' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.map((u) => (
            <Card key={u.id} hover>
              <div className="flex items-center gap-3">
                <Avatar name={u.name} color={u.color} size="lg" status={u.status as any} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{u.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">{u.role}</p>
                  <p className="text-[10px] text-[var(--text-subtle)] mt-0.5">{u.email}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
