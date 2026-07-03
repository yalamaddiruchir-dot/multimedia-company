import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { revenueData, stageDistribution } from '../../data/mock';

const tooltipStyle = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 12,
  fontSize: 12,
  padding: '8px 12px',
  boxShadow: 'var(--shadow-pop)',
};

const axisProps = {
  tickLine: false,
  axisLine: false,
  tick: { fill: 'var(--text-muted)', fontSize: 11 },
};

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="prof" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} tickFormatter={(v) => `$${v / 1000}k`} />
        <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`$${Number(v).toLocaleString()}`, '']} />
        <Area type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={2.5} fill="url(#rev)" />
        <Area type="monotone" dataKey="profit" stroke="#7C3AED" strokeWidth={2.5} fill="url(#prof)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function ProjectGrowthChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" {...axisProps} />
        <YAxis {...axisProps} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line type="monotone" dataKey="projects" stroke="#22C55E" strokeWidth={2.5} dot={{ r: 4, fill: '#22C55E' }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function TeamPerformanceChart({ data }: { data: { name: string; tasks: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" {...axisProps} />
        <YAxis {...axisProps} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="tasks" fill="#2563EB" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function StageDistributionChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Tooltip contentStyle={tooltipStyle} />
        <Pie
          data={stageDistribution}
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
          stroke="none"
        >
          {stageDistribution.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          iconType="circle"
          wrapperStyle={{ fontSize: 11, color: 'var(--text-muted)' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function ProductivityHeatmap() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 12 }, (_, i) => i + 8);
  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        <div className="w-10" />
        {hours.map((h) => (
          <div key={h} className="flex-1 text-center text-[9px] text-[var(--text-subtle)] font-medium">
            {h}:00
          </div>
        ))}
      </div>
      {days.map((day, di) => (
        <div key={day} className="flex gap-1">
          <div className="w-10 text-[10px] text-[var(--text-muted)] font-medium flex items-center">{day}</div>
          {hours.map((h) => {
            const v = ((di * 7 + h) * 13) % 100;
            const opacity = 0.1 + (v / 100) * 0.9;
            return (
              <div
                key={h}
                className="flex-1 aspect-square rounded-sm transition-all hover:scale-110 cursor-pointer"
                style={{ background: `rgba(37, 99, 235, ${opacity})` }}
                title={`${day} ${h}:00 — ${v} tasks`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
