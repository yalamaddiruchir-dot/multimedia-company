import { useState } from 'react';
import { PageContainer, PageHeader } from '../components/layout/AppShell';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin } from 'lucide-react';
import { cn } from '../lib/utils';

const events = [
  { day: 8, color: 'bg-blue-500', title: 'Sharma Wedding Shoot', time: '06:00 - 18:00', location: 'Mumbai' },
  { day: 12, color: 'bg-violet-500', title: 'Apex Tech Conference', time: '09:00 - 17:00', location: 'Delhi' },
  { day: 14, color: 'bg-emerald-500', title: 'Kapoor Family Portrait', time: '14:00 - 16:00', location: 'Studio' },
  { day: 18, color: 'bg-pink-500', title: 'Mehta Wedding Goa', time: '08:00 - 20:00', location: 'Goa' },
  { day: 22, color: 'bg-amber-500', title: 'Vogue Editorial', time: '10:00 - 14:00', location: 'Studio' },
  { day: 25, color: 'bg-cyan-500', title: 'Redwood Gala', time: '18:00 - 23:00', location: 'Bangalore' },
  { day: 28, color: 'bg-red-500', title: 'Lumen Studios Launch', time: '19:00 - 22:00', location: 'Mumbai' },
];

export function CalendarPage() {
  const [view, setView] = useState<'month' | 'week'>('month');
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const startDay = 3; // July 1, 2026 starts on Wednesday
  const daysInMonth = 31;
  
  const cells = Array.from({ length: 42 }, (_, i) => {
    const day = i - startDay + 1;
    if (day < 1 || day > daysInMonth) return null;
    return day;
  });

  return (
    <PageContainer>
      <PageHeader
        title="Calendar"
        description="Schedule shoots, meetings, and deliveries"
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="md" icon={<ChevronLeft className="h-3.5 w-3.5" />}>Prev</Button>
            <Button variant="outline" size="md" iconRight={<ChevronRight className="h-3.5 w-3.5" />}>Next</Button>
            <Button variant="primary" size="md" icon={<Plus className="h-3.5 w-3.5" />}>New Event</Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Calendar */}
        <Card padding="md" className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">July 2026</h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">7 events scheduled</p>
            </div>
            <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
              {['month', 'week', 'day'].map((v) => (
                <button
                  key={v}
                  onClick={() => v !== 'day' && setView(v as any)}
                  className={cn('h-7 px-3 rounded-lg text-xs font-medium capitalize transition-colors', view === v ? 'bg-[var(--surface)] shadow-sm' : 'text-[var(--text-muted)]')}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Days header */}
          <div className="grid grid-cols-7 mb-2">
            {days.map((d) => (
              <div key={d} className="text-center text-[10px] uppercase tracking-wider font-semibold text-[var(--text-muted)] py-2">{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-px bg-[var(--border)] rounded-xl overflow-hidden border border-[var(--border)]">
            {cells.map((day, i) => {
              const today = day === 3;
              const dayEvents = day ? events.filter((e) => e.day === day) : [];
              return (
                <div
                  key={i}
                  className={cn(
                    'min-h-[100px] bg-[var(--surface)] p-2 transition-colors hover:bg-[var(--surface-2)] cursor-pointer',
                    !day && 'opacity-30'
                  )}
                >
                  {day && (
                    <>
                      <div className={cn('text-xs font-semibold mb-1.5 flex items-center justify-center h-6 w-6 rounded-full', today && 'bg-[var(--primary)] text-white')}>
                        {day}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((e, j) => (
                          <div key={j} className={cn('text-[10px] font-medium text-white px-1.5 py-0.5 rounded truncate', e.color)}>
                            {e.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-[9px] text-[var(--text-muted)] font-medium">+{dayEvents.length - 2} more</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Upcoming events sidebar */}
        <div className="space-y-4">
          <Card>
            <h3 className="text-sm font-semibold mb-3">Upcoming Events</h3>
            <div className="space-y-3">
              {events.slice(0, 4).map((e, i) => (
                <div key={i} className="flex gap-3 group cursor-pointer">
                  <div className={cn('w-1 rounded-full flex-shrink-0', e.color)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate group-hover:text-[var(--primary)] transition-colors">{e.title}</p>
                    <p className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                      <Clock className="h-2.5 w-2.5" /> {e.time}
                    </p>
                    <p className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 mt-0.5">
                      <MapPin className="h-2.5 w-2.5" /> {e.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold mb-3">Deadlines This Week</h3>
            <div className="space-y-2">
              {[
                { title: 'Apex Summit teaser review', date: 'Jul 9', urgent: true },
                { title: 'Sharma Wedding Lightroom proofs', date: 'Jul 11', urgent: true },
                { title: 'Mehta Wedding shot list', date: 'Jul 13', urgent: false },
                { title: 'Album design v2', date: 'Jul 14', urgent: false },
              ].map((d, i) => (
                <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[var(--surface-2)] transition-colors">
                  <div className={cn('h-8 w-8 rounded-lg flex flex-col items-center justify-center flex-shrink-0',
                    d.urgent ? 'bg-red-500/10 text-red-600' : 'bg-[var(--surface-2)] text-[var(--text-muted)]'
                  )}>
                    <span className="text-[9px] font-bold leading-none">{d.date.split(' ')[1]}</span>
                    <span className="text-[8px] leading-none mt-0.5">Jul</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{d.title}</p>
                    <p className="text-[10px] text-[var(--text-muted)]">{d.urgent ? 'Urgent' : 'Normal'}</p>
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
