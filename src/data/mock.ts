export type Stage = 'manager' | 'data-copy' | 'lightroom' | 'video' | 'album' | 'editor' | 'delivery';
export type Status = 'active' | 'completed' | 'delayed' | 'rejected' | 'locked' | 'review';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Role = 'Owner' | 'Manager' | 'Data Copy' | 'Lightroom' | 'Video' | 'Album' | 'Editor';

export type User = {
  id: string;
  name: string;
  role: Role;
  email: string;
  initials: string;
  color: string;
  status?: 'online' | 'away' | 'offline';
};

export const team: User[] = [
  { id: 'u1', name: 'Aarav Kapoor', role: 'Owner', email: 'aarav@reelline.io', initials: 'AK', color: '#2563EB', status: 'online' },
  { id: 'u2', name: 'Maya Singh', role: 'Manager', email: 'maya@reelline.io', initials: 'MS', color: '#7C3AED', status: 'online' },
  { id: 'u3', name: 'Rohan Verma', role: 'Data Copy', email: 'rohan@reelline.io', initials: 'RV', color: '#22C55E', status: 'online' },
  { id: 'u4', name: 'Ishita Patel', role: 'Lightroom', email: 'ishita@reelline.io', initials: 'IP', color: '#F59E0B', status: 'away' },
  { id: 'u5', name: 'Vikram Shah', role: 'Video', email: 'vikram@reelline.io', initials: 'VS', color: '#EF4444', status: 'online' },
  { id: 'u6', name: 'Anaya Roy', role: 'Album', email: 'anaya@reelline.io', initials: 'AR', color: '#06B6D4', status: 'offline' },
  { id: 'u7', name: 'Dev Mehta', role: 'Editor', email: 'dev@reelline.io', initials: 'DM', color: '#EC4899', status: 'online' },
  { id: 'u8', name: 'Priya Joshi', role: 'Lightroom', email: 'priya@reelline.io', initials: 'PJ', color: '#8B5CF6', status: 'online' },
];

export const stages: { id: Stage; name: string; color: string; icon: string }[] = [
  { id: 'manager', name: 'Manager', color: '#2563EB', icon: 'Briefcase' },
  { id: 'data-copy', name: 'Data Copy', color: '#7C3AED', icon: 'HardDrive' },
  { id: 'lightroom', name: 'Lightroom', color: '#F59E0B', icon: 'Image' },
  { id: 'video', name: 'Video Editing', color: '#EF4444', icon: 'Film' },
  { id: 'album', name: 'Album Design', color: '#06B6D4', icon: 'BookOpen' },
  { id: 'editor', name: 'Editor', color: '#EC4899', icon: 'Edit3' },
  { id: 'delivery', name: 'Delivery', color: '#22C55E', icon: 'PackageCheck' },
];

export type Project = {
  id: string;
  code: string;
  name: string;
  client: string;
  eventDate: string;
  status: Status;
  currentStage: Stage;
  priority: Priority;
  manager: string;
  team: string[];
  quotation: number;
  progress: number;
  thumbnail: string;
  type: 'Wedding' | 'Corporate' | 'Portrait' | 'Fashion' | 'Event';
};

export const projects: Project[] = [
  {
    id: 'p1',
    code: 'PRJ-2841',
    name: 'Sharma & Patel Wedding',
    client: 'Rohan Sharma',
    eventDate: '2026-07-18',
    status: 'active',
    currentStage: 'lightroom',
    priority: 'high',
    manager: 'u2',
    team: ['u3', 'u4', 'u5', 'u6'],
    quotation: 28500,
    progress: 68,
    thumbnail: 'wedding',
    type: 'Wedding',
  },
  {
    id: 'p2',
    code: 'PRJ-2840',
    name: 'Apex Tech Annual Summit',
    client: 'Apex Technologies',
    eventDate: '2026-07-22',
    status: 'active',
    currentStage: 'video',
    priority: 'urgent',
    manager: 'u2',
    team: ['u5', 'u7'],
    quotation: 42000,
    progress: 45,
    thumbnail: 'corporate',
    type: 'Corporate',
  },
  {
    id: 'p3',
    code: 'PRJ-2839',
    name: 'Kapoor Family Portrait',
    client: 'Anjali Kapoor',
    eventDate: '2026-07-15',
    status: 'completed',
    currentStage: 'delivery',
    priority: 'medium',
    manager: 'u2',
    team: ['u4', 'u8'],
    quotation: 9800,
    progress: 100,
    thumbnail: 'portrait',
    type: 'Portrait',
  },
  {
    id: 'p4',
    code: 'PRJ-2838',
    name: 'Vogue Editorial — Spring',
    client: 'Vogue India',
    eventDate: '2026-07-25',
    status: 'delayed',
    currentStage: 'data-copy',
    priority: 'high',
    manager: 'u2',
    team: ['u3', 'u7'],
    quotation: 65000,
    progress: 22,
    thumbnail: 'fashion',
    type: 'Fashion',
  },
  {
    id: 'p5',
    code: 'PRJ-2837',
    name: 'Mehta Wedding — Goa',
    client: 'Sahil Mehta',
    eventDate: '2026-08-02',
    status: 'active',
    currentStage: 'manager',
    priority: 'medium',
    manager: 'u2',
    team: ['u4', 'u5', 'u6'],
    quotation: 38000,
    progress: 15,
    thumbnail: 'wedding',
    type: 'Wedding',
  },
  {
    id: 'p6',
    code: 'PRJ-2836',
    name: 'Lumen Studios Launch',
    client: 'Lumen Studios',
    eventDate: '2026-07-30',
    status: 'review',
    currentStage: 'album',
    priority: 'medium',
    manager: 'u2',
    team: ['u6', 'u8'],
    quotation: 22000,
    progress: 82,
    thumbnail: 'corporate',
    type: 'Corporate',
  },
  {
    id: 'p7',
    code: 'PRJ-2835',
    name: 'Gupta Engagement Ceremony',
    client: 'Nidhi Gupta',
    eventDate: '2026-07-12',
    status: 'active',
    currentStage: 'editor',
    priority: 'low',
    manager: 'u2',
    team: ['u7'],
    quotation: 12500,
    progress: 90,
    thumbnail: 'wedding',
    type: 'Event',
  },
  {
    id: 'p8',
    code: 'PRJ-2834',
    name: 'Redwood Charity Gala',
    client: 'Redwood Foundation',
    eventDate: '2026-08-10',
    status: 'locked',
    currentStage: 'data-copy',
    priority: 'low',
    manager: 'u2',
    team: ['u3'],
    quotation: 18000,
    progress: 0,
    thumbnail: 'event',
    type: 'Event',
  },
];

export const recentActivity = [
  { id: 1, user: 'u4', action: 'completed Lightroom edits for', target: 'Sharma Wedding', time: '4m ago', type: 'completion' },
  { id: 2, user: 'u5', action: 'uploaded teaser for', target: 'Apex Summit', time: '22m ago', type: 'upload' },
  { id: 3, user: 'u6', action: 'requested revision on', target: 'Vogue Editorial', time: '1h ago', type: 'revision' },
  { id: 4, user: 'u2', action: 'assigned team to', target: 'Mehta Wedding', time: '2h ago', type: 'assignment' },
  { id: 5, user: 'u7', action: 'commented on', target: 'Gupta Engagement', time: '3h ago', type: 'comment' },
  { id: 6, user: 'u3', action: 'started data copy for', target: 'Redwood Gala', time: '5h ago', type: 'assignment' },
];

export const notifications = [
  { id: 1, type: 'mention', title: 'Vikram mentioned you', desc: 'in Apex Summit — Final cuts ready for review', time: '2m', unread: true },
  { id: 2, type: 'assignment', title: 'New assignment', desc: 'You were assigned to Sharma Wedding — Lightroom', time: '12m', unread: true },
  { id: 3, type: 'completion', title: 'Stage completed', desc: 'Ishita finished Lightroom for Kapoor Portrait', time: '34m', unread: true },
  { id: 4, type: 'delay', title: 'Delay alert', desc: 'Vogue Editorial is 3 days behind schedule', time: '1h', unread: false },
  { id: 5, type: 'approval', title: 'Approval requested', desc: 'Album design ready for Sharma Wedding', time: '2h', unread: false },
  { id: 6, type: 'revision', title: 'Revision requested', desc: 'Apex Summit teaser needs color correction', time: '4h', unread: false },
];

export const todaysTasks = [
  { id: 1, title: 'Review Sharma Wedding Lightroom proofs', time: '10:00 AM', priority: 'high', done: false },
  { id: 2, title: 'Send Apex Summit teaser for client review', time: '11:30 AM', priority: 'urgent', done: false },
  { id: 3, title: 'Brief team for Mehta Wedding shoot prep', time: '2:00 PM', priority: 'medium', done: true },
  { id: 4, title: 'Approve Kapoor Portrait final delivery', time: '3:30 PM', priority: 'medium', done: false },
  { id: 5, title: 'Vogue Editorial catch-up call', time: '5:00 PM', priority: 'high', done: false },
];

export const revenueData = [
  { month: 'Jan', revenue: 142000, profit: 48000, projects: 12 },
  { month: 'Feb', revenue: 168000, profit: 62000, projects: 14 },
  { month: 'Mar', revenue: 195000, profit: 78000, projects: 17 },
  { month: 'Apr', revenue: 178000, profit: 71000, projects: 15 },
  { month: 'May', revenue: 224000, profit: 92000, projects: 19 },
  { month: 'Jun', revenue: 256000, profit: 108000, projects: 22 },
  { month: 'Jul', revenue: 289000, profit: 124000, projects: 25 },
];

export const teamPerformance = [
  { name: 'Aarav', tasks: 42, rating: 4.9 },
  { name: 'Maya', tasks: 38, rating: 4.8 },
  { name: 'Rohan', tasks: 31, rating: 4.7 },
  { name: 'Ishita', tasks: 45, rating: 4.9 },
  { name: 'Vikram', tasks: 36, rating: 4.6 },
  { name: 'Anaya', tasks: 29, rating: 4.8 },
  { name: 'Dev', tasks: 33, rating: 4.7 },
  { name: 'Priya', tasks: 27, rating: 4.5 },
];

export const stageDistribution = [
  { name: 'Manager', value: 8, color: '#2563EB' },
  { name: 'Data Copy', value: 12, color: '#7C3AED' },
  { name: 'Lightroom', value: 18, color: '#F59E0B' },
  { name: 'Video', value: 14, color: '#EF4444' },
  { name: 'Album', value: 9, color: '#06B6D4' },
  { name: 'Editor', value: 6, color: '#EC4899' },
];

export const productivityHeatmap = Array.from({ length: 7 }, (_, d) =>
  Array.from({ length: 12 }, (_, h) => ({
    day: d,
    hour: h,
    value: Math.floor(Math.random() * 90) + (d < 5 ? 30 : 10),
  }))
).flat();

export const auditLogs = [
  { id: 1, who: 'Aarav Kapoor', action: 'Updated subscription plan', target: 'Organization', oldValue: 'Pro', newValue: 'Enterprise', time: '2h ago', ip: '192.168.1.42', role: 'Owner' },
  { id: 2, who: 'Maya Singh', action: 'Created project', target: 'Mehta Wedding — Goa', oldValue: '—', newValue: 'PRJ-2837', time: '5h ago', ip: '192.168.1.18', role: 'Manager' },
  { id: 3, who: 'Vikram Shah', action: 'Uploaded file', target: 'apex-teaser-v3.mp4', oldValue: '—', newValue: '2.4 GB', time: '1d ago', ip: '192.168.1.27', role: 'Video' },
  { id: 4, who: 'Ishita Patel', action: 'Changed role', target: 'Dev Mehta', oldValue: 'Data Copy', newValue: 'Editor', time: '2d ago', ip: '192.168.1.31', role: 'Owner' },
  { id: 5, who: 'Aarav Kapoor', action: 'Enabled 2FA', target: 'Security settings', oldValue: 'Disabled', newValue: 'Enabled', time: '3d ago', ip: '192.168.1.42', role: 'Owner' },
];

export const files = [
  { id: 1, name: 'Sharma-Wedding-Day01-RAW.zip', type: 'folder', size: '24.8 GB', items: 1247, modified: '2h ago' },
  { id: 2, name: 'apex-summit-teaser-v3.mp4', type: 'video', size: '2.4 GB', modified: '4h ago' },
  { id: 3, name: 'kapoor-portrait-finals', type: 'folder', size: '8.2 GB', items: 412, modified: '1d ago' },
  { id: 4, name: 'vogue-editorial-moodboard.pdf', type: 'doc', size: '12 MB', modified: '1d ago' },
  { id: 5, name: 'mehta-wedding-shotlist.xlsx', type: 'doc', size: '340 KB', modified: '2d ago' },
  { id: 6, name: 'album-sharman-final-v8.fig', type: 'doc', size: '84 MB', modified: '2d ago' },
  { id: 7, name: 'redwood-gala-promotional.jpg', type: 'image', size: '8.4 MB', modified: '3d ago' },
  { id: 8, name: 'gupta-engagement-teaser.mp4', type: 'video', size: '1.1 GB', modified: '3d ago' },
];
