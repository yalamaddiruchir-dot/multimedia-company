import { PageContainer, PageHeader } from '../components/layout/AppShell';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Sparkles, Lightbulb, ArrowRight, BarChart3, Search, FileText, MessageSquare, Wand2 } from 'lucide-react';

const prompts = [
  { icon: Search, label: 'Find all delayed weddings', desc: 'Filter projects with delays > 24h' },
  { icon: Calendar, label: 'Show projects due this week', desc: 'List events scheduled in 7 days' },
  { icon: FileText, label: 'Summarize today\'s production', desc: 'Generate daily activity report' },
  { icon: MessageSquare, label: 'Why is Project Alpha delayed?', desc: 'Analyze root cause from logs' },
  { icon: BarChart3, label: 'Generate production report', desc: 'Create executive PDF summary' },
  { icon: Wand2, label: 'Suggest workload rebalancing', desc: 'AI-powered team optimization' },
];

import { Calendar } from 'lucide-react';

export function AIPage() {
  return (
    <PageContainer>
      <PageHeader
        title="AI Assistant"
        description="Ask anything about your studio's production data"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-8 bg-gradient-to-br from-violet-500/10 via-pink-500/5 to-blue-500/10 border-violet-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold gradient-text">ReelLine AI</h2>
              <p className="text-xs text-[var(--text-muted)]">Powered by studio-specific intelligence</p>
            </div>
          </div>
          <p className="text-sm text-[var(--text-muted)] mb-6 max-w-xl">
            Get instant answers about projects, team performance, revenue, and bottlenecks. Just ask in plain English.
          </p>
          <div className="flex items-center gap-2 bg-[var(--surface)] rounded-2xl px-4 py-3 border border-[var(--border)] focus-within:border-[var(--primary)] transition-colors max-w-xl">
            <Sparkles className="h-4 w-4 text-violet-500 flex-shrink-0" />
            <input placeholder="Ask anything about your studio..." className="flex-1 bg-transparent outline-none text-sm" />
            <Button variant="primary" size="sm" icon={<ArrowRight className="h-3.5 w-3.5" />}>Ask</Button>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Lightbulb className="h-4 w-4 text-amber-500" /> AI Capabilities</h3>
          <div className="space-y-2">
            {[
              { label: 'Natural language search', enabled: true },
              { label: 'Auto-generate reports', enabled: true },
              { label: 'Predict delays', enabled: true },
              { label: 'Smart scheduling', enabled: true },
              { label: 'Voice commands', enabled: false },
              { label: 'Auto-tagging photos', enabled: false },
            ].map((c) => (
              <div key={c.label} className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--surface-2)]">
                <span className="text-xs">{c.label}</span>
                <span className={c.enabled ? 'h-5 w-9 rounded-full bg-[var(--primary)] relative' : 'h-5 w-9 rounded-full bg-[var(--border)] relative'}>
                  <span className={c.enabled ? 'absolute top-0.5 right-0.5 h-4 w-4 rounded-full bg-white shadow-sm' : 'absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm'} />
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <h3 className="text-sm font-semibold mt-6 mb-3">Try these prompts</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {prompts.map((p) => {
          const Icon = p.icon;
          return (
            <button key={p.label} className="flex items-start gap-3 p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--primary)] transition-colors text-left group">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0">
                <Icon className="h-4 w-4 text-violet-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium group-hover:text-[var(--primary)] transition-colors">{p.label}</p>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5">{p.desc}</p>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity mt-2" />
            </button>
          );
        })}
      </div>
    </PageContainer>
  );
}
